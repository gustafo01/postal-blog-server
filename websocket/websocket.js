const ws = require("ws");
const conversationModel = require("../models/conversation-model");

const wss = new ws.Server(
  {
    port: 8080,
  },
  () => console.log(`WS started on 8080`)
);

wss.on("connection", function connection(ws) {
  ws.on("message", async function (message) {
    message = JSON.parse(message);
    const conversation = await findConversation(message.from, message.to)

    if (conversation && message.event === "message") {
      ws.id = conversation._id;
      addMessage(message, conversation._id)
    } else if(message.event === "message") {
      const newConversation = new conversationModel({
        members: [message.from, message.to],
      });
      await newConversation.save();
      ws.id = newConversation._id;
      addMessage(message, newConversation._id)
    } else if(conversation && message.event === "connection") {
      ws.id = conversation._id;
      broadcastMessage(conversation.messages, conversation._id);
    }
  });
});

const findConversation = async (from, to) => {
  return await conversationModel.findOne({
    members: [from, to].sort(),
  });
}

const addMessage = async (message, conversationId) => {
  const filter = { members: [message.from, message.to].sort() };
  const update = { $push: { messages: message } };
  const updatedConversation = await conversationModel.updateOne(filter, update);

  const conversation = await conversationModel.findById(conversationId);
  const lastMessage = conversation.messages[conversation.messages.length - 1];

  broadcastMessage(conversation.messages, conversationId);
}

function broadcastMessage(message, id) {
  wss.clients.forEach((client) => {
    if (String(client.id) === String(id)) {
      client.send(JSON.stringify(message));
    }
  });
}

module.exports = wss;

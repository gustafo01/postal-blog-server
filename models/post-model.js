const {Schema, model} = require('mongoose');

const PostSchema = new Schema({
    userId: {type: String, required: true},
    title: {type: String, required: true},
    content: {type: String, required: true},
    avatarAuthorUrl: {type: String, required: true},
})

module.exports = model('Post', PostSchema);
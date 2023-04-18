module.exports = class MessageDto {
    chatUrl;
    from;
    to;
    message;
    time;

    constructor(model) {
        this.chatUrl = model.chatUrl
        this.from = model.from;
        this.to = model.to;
        this.message = model.message;
        this.time = model.time;
    }
}

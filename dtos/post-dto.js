module.exports = class PostDto {
    userId;
    title;
    content;
    avatarAuthorUrl;

    constructor(model) {
        this.userId = model.userId;
        this.title = model.title;
        this.content = model.content;
        this.avatarAuthorUrl = model.avatarAuthorUrl;
    }
}

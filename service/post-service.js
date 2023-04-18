const PostModel = require('../models/post-model');
const PostDto = require('../dtos/post-dto');


class PostService {
    async createPost(userId, title, content, avatarAuthorUrl) {
        const post = await PostModel.create({userId, title, content, avatarAuthorUrl})
        const postDto = new PostDto(post);
        return postDto
    }
    async getAllPosts() {
        const posts = await PostModel.find();
        return posts.reverse();
    }
}

module.exports = new PostService();
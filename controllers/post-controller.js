const postService = require("../service/post-service");

class PostController {
  async createPost(req, res, next) {
    try {
      const { userId, title, content, avatarAuthorUrl } = req.body;
      const postData = await postService.createPost(
        userId,
        title,
        content,
        avatarAuthorUrl
      );
      return res.json(postData);
    } catch (e) {
      next(e);
    }
  }
  async getPosts(req, res, next) {
    try {
      const { page = 1, limit = 5 } = req.query;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const posts = await postService.getAllPosts();
      res.header("x-total-count", posts.length);
      const result = posts.slice(startIndex, endIndex);
      return res.json(result);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new PostController();

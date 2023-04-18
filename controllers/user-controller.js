const userService = require("../service/user-service");
const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api-error");

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest("Ошибка при валидации", errors.array())
        );
      }
      const {
        email,
        password,
        firstname,
        lastname,
        dateOfBirth,
        avatarImg,
        backgroundImg,
      } = req.body;
      const userData = await userService.registration(
        email,
        password,
        firstname,
        lastname,
        dateOfBirth,
        avatarImg,
        backgroundImg
      );
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie("refreshToken");
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const { page = 1, limit = 5 } = req.query;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const users = await userService.getAllUsers();
      res.header("x-total-count", users.length);
      const result = users.slice(startIndex, endIndex);
      return res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async changeAvatar(req, res, next) {
    try {
      const { avatarImg, id } = req.body;
      const userData = await userService.changeAvatar(avatarImg, id);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async changeBackgroundImg(req, res, next) {
    try {
      const { backgroundImg, id } = req.body;
      const userData = await userService.changeBackgroundImg(backgroundImg, id);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async getUsersPic(req, res, next) {
    try {
      const userspic = await userService.getAllUsersPic();
      return res.json(userspic);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();

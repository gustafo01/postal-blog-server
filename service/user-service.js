const UserModel = require('../models/user-model');
const PostModel = require('../models/post-model')
const bcrypt = require('bcrypt');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');

class UserService {
    async registration(email, password, firstname, lastname, dateOfBirth, avatarImg, backgroundImg) {
        const candidate = await UserModel.findOne({email});
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const user = await UserModel.create({email, password: hashPassword, firstname, lastname, dateOfBirth, avatarImg, backgroundImg});
        const userDto = new UserDto(user); // id, email
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto};
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequest('Неккоректная ссылка активации')
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await UserModel.findOne({email})
        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData._id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto._id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async getAllUsers() {
        const users = await UserModel.find();
        return users.reverse();
    }

    async changeAvatar(newAvatarImg, id) {
        const user = await UserModel.findById(id);
        if (!user) {
          throw ApiError.NotFound(`Пользователь с id ${id} не найден`);
        }
        await PostModel.updateMany({ userId: id }, { avatarAuthorUrl: newAvatarImg });
        user.avatarImg = newAvatarImg;
        await user.save();
      
        return new UserDto(user);
    }

    async changeBackgroundImg(newBackgroundImg, id) {
        const user = await UserModel.findById(id);
        if (!user) {
          throw ApiError.NotFound(`Пользователь с id ${id} не найден`);
        }
      
        user.backgroundImg = newBackgroundImg;
        await user.save();
      
        return new UserDto(user);
    }

    async getAllUsersPic() {
        const usersPic = await UserModel.find();
        return usersPic;
    }
}

module.exports = new UserService();

module.exports = class UserDto {
    email;
    firstname;
    lastname;
    dateOfBirth;
    id;
    avatarImg;
    backgroundImg;

    constructor(model) {
        this.email = model.email;
        this.firstname = model.firstname;
        this.lastname = model.lastname;
        this.dateOfBirth = model.dateOfBirth;
        this._id = model._id;
        this.avatarImg = model.avatarImg;
        this.backgroundImg = model.backgroundImg;
    }
}

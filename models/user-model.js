const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    firstname: {type: String, required: true}, 
    lastname: {type: String, required: true}, 
    dateOfBirth: {type: String, required: true},
    activationLink: {type: String},
    avatarImg: {type: String, required: true},
    backgroundImg: {type: String, required: true}
})

module.exports = model('User', UserSchema);

const mongoose = require('mongoose')

const UsersSchema = mongoose.Schema({
    name: String, 
    pic: String,
    parol: String
});



module.exports = mongoose.model('users', UsersSchema)
const mongoose = require('mongoose')

const UsersSchema = mongoose.Schema({
    name: String, 
    email: String,
    parol: String
});



module.exports = mongoose.model('users', UsersSchema)
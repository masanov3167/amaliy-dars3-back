const mongoose = require('mongoose')

const UsersSchema = mongoose.Schema({
    name: String, 
    email: String,
    parol: String,
    role: Number,
    courses: [
        {
            ref: 'courses',
            type: mongoose.Schema.Types.ObjectId
        }
    ]
});



module.exports = mongoose.model('users', UsersSchema)
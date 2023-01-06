const mongoose = require("mongoose")

const CoursesSchema = mongoose.Schema({
    name: String,
    category_id: {type: mongoose.Schema.Types.ObjectId, ref:'category', required:true  },
    user_id: {type: mongoose.Schema.Types.ObjectId, ref:'users', required:true  },
    about: String,
    pic: String
})

module.exports = mongoose.model("courses", CoursesSchema)
const  joi = require('joi');

class Validate {
   postUserValidation = joi.object().keys({
        name: joi.string().min(3).required(),
        parol: joi.string().min(3).required(),
        email: joi.string().min(5).required().regex(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    })

    loginValidation = joi.object().keys({
        name: joi.string().min(3).required(),
        parol: joi.string().min(3).required()
    })

    courseValidation = joi.object().keys({
        name: joi.string().min(3).required(),
        category_id: joi.string().required().regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i),
        user_id: joi.required(),
        about: joi.string().required().min(3),
        pic: joi.string().min(5).required()
    })
}

module.exports = new Validate;
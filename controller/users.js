const validate = require("../config");
const users = require("../models/users");
const jwt = require('jsonwebtoken');
const courses = require("../models/courses");

const setToken = payload => jwt.sign(payload, 'MUSAFFO_SKY', {
    expiresIn:"100h"
})

class UsersController{
    async Add(req, res){
        try{
            const { error, value } = validate.postUserValidation.validate({...req.body});
            if(error){
                res.status(403).json({status:403, message:`Ma'lumotla to'gri kelmadi`})
                return
            }

            const oldData = await users.findOne({name:value.name, parol: value.parol});

            if(oldData){
                res.status(403).json({status:403, message:`Name yoki parol oldindan mavjud`})
                return
            }
            value.role = 1;

            const user = new users(value)
            await user.save();

            res.status(200).json({status:200, success:true,  token: setToken({id:user._id}), message:'yaxshi uka', data: user})
        }
        catch(e){
            res.status(500).json({status:500, message:'Noto`g`ri so`rov'})
        }
    }

    async Login(req, res){
        try{
            const { error, value } = validate.loginValidation.validate({...req.body});
            if(error){
                res.status(403).json({status:403, message:`Ma'lumotla to'gri kelmadi`})
                return
            }

            const oldData = await users.findOne({name:value.name, parol: value.parol});

            if(!oldData){
                res.status(403).json({status:403, message:`Name yoki parol xato`})
                return
            }

            res.status(200).json({status:200, success:true,  token: setToken({id:oldData._id}), message:'yaxshi uka', data: oldData})
        }
        catch(e){
            console.log(e);
            res.status(500).json({status:500, message:'Noto`g`ri so`rov'})
        }
    }

    async Get(req, res){
        try{
            if(req.user.role !== 2){
                res.status(403).json({status:403, message:`Sizga ruhsat yo'q :(`})
                return
            }
            const user = await users.find({_id:{$ne: req.user._id}}).populate({
                path:'courses',
                populate: {
                    path: 'category_id',
                    model: 'category'
                } 
            })
            
            res.status(200).json({status:200, success:true,  message:'yaxshi uka', data: user})
        }
        catch(e){
            console.log(e);
            res.status(500).json({status:500, message:'Noto`g`ri so`rov'})
        }
    }

    async Edit(req,res){
        try{
            if(req.user.role !== 2){
                res.status(403).json({status:403, message:`Sizga ruhsat yo'q`})
                return
            }
            const { error, value } = validate.postUserValidation.validate({...req.body});
            if(error){
                res.status(403).json({status:403, message:`Ma'lumotla to'gri kelmadi`})
                return
            }

            const oldData = await users.findOne({_id: req.params.id});

            if(!oldData){
                res.status(403).json({status:403, message:`user mavjud emas`})
                return
            }
            const user = await users.findByIdAndUpdate(req.params.id, {...value}, {new:true}).populate({
                path:'courses',
                populate: {
                    path: 'category_id',
                    model: 'category'
                } 
            });

            res.status(200).json({status:200, success:true,  token: setToken({id:user._id}), message:'yaxshi uka', data: user})
        }
        catch(e){
            res.status(500).json({status:500, message:'Noto`g`ri so`rov'})
        }
    }

    async Delete(req,res){
        try{
            if(req.user.role !== 2){
                res.status(403).json({status:403, message:`Sizga ruhsat yo'q`})
                return
            }
            
            const oldData = await users.findOne({_id: req.params.id});

            if(!oldData){
                res.status(403).json({status:403, message:`user mavjud emas`})
                return
            }
            const user = await users.findByIdAndDelete(req.params.id);
            await courses.deleteMany({user_id: req.params.id})

            res.status(200).json({status:200, success:true,  message:'yaxshi uka delet bo`ldi', data: user})
        }
        catch(e){
            res.status(500).json({status:500, message:'Noto`g`ri so`rov'})
        }
    }
}

// exports.login = async(req, res)=>{
//     const {phone, password} = req.body
//     users.findOne({phone: phone, password: password}, (err, user)=>{
//         if(err)
//            throw err
//         else{
//             res.status(200).json(user)
//         }
//     })
// }


// exports.GetByIdusers = async(req, res)=>{
//     try {
//         const auth = await users.findById({_id: req.params.id})
//         res.status(200).json(
//             {
//                 message: "success",
//                 data: auth
//             }
//         )
//     } catch (err) {
//         res.status(404).json(
//             {
//                 message: "editor not found"
//             }
//         )
//     }
// }


// exports.Getusers = async(req, res)=>{
//     try {
//         const auth = await users.find({roles: "moderator"}).sort({date: -1})
//         res.status(200).json(
//             {
//                 message: "success",
//                 data: auth
//             }
//         )
//     } catch (err) {
//         res.status(404).json(
//             {
//                 message: "auth not found"
//             }
//         )
//     }
// }


// exports.Editusers = async(req, res)=>{
//     try {
//         const auth = await users.findByIdAndUpdate(req.params.id, {
//             ...req.body
//         })
//         res.status(200).json(
//             {
//                 message: "success",
//                 data: auth
//             }
//         )
//     } catch (err) {
//         res.status(404).json(
//             {
//                 message: "auth not found"
//             }
//         )
//     }
// }


module.exports = new UsersController;
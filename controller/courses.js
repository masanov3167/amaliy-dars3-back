const course = require("../models/courses");
const validate = require('../config');
const users = require("../models/users");

class CoursesController{
    async Get(_, res){
        try{
            const courses = await course.find().populate('category_id').populate('user_id');
            res.status(200).json({status:200,success:true, message:'success', data: courses})
        }
        catch(e){
            console.log(e);
            res.status(500).json({status:500,   message:'Noto`g`ri so`rov'})
        }
    }

    async GetByCategoryId(req, res){
        try{
            const courses = await course.find({category_id: req.params.id}).populate('category_id').populate('user_id');
            res.status(200).json({status:200, success:true, message:'success', data: courses})
        }
        catch(e){
            console.log(e);
            res.status(500).json({status:500, message:'Noto`g`ri so`rov'})
        }
    }

    async GetMy(req, res){
        try{
            const courses = await course.find({user_id: req.user._id}).populate('category_id');
            res.status(200).json({status:200,success:true, message:'success', data: courses})
        }
        catch(e){
            console.log(e);
            res.status(500).json({status:500, message:'Noto`g`ri so`rov'})
        }
    }

    async Search(req, res){
        try{
            const courses = await course.find({name:{ $regex: req.body.title, $options: "i"}}).populate('category_id');
            res.status(200).json({status:200,success:true, message:'success', data: courses})
        }
        catch(e){
            res.status(500).json({status:500, message:'Noto`g`ri so`rov'})
        }
    }

    async SearchMy(req, res){
        try{
            const courses = await course.find({user_id:req.user._id, name:{ $regex: req.body.title, $options: "i"}}).populate('category_id');
            console.log(courses);
            res.status(200).json({status:200,success:true, message:'success', data: courses})
        }
        catch(e){
            res.status(500).json({status:500, message:'Noto`g`ri so`rov'})
        }
    }

    async Edit(req, res){
        try{
           req.body.user_id = req.user._id;
            const { error, value } = validate.courseValidation.validate({...req.body});
            if(error){
                res.status(403).json({status:403, message:'Ma`lumotlaringiz mos xolda emas :('});
                return
            }
            const courses = await course.find({user_id:req.user._id, _id: req.params.id});
            if(courses.length <1 && req.user.role !==2){
                res.status(404).json({status:404, message:'kurs topilmadi yoki siz tahrirlamoqchi bo`lgan kurs sizga tegishli emas :('});
                return
            }
            const updateCourse = await course.findByIdAndUpdate(req.params.id, {...value}, {new:true}).populate('category_id');

            res.status(200).json({status:200, success: true,  message:'success', data: updateCourse})
        }
        catch(e){
            res.status(500).json({status:500, message:'Noto`g`ri so`rov'})
        }
    }

    async Add(req, res){
        try{
           req.body.user_id = req.user._id;
            const { error, value } = validate.courseValidation.validate({...req.body});
            if(error){
                res.status(403).json({status:403, message:'Ma`lumotlaringiz mos xolda emas :('});
                return
            }
           
            const oldUser = await users.findOne({_id: value.user_id});
            if(!oldUser){
                res.status(403).json({status:403, message:'Sizdagi token yaroqsiz iltimos qayta login qiling :('});
                return
            }
            const AddedCourse = new course(value);
            await AddedCourse.save().then(t => t.populate('category_id'));
            oldUser.courses.push(AddedCourse._id);
            
            await AddedCourse.save();
            await oldUser.save();

            res.status(200).json({status:200, success: true,  message:'success', data: AddedCourse})
        }
        catch(e){
            console.log(e);
            res.status(500).json({status:500, message:'Noto`g`ri so`rov'})
        }
    }

    async Delete(req, res){
        try{           
            const courses = await course.find({user_id:req.user._id, _id: req.params.id});
            if(courses.length <1  && req.user.role !==2){
                res.status(404).json({status:404, message:'kurs topilmadi yoki sizga ruhsat yo`q :('});
                return
            }
            const deletedCourse = await course.findByIdAndDelete(req.params.id).populate('category_id');
            await users.update({courses:{ $all : [req.params.id]}}, {
                $pull: {
                    courses: req.params.id
                }
            });

            res.status(200).json({status:200, success: true,  message:'success', data: deletedCourse})
        }
        catch(e){
            console.log(e);
            res.status(500).json({status:500, message:'Noto`g`ri so`rov'})
        }
    }
}


module.exports = new CoursesController;
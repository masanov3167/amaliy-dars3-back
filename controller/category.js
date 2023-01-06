const category = require("../models/category");

class CategoryController{
    async Get(_, res){
        try{
            const categories = await category.find();
            res.status(200).json({status:200, success:true, message:'success', data: categories})
        }
        catch{
            res.status(500).json({status:500, message:'Noto`g`ri so`rov'})
        }
    }
}


module.exports = new CategoryController;
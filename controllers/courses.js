const Course = require("../models/course.js");
const ExpressError = require("../utils/ExpressError");

module.exports.index = async (req,res)=>{
    let courses = await Course.find().sort({_id:-1});
    if(courses.length === 0){
        return res.json({status:"error",message:"No courses found"});
    }
    res.json({status:"success",courses});
}

module.exports.show = async (req,res)=>{
    let course = await Course.findById(req.params.id);
    if(!course){
        throw new ExpressError(404,"Course not found");
    }
    res.json({status:"success",course});
}

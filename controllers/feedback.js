const Feedback = require("../models/feedback.js");
const Course = require("../models/course.js");
const ExpressError = require("../utils/ExpressError");
const {isValidId} = require("../middleware.js");

module.exports.create = async (req,res)=>{
    let {course_id,rating,feedback} = req.body;
    if(!(await Course.exists({_id:course_id}))){
        throw new ExpressError(404,"Course not found");
    }
    await Feedback.create({
        user:req.session.user.user_id,
        course:course_id,
        rating,
        comment:feedback,
    });
    res.status(201).json({status:"success",message:"Feedback submitted successfully"});
}

module.exports.index = async (req,res)=>{
    let {course_id} = req.query;
    if(!isValidId(course_id)){
        return res.json({status:"success",feedbacks:[]});
    }

    let rows = await Feedback.find({course:course_id})
        .sort({submitted_at:-1})
        .populate("user","name");

    let feedbacks = rows.map((f)=>({
        rating:f.rating,
        comment:f.comment,
        submitted_at:f.submitted_at,
        user_name:f.user ? f.user.name : "Deleted user",
    }));
    res.json({status:"success",feedbacks});
}

const Enrollment = require("../models/enrollment.js");
const Course = require("../models/course.js");
const ExpressError = require("../utils/ExpressError");

module.exports.create = async (req,res)=>{
    let {course_id} = req.body;
    if(!(await Course.exists({_id:course_id}))){
        throw new ExpressError(404,"Course not found");
    }
    // a second enrollment hits the unique {user, course} index -> 409 from the error handler
    await Enrollment.create({user:req.session.user.user_id,course:course_id});
    res.status(201).json({status:"success",message:"Course enrolled successfully"});
}

module.exports.mine = async (req,res)=>{
    let rows = await Enrollment.find({user:req.session.user.user_id})
        .sort({enroll_date:-1})
        .populate("course","title description");

    let courses = rows
        .filter((e)=> e.course)          // skip enrollments whose course no longer exists
        .map((e)=>({
            course_id:e.course._id.toString(),
            title:e.course.title,
            description:e.course.description,
            enroll_date:e.enroll_date,
            progress:e.progress,
        }));

    if(courses.length === 0){
        return res.json({status:"empty",message:"No enrolled courses found"});
    }
    res.json({status:"success",courses});
}

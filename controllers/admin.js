const Course = require("../models/course.js");
const User = require("../models/user.js");
const Contact = require("../models/contact.js");
const Enrollment = require("../models/enrollment.js");
const ExpressError = require("../utils/ExpressError");

// ---------- Courses ----------

module.exports.courses = async (req,res)=>{
    res.json({status:"success",data:await Course.find().sort({_id:-1})});
}

module.exports.createCourse = async (req,res)=>{
    await Course.create(req.body);
    res.status(201).json({status:"success",message:"Course added successfully"});
}

module.exports.updateCourse = async (req,res)=>{
    let updated = await Course.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
    if(!updated){
        throw new ExpressError(404,"Course not found");
    }
    res.json({status:"success",message:"Course updated successfully"});
}

module.exports.deleteCourse = async (req,res)=>{
    // enrollments and feedback of this course are removed by the post hook in models/course.js
    let deleted = await Course.findByIdAndDelete(req.params.id);
    if(!deleted){
        throw new ExpressError(404,"Course not found");
    }
    res.json({status:"success",message:"Course deleted successfully"});
}

// ---------- Users ----------

module.exports.users = async (req,res)=>{
    res.json({status:"success",data:await User.find().sort({_id:-1})});
}

module.exports.deleteUser = async (req,res)=>{
    if(req.params.id === req.session.user.user_id){
        throw new ExpressError(400,"You cannot delete yourself");
    }
    // enrollments and feedback of this user are removed by the post hook in models/user.js
    let deleted = await User.findByIdAndDelete(req.params.id);
    if(!deleted){
        throw new ExpressError(404,"User not found");
    }
    res.json({status:"success",message:"User deleted successfully"});
}

// ---------- Contacts ----------

module.exports.contacts = async (req,res)=>{
    res.json({status:"success",data:await Contact.find().sort({_id:-1})});
}

// ---------- Dashboard numbers + chart ----------

const WEEKS = 5;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

module.exports.stats = async (req,res)=>{
    // start of each of the last 5 weeks, oldest first (last bucket is the current 7 days)
    let now = Date.now();
    let weekStarts = [];
    for(let i = WEEKS - 1; i >= 0; i--){
        weekStarts.push(new Date(now - (i + 1) * WEEK_MS + 1));
    }

    let [totalUsers,totalCourses,activeEnrollments,weeklyCounts] = await Promise.all([
        User.countDocuments(),
        Course.countDocuments(),
        Enrollment.countDocuments(),
        Promise.all(weekStarts.map((start)=>
            Enrollment.countDocuments({enroll_date:{$gte:start,$lt:new Date(start.getTime() + WEEK_MS)}})
        )),
    ]);

    res.json({
        status:"success",
        totalUsers,
        totalCourses,
        activeEnrollments,
        weekly:weekStarts.map((start,i)=>({weekStart:start,count:weeklyCounts[i]})),
    });
}

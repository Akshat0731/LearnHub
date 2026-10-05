// Fills the database with sample data so you can check that everything works.
//   npm run init-db
// WARNING: this deletes all users, courses, enrollments, feedback and contacts first.

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db.js");
const initdata = require("./data.js");

const User = require("../models/user.js");
const Course = require("../models/course.js");
const Enrollment = require("../models/enrollment.js");
const Feedback = require("../models/feedback.js");
const Contact = require("../models/contact.js");

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

const initDb = async ()=>{
    if(process.env.NODE_ENV === "production" && !process.argv.includes("--force")){
        console.log("NODE_ENV is production and this script deletes all data. Run it with --force if you really want that.");
        return;
    }

    await Promise.all([
        User.deleteMany({}),
        Course.deleteMany({}),
        Enrollment.deleteMany({}),
        Feedback.deleteMany({}),
        Contact.deleteMany({}),
    ]);

    // make sure the unique indexes (email, user+course) exist before inserting
    await Promise.all([User.init(),Enrollment.init()]);

    let users = await User.insertMany(
        await Promise.all(initdata.users.map(async (u)=>({...u,password:await bcrypt.hash(u.password,10)})))
    );
    let courses = await Course.insertMany(initdata.courses);

    const userId = (email) => users.find((u)=>u.email === email)._id;
    const courseId = (title) => courses.find((c)=>c.title === title)._id;

    await Enrollment.insertMany(initdata.enrollments.map(([email,title,progress,days])=>({
        user:userId(email),
        course:courseId(title),
        progress,
        enroll_date:daysAgo(days),
    })));

    await Feedback.insertMany(initdata.feedback.map(([email,title,rating,comment])=>({
        user:userId(email),
        course:courseId(title),
        rating,
        comment,
    })));

    await Contact.insertMany(initdata.contacts);

    console.log("data was saved");
    console.log("\nLog in with:");
    initdata.users.forEach((u)=> console.log(`  ${u.role.padEnd(7)} ${u.email}  /  ${u.password}`));
}

connectDB()
.then(initDb)
.then(()=> mongoose.disconnect())
.catch(async (err)=>{
    console.log("ERROR:",err.message);
    await mongoose.disconnect();
    process.exit(1);
});

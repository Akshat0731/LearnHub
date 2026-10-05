const express = require("express");
const path = require("path");
const router = express.Router();
const {isLoggedIn,isAdmin,validateId} = require("../middleware.js");

// sends views/<folder>/<file>
const page = (...file) => (req,res,next) =>{
    res.sendFile(path.join(__dirname,"..","views",...file),(err)=>{
        if(err) next(err);
    });
}

// ---------- public ----------
router.get("/",page("home","home.html"));
router.get("/courses",page("home","courses.html"));
router.get("/courses/:id",validateId("Course"),page("home","course_detail.html"));
router.get("/contact",page("home","contact.html"));
router.get("/login",page("auth","login.html"));
router.get("/register",page("auth","register.html"));

// ---------- logged in ----------
router.get("/courses/:id/feedback",validateId("Course"),isLoggedIn,page("home","feedback.html"));
router.get("/student/dashboard",isLoggedIn,page("student","dashboard.html"));

// ---------- admin only ----------
router.get("/admin/dashboard",isAdmin,page("admin","dashboard.html"));
router.get("/admin/courses",isAdmin,page("admin","courses.html"));
router.get("/admin/courses/new",isAdmin,page("admin","add_course.html"));
router.get("/admin/courses/:id/edit",isAdmin,validateId("Course"),page("admin","edit_course.html"));
router.get("/admin/users",isAdmin,page("admin","users.html"));
router.get("/admin/contacts",isAdmin,page("admin","contacts.html"));

module.exports = router;

const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const {isAdmin,validateCourse,validateId} = require("../middleware.js");
const admin = require("../controllers/admin.js");

// every route below needs an admin session
router.use(isAdmin);

router.get("/stats",wrapAsync(admin.stats));

router.route("/courses")
.get(wrapAsync(admin.courses))
.post(validateCourse,wrapAsync(admin.createCourse));

router.route("/courses/:id")
.put(validateId("Course"),validateCourse,wrapAsync(admin.updateCourse))
.delete(validateId("Course"),wrapAsync(admin.deleteCourse));

router.get("/users",wrapAsync(admin.users));
router.delete("/users/:id",validateId("User"),wrapAsync(admin.deleteUser));

router.get("/contacts",wrapAsync(admin.contacts));

module.exports = router;

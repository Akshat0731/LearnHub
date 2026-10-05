const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const {validateId} = require("../middleware.js");
const courses = require("../controllers/courses.js");

router.get("/",wrapAsync(courses.index));

router.get("/:id",validateId("Course"),wrapAsync(courses.show));

module.exports = router;

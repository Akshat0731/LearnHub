const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const multer = require("multer");
const {isLoggedIn,validateEnrollment} = require("../middleware.js");
const enrollments = require("../controllers/enrollments.js");

const upload = multer();

router.post("/",isLoggedIn,upload.none(),validateEnrollment,wrapAsync(enrollments.create));

router.get("/me",isLoggedIn,wrapAsync(enrollments.mine));

module.exports = router;

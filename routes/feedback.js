const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const {isLoggedIn,validateFeedback,validateFeedbackQuery} = require("../middleware.js");
const feedback = require("../controllers/feedback.js");

router.route("/")
.get(validateFeedbackQuery,wrapAsync(feedback.index))                       //feedback of one course
.post(isLoggedIn,validateFeedback,wrapAsync(feedback.create));              //submit feedback

module.exports = router;

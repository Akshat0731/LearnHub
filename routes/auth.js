const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const multer = require("multer");
const {validateRegister,validateLogin} = require("../middleware.js");
const auth = require("../controllers/auth.js");

// the frontend sends FormData (multipart), Express can't read that without multer
const upload = multer();

router.post("/register",upload.none(),validateRegister,wrapAsync(auth.register));

router.post("/login",upload.none(),validateLogin,wrapAsync(auth.login));

router.get("/session",auth.session);

router.post("/logout",wrapAsync(auth.logout));

module.exports = router;

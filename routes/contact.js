const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const multer = require("multer");
const {validateContact} = require("../middleware.js");
const contact = require("../controllers/contact.js");

const upload = multer();

router.post("/",upload.none(),validateContact,wrapAsync(contact.create));

module.exports = router;

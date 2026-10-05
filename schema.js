const Joi = require("joi");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const objectId = Joi.string().trim().hex().length(24);

// Joi only accepts what the schema describes, so an object like { "$ne": null }
// sent in place of a string is rejected before it can reach a MongoDB query.

module.exports.registerSchema = Joi.object({
    name : Joi.string().trim().required(),
    email : Joi.string().trim().lowercase().pattern(EMAIL_RE).required()
        .messages({"string.pattern.base":"Invalid email address."}),
    password : Joi.string().trim().required(),
    confirm_password : Joi.string().trim().required().valid(Joi.ref("password"))
        .messages({"any.only":"Passwords do not match."}),
}).messages({
    "any.required":"All fields are required.",
    "string.empty":"All fields are required.",
    "string.base":"All fields are required.",
});

module.exports.loginSchema = Joi.object({
    email : Joi.string().trim().lowercase().required(),
    password : Joi.string().trim().required(),
}).messages({
    "any.required":"All fields are required.",
    "string.empty":"All fields are required.",
    "string.base":"All fields are required.",
});

module.exports.contactSchema = Joi.object({
    name : Joi.string().trim().required(),
    email : Joi.string().trim().pattern(EMAIL_RE).required()
        .messages({"string.pattern.base":"Invalid email format"}),
    message : Joi.string().trim().required(),
}).messages({
    "any.required":"All fields are required",
    "string.empty":"All fields are required",
    "string.base":"All fields are required",
});

module.exports.courseSchema = Joi.object({
    title : Joi.string().trim().required(),
    description : Joi.string().trim().required(),
    category : Joi.string().trim().required(),
    youtube_video_id : Joi.string().trim().allow("").default(""),
    youtube_playlist_id : Joi.string().trim().allow("").default(""),
    video_count : Joi.number().integer().min(1).empty("").default(1),
    image_url : Joi.string().trim().allow("").default(""),
}).messages({
    "any.required":"All required fields must be filled",
    "string.empty":"All required fields must be filled",
    "string.base":"All required fields must be filled",
    "number.base":"Video count must be a whole number",
    "number.integer":"Video count must be a whole number",
    "number.min":"Video count must be at least 1",
});

module.exports.enrollmentSchema = Joi.object({
    course_id : objectId.required().messages({
        "any.required":"Course ID missing",
        "string.empty":"Course ID missing",
        "string.base":"Course ID missing",
        "string.hex":"Course not found",
        "string.length":"Course not found",
    }),
});

module.exports.feedbackSchema = Joi.object({
    course_id : objectId.required().messages({
        "string.hex":"Invalid course",
        "string.length":"Invalid course",
    }),
    rating : Joi.number().integer().min(1).max(5).required().messages({
        "number.base":"Invalid course or rating (1-5)",
        "number.integer":"Invalid course or rating (1-5)",
        "number.min":"Invalid course or rating (1-5)",
        "number.max":"Invalid course or rating (1-5)",
    }),
    feedback : Joi.string().trim().required(),   // the frontend sends the text as "feedback"
}).messages({
    "any.required":"Missing required fields",
    "string.empty":"Missing required fields",
    "string.base":"Missing required fields",
});

module.exports.feedbackQuerySchema = Joi.object({
    course_id : Joi.string().trim().required(),
}).messages({
    "any.required":"Course ID is required",
    "string.empty":"Course ID is required",
    "string.base":"Course ID is required",
}).unknown(true);

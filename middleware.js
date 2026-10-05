const fs = require("fs");
const path = require("path");
const ExpressError = require("./utils/ExpressError");
const schemas = require("./schema.js");

const isApiRequest = (req) => req.originalUrl.startsWith("/api");
const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;

module.exports.isValidId = (id) => typeof id === "string" && OBJECT_ID_RE.test(id);

// ---------- auth ----------

module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.session.user){
        if(isApiRequest(req)){
            throw new ExpressError(401,"User not logged in");
        }
        return res.redirect("/login");
    }
    next();
}

module.exports.isAdmin = (req,res,next) =>{
    if(!req.session.user){
        if(isApiRequest(req)){
            throw new ExpressError(403,"Access denied");
        }
        return res.redirect("/login");
    }
    if(req.session.user.role !== "admin"){
        throw new ExpressError(403,"Access denied");
    }
    next();
}

// ---------- input safety ----------

// Removes keys that start with "$" or contain "." (e.g. { "$ne": null }) so they can never
// act as MongoDB operators. Works on the object in place.
const clean = (obj) =>{
    if(!obj || typeof obj !== "object"){
        return obj;
    }
    for(const key of Object.keys(obj)){
        if(key.startsWith("$") || key.includes(".")){
            delete obj[key];
        }else{
            clean(obj[key]);
        }
    }
    return obj;
}

module.exports.sanitizeInputs = (req,res,next) =>{
    clean(req.body);
    clean(req.params);
    clean(req.query);
    next();
}

// validate(schema) checks req.body, validate(schema,"query") checks req.query
const validate = (schema,source="body") => (req,res,next) =>{
    const input = clean(req[source] || {});     // runs again here because multer fills req.body after the global sanitizer
    const {error,value} = schema.validate(input,{abortEarly:true,stripUnknown:true});
    if(error){
        throw new ExpressError(400,error.details[0].message);
    }
    if(source === "body"){
        req.body = value;
    }
    next();
}
module.exports.validate = validate;

module.exports.validateRegister = validate(schemas.registerSchema);
module.exports.validateLogin = validate(schemas.loginSchema);
module.exports.validateContact = validate(schemas.contactSchema);
module.exports.validateCourse = validate(schemas.courseSchema);
module.exports.validateEnrollment = validate(schemas.enrollmentSchema);
module.exports.validateFeedback = validate(schemas.feedbackSchema);
module.exports.validateFeedbackQuery = validate(schemas.feedbackQuerySchema,"query");

// validateId("Course") rejects /:id values that are not a real ObjectId with "Course not found"
module.exports.validateId = (label="Item") => (req,res,next) =>{
    if(!module.exports.isValidId(req.params.id)){
        throw new ExpressError(404,`${label} not found`);
    }
    next();
}

// ---------- error handling ----------

module.exports.notFound = (req,res,next) =>{
    next(new ExpressError(404,isApiRequest(req) ? "Not found" : "Page Not Found"));
}

const errorPage = fs.readFileSync(path.join(__dirname,"views","error.html"),"utf8");
const escapeHtml = (s) => String(s).replace(/[&<>"']/g,(c)=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

// The one and only error handler. Everything that throws (ExpressError, Mongoose,
// Multer, bad JSON...) ends up here and is turned into a consistent response.
module.exports.errorHandler = (err,req,res,next) =>{
    if(res.headersSent){
        return next(err);
    }

    let status = err.status || err.statusCode || 500;
    let message = err.message || "Something went wrong!!";

    if(err.code === 11000){                                   // unique index violated
        const keys = Object.keys(err.keyPattern || err.keyValue || {});
        status = 409;
        if(keys.includes("email")){
            message = "Email already registered.";
        }else if(keys.includes("user") && keys.includes("course")){
            message = "Already enrolled in this course";
        }else{
            message = "Duplicate entry";
        }
    }else if(err.name === "ValidationError"){                 // Mongoose schema validation
        status = 400;
        message = Object.values(err.errors).map((e)=>e.message).join(", ");
    }else if(err.name === "CastError"){                       // malformed ObjectId etc.
        status = 400;
        message = "Invalid ID";
    }else if(err.name === "MulterError"){
        status = 400;
    }else if(err.type === "entity.parse.failed"){             // broken JSON body
        status = 400;
        message = "Invalid JSON";
    }

    if(!Number.isInteger(status) || status < 400 || status > 599){
        status = 500;
    }
    if(status >= 500){
        console.error(err);
        message = "Something went wrong. Try again.";
    }

    if(isApiRequest(req)){
        return res.status(status).json({status:"error",message});
    }
    res.status(status).type("html").send(
        errorPage.replace("{{status}}",status).replace("{{message}}",escapeHtml(message))
    );
}

require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db.js");
const {MONGO_URI} = connectDB;
const {sanitizeInputs,notFound,errorHandler} = require("./middleware.js");
const authRoute = require("./routes/auth.js");
const courseRoute = require("./routes/course.js");
const enrollmentRoute = require("./routes/enrollment.js");
const feedbackRoute = require("./routes/feedback.js");
const contactRoute = require("./routes/contact.js");
const adminRoute = require("./routes/admin.js");
const pageRoute = require("./routes/pages.js");

const isProduction = process.env.NODE_ENV === "production";
let port = process.env.PORT || 3000;

if(!process.env.SESSION_SECRET){
    if(isProduction){
        throw new Error("SESSION_SECRET is not set. Add it to your environment variables.");
    }
    console.warn("SESSION_SECRET is not set, using an insecure development secret. Copy .env.example to .env.");
}

// behind a proxy (Render, Railway, Heroku...) the secure cookie only works if Express trusts it
if(isProduction){
    app.set("trust proxy",1);
}

const sessionOptions = {
    secret:process.env.SESSION_SECRET || "learnhub-dev-secret",
    resave:false,
    saveUninitialized:false,
    store:MongoStore.create({mongoUrl:MONGO_URI,touchAfter:24 * 3600}),      // sessions live in MongoDB
    cookie:{
        httpOnly:true,
        sameSite:"lax",
        secure:isProduction,
        maxAge:7 * 24 * 60 * 60 * 1000,
    }
}

app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session(sessionOptions));
app.use(sanitizeInputs);

// ---------- REST API ----------
app.use("/api/auth",authRoute);
app.use("/api/courses",courseRoute);
app.use("/api/enrollments",enrollmentRoute);
app.use("/api/feedback",feedbackRoute);
app.use("/api/contact",contactRoute);
app.use("/api/admin",adminRoute);

// ---------- Pages ----------
app.use("/",pageRoute);

// ---------- 404 + the one central error handler ----------
app.use(notFound);
app.use(errorHandler);

connectDB()
.then(()=>{
    app.listen(port,()=>{
        console.log(`LearnHub running at http://localhost:${port}`);
    });
})
.catch((err)=>{
    console.log("Failed to connect to MongoDB at",MONGO_URI);
    console.log("ERROR:",err.message);
    console.log("Is MongoDB running? (or fix MONGO_URI in your .env)");
    process.exit(1);
});

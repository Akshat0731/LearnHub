const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/learnhub";

module.exports = async function connectDB(){
    await mongoose.connect(MONGO_URI,{serverSelectionTimeoutMS:8000});
    console.log("connected with mongodb");
};

module.exports.MONGO_URI = MONGO_URI;

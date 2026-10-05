const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const enrollmentSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    course:{
        type:Schema.Types.ObjectId,
        ref:"Course",
        required:true,
    },
    progress:{
        type:Number,
        default:0,
        min:0,
        max:100,
    },
    enroll_date:{
        type:Date,
        default:Date.now,
    },
});

// one enrollment per user per course - the database blocks duplicates, even for concurrent requests
enrollmentSchema.index({user:1,course:1},{unique:true});
enrollmentSchema.index({enroll_date:1});

const Enrollment = mongoose.model("Enrollment",enrollmentSchema);
module.exports = Enrollment;

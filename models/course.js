const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Enrollment = require("./enrollment.js");
const Feedback = require("./feedback.js");

const courseSchema = new Schema({
    title:{
        type:String,
        required:true,
        trim:true,
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    youtube_video_id:{
        type:String,
        default:"",
        trim:true,
    },
    youtube_playlist_id:{
        type:String,
        default:"",
        trim:true,
    },
    video_count:{
        type:Number,
        default:1,
        min:1,
    },
    image_url:{
        type:String,
        default:"",
        trim:true,
    },
    category:{
        type:String,
        required:true,
        trim:true,
    },
    created_at:{
        type:Date,
        default:Date.now,
    },
},{
    toJSON:{
        transform(doc,ret){
            ret.course_id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});

// deleting a course also deletes its enrollments and feedback
courseSchema.post("findOneAndDelete", async (course) =>{
    if(course){
        await Enrollment.deleteMany({course:course._id});
        await Feedback.deleteMany({course:course._id});
    }
});

const Course = mongoose.model("Course",courseSchema);
module.exports = Course;

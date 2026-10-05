const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
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
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5,
    },
    comment:{
        type:String,
        required:true,
        trim:true,
    },
    submitted_at:{
        type:Date,
        default:Date.now,
    },
});

feedbackSchema.index({course:1,submitted_at:-1});

const Feedback = mongoose.model("Feedback",feedbackSchema);
module.exports = Feedback;

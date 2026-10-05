const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Enrollment = require("./enrollment.js");
const Feedback = require("./feedback.js");

const userSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,    // bcrypt hash
    },
    role:{
        type:String,
        enum:["student","admin"],
        default:"student",
    },
    created_at:{
        type:Date,
        default:Date.now,
    },
},{
    toJSON:{
        // keep the field name the frontend uses (user_id) and never leak the hash
        transform(doc,ret){
            ret.user_id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            delete ret.password;
            return ret;
        },
    },
});

// deleting a user also deletes their enrollments and feedback
userSchema.post("findOneAndDelete", async (user) =>{
    if(user){
        await Enrollment.deleteMany({user:user._id});
        await Feedback.deleteMany({user:user._id});
    }
});

const User = mongoose.model("User",userSchema);
module.exports = User;

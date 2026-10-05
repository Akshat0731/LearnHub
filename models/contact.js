const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    message:{
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
            ret.contact_id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
        },
    },
});

const Contact = mongoose.model("Contact",contactSchema);
module.exports = Contact;

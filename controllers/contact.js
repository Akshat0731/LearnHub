const Contact = require("../models/contact.js");

module.exports.create = async (req,res)=>{
    let {name,email,message} = req.body;
    await Contact.create({name,email,message});
    res.status(201).json({status:"success",message:"Thank you for contacting us!"});
}

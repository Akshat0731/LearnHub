const bcrypt = require("bcryptjs");
const User = require("../models/user.js");
const ExpressError = require("../utils/ExpressError");

// express-session uses callbacks, these wrap them so we can use await
const regenerateSession = (req) => new Promise((resolve,reject)=>{
    req.session.regenerate((err)=> err ? reject(err) : resolve());
});
const saveSession = (req) => new Promise((resolve,reject)=>{
    req.session.save((err)=> err ? reject(err) : resolve());
});
const destroySession = (req) => new Promise((resolve,reject)=>{
    req.session.destroy((err)=> err ? reject(err) : resolve());
});

module.exports.register = async (req,res)=>{
    let {name,email,password} = req.body;
    let hashed = await bcrypt.hash(password,10);
    await User.create({name,email,password:hashed});     // role defaults to "student"
    res.status(201).json({status:"success",message:"Registration successful."});
}

module.exports.login = async (req,res)=>{
    let {email,password} = req.body;

    let user = await User.findOne({email});
    let ok = user && await bcrypt.compare(password,user.password);
    if(!ok){
        throw new ExpressError(401,"Invalid email or password.");
    }

    // new session id on login (prevents session fixation)
    await regenerateSession(req);
    req.session.user = {
        user_id:user._id.toString(),
        name:user.name,
        email:user.email,
        role:user.role,
    };
    await saveSession(req);

    res.json({status:"success",role:user.role,message:"Login successful."});
}

module.exports.session = (req,res)=>{
    if(req.session.user){
        return res.json({logged_in:true,...req.session.user});
    }
    res.json({logged_in:false});
}

module.exports.logout = async (req,res)=>{
    await destroySession(req);
    res.clearCookie("connect.sid");
    res.json({status:"success",message:"Logged out successfully"});
}

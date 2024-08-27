const User = require("../models/userModel");
const { createToken } = require("../utils.js/jwt");

exports.signup=async(req,res)=>{
    try{
    const {name,email,aadharCard,password,address,age}=req.body;
    if(!name || !email || !aadharCard || !password || !address || !age)
        return res.status(400).json({
        status:'Failed',
        message:'Please provide complete details !!'});

    // Validate Aadhar Card Number 
    if (!/^\d{12}$/.test(aadharCard)) {
        return res.status(400).json({ error: 'Aadhar Card Number must be exactly 12 digits' });
    }

    // Check if a user with the same Aadhar Card Number already exists
    const existingUser = await User.findOne({aadharCard });
    if (existingUser) {
        return res.status(400).json({ error: 'User with the same Aadhar Card Number already exists' });
    }

    const newUser=await User.create({name,email,aadharCard,password,address,age});
    const payload={
        id:newUser.id,
        name:newUser.name,
        aadharCard:newUser.aadharCard
    };
    const token=createToken(payload);
    return res.status(200).cookie('jwt',token).json({
        status:'Signup Successful !!',
        data:{
            data:newUser,
            token:token
        }
    })
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Internal Server Error'});
    }
}

exports.login=async(req,res)=>{
const {aadharCard,password}=req.body;
if(! password || !aadharCard)
    return res.json({
    status:"Failure",
    Message:"Please provide complete details"
    });

    const user= await User.findOne({aadharCard});
    if(!user || !(await user.correctPassword(password)))
    return res.status(401).json({
    status:"Failure",
    Message:"Invalid Aadhar or Password is wrong !!"
    });
    try{

    const payload={
        id:user.id,
        name:user.name,
        aadharCard:user.aadharCard
    };
    const token=createToken(payload);
    user.password=undefined;
    return res.status(200).cookie('jwt',token).json({
        status:'Login Successful !!',
        data:{
            data:user,
            token:token
        }
    })
}catch(err){
    console.log(err);
        return res.status(500).json({error: 'Internal Server Error'});
}
}

exports.getMe=async(req,res)=>{
try{
const metaData=req.user;
const userId=metaData.id;
const user=await User.findById(userId);
res.status(200).json({
    status:'Success',
    data:{
        User:user
    }
})
}catch(err){
    console.log(err);
        return res.status(500).json({error: 'Internal Server Error'});
}
};

exports.changePassword=async(req,res)=>{
    try{
    const userId=req.user.id;
    const {currentPassword,newPassword}=req.body;
    if(!currentPassword || !newPassword)
        return res.status(400).json({
    status:'Failure',
    Message:"Please provide complete details"});

    const user=await User.findById(userId);

    if(!user || !(await user.correctPassword(currentPassword)))
        return res.status(400).json({
        status:'Failure',
        Message:"Password is wrong or User doesn't exists"});

    user.password=newPassword;
    await user.save();

    res.status(200).json({
        status:'Success',
        Message:'Password changed successfully'
    });
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Internal Server Error'});
    }
};
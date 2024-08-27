const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const Candidate = require('../models/candidateModel');

const checkAdminRole = async (userID) => {
    try{
         const user = await User.findById(userID);
         if(user.role === 'admin'){
             return true;
         }
    }catch(err){
         return false;
    }
}

exports.createCandidate=async(req,res)=>{
    try{
    if(!checkAdminRole(req.user.id))
        return res.status(400).json({
            status:"Failure",
            Message:"Only admin is authorized to perform this function"
    });
    const {name,party,age}=req.body;
    if(!name || !party || !age)
        return res.status(400).json({
            status:"Failure",
            Message:"Please provide complete details"
    });
    const newCandidate=await Candidate.create({name,party,age});
    return res.status(200).json({
        status:'Success',
        data:{
            Candidate:newCandidate
        }
    })
}catch(err){
    console.log(err);
        return res.status(500).json({error: 'Internal Server Error'});
}
};

exports.updateCandidate= async (req, res)=>{
    try{
        if(!checkAdminRole(req.user.id))
            return res.status(403).json({
            status:"Failure",
            Message:"Only admin is authorized to perform this function"
        });
        
        const candidateID = req.params.candidateID;
        const updatedCandidateData = req.body; 

        const response = await Candidate.findByIdAndUpdate(candidateID, updatedCandidateData, {
            new: true, // Return the updated document
            runValidators: true, // Run Mongoose validation
        })

        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        console.log('candidate data updated');
        res.status(200).json({
            status:'Update Successfull !!',
            data:{
                response
            }
        });
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

exports.deleteCandidate= async (req, res)=>{
    try{
        if(!checkAdminRole(req.user.id))
            return res.status(403).json({message: 'user does not have admin role'});
        
        const candidateID = req.params.candidateID;

        const response = await Candidate.findByIdAndDelete(candidateID);

        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        res.status(200).json({
            status:'Delete Successfull !!',
            data:{
                response
            }
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Internal Server Error'});
    }
};

exports.voting=async (req, res)=>{
    
    const candidateID = req.params.candidateID;
    const userId = req.user.id;
    console.log({candidateID,userId});

    try{
        const candidate = await Candidate.findById(candidateID);
        if(!candidate){
            return res.status(404).json({ 
                status:'Success',
                message: 'Candidate not found' });
        }

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ 
            status:'Failure',
            message: 'user not found' });
        }
        if(user.role == 'admin'){
            return res.status(403).json({ message: 'admin is not allowed'});
        }
        if(user.isVoted){
            return res.status(400).json({ message: 'You have already voted' });
        }

        // Update the Candidate document to record the vote
        candidate.votes.push({user: userId})
        candidate.voteCount++;
        await candidate.save();

        // update the user document
        user.isVoted = true
        await user.save();

        return res.status(200).json({ 
            status:'Success',
            message: 'Vote recorded successfully' });
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Internal Server Error'});
    }
};


exports.voteAnalytics= async (req, res) => {
    try{
        // voteCount in descending order
        const candidate = await Candidate.find().sort({voteCount: 'desc'});

        const voteRecord = candidate.map((data)=>{
            return {
                party: data.party,
                count: data.voteCount
            }
        });

        return res.status(200).json({
            status:'success',
            data:{
                voteRecord
            }
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:"/vote/count",
            error: 'Internal Server Error'});
    }
};

exports.getAllCandidates=async (req, res) => {
    try {
        console.log("hiiiii");
        
        // Find all candidates and select only the name and party fields
        const candidates = await Candidate.find({}, 'name party -id');

        res.status(200).json({
            status:'Success',
            Total_Candidates:candidates.length,
            data:{
                candidates
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 
            error: 'Internal Server Error' });
    }
};

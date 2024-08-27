const jwt=require('jsonwebtoken');
const User = require('../models/userModel');

const jwtAuthMiddleware = async(req, res, next) => {


    const authorization = req.headers.authorization
    if(!authorization) return res.status(401).json({ error: 'Token Not Found' });

    const token = req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({ error: 'Unauthorized' });

    try{
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const currentUser = await User.findById(decoded.id);
        req.user = currentUser
        next();
    }catch(err){
        console.error(err);
        res.status(401).json({ error: 'Invalid token' });
    }
}


const createToken=(data)=>{
    return jwt.sign(data,SECRET_KEY,{expiresIn:100000});
}

module.exports={createToken,jwtAuthMiddleware};
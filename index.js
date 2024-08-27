const express = require('express')
const app = express();
const db = require('./db');
const dotenv=require('dotenv');
const bodyParser = require('body-parser'); 
const userRoutes=require('./routes/userRoutes');
const candidateRoutes=require('./routes/candidateRoutes');

app.use(bodyParser.json()); // To use the req.body
dotenv.config({path:'./config.env'});

app.use('/candidate',candidateRoutes)
app.use('/user',userRoutes);

const PORT = 3000;
app.listen(PORT, ()=>{
    console.log('listening on port 3000');
})
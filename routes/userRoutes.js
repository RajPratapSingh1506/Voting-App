const express = require('express');
const router=express.Router();
const userController=require('./../controllers/userController');
const { jwtAuthMiddleware } = require('../utils.js/jwt');


router.post('/signup',userController.signup);
router.post('/login',userController.login);
router.get('/profile',jwtAuthMiddleware,userController.getMe);
router.put('/profile/password',jwtAuthMiddleware,userController.changePassword)

module.exports=router;
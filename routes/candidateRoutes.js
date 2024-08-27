const express = require('express');
const router=express.Router();
const candidateController=require('./../controllers/candidateController');
const { jwtAuthMiddleware } = require('./../utils.js/jwt');

router.post('/',jwtAuthMiddleware,candidateController.createCandidate);
router.put('/:candidateID',jwtAuthMiddleware,candidateController.updateCandidate);
router.delete('/:candidateID',jwtAuthMiddleware,candidateController.deleteCandidate);
router.get('/vote/count',jwtAuthMiddleware,candidateController.voteAnalytics);
router.get('/vote/:candidateID',jwtAuthMiddleware,candidateController.voting);
router.get('/',jwtAuthMiddleware,candidateController.getAllCandidates);

module.exports=router;
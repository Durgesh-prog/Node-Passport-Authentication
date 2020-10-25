const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Task = require('../models/Task.js');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

console.log(ensureAuthenticated)
router.get('/dashboard',ensureAuthenticated, function(req, res, next) {
  console.log(req.user)
  let tasks = Task.find({userId:req.user._id}).then(data => {
	 console.log(data)
	 res.render('dashboard',{
	   user:req.user,
	   task:data
	})
  }).catch(err => {
	  console.log(err)
  })

 
});

router.get('/dashboard/create',ensureAuthenticated, function(req, res, next) {
  console.log(req.user)
 res.render('create')
});


router.post('/dashboard/create',ensureAuthenticated, function(req, res, next) {
  console.log(req.body)
  let task = new Task({userId:req.user._id,task:req.body.task})
	task.save(function (err) {
		if (err) {
		  console.log(err)
		  return;
		}
		console.log('New Task: ' + task);
	  });
	  res.redirect('/user/dashboard')
});

//update
router.get('/dashboard/update/:id',ensureAuthenticated, function(req, res, next) {
  console.log(req.params.id)
   Task.findById(req.params.id).then(data => {
	   console.log(data)
	   res.render('update',{
		   id:req.params.id
	   })
   })
});

router.post('/dashboard/update/:id',ensureAuthenticated, function(req, res, next) {
  console.log(req.params.id)
   Task.updateOne({_id:req.params.id},{task:req.body.task}).then(data => {
	   console.log(data)
	   res.redirect('/user/dashboard')
   })
});

router.get('/dashboard/delete/:id',ensureAuthenticated, function(req, res, next) {
  console.log(req.params.id)
  Task.deleteOne({_id:req.params.id},(err) => {
	  if(err) console.log(err)
	  res.redirect('/user/dashboard')
  })
});



module.exports = router;

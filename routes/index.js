const express = require('express');
const router = express.Router();
const {check,validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const Users = require('../models/User.js');
const { forwardAuthenticated } = require('../config/auth');
const passport = require('passport');


// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/signup', forwardAuthenticated, (req, res) => res.render('signup'));


// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/user/dashboard',
    failureRedirect: '/login',
    failureFlash:true
  })(req, res, next);
});

 
router.post('/signup',
	[
	 check("username","Please Enter a valid username")
		.not()
		.isEmpty(),
	check("email","Please enter a valid email")
		.isEmail(),
	check("password","Please enter a valid password")
		.isLength({min:6})
	],
	async (req,res) => {
		const errors = validationResult(req);
		//if errors 
		if(!errors.isEmpty()){
			return res.render('signup', {
					  errors
				});
		};
	  
	console.log('No errors ...')
	const {username,email,password} = req.body;
	console.log(username)
	console.log(email)
	console.log(password)
	try{
		let user = await Users.findOne({email}); 
		if(user){
			//need to add error here
			 console.log(errors)
			return  res.render('signup', {
				  errors,
				  username,
				  email,
				  password
				});
		}
		user = new Users({
			username,
			email,
			password
		}); 
		
		console.log('created')
		console.log(user)
	    const salt = await bcrypt.genSalt(10);
		console.log('salt')
		console.log(salt)
		user.password = await bcrypt.hash(password,salt); 
		
		const savedUser = await user.save();
		 
		console.log('finally')
		console.log(savedUser)
		res.redirect('/login')
	 }catch(err){
		console.log(err.message);
		res.status(500).send("Error in Saving");
	}		
 });

// Logout
router.get('/logout',(req, res) => {
  req.logout();
 res.redirect('/login')
});

module.exports = router;

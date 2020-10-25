/* Importing Modules */
const express = require('express');
const path = require('path');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');


//Routes
const AuthenticationRoute = require('./routes/index');
const UserRoute = require('./routes/User');


/* Initialising Express Application */
const app = express();

//Set up mongoose connection
const MongoServer = require('./config/db');
MongoServer().catch(err => {
	console.log('Error Connecting to database ');
	return;
}) 

/* Intializing Passport */
require('./config/passport')(passport);


 /* view engine setup EJS */
app.use(expressLayouts);
app.set('view engine', 'ejs');


// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Adding Passport as middleware
app.use(passport.initialize());
app.use(passport.session());


// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});



app.use('/',AuthenticationRoute);
app.use('/user',UserRoute);

app.get('*',(req,res) => {
	res.redirect('/login')
})

const PORT = process.env.PORT || 9000

app.listen(PORT,() => {
	console.log(`Welcome To Node APP`);
})
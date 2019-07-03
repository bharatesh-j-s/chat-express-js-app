const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
var bcrypt = require('bcryptjs');

// Load Models
let User = require('../models/user');

// Register
router.get('/register', function(req, res) {
	if(!req.session.user) {
		res.render('register', {
			title : 'Register'
		});
	}
	else {
		res.redirect('/');
	}
});

// Register
router.post('/register', [
		check('name').not().isEmpty().withMessage('Name field is required'),
		check('mobile').not().isEmpty().withMessage('Mobiel field is required'),
		check('email').not().isEmpty().withMessage('Email field is required'),
		check('username').not().isEmpty().withMessage('Username field is required'),
		check('password').not().isEmpty().withMessage('Password field is required'),
	],
	function(req, res) {

	const errors = validationResult(req);
	console.log(errors);
	if (!errors.isEmpty()) {
		res.render('register', {
			title : 'Register',
			errors: errors.array()
		});
	}
	else {
		let user = new User();
		user.name = req.body.name;
		user.mobile = req.body.mobile;
		user.email = req.body.email;
		user.username = req.body.username;
		user.password = req.body.password;


		var salt = bcrypt.genSaltSync(10);
		var hash = bcrypt.hashSync(user.password, salt);
		user.password = hash;

		user.save(function(err) {
			if(err) {
				console.log(err);
				return;
			}
			else {
				req.flash('message', 'You are now registered and can log in');
				res.redirect('/auth/login');
			}
		})
	}
});

// Login
router.get('/login', function(req, res) {
	if(!req.session.user) {
		res.render('login', {
			title : 'Login'
		});
	}
	else {
		res.redirect('/');
	}
});

// Login
router.post('/login', [
		check('username').not().isEmpty().withMessage('Username field is required'),
		check('password').not().isEmpty().withMessage('Password field is required'),
	],
	function(req, res) {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.render('login', {
			title : 'Login',
			errors: errors.array()
		});
	}
	else {
		var salt = bcrypt.genSaltSync(10);
		var hash = bcrypt.hashSync(req.body.password, salt);

		let query = { username:req.body.username};
		User.findOne(query,function(err, user) {
			if(err) {
				console.log(err);
				return;
			}
			else {
				if(user!=null) {
					if(bcrypt.compareSync(req.body.password, hash)){
						req.session.user = user;
						res.redirect('/');
					}
					else {
						req.flash('message', 'Enter valid username and password');
						res.redirect('/auth/login');
					}
				}
				else {
					req.flash('message', 'Enter valid username and password');
					res.redirect('/auth/login');
				}
			}
		})
	}
});

router.get('/logout', function(req, res) {
	req.session.user = '';
	res.redirect('/auth/login');
});

module.exports = router;
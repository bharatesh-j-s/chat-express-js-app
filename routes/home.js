const express = require('express');
const router = express.Router();
const path = require('path');
const { check, validationResult } = require('express-validator');

// Load Models
let User = require('../models/user');

// Home
router.get('/', function(req, res) {
	if(req.session.user) {
		User.find({}, function(err, users){
			if(err) {
				console.log(err);
				return;
			}
			else {
				res.render('home', {
					title : 'Home',
					users : users
				});
			}
		});
	}
	else {
		res.redirect('/auth/login');
	}
});

//chat

router.get('/chat', function(req, res) {
	res.sendFile(path.join(__dirname, '../', '/views/chat.html'));
});

module.exports = router;
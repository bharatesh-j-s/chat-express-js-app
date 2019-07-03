const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Load Models
let User = require('../models/user');

// Register
router.get('/error', function(req, res) {
	res.render('home', {
		title : req.session.user
	});
});

module.exports = router;
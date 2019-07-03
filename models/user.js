
//Load ORM mongoose
const mongoose = require('mongoose');

//User Schema
let userSchema = mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	mobile:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true
	},
	username:{
		type:String,
		required:true
	},
	password:{
		type:String,
		required:true
	}
});

//set to model
let User = module.exports = mongoose.model('User', userSchema);
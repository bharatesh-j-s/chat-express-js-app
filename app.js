const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash  = require('connect-flash');
const { check, validationResult } = require('express-validator');
const config = require('./config/database');

// Load ORM mongoose
mongoose.connect(config.database, {useNewUrlParser: true});
let db = mongoose.connection;

// Check connection
db.once('open', function(){
	console.log('Connected to MongoDB');
})

// Check for DB Errors
db.on('error', function(err) {
	console.log('err');
})

// Init App
const app = express()

// Load Models
let User = require('./models/user');

// Body parser 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Load view Engine pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Set public folder
app.use(express.static(path.join(__dirname, 'public')))

// Flash Messages
app.use(cookieParser());
app.use(session({
  	secret: 'secret123', 
  	resave: false,
  	saveUninitialized: true
}));
app.use(flash());
app.use(function (req, res, next)
{
	res.locals.session = req.session.user
    res.locals.message = req.flash('message')
    next()
});

//Router


//Auth Router
let auth = require('./routes/auth');
app.use('/auth',auth);

// Home Route
let home = require('./routes/home');
app.use('/',home);

//Scoket IO

const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

//Server
server.listen(3000, function(){
	console.log('server started on port 3000');
});

users = [];
connections = [];

io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log('Connected : %s scokets connected', connections.length);

	//Disconnect
	socket.on('disconnect', function(data){
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected : %s scokets connected', connections.length);
	});

	//Send Message
	socket.on('send message', function(message, from, to){
		process.stderr.write('\u0007');
		io.sockets.emit('new message', {message:message,from:from,to:to});
	});
});









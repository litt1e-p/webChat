var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
	res.send('<h1>welcome to webChat</h1>');
});

var onlineUsers = {};
var onlineUsrCount = 0;

io.on('connection', function(socket){
	console.log('an user connected');

	socket.on('login', function(newUser){
		socket.name = newUser.userid;
		if(!onlineUsers.hasOwnProperty(newUser.userid)) {
			onlineUsers[newUser.userid] = newUser.username;
			onlineUsrCount++;
		}
		io.emit('login', {onlineUsers:onlineUsers, onlineUsrCount:onlineUsrCount, user:newUser});
		console.log(newUser.username+' has joined webChat');
	});

	socket.on('disconnect', function(){
		if(onlineUsers.hasOwnProperty(socket.name)) {
			var existUsr = {userid:socket.name, username:onlineUsers[socket.name]};
			delete onlineUsers[socket.name];
			onlineUsrCount--;
			io.emit('logout', {onlineUsers:onlineUsers, onlineUsrCount:onlineUsrCount, user:existUsr});
			console.log(existUsr.username+' has existed webChat');
		}
	});

	socket.on('message', function(usr){
		io.emit('message', usr);
		console.log(usr.username+'say: '+usr.content);
	});

});

http.listen(8081, function(){
	console.log('listening on *:8081');
});

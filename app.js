var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
 
server.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + port )
});


var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(server);													//Hook websocket server to the http server 
var users = [];
var num_users = 0;




publicDir = require('path').join(__dirname, '/public');


app.get('/', function(req, res){
	
	res.sendFile(__dirname + '/index.html');
		
});


app.use(express.static(publicDir)); 													//serving css, js, img etc.

io.sockets.on('connection', function(socket){
  
  users.push(socket);
  num_users = users.length;	
  console.log("No. of players: " + num_users);
  
  io.emit('users', num_users);
  
  socket.on('disconnect', function() {
       
	   if(socket == users[0] || socket == users[1])
	   io.emit('reload', 'reload');									//if a player leaves reload all user's page
   
	   var i = users.indexOf(socket);
       users.splice(i, 1);					
	    
	   num_users = users.length;
	   console.log("No. of players: " + num_users);
	   		  
  });	  
 
  
  socket.on('turn', function(msg){
    io.emit('turn', msg);											//let everyone else know
	
});


   
   

});


var port = 8080;






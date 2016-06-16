var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);													//Hook websocket server to the http server 
var users = [];
var num_users = 0;

publicDir = require('path').join(__dirname, '/public');


app.get('/', function(req, res){
	
	res.sendFile(__dirname + '/index.html');
		
});


app.use(express.static(publicDir)); 													//serving css, js, img etc.

io.sockets.on('connection', function(socket){
  
  users.push(socket);
  
  socket.on('disconnect', function() {
       
	   io.emit('reload', 'reload');														//if a player leaves reload other player's page
	   
	   var i = users.indexOf(socket);
       users.splice(i, 1);
	    
	   num_users = users.length;
	   console.log("No. of players: " + num_users);
	   		  
  });	  
  
  
  
  num_users = users.length;	
  console.log("No. of players: " + num_users);
  
  socket.on('turn', function(msg){
    io.emit('turn', msg);
});

 socket.on('reload', function(msg){
    io.emit('reload', msg);
});
   
   

});





var port = 8080;

http.listen( port , function(){
  console.log('listening on port : ' + port);
});




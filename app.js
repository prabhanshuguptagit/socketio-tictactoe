var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);													//Hook websocket server to the http server 
var active_users = 0;

publicDir = require('path').join(__dirname, '/public');


app.get('/', function(req, res){
	
	res.sendFile(__dirname + '/index.html');

});


app.use(express.static(publicDir)); 													//serving css, js, img etc.


io.on('connection', function(socket){
 
  active_users++;
  io.emit('users',active_users);														//depending on num of users game.js(client!) shows state(wait, game,busy).
  
  socket.on('disconnect', function() {
	   active_users--;
	   													//if a player leaves reload other player's page
	
	   console.log("No. of players : " + active_users);   		  
  });	  
  
  console.log("No. of players : " + active_users);
		
		
  socket.on('turn', function(msg){
    io.emit('turn', msg);
	});
   
  

});





var port = 8080;

http.listen( port , function(){
  console.log('listening on port : ' + port);
});




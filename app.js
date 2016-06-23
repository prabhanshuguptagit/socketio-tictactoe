var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);													//Hook websocket server to the http server 
var users = [];
var num_users = 0;



app.get('/', function(req, res){
	
	res.sendFile(__dirname + '/index.html');
		
});

publicDir = require('path').join(__dirname, '/public');
app.use(express.static(publicDir)); 													//serving css, js, img etc. from public folder

io.sockets.on('connection', function(socket){
  
  socket.on('disconnect', function() {
       
	   if(socket == users[0] || socket == users[1])
	   io.emit('reload', 'reload');									//if a player leaves reload all user's page
   
	   var i = users.indexOf(socket);
       users.splice(i, 1);					
	    
	   num_users = users.length;
	   console.log("No. of players: " + num_users);
	   		  
  });
  
  users.push(socket);
  num_users = users.length;	
  console.log("No. of players: " + num_users);
  
  io.emit('users', num_users);
  
  
  socket.on('turn', function(turn){
	 
    if( users[0] == socket && turn.player === 1)
		io.emit('turnadd', turn);											//turnadd tells everyone to add the symbol
			
	
	else if( users[1] == socket && turn.player === 2)
	   io.emit('turnadd', turn);
		 	
			
	else
		socket.emit('notyourturn',"It's not your turn. Wait for other player to make his move.");	
	
	});

	
	socket.on('geticon',function(){
		if(socket == users[0])
			socket.emit('icon', 'O');
		else
			socket.emit('icon','X');
	});
	
	socket.on('win',function(turn){
		
		if(turn.player === 1)
		{users[1].emit('winmsg', "Player 2 ");
		users[0].emit('winmsg',"You ");
		users[1].emit('updatescore', 1);
		users[0].emit('updatescore',0);}
		
		if(turn.player === 2)
		{users[0].emit('winmsg', "Player 2 ");
		users[1].emit('winmsg',"You ");
		users[0].emit('updatescore', 1);
		users[1].emit('updatescore',0);}
		
		
		});
	
	socket.on('getchance', function(turn){
		
		if(turn.player === 1 && socket == users[0])
		{ socket.emit('mychance','.player1');
			users[1].emit('mychance','.player2');}
		
		if(turn.player === 2 && socket == users[1])
		{ socket.emit('mychance','.player1');
			users[0].emit('mychance','.player2');}
		
		
	});
	

});


var port = 8080;

http.listen( process.env.VCAP_APP_PORT || port , function(){
  console.log('listening on port : ' + port);
});



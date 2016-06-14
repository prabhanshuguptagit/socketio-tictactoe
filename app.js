var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

publicDir = require('path').join(__dirname, '/public');


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(publicDir)); //serving css, js, img etc.

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
	console.log(msg);
  });
});

var port = 8080;

http.listen( port , function(){
  console.log('listening on port : ' + port);
});
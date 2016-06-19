
$(document).ready(function(){
	var socket = io();
	var score = 0;
	
	socket.on('users', function(num_users){
	   if(num_users == 1)
	   { $('h1').remove();
		 $('body').append('<h1>Waiting for second player</h1>');} 	
	   if(num_users == 2)
	   { $('h1').remove();   
   
		$('body').append('\
		<div class="game">\
			<div class="board">\
				<div class="square top left"></div>\
				<div class="square top"></div>\
				<div class="square top right"></div>\
				<div class="square left"></div>\
				<div class="square"></div>\
				<div class="square right"></div>\
				<div class="square bottom left"></div>\
				<div class="square bottom"></div>\
				<div class="square bottom right"></div>\
			</div>\
		</div>\
	   <div class="scores"><p>svevevefffffff</p></div>' );  }
	   
	   if(num_users >=3)
	   {	
		if(!$('body').children().length)
		 $('body').append('<h1>Two players are already playing. Wait for you turn.</h1>');	}   

	});
	
	
	socket.on('reload', function(msg){
	   
	   location.reload(true);
   });	
   
   
	
	var turn = {
		player : 1,
		name : "Player",
		square: 0
		//GLOBAL variable
	}
	
	
	
	$("body").on("click", "div.square", function(event){
		
			turn.square = $(this).index();
			
			socket.emit('turn', turn);
	});
	

	socket.on('turn', function(turnval){
		
		//square number is index. squares begin from 0 not from one.
		square_num = turnval.square;
		clicked_square = $(".board").find( "div.square:eq(" + square_num + ")" );
		
		if(!clicked_square.has("p").length)     //double check because if square is double clicked then div is not added and two requests are sent
		{ 
		if( turn.player==1 )
				clicked_square.append('<p class="O">o</p>');
			else
				clicked_square.append('<p class="X">x</p>');
		turn.player = 3-turn.player;					//GLOBAL change
		}
		
		socket.emit('checkwin', 'abcde' );					
		
   });
	
   
  
	socket.on('checkwin', function(){
		console.log("heyhyehey!");
		var squares = $(board).children( ".square" );
		console.log('squares');
		 winner  = false;
                if (squares[0].innerHTML === mark && squares[1].innerHTML === mark && squares[2].innerHTML === mark) {
                  winner = true;
                } else if (squares[3].innerHTML === mark && squares[4].innerHTML === mark && squares[5].innerHTML === mark) {
                  winner = true;
                } else if (squares[6].innerHTML === mark && squares[7].innerHTML === mark && squares[8].innerHTML === mark) {
                  winner = true;
                } else if (squares[0].innerHTML === mark && squares[3].innerHTML === mark && squares[6].innerHTML === mark) {
                  winner = true;
                } else if (squares[1].innerHTML === mark && squares[4].innerHTML === mark && squares[7].innerHTML === mark) {
                  winner = true;
                } else if (squares[2].innerHTML === mark && squares[5].innerHTML === mark && squares[8].innerHTML === mark) {
                  winner = true;
                } else if (squares[0].innerHTML === mark && squares[4].innerHTML === mark && squares[8].innerHTML === mark) {
                  winner = true;
                } else if (squares[2].innerHTML === mark && squares[4].innerHTML === mark && squares[6].innerHTML === mark) {
                  winner = true;
                }
                return winner;
		
	});

});
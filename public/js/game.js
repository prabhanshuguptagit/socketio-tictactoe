
$(document).ready(function(){
	var socket = io();
	var score1 = 0, score2 = 0,ties=0;
	var squares;
	var winner =false;
	var moves = 0;
	var icon, iconother;
	var turn = {
		player : 1,
		square: 0
		//GLOBAL variable
	}
	
	var resetboard = function(){
		
		$('.square').empty('p');
		moves = 0;
		
	}
	
	socket.on('users', function(num_users){
	   if(num_users == 1)
	   { $('h1').remove();
		 $('body').append('<h1>Waiting for second player</h1>');} 	
	   if(num_users == 2)
	   { $('h1').remove(); 
   
		socket.emit('geticon', 'abcde');
		socket.on('icon',function(msg){
			icon = msg;
			if(icon == "X")
				iconother="O";
			else
				iconother="X";
		
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
	   <div class="scores p1">\
<p class="player1"><span class="p1">You</span><span class="p2">Player 1</span> (<span class="x">' + icon + '</span>)<span class="score"> '+ score1 + '</span></p>\
<p class="ties">Ties<span class="score">' + ties + '</span></p>\
<p class="player2"><span class="p1">Player 2</span><span class="p2">Player 2</span> (<span class="o">'+ iconother + '</span>)<span class="score">' + score2 + '</span></p>\
</div>\
	   <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
  <div class="vertical-alignment-helper">\
  <div class="modal-dialog  vertical-align-center" role="document">\
    <div class="modal-content">\
      <div class="modal-header">\
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">\
          <span aria-hidden="true">&times;</span>\
        </button>\
      </div>\
	  </div>\
	 </div>\
    </div>\
  </div>\
	   </div>');  });	
	   }
	   
	   if(num_users >=3)
	   {	
		if(!$('body').children().length)
		 $('body').append('<h1>Two players are already playing. Wait for you turn.</h1>');	}   

	});
	
	
	socket.on('reload', function(msg){
	   
	   location.reload(true);
	   
   });	
   
  
	
	
	$("body").on("click", "div.square", function(event){
		
			turn.square = $(this).index();
				
			socket.emit('turn', turn);
	});
	

	socket.on('turnadd', function(turnval){
		
		//square number is index. squares begin from 0 not from one.
		square_num = turnval.square;
		clicked_square = $(".board").find( "div.square:eq(" + square_num + ")" );
		
		if(!clicked_square.has("p").length)     //double check because if square is double clicked then div is not added and two requests are sent
		{ 
		if( turn.player==1 )
				clicked_square.append('<p class="O">o</p>');
			else
				clicked_square.append('<p class="X">x</p>');
		
		
		//check if there's a winner
		
		
		squares = $(".square").toArray();
		
		 winner  = false;
		 
                if (squares[0].innerHTML && squares[0].innerHTML === squares[1].innerHTML  && squares[1].innerHTML === squares[2].innerHTML) {
                  winner = true;
                } else if (squares[3].innerHTML && squares[3].innerHTML ===  squares[4].innerHTML && squares[4].innerHTML ===  squares[5].innerHTML ) {
                  winner = true;
                } else if (squares[6].innerHTML && squares[6].innerHTML ===  squares[7].innerHTML && squares[7].innerHTML ===  squares[8].innerHTML ) {
                  winner = true;
                } else if (squares[0].innerHTML && squares[0].innerHTML ===  squares[3].innerHTML && squares[3].innerHTML ===  squares[6].innerHTML ) {
                  winner = true;
                } else if (squares[1].innerHTML && squares[1].innerHTML ===  squares[4].innerHTML && squares[4].innerHTML ===  squares[7].innerHTML ) {
                  winner = true;
                } else if (squares[2].innerHTML && squares[2].innerHTML ===  squares[5].innerHTML && squares[5].innerHTML ===  squares[8].innerHTML ) {
                  winner = true;
                } else if (squares[0].innerHTML && squares[0].innerHTML ===  squares[4].innerHTML && squares[4].innerHTML ===  squares[8].innerHTML ) {
                  winner = true;
                } else if (squares[2].innerHTML && squares[2].innerHTML ===  squares[4].innerHTML && squares[4].innerHTML ===  squares[6].innerHTML ) {
                  winner = true;
                }
         
		if(winner === true)	
		{socket.emit('win', turn);turn.player = 3-turn.player;	//Winner gets first move
		
		console.log(moves);}
		
		else if(moves === 8)
			{ $('.modal-title').remove();
				$('.modal-header').append('<h3 class="modal-title">It\'s a draw</h3> ' );
				$('#myModal').modal('show');
				resetboard();
				ties++;
				$('.ties > .score').empty();
				$('.ties > .score').append(ties);}
				
		else{
			turn.player = 3-turn.player;					//GLOBAL change
		moves++;
		
		socket.emit('getchance',turn);}
		
	}	
	
	});
	
	
   socket.on('mychance',function(msg)
				{	
					$('.player1').css("color", 'black');
					$('.player2').css('color', 'black');
					$(msg).css('color','#fff');
		});
		
   socket.on('notyourturn', function(msg){
	  
		 $('.modal-title').remove();
		 $('.modal-header').append('<h3 class="modal-title">' + msg + '</h3> ' );
		 $('#myModal').modal('show');

   });
  
	socket.on('winmsg', function(msg){
		 $('.modal-title').remove();
		 $('.modal-header').append('<h3 class="modal-title">' + msg + 'won</h3> ' );
		 $('#myModal').modal('show');
		 socket.emit('checkscore', turn);
		 setTimeout(resetboard, 3000);
		 	
	});
	
	socket.on('updatescore', function(msg){
		
		if(!msg) score1++;
		if(msg) score2++;
		$('.player1 >.score').empty();
		$('.player2 >.score').empty();
		$('.player1 > .score ').append(score1/2);
		$('.player2 > .score ').append(score2/2);
	});

});
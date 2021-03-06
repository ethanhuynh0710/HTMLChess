 var blackAI = false;
 var whiteAI=!blackAI;
 var playerVSAI=false;
 var playerVSplayer = true;
 var AIVSAI=false;
 var ROW,COL;
 var time =0;
 var animate = true;
 var engineDepth = 1;
 var positionsEvaluated=0;
 var gameOver = false;
var pieceMatrix, highlightedMoves;
var canvas;
var WIDTH, HEIGHT, BOARD_X, SCREEN_X, SCREEN_Y,BOARD_WIDTH,BOARD_HEIGHT,board,canvasX,canvasY;
var turn, mouseX, mouseY, whiteEval,blackEval;
var material;
var numWhitePieces, numBlackPieces, wkMoved, bkMoved, rightwrMoved, rightbrMoved, leftwrMoved, leftbrMoved, epR, epC;
/*
	turn,white/blackEval,numWhitePieces,numBlackPieces,wkMoved, bkMoved, rightwrMoved, rightbrMoved, leftwrMoved, leftbrMoved, epR, epC;
*/
var animationToggle;
class Piece{
	constructor(row,col,piece,st){
		this.row=row;
		this.col=col;
		this.xCoord = (this.col / COL * BOARD_WIDTH);
		this.yCoord =  (this.row / ROW * BOARD_HEIGHT);
		this.piece=piece;
		this.state=st;
		this.dx=.2;
		this.dy=.2;
		this.toRow=-1;
		this.toCol=-1;
		if(islower(this.piece)){
			if(this.piece=='p'){
				this.img = document.getElementById("WhitePawn");
			}
			else if(this.piece=='q'){
				this.img = document.getElementById("WhiteQueen");
			}
			else if(this.piece=='b'){
				this.img = document.getElementById("WhiteBishop");
			}
			else if(this.piece=='r'){
				this.img = document.getElementById("WhiteRook");
			}
			else if(this.piece=='n'){
				this.img = document.getElementById("WhiteKnight");
			}
			else if(this.piece=='k'){
				this.img = document.getElementById("WhiteKing");
			}
		}
		else if(isupper(this.piece)){
			if(this.piece=='P'){
				this.img = document.getElementById("BlackPawn");
			}
			else if(this.piece=='Q'){
				this.img = document.getElementById("BlackQueen");
			}
			else if(this.piece=='B'){
				this.img = document.getElementById("BlackBishop");
			}
			else if(this.piece=='R'){
				this.img = document.getElementById("BlackRook");
			}
			else if(this.piece=='N'){
				this.img = document.getElementById("BlackKnight");
			}
			else if(this.piece=='K'){
				this.img = document.getElementById("BlackKing");
			}
		}
	}
	moveTo(r,c){
		this.state=2;
		this.toRow=r;
		this.toCol=c;
	}
	setState(i){
		this.state=i;
	}
	draw(c){
		c.beginPath();
		var width = BOARD_WIDTH/COL;
		var height = BOARD_HEIGHT/ROW;
		/*
			state 0:static, no moving
			state 1:hover after selection
			state 2:make move
			state 3:piece death
		*/
		if(!animationToggle){
			//do nothing
		}
		else if(false&&this.state==1){
			//ANIMATE HOVER
			this.xCoord+=this.dx;
			this.yCoord+=this.dy;
			let xCenter = (this.col / COL * BOARD_WIDTH);
			let yCenter =  (this.row / ROW * BOARD_HEIGHT);
			let len = 15;
			let leftBorder = xCenter-len;
			let rightBorder = xCenter+len;
			let topBorder = yCenter - len;
			let bottomBorder = yCenter + len;
			if(this.xCoord<leftBorder || this.xCoord>rightBorder){
				this.dx*=-1;
			}
			if(this.yCoord<topBorder || this.yCoord>bottomBorder){
				this.dy*=-1;
			}
		}
		else if(this.state==2){
			let toX = (this.toCol / COL * BOARD_WIDTH);
			let toY =  (this.toRow / ROW * BOARD_HEIGHT);
			let x = (this.col / COL * BOARD_WIDTH);
			let y =  (this.row / ROW * BOARD_HEIGHT);
			let xi = (toX-x)/30;
			let yi = (toY-y)/30;
			if((toX-x>0&&toX-this.xCoord>0)||(toX-x<0&&toX-this.xCoord<0)){
				if(Math.abs(xi)>Math.abs(toX-this.xCoord)){
					this.xCoord=toX;
				}
				else{
					this.xCoord+=xi;
				}
				
			}
			if((toY-y>0&&toY-this.yCoord>0)||(toY-y<0&&toY-this.yCoord<0)){
				if(Math.abs(yi)>Math.abs(toY-this.yCoord)){
					this.yCoord=toY;
				}
				else{
					this.yCoord+=yi;
				}
			}
		}
		c.drawImage(this.img,this.xCoord,this.yCoord,width,height);
		c.closePath();
	}

}




document.addEventListener("click", processClick);


initialize();
updateScreen();


if(playerVSAI || AIVSAI){
	moveAI();
}
 



//GRAPHICS
function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
	  if ((new Date().getTime() - start) > milliseconds){
		break;
	  }
	}
  }

function oppositePieces(r1,c1,r2,c2){
	let p1 = board[r1][c1];
	let p2 = board[r2][c2];
	return (isupper(p1)&&islower(p2))||(islower(p1)&&isupper(p2));
}
function correctPiece(piece){
	return (islower(piece)&&turn==1)||(isupper(piece)&&turn==-1);
}
function highlightLegalMoves(row,col){
	var moves = generateMoves(board,row,col,turn);
	/*
	1 = regular move (orange)
	2 = piece capture (red)
	3 = selected piece (green)
	*/
  highlightedMoves= [];
  var radius = 0;
  //each element of highlightedMoves is an array: [row,col,color,dist,radius]
	highlightedMoves.push([row,col,3,0,radius]);
	for (let item of moves){
		var v =item.split('-');
		for(var i=0;i<v.length;++i){
			v[i]=parseInt(v[i]);
		  }
		var r = v[2];
		var c = v[3];
		let dist = Math.max(Math.abs(row-r),Math.abs(col-c));
		if(board[r][c]!='.'&&oppositePieces(row,col,r,c)){
			highlightedMoves.push([r,c,2,dist,radius]);
		}
		else{
			highlightedMoves.push([r,c,1,dist,radius]);
		}
		
	}
	
}
function drawLegalMoves(){

	var ctx = canvas.getContext("2d");
	
	for(let v of highlightedMoves){
	ctx.beginPath();
	let r=v[0],
	c=v[1],
	color=v[2],
	dist=v[3],
	radius=v[4];
	let maxRadius=BOARD_WIDTH/COL/2;
	if(!animationToggle){
		radius=maxRadius;
	}
	if(radius<maxRadius){
		//v[4]+=(.15)*(Math.max(ROW,COL)+1-dist);
		//time = 50 = 1 second
		var delay = 1000*dist/Math.max(ROW,COL);
		if(!animationToggle){
			delay=10;
		}
		setTimeout(function() {
			// Your code here
			if(v[4]<maxRadius){
				v[4]++;
			}
			
		}, delay);
		
	}
	var x = (c / COL * BOARD_WIDTH) + BOARD_WIDTH/COL/2,
    y = (r / ROW * BOARD_HEIGHT)+ BOARD_HEIGHT/ROW/2;
    // Radii of the white glow.
    var innerRadius = radius/3;

	
	var gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, radius);
	var col;
	if(color==1){
		col='rgb(255, 200, 0,255)';
		
	}
	else if(color==2){
		col='rgb(255, 0, 0,255)';
	}
	else if(color==3){
		col='rgb(130, 255, 0,255)';
	}
	gradient.addColorStop(0, col);
	gradient.addColorStop(1, 'rgb(255,255,255,0)');

	ctx.arc(x, y, radius, 0, 2 * Math.PI);
	
	ctx.fillStyle = gradient;
	ctx.fill();
	ctx.closePath();
	}
	
}
function updateScreen(){
	var c = canvas.getContext("2d");
	c.clearRect(0,0,c.width,c.height);
	drawBoard();
	drawLegalMoves();
	drawPieces();
	if(!animationToggle){
		//nothing
	}
	else if(animate){
		time++;
		requestAnimationFrame(updateScreen);
	}else{
		time=0;
		highlightedMoves=[];
		cancelAnimationFrame(updateScreen);
	}
	
}
function moveAI() {
	if(gameOver){
		return;
	}
	positionsEvaluated=0;
	var delay = 1000;
	if(!animationToggle){
		delay=10;
	}
	if((turn==1&&whiteAI)||(turn==-1&&blackAI)||AIVSAI){
		time=0;
		let obj = {
			a: "null"
		}
		search(engineDepth,-99999999, 99999999,obj,3);
		var v =obj.a.split('-');
		for(var i=0;i<v.length;++i){
			v[i]=parseInt(v[i]);
		  }
		  pieceMatrix[v[0]][v[1]].setState(1);
			highlightLegalMoves(v[0],v[1]);
		  animate=true;
		  updateScreen();
		  
		  setTimeout(
			function(){
			move(v[0],v[1],v[2],v[3]);
			}, 
			delay);
		  
	}
	if(AIVSAI){
		setTimeout(
			function(){
				moveAI();
			}, 
			2*delay+50);
		
	}
	//var repeater = setTimeout(moveAI, 0);
   }
function updatePieceMatrix(){
	for(var row=0;row<ROW;++row){
		for(var col=0;col<COL;++col){
			let pieceObj = new Piece(row,col,board[row][col],0);
			pieceMatrix[row][col]=pieceObj;
		}
	}

}
function selectMove(x,y){

	var c = Math.floor((x - canvasX) / BOARD_WIDTH * COL);
	var r = Math.floor((y - canvasY) / BOARD_HEIGHT * ROW);
	if(x<canvasX||y<canvasY||x>(canvasX + BOARD_WIDTH)||y>(canvasY+BOARD_HEIGHT)){
		//Outside Board: deselect piece
		mouseX=mouseY=-1;
		time=0;
		animate=false;
		updateScreen();
		return false;
	}
	else if(mouseX==-1){
		//select piece
		time=0;
		if(!inBound(r,c,r,c)||board[r][c]=='.'||!correctPiece(board[r][c])){
			mouseX=mouseY=-1;
			animate=false;
			updateScreen();
			return false;
		}
		pieceMatrix[r][c].setState(1);
		highlightLegalMoves(r,c);
		animate=true;
		updateScreen();
		mouseX = x;
		mouseY=y;
		

		return false;
	}
	highlightedMoves=[];
	return true;
}
function processClick(event) {
	if(gameOver){
		return;
	}
	var x = event.clientX;
	var y = event.clientY;
	
	
	  if(playerVSAI||playerVSplayer){
		if((turn==1&&blackAI)||(turn==-1&&whiteAI)||playerVSplayer){
			if(selectMove(x,y)){
				//move
				var c = Math.floor((mouseX - canvasX) / BOARD_WIDTH * COL);
				var r = Math.floor((mouseY - canvasY) / BOARD_HEIGHT * ROW);
				var toC = Math.floor((x - canvasX) / BOARD_WIDTH * COL);
				var toR = Math.floor((y - canvasY) / BOARD_HEIGHT * ROW);
				
				
				/*
				calling move() alters the board, so when moveto is called, you are moving and drawing '.'
				*/

				move(r,c,toR,toC,true);
				var delay = 1000;
			if(!animationToggle){
				delay=10;
			}
			
					setTimeout(
						function(){
							moveAI();
						}, 
						delay+50);
			
					 
					
					mouseX=mouseY=-1;
		
				
			}
		}
	  }
	  
	

	
	
  }
  function searchMove(r,c,toR,toC){
	var str = r+"-"+c+"-"+toR+"-"+toC;
		var piece = board[r][c];
		if((turn==1&&isupper(piece))||(turn==-1&&islower(piece))){
			mouseX=mouseY=-1;
			return;
		}
		
		var moves = generateMoves(board,r,c,turn);

		if(moves.has(str)){
			//should be move
			var move = str.split('-');
			for(var i=0;i<move.length;++i){
				move[i]=parseInt(move[i]);
			  }
			if(tolower(board[move[0]][move[1]])=='k'&&Math.abs(move[1]-move[3])>1){
				//castling right
				
				basicMove(board,r,c,toR,toC);
				var dir = move[3]-move[1];
				if(turn==1){
					wkMoved=true;
				}
				else{
					bkMoved=true;
				}
				if(dir>0){
					basicMove(board,r,COL-1,toR,c+1);
					if(turn==1){
						rightwrMoved=true;
					}
					else{
						rightbrMoved=true;
					}
				}
				else{
					basicMove(board,r,0,toR,c-1);
					if(turn==1){
						leftwrMoved=true;
					}
					else{
						leftbrMoved=true;
					}
				}

			}
			else if(toupper(board[r][c]) == 'P' && epR != -1 && epC != -1 && toC == epC && toR == epR - turn && r == epR && Math.abs(c - epC) == 1 && inBound(r, c, toR, toC)){
				//En passant
	
				basicMove(board,r,c,toR,toC);
				board[epR][epC] = '.';
				epR = -1;
				epC = -1;
				if(turn==1){
					blackEval-=100;
				}
				else{
					whiteEval-=100;
				}
			}
			else{
				//Normal move
				updateCastleStatus(r,c);
				if (toupper(board[r][c]) == 'P' && Math.abs(r - toR) == 2)
				{
					epR = toR;
					epC = toC;
				}
				else
				{
					epR = -1;
					epC = -1;
				}
				if(board[toR][toC]!='.'){
					if(turn==1){
						//white captures a piece
				
						blackEval-=material.get(tolower(board[toR][toC]));
					}
					else{
						whiteEval-=material.get(tolower(board[toR][toC]));
					}
				}
				basicMove(board,r,c,toR,toC);
				if(promote()){
					if(turn==1){
						whiteEval+=material.get(tolower(board[toR][toC]))-100;
					}
					else{
						blackEval+=material.get(tolower(board[toR][toC]))-100;
					}
				}
				
				
			}
			var ending = outcome(board,-1*turn);
		if (ending == 1)
		{
			if (turn == -1)
			{

			//	console.log("BLACK WINS");
			}
			else
			{

			//	console.log("WHITE WINS");

			}

		}
		else if (ending == 2)
		{

		//	console.log("STALEMATE");

		}
		else if (ending == 3)
		{
		//	console.log("DRAW BY INSUFFICIENT MATERIAL");

		}
			turn*=-1;
			
	
	
		//OUTCOME
		
		
		}
}
function move(r,c,toR,toC,animateMove){
	if(gameOver){
		return false;
	}
	highlightedMoves=[];
	var delay = 250;
	if(!animationToggle){
		delay=10;
	}
	var str = r+"-"+c+"-"+toR+"-"+toC;
		var piece = board[r][c];
		if((turn==1&&isupper(piece))||(turn==-1&&islower(piece))){
			mouseX=mouseY=-1;
			return false;
		}
		
		var moves = generateMoves(board,r,c,turn);

		if(moves.has(str)){
			//should be move
			var move = str.split('-');
			for(var i=0;i<move.length;++i){
				move[i]=parseInt(move[i]);
			  }
			if(tolower(board[move[0]][move[1]])=='k'&&Math.abs(move[1]-move[3])>1){

				if(turn==1){
					wkMoved=true;
				}
				else{
					bkMoved=true;
				}
				if(dir>0){
					if(turn==1){
						rightwrMoved=true;
					}
					else{
						rightbrMoved=true;
					}
				}
				else{
					if(turn==1){
						leftwrMoved=true;
					}
					else{
						leftbrMoved=true;
					}
				}
				var dir = move[3]-move[1];
				
				if(animateMove){
					pieceMatrix[r][c].setState(2);
				pieceMatrix[r][c].moveTo(toR,toC);
				
				if(dir>0){
					pieceMatrix[r][COL-1].setState(2);
					pieceMatrix[r][COL-1].moveTo(toR,c+1);
				}
				else{
					pieceMatrix[r][0].setState(2);
					pieceMatrix[r][0].moveTo(toR,c-1);
				}
					animate=true;
					updateScreen();
				}
				

				
				setTimeout(function() {
					basicMove(board,r,c,toR,toC);
					if(dir>0){
						basicMove(board,r,COL-1,toR,c+1);
					}
					else{
						basicMove(board,r,0,toR,c-1);
					}
					if(animateMove){
						updatePieceMatrix();
						animate=false;
						updateScreen();
					}
					
				}

				,delay);
				

			}
			else if(toupper(board[r][c]) == 'P' && epR != -1 && epC != -1 && toC == epC && toR == epR - turn && r == epR && Math.abs(c - epC) == 1 && inBound(r, c, toR, toC)){
				//En passant
				
				if(turn==1){
					blackEval-=100;
				}
				else{
					whiteEval-=100;
				}

				if(animateMove){
					pieceMatrix[r][c].setState(2);
					pieceMatrix[r][c].moveTo(toR,toC);
					animate=true;
					updateScreen();
				}
				
				setTimeout(function() {
					basicMove(board,r,c,toR,toC);
					board[epR][epC] = '.';
					epR = -1;
					epC = -1;
					if(animateMove){
						updatePieceMatrix();
						animate=false;
						updateScreen();
					}
				} ,delay);
				
				
			}
			else{
				//Normal move
				updateCastleStatus(r,c);
				if (toupper(board[r][c]) == 'P' && Math.abs(r - toR) == 2)
				{
					epR = toR;
					epC = toC;
				}
				else
				{
					epR = -1;
					epC = -1;
				}
				if(board[toR][toC]!='.'){
					if(turn==1){
						//white captures a piece
				
						blackEval-=material.get(tolower(board[toR][toC]));
					}
					else{
						whiteEval-=material.get(tolower(board[toR][toC]));
					}
				}
					pieceMatrix[r][c].setState(2);
					pieceMatrix[r][c].moveTo(toR,toC);
					animate=true;
					updateScreen();

				
				setTimeout(function() {
					basicMove(board,r,c,toR,toC);
					if(promote()){
						if(turn==1){
							whiteEval+=material.get(tolower(board[toR][toC]))-100;
						}
						else{
							blackEval+=material.get(tolower(board[toR][toC]))-100;
						}
					}
						updatePieceMatrix();
						animate=false;
						updateScreen();
					
				
					
				}, delay);
				
				
				
			}
			
			setTimeout(function(){
				animate=false;
				updateScreen();
				setTimeout(function(){
					endGame();
					turn*=-1;
					if(turn==1){
						document.getElementById("turn").innerHTML="White to Move";
					}
					else{
						document.getElementById("turn").innerHTML="Black to Move";
					}
					let evaluation = (whiteEval-blackEval);
					let evalDisplay = "Static Material Evaluation: "+(evaluation)+" (";
					if(evaluation==0){
						evalDisplay+="neutral)";
					}
					else if(evaluation>0){
						evalDisplay+="White is ";
					}
					else{
						evalDisplay+="Black is ";
					}
					 evaluation = Math.abs(whiteEval-blackEval)/100;
					if(evaluation!=0){
						if(evaluation>=ROW){
							evalDisplay+="heavily favored)"
						}
						else if(evaluation>=ROW/2){
							evalDisplay+="favored)"
						}
						else{
							evalDisplay+="slightly favored)";
						}
					}
					document.getElementById("materialEvaluation").innerHTML=evalDisplay;


					
				},50);
					
				
				
			},delay);
			
	
	
		//OUTCOME
		return true;
		
		}
			animate=false;
			updateScreen();
		
		
		return false;
}
function endGame(){
	var ending = outcome(board,-1*turn);
			if(ending>0){
				gameOver=true;
			}
		if (ending == 1)
		{
			
			if (turn == -1)
			{
				alert("Black wins by Checkmate");
			}
			else
			{

				alert("White wins by Checkmate");

			}
			
		}
		else if (ending == 2)
		{

			alert("Stalemate");

		}
		else if (ending == 3)
		{
			alert("Draw by Insufficient Material");

		}
			
}
function drawBoard(){
	
	
	var c = canvas.getContext("2d");
	c.beginPath();

	for (var row = 0; row < ROW; row++)
	{
		for (var col = 0; col < COL; col++)
		{
			var tile;
			//sf::RectangleShape rect(sf::Vector2f(WIDTH / COL, HEIGHT / ROW));
			if ((row + col) % 2 == 0)
			{
				//white
				tile = document.getElementById("WhiteTile1");
				c.fillStyle = "#FFFFFF";
			}
			else
			{
				//black
				tile = document.getElementById("BlackTile1");
				c.fillStyle = "#800000";
			}
			var width = BOARD_WIDTH/COL;
			var height = BOARD_HEIGHT/ROW;
			var xCoord = (col / COL * BOARD_WIDTH);
			var yCoord = (row / ROW * BOARD_HEIGHT);
			//c.drawImage(tile,xCoord,yCoord,width,height);
			c.fillRect(xCoord,yCoord,width,height);
			
		}
	}
	c.closePath();
}

function drawPieces(){

	
	var c = canvas.getContext("2d");


	for(var row=0;row<ROW;++row){
		for(var col=0;col<COL;++col){
			var piece = board[row][col];
			if(piece=='.'){
				continue;
			}
			
			pieceMatrix[row][col].draw(c);
		}
	}

}


//UTILITY
function clone(b) //returns a clone of b
{
	var a = new Array(ROW);
	for (var i = 0; i < ROW; i++) {
    	a[i] = new Array(COL);
	}
	for (var r = 0; r < ROW; r++)
	{
		for (var c = 0; c < COL; c++)
		{
			a[r][c] = b[r][c];
		}
	}
	return a;
}
function print(a)
{
	for (var r = 0; r < ROW; r++)
	{
        var str = "";
		for (var c = 0; c < COL; c++)
		{
			str+=a[r][c];
		}
		console.log(str);
	}
}

function inBound(r,  c,  toR,  toC)
{
	return (r >= 0 && r <= ROW - 1 && c >= 0 && c <= COL - 1 && toR >= 0 && toR <= ROW - 1 && toC >= 0 && toC <= COL - 1);
}
//import {ROW, COL, WIDTH, HEIGHT, BOARD_X, SCREEN_X, SCREEN_Y,SCREEN_WIDTH,SCREEN_HEIGHT,board,numWhitePieces, numBlackPieces, wkMoved, bkMoved, rightwrMoved, rightbrMoved, leftwrMoved, leftbrMoved, epR, epC} from "./master"

function fill(){
    numWhitePieces = 2 * COL - 1;
	numBlackPieces = 2 * COL - 1;
	var randKingPosition = Math.ceil(Math.random()*COL) % COL;
	board[0][randKingPosition] = 'K';
	board[ROW - 1][randKingPosition] = 'k';
	var pieces = [ 'r','n','b','q' ];
	for (var c = 0; c < COL; c++)
	{
		if (board[0][c] != 'K')
		{
			var pieceIndex = Math.ceil(Math.random()*4) % 4;
			board[0][c] = pieces[pieceIndex].toUpperCase();
			board[ROW - 1][c] = pieces[pieceIndex].toLowerCase();
			whiteEval+=material.get(tolower(board[0][c]));
			blackEval+=material.get(tolower(board[0][c]));
		}
		whiteEval+=100;
		blackEval+=100;
		board[1][c] = 'P';
		board[ROW - 2][c] = 'p';
		for (var r = 2; r < ROW - 2; r++)
		{
			board[r][c] = '.';
		}

	}
}

function fullFill()
{

	if (ROW <= 8)
	{
		fill();
		return;
	}
	var randKingPosition = Math.ceil(Math.random()*COL) % COL;
	board[0][randKingPosition] = 'K';
	board[ROW - 1][randKingPosition] = 'k';
	var pieces = [ 'r','n','b','q' ];
	//numNonPawnRows = (row-4)/2-1
	var backline = Math.floor((ROW - 4) / 2 - 1);
	for (var r = 0; r < backline; r++)
	{
		for (var c = 0; c < COL; c++)
		{
			//in conditional below, change r to 0 if you want empty space in front of king
			if (board[r][c] != 'K')
			{
				var pieceIndex = Math.ceil(Math.random()*4) % 4;
				board[r][c] = pieces[pieceIndex].toUpperCase();
				board[ROW - 1 - r][c] = pieces[pieceIndex].toLowerCase();
				++numWhitePieces;
				++numBlackPieces;
				whiteEval+=material.get(tolower(board[r][c]));
				blackEval+=material.get(tolower(board[r][c]));
			}

		}

	}
	///*
	for (var c = 0; c < COL; c++)
	{
		board[backline][c] = 'P';
		board[ROW - 1 - backline][c] = 'p';
		whiteEval+=100;
		blackEval+=100;
		++numWhitePieces;
		++numBlackPieces;
		for (var r = backline + 1; r < ROW - 1 - backline; r++)
		{
			board[r][c] = '.';
		}
	}
	//*/
	//print(a);

}


function initialize()
{
	if(localStorage.animationToggle=="true"){
		animationToggle=true;
	}
	else{
		animationToggle=false;
	}
	//fix:
	animationToggle=true;
	
	console.log(animationToggle);
	canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	ctx.canvas.height = .7*window.innerHeight;
	ctx.canvas.width  = .7*window.innerHeight;
	
	BOARD_WIDTH = ctx.canvas.width;
	BOARD_HEIGHT = ctx.canvas.height;
	ROW = localStorage.selectedRow;
	COL=localStorage.selectedCol;
	if(ROW<=5){
		engineDepth=4;
	}
	else if(ROW<=8){
		engineDepth=3;
	}
	else if(ROW<=12){
		engineDepth=2;
	}
	else{
		engineDepth=1;
	}
	highlightedMoves=[];
	
	
	board = new Array(ROW);
	pieceMatrix = new Array(ROW);
for (var i = 0; i < ROW; i++) {
    board[i]=new Array(COL);
	pieceMatrix[i]=new Array(COL);
  }
	var mode = localStorage.something;
	if(mode=="pvp"){
        playerVSAI=false;
        playerVSplayer=true;
        AIVSAI=false;
		whiteAI=blackAI=false;
    }
    else if(mode=="pva"){
        playerVSAI=true;
        playerVSplayer=false;
        AIVSAI=false;
        
    }
    else if(mode=="ava"){
        playerVSAI=false;
        playerVSplayer=false;
        AIVSAI=true;
		whiteAI=blackAI=false;
    }
	material = new Map();
	material.set('p',100);
	material.set('b',300);
	material.set('n',300);
	material.set('r',500);
	material.set('q',900);
	whiteEval=blackEval=0;
	mouseX=mouseY=-1;
	
	  let rect = canvas.getBoundingClientRect();
	canvasX = rect.left;
	canvasY=rect.top;
	turn=1;
	numWhitePieces = numBlackPieces = 0;
	
	wkMoved = bkMoved = rightwrMoved = rightbrMoved = leftwrMoved = leftbrMoved = false;
	epR = epC = -1;

	if (ROW == 8 && COL == 8)
	{
		numWhitePieces = 15;
		numBlackPieces = 15;
		///*
		board = [
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'] ,
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'] ,
            ['.','.','.','.','.','.','.','.'],
            ['.','.','.','.','.','.','.','.'],
            ['.','.','.','.','.','.','.','.'],
            ['.','.','.','.','.','.','.','.'],
            [ 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p' ],
            [ 'r', 'n', 'b', 'q', 'k', 'b', 'n', 'r' ]
                ];
				whiteEval=blackEval=3900;
				
/*
				whiteEval=300;
				blackEval = 500;
				board = [
					['K', '.', '.', 'R', '.', '.', '.', '.'] ,
					['.', '.', '.', '.', '.', '.', '.', '.'] ,
					['.','.','.','.','.','.','.','.'],
					['.','.','.','n','.','.','.','.'],
					['.','.','.','.','.','.','.','.'],
					['.','.','.','.','.','.','.','.'],
					[ '.', '.', '.', '.', '.', '.', '.', '.' ],
					[ '.', '.', '.', '.', '.', '.', '.', 'k' ]
						];

//	*/
		//*/
		/*
			char classic[MAX_D][MAX_D] = {
{'.', '.', '.', '.', '.', 'K', '.', '.'} ,
{'.', '.', '.', '.', '.', 'P', '.', '.'} ,
{'.','.','.','.','.','q','.','r'},
{'.','.','n','.','.','.','.','.'},
{'.','.','.','.','.','.','p','.'},
{'.','.','.','.','p','n','p','.'},
{ '.', '.', '.', 'p', 'k', '.', '.', '.' },
{ 'r', '.', '.', '.', '.', '.', '.', '.' }
		};
		//*/
	}


	if (ROW != 8 || COL != 8)
	{
		fullFill();
	}
	for(var row=0;row<ROW;++row){
		for(var col=0;col<COL;++col){
			let pieceObj = new Piece(row,col,board[row][col],0);
			pieceMatrix[row][col]=pieceObj;
		}
	}


	


}

function updateCastleStatus( r, c)
{
	//wkMoved, bkMoved, rightwrMoved, rightbrMoved, leftwrMoved, leftbrMoved;
	if (board[r][c] == 'k')
	{
		wkMoved = true;
		//cout << "Moved: " << a[r][c];
	}
	if (board[r][c] == 'K')
	{
		bkMoved = true;
		//cout << "black king moved";
	}
	if (board[r][c] == 'r')
	{
		if (c == 0)
		{
			leftwrMoved = true;
		}
		if (c == COL - 1)
		{
			rightwrMoved = true;
			//cout << "right white rook moved";
		}
	}
	if (board[r][c] == 'R')
	{
		if (c == 0)
		{
			leftbrMoved = true;
		}
		if (c == COL - 1)
		{
			rightbrMoved = true;
		}
	}
}


//Playable
function playableKing(a,r,  c,  toR,  toC)
{
	var b = a[toR][toC]==a[toR][toC].toUpperCase();
	if (a[r][c]==a[r][c].toUpperCase())
	{
		b = a[toR][toC]==a[toR][toC].toLowerCase();
	}
	var ri = [ -1,-1,-1,0,0,1,1,1, 0, 0 ];
	var ci = [ -1,0,1,-1,1,-1,0,1 , -2, 2];

	for (var i = 0; i < ri.length; i++)
	{
		if (!inBound(r,c,r + ri[i], c + ci[i]))
		{
			continue;
		}
		
		if (r + ri[i] == toR && c + ci[i] == toC && (a[toR][toC] == '.' || b))
		{
			if(Math.abs(ci[i])>1){
				var p=1;
				if(a[r][c]=='K'){
					p=-1;
				}
				var dir = ci[i];
				if(squareAttacked(a,r,c+dir/2,p)){
					return false;
				}
					for(var col=c+dir/2; col!=0&&col!=(COL-1);col+=dir/2){
						if(a[r][col]!='.'){
							return false;
						}
					}

			}
			return true;
		}
	}


	return false;



}
function playableKnight(a, r,  c,  toR,  toC)
{
	var b = a[toR][toC]==a[toR][toC].toUpperCase();
	if (a[r][c]==a[r][c].toUpperCase())
	{
		b = a[toR][toC]==a[toR][toC].toLowerCase();
	}
	var ri = [ -1,-2,-2,-1,1,2,2,1 ];
	var ci = [ -2,-1,1,2,2,1,-1,-2  ];

	for (var i = 0; i < 8; i++)
	{
		if (!inBound(r,c,r + ri[i], c + ci[i]))
		{
			continue;
		}
		if (((r + ri[i]) == toR) && ((c + ci[i]) == toC) && ((a[toR][toC] == '.') || b))
		{
			return true;
		}
	}
	return false;



}
function playableRook(a, r,  c,  toR,  toC)
{

	var b = a[toR][toC]==a[toR][toC].toUpperCase();
	if (a[r][c]==a[r][c].toUpperCase())
	{
		b = a[toR][toC]==a[toR][toC].toLowerCase();
	}

	if (r != toR && c != toC)
	{
		return false;
	}
	//traverse upward
	if (toR < r)
	{
		for (var i = r - 1; i >= 0; i--)
		{
			if (a[i][c] != '.' && !(i == toR && c == toC))
			{
				break;
			}
			if (i == toR && c == toC && (b || a[toR][toC] == '.'))
			{
				return true;
			}
		}
	}
	else if (toR > r)
	{
		//traverse downward
		for (var i = r + 1; i <= ROW - 1; i++)
		{
			if (a[i][c] != '.' && !(i == toR && c == toC))
			{
				break;
			}
			if (i == toR && c == toC && (b || a[toR][toC] == '.'))
			{
				return true;
			}
		}
	}
	else if (toC > c)
	{
		//traverse right
		for (var i = c + 1; i <= COL - 1; i++)
		{
			if (a[r][i] != '.' && !(r == toR && i == toC))
			{
				break;
			}
			if (r == toR && i == toC && (b || a[toR][toC] == '.'))
			{
				return true;
			}
		}
	}
	else if (toC < c)
	{//traverse left
		for (var i = c - 1; i >= 0; i--)
		{
			if (a[r][i] != '.' && !(r == toR && i == toC))
			{
				break;
			}
			if (r == toR && i == toC && (b || a[toR][toC] == '.'))
			{
				return true;
			}
		}
	}



	return false;
}
function playableBishop(a, r,  c,  toR,  toC)
{
    var b = a[toR][toC]==a[toR][toC].toUpperCase();
	if (a[r][c]==a[r][c].toUpperCase())
	{
		b = a[toR][toC]==a[toR][toC].toLowerCase();
	}
	if (Math.abs(r - toR) != Math.abs(c - toC))
	{
		return false;
	}
	//top left
	if (toC < c && toR < r)
	{
		var tlr = r - 1;
		var tlc = c - 1;
		while (inBound(r,c,tlr, tlc))
		{
			if (a[tlr][tlc] != '.' && !(tlr == toR && tlc == toC))
			{
				break;
			}
			if (tlr == toR && tlc == toC && (b || a[toR][toC] == '.'))
			{
				return true;
			}
			tlr--;
			tlc--;
		}
	}


	//top right
	if (toC > c && toR < r)
	{
		var trr = r - 1;
		var trc = c + 1;
		while (inBound(r,c,trr, trc))
		{
			if (a[trr][trc] != '.' && !(trr == toR && trc == toC))
			{
				break;
			}
			if (trr == toR && trc == toC && (b || a[toR][toC] == '.'))
			{
				return true;
			}
			trr--;
			trc++;
		}
	}


	//bottom left
	if (toC<c && toR>r)
	{
		var blr = r + 1;
		var blc = c - 1;
		while (inBound(r,c,blr, blc))
		{
			if (a[blr][blc] != '.' && !(blr == toR && blc == toC))
			{
				break;
			}
			if (blr == toR && blc == toC && (b || a[toR][toC] == '.'))
			{
				return true;
			}
			blr++;
			blc--;
		}
	}


	//bottom right
	if (toC > c && toR > r)
	{
		var brr = r + 1;
		var brc = c + 1;
		while (inBound(r,c,brr, brc))
		{
			if (a[brr][brc] != '.' && !(brr == toR && brc == toC))
			{
				break;
			}
			if (brr == toR && brc == toC && (b || a[toR][toC] == '.'))
			{
				return true;
			}
			brr++;
			brc++;
		}
	}


	return false;
}
function playablePawn(a, r,  c,  toR,  toC)
{
	var i = 1;
	var b = a[toR][toC]==a[toR][toC].toUpperCase();
	var s = ROW - 2;
	if (a[r][c] == 'P')
	{
		i *= -1;
		b = a[toR][toC]==a[toR][toC].toLowerCase();
		s = 1;
	}
	if ((toC == (c - 1) || toC == (c + 1)) && toR == r - i)
	{
		return (a[toR][toC] != '.' && b) || (epR != -1 && epC != -1 && toC == epC && toR == epR - turn && r == epR && Math.abs(c - epC) == 1 && inBound(r, c, toR, toC));
	}
	if (toR == r - 2 * i && toC == c)
	{
		if (a[r - i][toC] != '.' || a[r - 2 * i][toC] != '.' || r != s)
		{
			return false;
		}
		return true;
	}
	if (toR == r - i && toC == c)
	{
		if (a[r - i][toC] != '.')
		{
			return false;
		}
		return true;
	}
	return false;
}
function playable(a, r,  c,  toR,  toC)
{
	if (a[r][c] == '.' || !inBound(r, c, toR, toC))
	{
		return false;
	}
	if (r == toR && c == toC)
	{
		return false;
	}
	if (a[r][c] == 'p' || a[r][c] == 'P')
	{
		return playablePawn(a, r, c, toR, toC);
	}
	if (a[r][c] == 'r' || a[r][c] == 'R')
	{
		return playableRook(a, r, c, toR, toC);
	}

	if (a[r][c] == 'b' || a[r][c] == 'B')
	{
		return playableBishop(a, r, c, toR, toC);
	}

	if (a[r][c] == 'q' || a[r][c] == 'Q')
	{
		return playableBishop(a, r, c, toR, toC) || playableRook(a, r, c, toR, toC);
	}

	if (a[r][c] == 'n' || a[r][c] == 'N')
	{
		return playableKnight(a, r, c, toR, toC);
	}

	if (a[r][c] == 'k' || a[r][c] == 'K')
	{
		return playableKing(a, r, c, toR, toC);
	}

	return false;
}
//Check

function knightCheck(a,  kingR,  kingC,  p) {

	var ri = [ -1,-2,-2,-1,1,2,2,1 ];
	var ci = [ -2,-1,1,2,2,1,-1,-2 ];

	for (var i = 0; i < 8; i++)
	{
		var kr = kingR + ri[i];
		var kc = kingC + ci[i];
		if (!inBound(kingR,kr,kingC, kc) || a[kr][kc] == '.')
		{
			continue;
		}
		var piece = a[kr][kc];
		if (p == 1 && piece == 'N') {
			return true;
		}
		if (p == -1 && piece == 'n') {
			return true;
		}

	}
	return false;
}
function islower(c){

    return c==c.toLowerCase();
}
function isupper(c){
    return c==c.toUpperCase();
}
function tolower(c){
    return c.toLowerCase();
}
function toupper(c){
    return c.toUpperCase();
}
function sideCheckHelper( a,  piece,  p) {
	//-1 = break
	//0 = continue
	//1 = return true
	if (piece == '.') {
		return 0;
	}
	//check if friendly piece is in the way
	if ((p == 1 && islower(piece)) || (p == -1 && isupper(piece)))
	{
		return -1;
	}
	//check if enemy piece is in the way
	if ((p == 1 && isupper(piece)) || (p == -1 && islower(piece)))
	{
		if ((tolower(piece) == 'r') || (tolower(piece) == 'q')) {
			return 1;
		}
		else {
			return -1;
		}
	}
	return -1;
}
function sideCheck( a,  kingR,  kingC,  p) {
	//traverse upward
	for (var i = kingR - 1; i >= 0; i--)
	{
		var piece = a[i][kingC];
		var SCH = sideCheckHelper(a, piece, p);
		if (SCH == -1) {
			break;
		}
		if (SCH == 1) {
			return true;
		}
	}
	//traverse downward
	for (var i = kingR + 1; i <= ROW - 1; i++)
	{
		var piece = a[i][kingC];
		var SCH = sideCheckHelper(a, piece, p);
		if (SCH == -1) {
			break;
		}
		if (SCH == 1) {
			return true;
		}
	}
	//traverse right
	for (var i = kingC + 1; i <= COL - 1; i++)
	{
		var piece = a[kingR][i];
		var SCH = sideCheckHelper(a, piece, p);
		if (SCH == -1) {
			break;
		}
		if (SCH == 1) {
			return true;
		}
	}
	for (var i = kingC - 1; i >= 0; i--)
	{
		var piece = a[kingR][i];
		var SCH = sideCheckHelper(a, piece, p);
		if (SCH == -1) {
			break;
		}
		if (SCH == 1) {
			return true;
		}
	}
	return false;
}
function diagonalCheckHelper( a,  piece,  p) {
	//-1 = break
	//0 = continue
	//1 = return true
	if (piece == '.') {
		return 0;
	}
	if ((p == 1 && islower(piece)) || (p == -1 && isupper(piece)))
	{
		return -1;
	}

	if ((p == 1 && isupper(piece)) || (p == -1 && islower(piece)))
	{
		if ((tolower(piece) == 'b') || (tolower(piece) == 'q')) {
			return 1;
		}
		else {
			return -1;
		}
	}
	return -1;

}
function diagonalCheck( a,  kingR,  kingC,  p) {
	//top left
	var r = kingR - 1;
	var c = kingC - 1;
	while (inBound(kingR,kingC,r, c)) {
		var piece = a[r][c];
		var DCH = diagonalCheckHelper(a, piece, p);
		if (DCH == 1) {
			return true;
		}
		if (DCH == -1) {
			break;
		}
		r--;
		c--;
	}
	//bottom left
	r = kingR + 1;
	c = kingC - 1;
	while (inBound(kingR,kingC,r, c)) {
		var piece = a[r][c];
		var DCH = diagonalCheckHelper(a, piece, p);
		if (DCH == 1) {
			return true;
		}
		if (DCH == -1) {
			break;
		}
		r++;
		c--;
	}
	r = kingR - 1;
	c = kingC + 1;
	while (inBound(kingR,kingC,r, c)) {
		var piece = a[r][c];
		var DCH = diagonalCheckHelper(a, piece, p);
		if (DCH == 1) {
			return true;
		}
		if (DCH == -1) {
			break;
		}
		r--;
		c++;
	}
	r = kingR + 1;
	c = kingC + 1;
	while (inBound(kingR,kingC,r, c)) {
		var piece = a[r][c];
		var DCH = diagonalCheckHelper(a, piece, p);
		if (DCH == 1) {
			return true;
		}
		if (DCH == -1) {
			break;
		}
		r++;
		c++;
	}
	return false;
}
function kingCheck( a,  r,  c,  p) {
	var ri = [ -1,-1,-1,0,0,1,1,1 ];
	var ci = [ -1,0,1,-1,1,-1,0,1 ];

	for (var i = 0; i < 8; i++)
	{
		if (!inBound(r,c,r + ri[i], c + ci[i]))
		{
			continue;
		}
		var piece = (a[r + ri[i]][c + ci[i]]);
		if ((piece == 'k'&&p==-1)||(piece=='K'&&p==1)) {
			return true;
		}
	}
	return false;
}
function pawnCheck( a,  r,  c,  p) {
	if (p == 1) {
		if (inBound(r,c,r - 1, c - 1)) {
			var piece = a[r - 1][c - 1];
			if (piece == 'P') {
				return true;
			}
		}
		if (inBound(r,c,r - 1, c + 1)) {
			var piece = a[r - 1][c + 1];
			if (piece == 'P') {
				return true;
			}
		}
	}
	if (p == -1) {
		if (inBound(r,c,r + 1, c - 1)) {
			var piece = a[r + 1][c - 1];
			if (piece == 'p') {
				return true;
			}
		}
		if (inBound(r,c,r + 1, c + 1)) {
			var piece = a[r + 1][c + 1];
			if (piece == 'p') {
				return true;
			}
		}
	}
	return false;
}
function squareAttacked(a,r,c,p){
	var knc = knightCheck(a, r, c, p);
	var sc = sideCheck(a, r, c, p);
	var dc = diagonalCheck(a, r, c, p);
	var pc = pawnCheck(a, r, c, p);
	var kc = kingCheck(a, r, c, p);

	return (knc || sc || dc || pc || kc);
}
function check( a,  p)
{
	//
	var kingR = -1;
	var kingC = -1;
	for (var r = 0; r < ROW; r++)
	{
		for (var c = 0; c < COL; c++)
		{
			if (p == 1)
			{
				if (a[r][c] == 'k')
				{
					kingR = r;
					kingC = c;
					break;
				}
			}
			else
			{
				if (a[r][c] == 'K')
				{
					kingR = r;
					kingC = c;
					break;
				}
			}
		}
	}
	///*
	var knc = knightCheck(a, kingR, kingC, p);
	var sc = sideCheck(a, kingR, kingC, p);
	var dc = diagonalCheck(a, kingR, kingC, p);
	var pc = pawnCheck(a, kingR, kingC, p);
	var kc = kingCheck(a, kingR, kingC, p);
	return (knc || sc || dc || pc || kc);

	//old brute force algorithm:

	//*/
	/*
	for (var r = 0; r < ROW; r++)
	{
		for (var c = 0; c < COL; c++)
		{
			if (a[r][c] == '.')
			{
				continue;
			}
			if ((p == -1 && islower(a[r][c])) || (p == 1 && isupper(a[r][c])))
			{
				if (playable(a, r, c, kingR, kingC))
				{
					return true;
				}
			}


		}
	}//*/

}


//Game
/*
Notes:
Have a validate function
-after move(), validate()
    -check if player who just made move is in check
    -check if move is playable
    -if validate false, switch back to the previous position
        -create an undo function
        -remember to update prev
    -**MAKE SURE TO MODIFY GLOBAL VARIABLES AFTER validate(), NOT BEFORE
        -promote(), updateCastleStatus(),outcome()

*/

function outcome(a,p)
{
	//0 = nothing, 1 = player p is checkmated, 2 = stalemate, 3 = insufficient material
	var kingR, kingC;
	kingR=kingC=-1;
	for (var r = 0; r < ROW; r++)
	{
		for (var c = 0; c < COL; c++)
		{
			if (islower(board[r][c]) && p == 1)
			{
				kingR = r;
				kingC = c;
				break;
			}
			if (isupper(board[r][c]) && p == -1)
			{
				kingR = r;
				kingC = c;
				break;
			}
		}
	}
	var whitePoints = 0;
	var blackPoints = 0;
	for (var r = 0; r < ROW; r++)
	{
		for (var c = 0; c < COL; c++)
		{
			var x = tolower(a[r][c]);
			if (x == 'q' || x == 'p' || x == 'r')
			{
				whitePoints += 100;
				break;
			}
			if (x == 'b' || x == 'n')
			{
				if (islower(a[r][c]))
				{
					whitePoints++;
				}
				else
				{
					blackPoints++;
				}
			}
		}
		if (whitePoints > 1 || blackPoints > 1)
		{
			break;
		}
	}

	if (whitePoints <= 1 && blackPoints <= 1)
	{
		//cout << "Insufficient Material\n";
		return 3;
	}

	for (var r = 0; r < ROW; r++)
	{
		for (var c = 0; c < COL; c++)
		{
		
		
			if (p == 1 && islower(a[r][c]) && generateMoves(a,r,c,p).size>0)
			{
				return 0;
			}
	
			if (p == -1 && isupper(a[r][c]) && generateMoves(a,r,c,p).size>0)
			{
				return 0;
			}
		}
	}
	if (check(a, p))
		return 1;

	return 2;
}


function promote()
{
	for (var c = 0; c < COL; c++)
	{
		if (board[0][c] == 'p')
		{
			board[0][c] = 'q';
			return true;
		}
		if (board[ROW - 1][c] == 'P')
		{
			board[ROW - 1][c] = 'Q';
			return true;
		}

	}
	return false;
}
function generateMoves(a, r, c,  p) //generates all legal moves for the piece at r,c
{
	//----------------------------------------------------------
	//Generate all nonlegal moves and store them in ri and ci
	//----------------------------------------------------------
	var moves = new Set();
	if(isupper(board[r][c])&&p==1||islower(board[r][c])&&p==-1){
		return moves;
	}
	var ri = new Array();
	var ci = new Array();
	var piece = tolower(a[r][c]);
	if (piece == 'k')
	{
		ri = [ -1,-1,-1,0,0,1,1,1 ];
		ci = [ -1,0,1,-1,1,-1,0,1 ];
		ri.push(0);
		ci.push(2);
		ri.push(0);
		ci.push(-2);
	}
	if (piece == 'p')
	{
		var m = -p;
		ri = [ m,2 * m,m,m ];
		ci = [ 0,0,1,-1 ];
	}
	if (piece=='r'||piece == 'q')
	{
		//ri = { 1,2,3,4,5,6,7,-1,-2,-3,-4,-5,-6,-7 };
		//ci = { 0,0,0,0,0,0,0,0,0,0,0,0,0,0 };
		//up and down
		for (var i = 1; i <= Math.min(ROW - 1, COL - 1); i++)
		{
			ri.push(i);
			ri.push(-i);
			ci.push(0);
			ci.push(0);
		}
		//left and right
		for (var i = 1; i <= Math.min(ROW - 1, COL - 1); i++)
		{
			ri.push(0);
			ri.push(0);
			ci.push(i);
			ci.push(-i);
		}
	}
	if (piece == 'b' || piece == 'q')
	{
		//top left and bottom right
		for (var i = 1; i <= Math.min(ROW - 1, COL - 1); i++)
		{
			ri.push(i);
			ri.push(-i);
			ci.push(i);
			ci.push(-i);
		}
		//top right and bottom left
		for (var i = 1; i <= Math.min(ROW - 1, COL - 1); i++)
		{
			ri.push(i);
			ri.push(-i);
			ci.push(-i);
			ci.push(i);
		}
	}
	if (piece == 'n')
	{
		ri = [ -1,-2,-2,-1,1,2,2,1 ];
		ci = [ -2,-1,1,2,2,1,-1,-2 ];
	}

	//----------------------------------------------------------
	//Check if moves are legal
	//----------------------------------------------------------
	piece = a[r][c];
	
	for (var i = 0; i < ri.length; i++)
	{
		
		
		if (!inBound(r,c,r + ri[i], c + ci[i])||!playable(a,r,c,r+ri[i],c+ci[i]))
		{
			continue;
		}
		var dest = a[r+ri[i]][c+ci[i]];
		var temp = clone(a);
		var toR = r+ri[i];
		var toC = c+ci[i];

		var str = r+"-"+c+"-"+toR+"-"+toC;
		if(dest=='.'){
	
				if((tolower(piece)=='k')&&(Math.abs(ci[i])>1)){
					//Castling &&
					if(check(board,p)){
						continue;
					}
					var dir = ci[i];
					if(p==1){
						
						if(dir>0){
							//castle right
							

							if(!rightwrMoved&&!wkMoved){ 
								basicMove(temp, r, c, r, c + ci[i]);
								basicMove(temp, ROW - 1, COL - 1, ROW - 1, c + 1);
								if(!check(temp,p)){
									moves.add(str);
								}
							}
						}
						else{
							//castle left
							if(!leftwrMoved&&!wkMoved){ 
								basicMove(temp, r, c, r, c + ci[i]);
								basicMove(temp, ROW - 1, 0, ROW - 1, c - 1);
								if(!check(temp,p)){
									moves.add(str);
								}
							}
						}
					}
					else{
						if(dir>0){
							//castle right
							

							if(!rightbrMoved&&!bkMoved){ 
								basicMove(temp, r, c, r, c + ci[i]);
								basicMove(temp, 0, COL - 1,0, c + 1);
								if(!check(temp,p)){
									moves.add(str);
								}
							}
						}
						else{
							//castle left
							if(!leftbrMoved&&!bkMoved){ 
								basicMove(temp, r, c, r, c + ci[i]);
								basicMove(temp, 0, 0, 0, c - 1);
								if(!check(temp,p)){
									moves.add(str);
								}
							}
						}
					}

				}
				
				else if(toupper(a[r][c]) == 'P' && epR != -1 && epC != -1 && toC == epC && toR == epR - p && r == epR && Math.abs(c - epC) == 1 && inBound(r, c, toR, toC)){
					//en passant
					basicMove(temp,r,c,toR,toC);
					temp[epR][epC] = '.';
					if(!check(temp,p)){
						moves.add(str);
					}
				}
				else{
				basicMove(temp,r,c,toR,toC);
					if(!check(temp,p)){
						moves.add(str);
					}
				}
		}
		else if((isupper(piece)&&islower(dest))||(islower(piece)&&isupper(dest))){
			//Condition: Capturing a piece
			
			basicMove(temp,r,c,toR,toC);
			if(!check(temp,p)){
				moves.add(str);
			}
			
		}
		

	}
	return moves;
}
function generateAllMoves(a,p){
	var allMoves=new Set();
	for(var r=0;r<ROW;++r){
		for(var c=0;c<COL;++c){
			if(a[r][c]!='.'){
				var moves = generateMoves(a,r,c,p);
				for (let item of moves){
					allMoves.add(item);
				}
			}
		}
	}
	return allMoves;
}

function basicMove(a,  r,  c,  toR,  toC)
{
	var piece = a[r][c];
	a[r][c] = '.';
	if (a[toR][toC] != '.')
	{
		//graveyard[arr[toR][toC]]++;
	}
	a[toR][toC] = piece;
}

//ENGINE
function search( depth,  alpha,  beta,finalMove, firstDepth){
	if(depth==0){
		
		var evaluation = (whiteEval-blackEval);
		positionsEvaluated++;
		var str="Positions evaluated by AI "+" (depth = "+engineDepth+"): "+positionsEvaluated;
		document.getElementById("positionsEvaluated").innerHTML = str; 
		return evaluation;
	}
	//Evaluation = (whiteEval-blackEval) * turn
	var moves = generateAllMoves(board,turn);
	if(moves.size==0){
		if(check(board,turn)){
			return -9999999 * turn;
		}
		return 0;
	}
	var [bestMove] = moves;
	if(turn==1){
		var maxEval = -9999999;
		for (let m of moves){
			var v = m.split('-');
		
		for(var i=0;i<v.length;++i){
			v[i]=parseInt(v[i]);
		  }
		var temp = clone(board);
		//store all current state variables
		var t,we,be,nw,nb,wkm, bkm, rwrm, rbrm, lwrm, lbrm, er, ec;
		t=turn,we=whiteEval;be=blackEval,nw=numWhitePieces,nb=numBlackPieces,wkm=wkMoved,bkm=bkMoved,rwrm=rightwrMoved,rbrm=rightbrMoved,lwrm=leftwrMoved,lbrm=leftbrMoved,er=epR,ec=epR;
		searchMove((v[0]),(v[1]),(v[2]),(v[3]));
		
		var evaluation = search(depth-1,alpha,beta,finalMove,firstDepth);
		//undo
		turn=t,whiteEval=we;blackEval=be,numWhitePieces=nw,numBlackPieces=nb,wkMoved=wkm,bkMoved=bkm,rightwrMoved=rwrm,rightbrMoved=rbrm,leftwrMoved=lwrm,leftbrMoved=lbrm,epR=er,epR=ec;
		board=temp;
		if(evaluation > maxEval){
			maxEval = evaluation;
			bestMove = m;
		}
		else if(evaluation==maxEval){
			var rand = Math.floor(Math.random() * 100);
			if(rand%10==0){
				bestMove = m;
			}

		}
		alpha = Math.max(alpha,evaluation);
		if(beta<=alpha){
			//break;
		}
		


		}
		finalMove.a=bestMove;
		return maxEval;

	}
	else{
		var minEval = 9999999;
		for (let m of moves){
			var v = m.split('-');
		for(var i=0;i<v.length;++i){
			v[i]=parseInt(v[i]);
		  }
		var temp = clone(board);
		//store all current state variables
		var t,we,be,nw,nb,wkm, bkm, rwrm, rbrm, lwrm, lbrm, er, ec;
		t=turn,we=whiteEval;be=blackEval,nw=numWhitePieces,nb=numBlackPieces,wkm=wkMoved,bkm=bkMoved,rwrm=rightwrMoved,rbrm=rightbrMoved,lwrm=leftwrMoved,lbrm=leftbrMoved,er=epR,ec=epR;
		searchMove((v[0]),(v[1]),(v[2]),(v[3]));

		
		var evaluation = search(depth-1,alpha,beta,finalMove,firstDepth);

		//undo
		turn=t,whiteEval=we;blackEval=be,numWhitePieces=nw,numBlackPieces=nb,wkMoved=wkm,bkMoved=bkm,rightwrMoved=rwrm,rightbrMoved=rbrm,leftwrMoved=lwrm,leftbrMoved=lbrm,epR=er,epR=ec;
		board=temp;
		if(evaluation < minEval){
			minEval = evaluation;
			bestMove = m;
		}
		else if(evaluation==minEval){
			var rand = Math.floor(Math.random() * 100);
			if(rand%10==0){
				bestMove = m;
			}

		}
		beta = Math.min(beta,evaluation);
		if(beta<=alpha){
			//break;
		}
		


		}
		finalMove.a=bestMove;
		return minEval;
	}
}
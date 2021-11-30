//https://stackoverflow.com/questions/15455289/changing-variable-by-html-button

var lockedDimension;
var mode;
var BOARD_WIDTH;
var BOARD_HEIGHT;
var MAX_DIMENSION;
var MIN_DIMENSION;
var canvas;
var prevLen;
var board;


initialize();
drawBoard();
drawPieces();
drawRect(8,8);

//document.getElementById("selectMode").addEventListener("click", selectMode);
window.updateMode = updateMode;
function updateMode(){
    mode++;
    if(mode%3==0){
        document.getElementById("selectMode").innerHTML="Player VS Player";
        localStorage.something = "pvp" ; 
    }
    else if(mode%3==1){
        document.getElementById("selectMode").innerHTML="Player VS Bot";
        localStorage.something = "pva" ; 
    }
    else if(mode%3==2){
        document.getElementById("selectMode").innerHTML="Bot VS Bot";
        localStorage.something = "ava" ; 
    }
}
function print(a)
{
	for (var r = 0; r < MAX_DIMENSION; r++)
	{
        var str = "";
		for (var c = 0; c < MAX_DIMENSION; c++)
		{
			str+=a[r][c];
		}
		console.log(str);
	}
}

function fill(ROW,COL){
    if(ROW==8){
        board = [
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R','.','.','.','.','.','.','.','.','.','.','.','.'] ,
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P','.','.','.','.','.','.','.','.','.','.','.','.'] ,
            ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
            ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
            ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
            ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
            [ 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p','.','.','.','.','.','.','.','.' ,'.','.','.','.'],
            [ 'r', 'n', 'b', 'q', 'k', 'b', 'n', 'r','.','.','.','.','.','.','.','.' ,'.','.','.','.'],
            ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
            ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
            ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
            ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
            ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
            ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
            ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
            ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
            ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
            ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
            ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
            ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.']
                ];
                return;
    }
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
		}
		board[1][c] = 'P';
		board[ROW - 2][c] = 'p';
		for (var r = 2; r < ROW - 2; r++)
		{
			board[r][c] = '.';
		}

	}
}
function fullFill(ROW,COL)
{
    board = new Array(MAX_DIMENSION);
    for(var i=0;i<MAX_DIMENSION;++i){
        board[i]=new Array(MAX_DIMENSION);
    }
    for(var r=0;r<MAX_DIMENSION;++r){
        for(var c=0;c<MAX_DIMENSION;++c){
            board[r][c]='.';
        }
    }
   
	if (ROW <= 8)
	{
		fill(ROW,COL);
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
			}

		}

	}
	///*
	for (var c = 0; c < COL; c++)
	{
		board[backline][c] = 'P';
		board[ROW - 1 - backline][c] = 'p';
		for (var r = backline + 1; r < ROW - 1 - backline; r++)
		{
			board[r][c] = '.';
		}
	}
	//*/
	//print(a);

}
function drawPieces(){

	
	var c = canvas.getContext("2d");


	for(var row=0;row<MAX_DIMENSION;++row){
		for(var col=0;col<MAX_DIMENSION;++col){
			var piece = board[row][col];
			if(piece=='.'){
				continue;
			}
            var img;
            if(piece=='p'){
                img = document.getElementById("WhitePawn");
            }
            else if(piece=='q'){
                img = document.getElementById("WhiteQueen");
            }
            else if(piece=='b'){
                img = document.getElementById("WhiteBishop");
            }
            else if(piece=='r'){
                img = document.getElementById("WhiteRook");
            }
            else if(piece=='n'){
                img = document.getElementById("WhiteKnight");
            }
            else if(piece=='k'){
                img = document.getElementById("WhiteKing");
            }
            if(piece=='P'){
                img = document.getElementById("BlackPawn");
            }
            else if(piece=='Q'){
                img = document.getElementById("BlackQueen");
            }
            else if(piece=='B'){
                img = document.getElementById("BlackBishop");
            }
            else if(piece=='R'){
                img = document.getElementById("BlackRook");
            }
            else if(piece=='N'){
                img = document.getElementById("BlackKnight");
            }
            else if(piece=='K'){
                img = document.getElementById("BlackKing");
            }
			var width = BOARD_WIDTH/MAX_DIMENSION;
		    var height = BOARD_HEIGHT/MAX_DIMENSION;
            var xCoord = (col / MAX_DIMENSION * BOARD_WIDTH);
		    var yCoord =  (row / MAX_DIMENSION * BOARD_HEIGHT);
			c.drawImage(img,xCoord,yCoord,width,height);
		    c.closePath();
		}
	}

}
function drawBoard(){
	
	
	var c = canvas.getContext("2d");
	c.beginPath();

	for (var row = 0; row < MAX_DIMENSION; row++)
	{
		for (var col = 0; col < MAX_DIMENSION; col++)
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
            
			var width = BOARD_WIDTH/MAX_DIMENSION;
			var height = BOARD_HEIGHT/MAX_DIMENSION;
			var xCoord = (col / MAX_DIMENSION * BOARD_WIDTH);
			var yCoord = (row / MAX_DIMENSION * BOARD_HEIGHT);
			//c.drawImage(tile,xCoord,yCoord,width,height);
			c.fillRect(xCoord,yCoord,width,height);
			
		}
	}
	c.closePath();
}
function drawRect(row,col){
    var c = canvas.getContext("2d");
	c.beginPath();
    if(row<MIN_DIMENSION){
        c.fillStyle = 'rgb(255, 0, 0,.5)';
    }
    else if(row==8){
        c.fillStyle = 'rgb(255, 255, 0,.5)';
    }
    else{
        c.fillStyle = 'rgb(0, 255, 0,.5)';
    }
    
    let width = col*BOARD_WIDTH/MAX_DIMENSION;
    let height = row*BOARD_HEIGHT/MAX_DIMENSION;
    var rect = canvas.getBoundingClientRect();
    c.fillRect(0,0,width,height);
    c.closePath();
}
canvas.addEventListener("mousemove", function( event ) {
    var rect = canvas.getBoundingClientRect();
    var c = canvas.getContext("2d");
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    
    if(!lockedDimension){
        var col = Math.floor((x) / BOARD_WIDTH * MAX_DIMENSION)+1;
        var row = Math.floor((y) / BOARD_HEIGHT * MAX_DIMENSION)+1;
        var len = Math.max(row,col);
        if(len!=prevLen){
            c.clearRect(0,0,c.width,c.height);
            drawBoard();
            
            fullFill(len,len);
            drawPieces();
           
            drawRect(len,len);
            var display = len+" x "+len;
            if(len<MIN_DIMENSION){
                display = "INVALID";
            }
            document.getElementById("dimensions").innerHTML = display;
            prevLen=len;
        }
       
    }
  }, true);

  canvas.addEventListener("click", function( event ) {
    var rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    
    if(lockedDimension){
        lockedDimension=false;
        localStorage.selectedRow = 8; 
        localStorage.selectedCol = 8; 
        document.getElementById("dimensions").innerHTML = "8 x 8";
    }
    else{
        var col = Math.floor((x) / BOARD_WIDTH * MAX_DIMENSION)+1;
        var row = Math.floor((y) / BOARD_HEIGHT * MAX_DIMENSION)+1;
        var len = Math.max(row,col);
        var display = len+" x "+len;
        if(len<MIN_DIMENSION){
            display = "INVALID";
            localStorage.selectedRow = 8; 
            localStorage.selectedCol = 8; 
            document.getElementById("dimensions").innerHTML = display;
        }
        else{
            localStorage.selectedRow = len; 
            localStorage.selectedCol = len; 
            lockedDimension=true;
            document.getElementById("dimensions").innerHTML = display;
        }
        
    }
  }, false);
  function initialize(){
    canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
	ctx.canvas.height = .7*window.innerHeight;
	ctx.canvas.width  = .7*window.innerHeight;
    lockedDimension=false;
    mode = 0;
    BOARD_WIDTH = ctx.canvas.width;
    BOARD_HEIGHT = ctx.canvas.height;
    MAX_DIMENSION = 20;
    MIN_DIMENSION = 4;
    
    prevLen = -1;
    localStorage.something = "pvp" ; 
    localStorage.selectedRow = 8; 
    localStorage.selectedCol = 8; 
    board = [
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R','.','.','.','.','.','.','.','.','.','.','.','.'] ,
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P','.','.','.','.','.','.','.','.','.','.','.','.'] ,
        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
        [ 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p','.','.','.','.','.','.','.','.' ,'.','.','.','.'],
        [ 'r', 'n', 'b', 'q', 'k', 'b', 'n', 'r','.','.','.','.','.','.','.','.' ,'.','.','.','.'],
        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.'],
        ['.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.','.']
            ];
  }
//export {blackAI,whiteAI,playerVSAI,playerVSplayer,AIVSAI}
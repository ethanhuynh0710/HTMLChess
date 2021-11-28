//https://stackoverflow.com/questions/15455289/changing-variable-by-html-button

var lockedDimension=false;
var mode = 0;
var BOARD_WIDTH = 500;
var BOARD_HEIGHT = 500;
var MAX_DIMENSION = 20;
var MIN_DIMENSION = 4;
var canvas = document.getElementById("myCanvas");
localStorage.something = "pvp" ; 
localStorage.selectedRow = 8; 
localStorage.selectedCol = 8; 

drawBoard();
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
				c.fillStyle = "#4C8FFF";
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
        c.clearRect(0,0,c.width,c.height);
	    drawBoard();
        var len = Math.max(row,col);
        drawRect(len,len);
        var display = len+" x "+len;
        if(len<MIN_DIMENSION){
            display = "INVALID";
        }
        document.getElementById("dimensions").innerHTML = display;
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
//export {blackAI,whiteAI,playerVSAI,playerVSplayer,AIVSAI}
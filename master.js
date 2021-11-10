var ROW, COL, WIDTH, HEIGHT, BOARD_X, SCREEN_X, SCREEN_Y,BOARD_WIDTH,BOARD_HEIGHT,board,canvasX,canvasY;
var turn, mouseX, mouseY;
var numWhitePieces, numBlackPieces, wkMoved, bkMoved, rightwrMoved, rightbrMoved, leftwrMoved, leftbrMoved, epR, epC;
/*
extern map<char, int> graveyard;
extern map<char, int> values;
extern vector<char> uniquePieces;
extern vector<vector<int>> AImoves;
*/
var whiteIsHuman;
var blackIsHuman;

document.addEventListener("click", processClick);

ROW=8;
COL=8;



board = new Array(ROW);
for (var i = 0; i < ROW; i++) {
    board[i]=new Array(COL);
  }

initialize();
drawBoard();
drawPieces();





//GRAPHICS
function processClick(event) {
	//document.body.textContent =
	 // "clientX: " + event.clientX +
	  //" - clientY: " + event.clientY;
	  
	var x = event.clientX;
	var y = event.clientY;

	if(x<canvasX||y<canvasX||x>(canvasX + BOARD_WIDTH)||y>(canvasY+BOARD_HEIGHT)){
		//deselect piece
		mouseX=mouseY=-1;
	}
	else if(mouseX==-1){
		//select piece
		mouseX = x;
		mouseY=y;
	}
	else{
		//move

		var c = Math.floor((mouseX - canvasX) / BOARD_WIDTH * COL);
		var r = Math.floor((mouseY - canvasY) / BOARD_HEIGHT * ROW);

		var toC = Math.floor((x - canvasX) / BOARD_WIDTH * COL);
		var toR = Math.floor((y - canvasY) / BOARD_HEIGHT * ROW);

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
			else if(false){
				//En passant

			}
			else{
				updateCastleStatus(r,c);
				basicMove(board,r,c,toR,toC);
				
			}
			
		}
		turn*=-1;
		drawBoard();
		drawPieces();
		mouseX=mouseY=-1;
		
	}

	console.log(x,y);
  }
  
function drawBoard(){
	var canvas = document.getElementById("myCanvas");
	
	var c = canvas.getContext("2d");
	c.beginPath();

	for (var row = 0; row < ROW; row++)
	{
		for (var col = 0; col < COL; col++)
		{

			//sf::RectangleShape rect(sf::Vector2f(WIDTH / COL, HEIGHT / ROW));
			if ((row + col) % 2 == 0)
			{
				c.fillStyle = "#FFFFFF";
			}
			else
			{
				c.fillStyle = "#27AE60";
			}
			var width = BOARD_WIDTH/COL;
			var height = BOARD_HEIGHT/ROW;
			var xCoord = (col / COL * BOARD_WIDTH);
			var yCoord = (row / ROW * BOARD_HEIGHT);
			c.fillRect(xCoord,yCoord,width,height);
			
		}
	}
	c.closePath();
}

function drawPieces(){

	var canvas = document.getElementById("myCanvas");
	
	var c = canvas.getContext("2d");
	c.beginPath();

	for(var row=0;row<ROW;++row){
		for(var col=0;col<COL;++col){
			var piece = board[row][col];
			var width = BOARD_WIDTH/COL;
			var height = BOARD_HEIGHT/ROW;
			var xCoord = (col / COL * BOARD_WIDTH);
			var yCoord = (row / ROW * BOARD_HEIGHT);
			var img;
			if(piece=='.'){
				continue;
			}
			else if(islower(piece)){
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
			}
			else if(isupper(piece)){
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
			}
		c.drawImage(img,xCoord,yCoord,width,height);
		}
	}
	c.closePath();
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
			str+=board[r][c];
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
		}
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
			}

		}

	}
	///*
	for (var c = 0; c < COL; c++)
	{
		board[backline][c] = 'P';
		board[ROW - 1 - backline][c] = 'p';
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
	mouseX=mouseY=-1;
	var canvas = document.getElementById("myCanvas");
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

				board = [
					['R', '.', '.', '.', 'K', '.', '.', 'R'] ,
					['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'] ,
					['.','.','.','.','.','.','.','.'],
					['.','.','.','.','.','.','.','.'],
					['.','.','.','.','.','.','.','.'],
					['.','.','.','.','.','.','.','.'],
					[ 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p' ],
					[ 'r', '.', '.', '.', 'k', '.', '.', 'r' ]
						];
	
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


	BOARD_WIDTH = 500;
	BOARD_HEIGHT = 500;


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
			if(Math.abs(ci[i]>1)){
				var dir = ci[i];
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
		return a[toR][toC] != '.' && b;
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
	while (inBound(r, c)) {
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
		var piece = tolower(a[r + ri[i]][c + ci[i]]);
		if (piece == 'k') {
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

function outcome(p)
{
	//0 = nothing, 1 = player p is checkmated, 2 = stalemate, 3 = insufficient material
	var kingR, kingC;
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
			var x = tolower(board[r][c]);
			if (x == 'q' || x == 'p' || x == 'r')
			{
				whitePoints += 100;
				break;
			}
			if (x == 'b' || x == 'n')
			{
				if (islower(board[r][c]))
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
	if (canMove(board, kingR, kingC, p))
	{
		return 0;
	}
	for (var r = 0; r < ROW; r++)
	{
		for (var c = 0; c < COL; c++)
		{
			if (p == 1 && islower(board[r][c]) && canMove(board, r, c, p))
			{
				return 0;
			}
			if (p == -1 && isupper(board[r][c]) && canMove(board, r, c, p))
			{
				return 0;
			}
		}
	}
	if (check(board, p))
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
		}
		if (board[ROW - 1][c] == 'P')
		{
			board[ROW - 1][c] = 'Q';
		}

	}
}
function generateMoves(a, r, c,  p) //generates all legal moves for the piece at r,c
{
	//----------------------------------------------------------
	//Generate all nonlegal moves and store them in ri and ci
	//----------------------------------------------------------
	var moves = new Set();
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
				else if(1==0){
					//en passant
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
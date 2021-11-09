
import {ROW, COL, WIDTH, HEIGHT, BOARD_X, SCREEN_X, SCREEN_Y,SCREEN_WIDTH,SCREEN_HEIGHT,board,numWhitePieces, numBlackPieces, wkMoved, bkMoved, rightwrMoved, rightbrMoved, leftwrMoved, leftbrMoved, epR, epC} from "./master.js"

ROW=2;
COL=2;
var items = [
    [1, 2],
    [3, 4],
    [5, 6]
  ];
  
print(items);
function print(arr)
{
	for (var r = 0; r < ROW; r++)
	{
		for (var c = 0; c < COL; c++)
		{
			console.log(arr[r][c])
		}
		console.log("\n")
	}
}

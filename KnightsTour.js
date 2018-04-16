var canvas, context, numofBoxesI, numofBoxesJ, delay, boxSize;

function init(frm) {    
    canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');

    numofBoxesI = document.getElementById('rows').value;
    numofBoxesJ = document.getElementById('columns').value;
    boxSize = document.getElementById('boxSize').value;
    delay = document.getElementById('delay').value;

    //create a chess board using html5
    canvas.width = numofBoxesI * boxSize + 10;
    canvas.height = numofBoxesJ * boxSize + 10;
    for (var n = 0; n < numofBoxesI; n++) {
        for (var m = 0; m < numofBoxesJ; m++) {
            context.beginPath();
            context.rect(n * boxSize, m * boxSize, boxSize, boxSize);

            if ((n + m) % 2 != 0) {
                context.fillStyle = 'grey';
            }
            else {
                context.fillStyle = 'white';
            }

            context.fill();
            context.lineWidth = 1;
            context.strokeStyle = 'black';
            context.stroke();
        }
    }

}

function chessPosition(i, j) {
    this.posI = i;
    this.posJ = j;
}

function box(isMarked, positionI, positionJ) {
    this.isMarked = isMarked;
    this.positionI = positionI;
    this.positionJ = positionJ;
    this.listMoves = new Array();
    this.moves = 0;

    //check all moves			
    if (positionI - 2 >= 0 && positionJ - 1 >= 0) {
        this.listMoves.push(new chessPosition(positionI - 2, positionJ - 1));
        this.moves++;
    }
    if (positionI - 2 >= 0 && positionJ + 1 <= numofBoxesJ - 1) {
        this.listMoves.push(new chessPosition(positionI - 2, positionJ + 1));
        this.moves++;
    }

    if (positionI + 2 <= numofBoxesI - 1 && positionJ - 1 >= 0) {
        this.listMoves.push(new chessPosition(positionI + 2, positionJ - 1));
        this.moves++;
    }
    if (positionI + 2 <= numofBoxesI - 1 && positionJ + 1 <= numofBoxesJ - 1) {
        this.listMoves.push(new chessPosition(positionI + 2, positionJ + 1));
        this.moves++;
    }

    if (positionI - 1 >= 0 && positionJ - 2 >= 0) {
        this.listMoves.push(new chessPosition(positionI - 1, positionJ - 2));
        this.moves++;
    }
    if (positionI - 1 >= 0 && positionJ + 2 <= numofBoxesJ - 1) {
        this.listMoves.push(new chessPosition(positionI - 1, positionJ + 2));
        this.moves++;
    }

    if (positionI + 1 <= numofBoxesI - 1 && positionJ - 2 >= 0) {
        this.listMoves.push(new chessPosition(positionI + 1, positionJ - 2));
        this.moves++;
    }
    if (positionI + 1 <= numofBoxesI - 1 && positionJ + 2 <= numofBoxesJ - 1) {
        this.listMoves.push(new chessPosition(positionI + 1, positionJ + 2));
        this.moves++;
    }

}

var arr, cnt;
function myFunction() {
    //create the 2-d matrix
    cnt = 0;
    arr = new Array(numofBoxesI);
    for (var i = 0; i < numofBoxesI; i++) {
        arr[i] = new Array(numofBoxesJ);
    }

    for (var i = 0; i < numofBoxesI; i++) {
        for (var j = 0; j < numofBoxesJ; j++) {
            arr[i][j] = new box(false, i, j);
        }
    }

    var currentPos = new chessPosition(Math.round(numofBoxesI / 2 - 0.1), Math.round(numofBoxesJ / 2 - 0.1));

    var tt;
    for (var i = 0; i < numofBoxesI; i++) {
        for (var j = 0; j < numofBoxesJ; j++) {
            tt = 0;
            if (arr[i][j].isMarked == false) {
                for (var k = 0; k < arr[i][j].listMoves.length; k++) {
                    if (arr[i][j].listMoves[k].posI == currentPos.posI && arr[i][j].listMoves[k].posJ == currentPos.posJ) {
                        tt = k;
                        arr[i][j].moves--;
                    }
                }
            }
        }
    }

    arr[currentPos.posI][currentPos.posJ].isMarked = true;
    chooseYourMove(currentPos);

}

//javascript attacks knight
function chooseYourMove(pos) {
    cnt++;
    var tempMoves = 9;	//the biggest number of moves is 8
    var nextPos, tmp, indx = -2;

    //find the box with the minimum moves
    for (var i = 0; i < arr[pos.posI][pos.posJ].listMoves.length; i++) {
        tmp = arr[pos.posI][pos.posJ].listMoves[i];

        if (arr[tmp.posI][tmp.posJ].moves < tempMoves && arr[tmp.posI][tmp.posJ].isMarked == false) {
            nextPos = new chessPosition(tmp.posI, tmp.posJ);
            tempMoves = arr[tmp.posI][tmp.posJ].moves;
        }
    }
    try {
        for (var i = 0; i < numofBoxesI; i++) {
            for (var j = 0; j < numofBoxesJ; j++) {
                if (arr[i][j].isMarked == false) {
                    for (var k = 0; k < arr[i][j].listMoves.length; k++) {
                        if (arr[i][j].listMoves[k].posI == nextPos.posI && arr[i][j].listMoves[k].posJ == nextPos.posJ) {
                            arr[i][j].listMoves.splice(k, 1);
                            arr[i][j].moves--;
                        }
                    }
                }
            }
        }


        arr[nextPos.posI][nextPos.posJ].isMarked = true;
    }
    catch (err) {
        var txt = "There was an error on this page.\n\n";
        txt += "Error description: The knight's tour cannot be resolved. Possible causes error\n";
        txt += " 1)m and n are both odd; n is not 1 \n 2)m = 1, 2, or 4; n is not 1 \n 3)m = 3 and n = 4, 6, or 8.";
        txt += "Click OK to continue.\n\n";

        alert(txt);
        return;
    }
    drawLine(pos, nextPos);

    if (cnt == numofBoxesI * numofBoxesJ - 1) {
        return;
    }
    setTimeout(function () { chooseYourMove(nextPos) }, delay);
}

function drawLine(current, next) {
    context.moveTo(boxSize / 2 + current.posI * boxSize, boxSize / 2 + current.posJ * boxSize);
    context.lineTo(boxSize / 2 + next.posI * boxSize, boxSize / 2 + next.posJ * boxSize);
    context.lineWidth = 1;
    context.stroke();

    context.font = 'italic 10pt Calibri';
    context.fillStyle = 'black';
    context.fillText(cnt.toString(), current.posI * boxSize, current.posJ * boxSize + boxSize / 2);
    context.fillText((cnt + 1).toString(), next.posI * boxSize, next.posJ * boxSize + boxSize / 2);

}

function refresh() {
    canvas.width = canvas.width;
    canvas.height = canvas.height;
    cnt = 0;
    init();
}
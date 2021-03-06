class Game {

    constructor(isWhiteFirst) {
        this.boardData = new BoardData(isWhiteFirst);
    }

    /** funcs that paint the board **/

    createTable(numOfRows, numOfColumns) {
        const body = document.body;
        const table = document.createElement('table');
        table.id = "chess_table";
    
        body.appendChild(table);
        for (let i = 0; i < numOfRows; i++) {
            const tr = table.insertRow(i);
    
            for (let j = 0; j < numOfColumns; j++) {
                const td = tr.insertCell(j);
                if(i == 0) { //(first row - a to h)
                    const positionElement = document.createElement('h6');
                    positionElement.innerText = String.fromCharCode(65 + j); //65 is A in ascii
                    positionElement.classList.add('positionElementLetter');
                    td.appendChild(positionElement);
                }
                if(j == 0) { //(first column - 1 to 8)
                    const positionElement = document.createElement('h6');
                    positionElement.innerText = i + 1;
                    positionElement.classList.add('positionElementNumber');
                    td.appendChild(positionElement);
                }
                td.onclick = (e) => {clickedTD(e, j, i)};
                if ((j + i) % 2 != 0) {
                    td.className = "darkSquare";
                } else {
                    td.className = "lightSquare";
                }
            }
        }

        //place pieces pictures on the table
        this.placePictures();
    }

    showMoves(x, y) {
        let posMoves = this.boardData.getMoves(x,y);
        const table = document.getElementById("chess_table");
        //paint possible moves on board
        const tds = document.getElementsByTagName("td");
        if(posMoves.length > 0) {
            //possible moves
            for (let i = 0; i < posMoves[0].length; i+=2) {
                table.rows[posMoves[0][i + 1]].cells[posMoves[0][i]].classList.add('moveSpot');
            }
            
            // eat moves
            for (let i = 0; i < posMoves[1].length; i+=2) {
                table.rows[posMoves[1][i + 1]].cells[posMoves[1][i]].classList.add('eatSpot');
            }
        }
    }

    repaintBoard() {
        const table = document.getElementById("chess_table");

        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                table.rows[y].cells[x].classList.remove('selected');
                table.rows[y].cells[x].classList.remove('moveSpot');
                table.rows[y].cells[x].classList.remove('eatSpot');
                table.rows[y].cells[x].style.backgroundImage = "";
            }
        }

        this.placePictures();

    }

    placePictures() {
        const table = document.getElementById("chess_table");
        this.boardData.pieces.forEach(piece => {
            table.rows[piece.y].cells[piece.x].style.backgroundImage = "url(assets/" + piece.getImg() + ".png)";
        });
    }

    finishFrame(currentTarget, paintSelected, x, y) {
        this.boardData.selected[0] = currentTarget;
        this.boardData.selected[1] = x;
        this.boardData.selected[2] = y;
    
        //repaint the whole board
        this.repaintBoard();
    
        if(paintSelected) {
            //color the current selected pixel
            currentTarget.classList.add('selected');
                
            //paint possible moves for selected piece
            this.showMoves(x, y);
        }
    
    }

    finishGame() {
        this.boardData.winner = true;
        const table = document.getElementById("chess_table");
        const winnerPopup = document.createElement('div');
        table.appendChild(winnerPopup);
        winnerPopup.classList.add("winnerPopup");
        if(!this.boardData.isWhiteTurn) { //opposite because the turn is switched after moving
            winnerPopup.innerText = "White is the winner!";
            winnerPopup.style.color = "white";
        } else {
            winnerPopup.innerText = "Black is the winner!";
            winnerPopup.style.color = "black";
        }
        
    }

}
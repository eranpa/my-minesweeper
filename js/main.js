'use strict'

var gBoard
var gLevel = { size: 4, mines: 2 }
var gGame

var FLAG = '🚩'
var MINE = '💣'
var EMPTY = ''

//TODO:  create initGame - called <body> onLoad]
function initGame() {
    console.log('hey')
    gBoard = buildBoard()
    console.table(gBoard)
    // printMat(gBoard, )
    renderBoard(gBoard)
}
// TODO: buildBoard  - builds the board model - set mines at random locations
// call setMinesNegsCount, return the created board

function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.size; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.size; j++) {

            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }

            board[i][j] = cell
        }
    }

    //locate mines randomly
    locateMines(board)


    //count mines around each cell and update minesAroundCount property for each cell 
    setMinesNegsCount(board)

    return board;
}




// TODO: setMinesNegsCount(board) - Count mines around each cell and set the cell's
//minesAroundCount.

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {

            for (var k = i - 1; k <= i + 1; k++) {
                if (k < 0 || k >= board.length) continue;
                for (var l = j - 1; l <= j + 1; l++) {
                    if (k === i && l === j) continue;
                    if (l < 0 || l >= board[k].length) continue;
                    if (board[k][l].isMine) board[i][j].minesAroundCount++
                }
            }
        }

    }
}

// TODO:  renderBoard(board) - Render the board as a <table> to the page

function renderBoard(board) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {




            var classId = 'cell-' + i + '-' + j;
            strHTML += `<td id= "classId" class="cell" onclick= "cellClicked(this, ${i}, ${j})" oncontextmenu = "cellMarked(this, ${i}, ${j})"> </td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector('.board-container');
    elContainer.innerHTML = strHTML;
}

// TODO: cellClicked(elCell, i, j) - Called when a cell (td) is clicked

function cellClicked(elCell, i, j) {

    console.log("clicked") //TODO: GET RID 
    if (gBoard[i][j].isMine) {
        gameLost()
        return
    } else if (gBoard[i][j].minesAroundCount === 0) {
        elCell.classList.add('revealed')
        expandShown(gBoard, elCell, i, j)
    } else {
        console.log('display') //TODO: GET RID 
        elCell.classList.add('revealed')
        var displayInCell = `${gBoard[i][j].minesAroundCount}`
        elCell.innerHTML = displayInCell
    }

    gBoard[i][j].isShown = true
}

// TODO: cellMarked(elCell) -Called on right click to mark a cell (suspected to be a mine)
//Search the web (and implement) how to hide the context menu on right click


function cellMarked(elCell, i, j) {
    console.log('right clicked') //TODO: GET RID 
    var cell = gBoard[i][j]
    cell.isMarked = cell.isMarked !== true
    var cellDisp = cell.isMarked ? FLAG : ' '
    elCell.innerHTML = cellDisp

}

//TODO checkGameOver() Game ends when all mines are marked and all other cells are shown
function checkGameOver() {

}

//TODO expandShown(board, elCell, i, j) when When user clicks a cell with no
//mines around, we need to open not only that cell, but also its neighbors 

function expandShown(board, elCell, i, j) {
    console.log('expand')
    for (var k = i - 1; k <= i + 1; k++) {
        if (k < 0 || k >= board.length) continue;
        for (var l = j - 1; l <= j + 1; l++) {
            if (k === i && l === j) continue;
            if (l < 0 || l >= board[k].length) continue;
            var elNeig = 
        }
    }
}

//TODO: game lost -  reveal the whole board, stop timer, disable game, change emoji
function gameLost() {
    console.log('game lost')
}

///////////setLevel/////////
// TODO: connect to html 
//called on onclick assigned to each option on the display 
function setLevel(userLevelChoice) {
    switch (userLevelChoice) {
        case 'Beginner':
            gLevel = {
                size: 4,
                mines: 2
            }
            break
        case 'Medium':
            gLevel = {
                size: 8,
                mines: 13
            }
            break
        case 'Expert':
            gLevel = {
                size: 12,
                mines: 30
            }
            break
    }
}


//////locateMines///////
//locate mines randomly

function locateMines(board) {
    for (var i = 0; i < gLevel.mines; i++) {
        var newMineLocation = getEmptyCell(board)
        board[newMineLocation.i][newMineLocation.j].isMine = true
    }
}
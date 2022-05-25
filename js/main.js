'use strict'

var gBoard
var gLevel = {size: 4, mines: 2}
var gGame

var FLAG = '🚩'
var MINE = '💣'
var EMPTY = ''

//TODO:  create initGame - called <body> onLoad]
function initGame() {
    console.log('hey')
    gBoard = buildBoard()
    console.table(gBoard)

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

    return board;
}




// TODO: setMinesNegsCount(board) - Count mines around each cell and set the cell's
//minesAroundCount.

function setMinesNegsCount(board) {

}

// TODO:  renderBoard(board) - Render the board as a <table> to the page

function renderBoard(board) {

}
// TODO: cellClicked(elCell, i, j) - Called when a cell (td) is clicked

function cellClicked(elCell, i, j) {

}

// TODO: cellMarked(elCell) -Called on right click to mark a cell (suspected to be a mine)
//Search the web (and implement) how to hide the context menu on right click


function cellMarked(elCell) {

}

//TODO checkGameOver() Game ends when all mines are marked and all other cells are shown
function checkGameOver() {

}

//TODO expandShown(board, elCell, i, j) when When user clicks a cell with no
//mines around, we need to open not only that cell, but also its neighbors 

function expandShown(board, elCell, i, j) {

}

///////////setLevel/////////
// TODO: connect to html 
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
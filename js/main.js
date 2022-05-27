'use strict'

var gBoard
var gLevel
var gGame

var FLAG = '🚩'
var MINE = '💣'
var EMPTY = ''
var CROSS = '❌'

var RESET = '🙂'
var NOGO = '😮'
var LOSE = '🤯'
var WIN = '😎'
var LIFE = '♡'

var gTimerId

var gIsTimerRunning
var gElEmoji
var gElLifeBar
var gElTimer
var gElSelectedLevel

gLevel = { size: 4, mines: 2 }

//create initGame - initialize a the board and set all the variables and objects to their initial value 
function initGame() {
    gIsTimerRunning = false
    gBoard = buildBoard()
    console.table(gBoard) //TODO - REMOVE AFTER DEBUG IS DONE
    gElEmoji = document.querySelector('.emoji')
    gElEmoji.innerText = RESET
    var elElapsedTIme = document.querySelector('.timer span')
    elElapsedTIme.innerHTML = `0`

    renderBoard(gBoard)
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: 3,
        hints: 3,
        safeClick: 3
    }
    gElTimer = document.querySelector('.timer')

    var elFlagCounter = document.querySelector('.flag-counter span')
    elFlagCounter.innerHTML = gGame.markedCount
    gElLifeBar = document.querySelector('.life-bar')
    gElLifeBar.innerText = LIFE + LIFE + LIFE


    for (var i = 0; i < gBoard.length; i++) { //TODO - REMOVE AFTER DEBUG IS DONE
        for (var j = 0; j < gBoard.length[0]; j++) {
            console.log('cell: ', gBoard[i][j])
        }
    }

}

// buildBoard - builds the board model - and set all cell values to default 
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

// setMinesNegsCount(board) - Count mines around each cell and set the cell's
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

//renderBoard(board) - Render the board as a <table> to the page

function renderBoard(board) {
    var strHTML = '<table border="0"><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            var classId = 'cell-' + i + '-' + j;
            strHTML += `<td id= "${classId}" class="cell" onclick= "cellClicked(this, ${i}, ${j})" oncontextmenu = "cellMarked(this, ${i}, ${j})"> </td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector('.board-container');
    elContainer.innerHTML = strHTML;
}

//cellClicked(elCell, i, j) - Called when a cell (td) is clicked and handles each click according to the 
//cell value

function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    if (gBoard[i][j].isMine && gBoard[i][j].isShown) return
    if (!gIsTimerRunning) firstMove(elCell, i, j)

    if (gBoard[i][j].isMarked) return

    if (gBoard[i][j].isMine) {
        gGame.lives--

        elCell.innerHTML = '💣'
        elCell.classList.add('exploded')
        gElLifeBar.innerText = ''
        for (var i = 0; i < gGame.lives; i++) {
            gElLifeBar.innerText += LIFE
        }
        if (!gGame.lives) {
            gameLost()
        } else {
            gBoard[i][j].isShown = true
            gGame.markedCount++
        }
    } else if (gBoard[i][j].minesAroundCount === 0) {
        expandShown(gBoard, elCell, i, j)
    } else {
        var displayInCell = `${gBoard[i][j].minesAroundCount}`
        elCell.innerHTML = displayInCell
        gBoard[i][j].isShown = true
        gGame.shownCount++
    }
    elCell.classList.add('revealed')
    checkGameOver()
}

//cellMarked(elCell) -Called on right click - toggles a flag and isMarked

function cellMarked(elCell, i, j) {
    if (!gGame.isOn) return
    var cell = gBoard[i][j]

    if (!gIsTimerRunning) firstMove(elCell, i, j)
    if (gGame.markedCount === gLevel.mines && !cell.isMarked) return
    if (cell.isShown) return

    cell.isMarked = cell.isMarked !== true
    var cellDisp = cell.isMarked ? FLAG : ' '
    elCell.innerHTML = cellDisp
    gGame.markedCount += (cell.isMarked) ? 1 : -1
    var elFlagCounter = document.querySelector('.flag-counter span')

    elFlagCounter.innerHTML = gGame.markedCount
}

//checkGameOver() Game ends when all mines are marked and all other cells are shown
function checkGameOver() {
    var maxShown = (Math.pow(gLevel.size, 2)) - gLevel.mines

    if (gGame.shownCount === maxShown && gGame.markedCount === gLevel.mines) {

        gGame.isOn = false
        gElEmoji.innerText = WIN
        clearInterval(gTimerId)
    }
}

//expandShown(board, elCell, i, j) when a cell that does not have any mined neighbors is revealed - reveal all it's
// neighbors- recourse
function expandShown(board, elCell, i, j) {
    gBoard[i][j].isShown = true
    gGame.shownCount++

    for (var k = i - 1; k <= i + 1; k++) {
        if (k < 0 || k >= board.length) continue;
        for (var l = j - 1; l <= j + 1; l++) {
            if (k === i && l === j) continue;
            if (l < 0 || l >= board[k].length) continue;
            var cell = gBoard[k][l]
            if (cell.isMarked) return
            var elNeig = document.querySelector('#cell-' + k + '-' + l)
            if (cell.minesAroundCount === 0 && !cell.isShown) expandShown(gBoard, elNeig, k, l)
            if (!cell.isShown) {
                gGame.shownCount++
            }
            cell.isShown = true
            elNeig.classList.add('revealed')

            elNeig.innerHTML = cell.minesAroundCount

        }
    }
}

//game lost -  reveal the whole board, stop timer, disable game, change emoji
function gameLost() {

    gGame.isOn = false
    clearInterval(gTimerId)

    gElEmoji.innerText = LOSE
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {

            var cell = gBoard[i][j]
            var elCell = document.querySelector('#cell-' + i + '-' + j)

            if (gBoard[i][j].isMine && gBoard[i][j].isMarked === true) {
                elCell.classList.add('revealed')
                elCell.innerHTML = CROSS + MINE
            } else if (gBoard[i][j].isMine) {
                elCell.innerHTML = MINE
                elCell.classList.add('revealed')
            }
        }
    }
}

///////////setLevel/////////

//called on onclick assigned to each option on the display 
function setLevel(elBtn, userLevelChoice) {
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
    elBtn.classList.add('selected-level')
    clearInterval(gTimerId)
    initGame()
}

// //////locateMines///////
// //locate mines randomly

// function locateMines(board) {
//     for (var i = 0; i < gLevel.mines; i++) {
//         var newMineLocation = getEmptyCell(board)
//         board[newMineLocation.i][newMineLocation.j].isMine = true
//     }
// }
function firstMove(elCell, i, j) {

    runTimer()
    gBoard[i][j].isShown = true
    // gGame.shownCount++
    locateMinesAfterClick(gBoard, i, j)
    setMinesNegsCount(gBoard)
    //expand after first move
    for (var k = i - 1; k <= i + 1; k++) {
        if (k < 0 || k >= gBoard.length) continue;
        for (var l = j - 1; l <= j + 1; l++) {
            if (k === i && l === j) continue;
            if (l < 0 || l >= gBoard[k].length) continue;
            var cell = gBoard[k][l]
            if (cell.isMarked) return
            var elNeig = document.querySelector('#cell-' + k + '-' + l)
            if (cell.minesAroundCount === 0 && !cell.isShown) expandShown(gBoard, elNeig, k, l)
            if (!cell.isShown) {
                gGame.shownCount++
            }
            if (!cell.isMine) {
                cell.isShown = true
                elNeig.classList.add('revealed')
                elNeig.innerHTML = cell.minesAroundCount
            }
        }
    }
}

//run timer
function runTimer() {

    gElTimer = document.querySelector('.timer')
    var startTime = new Date()
    gTimerId = setInterval(function () {
        var currentTime = new Date()
        var elapsedTime = (currentTime - startTime) / 1000
        gGame.secsPassed = Math.floor(elapsedTime)
        var elElapsedTIme = gElTimer.querySelector('span')
        elElapsedTIme.innerHTML = `${gGame.secsPassed}`
    }, 1000);
    gIsTimerRunning = true
}
//reset game 
function resetGame() {
    gLevel = { size: 4, mines: 2 }
    clearInterval(gTimerId)
    initGame()
}
//Locate mines after first click
function locateMinesAfterClick(board, cellI, cellJ) {
    {
        for (var i = 0; i < gLevel.mines; i++) {
            var newMineLocation = getEmptyCellExcludeNegs(board, cellI, cellJ)
            board[newMineLocation.i][newMineLocation.j].isMine = true
        }
    }
}
//get a random empty cell - exclude given cell and it's neighbors - used in locate mines after first click.  
function getEmptyCellExcludeNegs(board, cellI, cellJ) {
    var emptyCells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            if ((i === cellI - 1) && ((j === cellJ - 1) || ((j === cellJ) || (j === cellJ + 1)))) continue
            if ((i === cellI) && ((j === cellJ - 1) || ((j === cellJ) || (j === cellJ + 1)))) continue
            if ((i === cellI + 1) && ((j === cellJ - 1) || ((j === cellJ) || (j === cellJ + 1)))) continue
            if (!cell.isMine && !cell.isShown) {
                emptyCells.push({ i: i, j: j })
            }
        }
    }

    if (emptyCells.length === 0) return
    var randIdx = getRandomInt(0, emptyCells.length)
    return emptyCells[randIdx]
}


//show hint -  //TODO: add functionality to cellClicked, and a global boolean variable that toggles on
//clicking 
function showHint(elCell, cellI, cellJ) {

    for (i = cellI - 1; i <= cellI + 1; i++) {
        for (j = cellJ - 1; j <= cellJ + 1; j++) {
            var cell = gBoard[i][j]
            var currHtml = elCell.innerHTML
            var elCurrCell = document.querySelector('#cell-' + i + '-' + j)
            elCurrCell.classList.add('hint')
            if (cell.isMine) {
                elCell.innerHTML = '💣'
            } else if (cell.minesAroundCount > 0){
                var displayInCell = `${gBoard[i][j].minesAroundCount}`
                elCell.innerHTML = displayInCell
            }
        }
        setTimeout(function(){ 
            elCurrCell.classList.remove('hint')
            elCell.innerHTML = currHtml
        },1)
    }
}

// safe click - //TODO: set a global variable or a property inside of gGame to function as the model 
//for how many safe clicks are left. create a dive to replace the temporary button

function safeClick(){
   
    var safeCell = getEmptyCell(gBoard)
    var displayInCell = `${gBoard[safeCell.i][safeCell.j].minesAroundCount}`
    var elCell = document.querySelector('#cell-' + safeCell.i + '-' + safeCell.j)
    elCell.innerHTML = displayInCell
    gBoard[safeCell.i][safeCell.j].isShown = true
    gGame.shownCount++
    elCell.classList.add('revealed')
    checkGameOver()

}
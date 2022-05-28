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
var HINT = '💡'
var SAFETY = '⛑'

var gTimerId

var gIsTimerRunning
var gElEmoji
var gElLifeBar
var gElTimer
var gElSelectedLevel
var gIsHint
var gElHintCounter
var gElsafeClickCounter
var gElElapsedTIme
var gElFlagCounter
var gElContainer

// gLevel = { size: 4, mines: 2 }

//create initGame - initialize a the board and set all the variables and objects to their initial value 
function initGame(size = 4, mines = 2) {
    gLevel = {
        size: size,
        mines: mines
    }
    gBoard = buildBoard()
    createCssElements()
    renderBoard(gBoard)
    setGGameDefault()
    setCountersDefault()

    //console.table(gBoard) //TODO - REMOVE AFTER DEBUG IS DONE
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

    gElContainer.innerHTML = strHTML
}

//cellClicked(elCell, i, j) - Called when a cell (td) is clicked and handles each click according to the 
//cell value

function cellClicked(elCell, i, j) {
    if (!gGame.isOn) return
    if (gIsHint) {
        showHint(elCell, i, j)
        return
    }
    if (gBoard[i][j].isMine && gBoard[i][j].isShown) return
    if (gGame.firstMove) firstMove(elCell, i, j, true)

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
    } else if (gBoard[i][j].minesAroundCount === 0 && !gGame.firstMove) {
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

    if (gGame.firstMove) firstMove(elCell, i, j, false)
    if (gGame.markedCount === gLevel.mines && !cell.isMarked) return
    if (cell.isShown) return

    cell.isMarked = cell.isMarked !== true
    var cellDisp = cell.isMarked ? FLAG : ' '
    elCell.innerHTML = cellDisp
    gGame.markedCount += (cell.isMarked) ? 1 : -1
    gElFlagCounter.innerHTML = gGame.markedCount

    checkGameOver()
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
    
    if (!gBoard[i][j].isShown) {
    gBoard[i][j].isShown = true
    gGame.shownCount++
    }

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
                cell.isShown = true
            }
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
    gElLifeBar.innerText = LIFE
    gElLifeBar.style.textDecoration = 'line-through'

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {

            var cell = gBoard[i][j]
            var elCell = document.querySelector('#cell-' + i + '-' + j)

            if (gBoard[i][j].isMine && gBoard[i][j].isMarked === true) {
                elCell.classList.add('revealed')
                elCell.innerHTML = CROSS
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
    var level
    switch (userLevelChoice) {
        case 'Beginner':
            level = {
                size: 4,
                mines: 2
            }
            break
        case 'Medium':
            level = {
                size: 8,
                mines: 13
            }
            break
        case 'Expert':
            level = {
                size: 12,
                mines: 30
            }
            break
    }
    elBtn.classList.add('selected')
    clearInterval(gTimerId)
    initGame(level.size, level.mines)
}


function firstMove(elCell, i, j) {

    runTimer()
    locateMinesAfterClick(gBoard, i, j)
    setMinesNegsCount(gBoard)
    //expand after first move
    expandShown(gBoard, elCell, i,j)
    gGame.firstMove = false
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



function showHint(elCell, cellI, cellJ) {
    gElHintCounter.classList.remove('selected')
    gIsHint = false

    for (var i = cellI - 1; i <= cellI + 1; i++) {
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i < 0 || i > gBoard.length - 1) continue
            if (j < 0 || j > gBoard.length - 1) continue
            var cell = gBoard[i][j]
            if (cell.isShown) continue
            var elCurrCell = document.querySelector('#cell-' + i + '-' + j)

            elCurrCell.classList.add('hint')

            if (cell.isMine) {
                elCurrCell.innerHTML = '💣'
            } else {
                var displayInCell = `${gBoard[i][j].minesAroundCount}`
                elCurrCell.innerHTML = displayInCell
            }


        }

        setTimeout(function () {
            for (var i = cellI - 1; i <= cellI + 1; i++) {
                for (var j = cellJ - 1; j <= cellJ + 1; j++) {
                    if (i < 0 || i > gBoard.length - 1) continue
                    if (j < 0 || j > gBoard.length - 1) continue
                    var cell = gBoard[i][j]
                    if (cell.isShown) continue
                    var elCurrCell = document.querySelector('#cell-' + i + '-' + j)
                    elCurrCell.classList.remove('hint')
                    elCurrCell.innerHTML = cell.isMarked ? FLAG : ' '

                }
            }

        }, 1000)


    }
}

// safe click - //TODO: set a global variable or a property inside of gGame to function as the model 
//for how many safe clicks are left. create a dive to replace the temporary button

function safeClick() {

    if (!gGame.safeClick) return
    gGame.safeClick--
    gElsafeClickCounter.innerText = ' '
    for (var i = 0; i < gGame.safeClick; i++) {
        gElsafeClickCounter.innerText += SAFETY
    }
    if (gGame.safeClick === 0) {
        gElsafeClickCounter.innerText = SAFETY
        gElsafeClickCounter.style.textDecoration = 'line-through'
    }

    var safeCell = getEmptyCell(gBoard)
    var displayInCell = `${gBoard[safeCell.i][safeCell.j].minesAroundCount}`
    var elCell = document.querySelector('#cell-' + safeCell.i + '-' + safeCell.j)
    elCell.innerHTML = displayInCell
    gBoard[safeCell.i][safeCell.j].isShown = true
    gGame.shownCount++
    elCell.classList.add('revealed')
    checkGameOver()

}

function hintClicked() {
    if (!gGame.hintCounter || !gGame.isOn) return
    gGame.hintCounter--
    gIsHint = true
    if (!gGame.hintCounter) {
        gElHintCounter.style.textDecoration = 'line-through'
    } else {
        gElHintCounter.innerText = ''
        for (var i = 0; i < gGame.hintCounter; i++) {
            gElHintCounter.innerText += HINT
        }
    }
    gElHintCounter.classList.add('selected')

}

function createCssElements() {
    gElElapsedTIme = document.querySelector('.timer span')
    gElEmoji = document.querySelector('.emoji')
    gElTimer = document.querySelector('.timer')
    gElFlagCounter = document.querySelector('.flag-counter span')
    gElLifeBar = document.querySelector('.life-bar')
    gElLifeBar.style.textDecoration = 'none'
    gElHintCounter = document.querySelector('.hint-counter')
    gElsafeClickCounter = document.querySelector('.safe-click-counter')
    gElContainer = document.querySelector('.board-container')
}

function setGGameDefault() {
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: 3,
        hints: 3,
        safeClick: 3,
        hintCounter: 3,
        firstMove: true

    }

}

function setCountersDefault() {
    gIsHint = false
    gIsTimerRunning = false

    gElElapsedTIme.innerHTML = `0`
    gElEmoji.innerText = RESET
    gElFlagCounter.innerHTML = gGame.markedCount
    gElLifeBar.innerText = LIFE + LIFE + LIFE
    gElHintCounter.innerText = HINT + HINT + HINT
    gElsafeClickCounter.innerText = SAFETY + SAFETY + SAFETY
    gElHintCounter.style.textDecoration = 'none'
    gElsafeClickCounter.style.textDecoration = 'none'

}
function getEmptyCell(board) {
    var emptyCells = []
    for (var i = 0; i < board.length; i++) {
      for (var j = 0; j < board[0].length; j++) {
        var cell = board[i][j]
        if (!cell.isMine && !cell.isShown) {
          emptyCells.push({ i: i, j: j })
        }
      }
    }
    if (emptyCells.length === 0) return
    var randIdx = getRandomInt(0, emptyCells.length)
    return emptyCells[randIdx]
  }
  
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }


  function printGBoard() {
    for (var i = 0; i < gBoard.length; i++) { 
      for (var j = 0; j < gBoard.length[0]; j++) {
          console.log('cell: ', gBoard[i][j])
      }
  }
  }



  // function forEachNegExclodeCell(i, j, func) { 
  //   for (var k = i - 1; k <= i + 1; k++) {
  //     if (k < 0 || k >= board.length) continue;
  //     for (var l = j - 1; l <= j + 1; l++) {
  //         if (k === i && l === j) continue;
  //         if (l < 0 || l >= board[k].length) continue;
  //         func(k,l) 
  // }
  



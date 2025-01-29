'use strict'

const EMPTY = ''
const MINE = '💣'
const FLAG = '🚩'

const elCell = document.querySelector('.td')


const gLevel = {
    size: 4,
    mines: 2
}
var gBoard = []

// {
//     minesAroundCount: 0,
//     isCovered: true,
//     isMine: false,
//     isMarked: false}


const gGame = {
    isOn: false,
    coveredCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function onInit(){
    
    gBoard = buildBoard()
    renderBoard(gBoard)

    gGame.isOn = true
}


function buildBoard() {
    const size = gLevel.size
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([]);
        for (var j = 0; j < size; j++) {
            board[i][j] = EMPTY; 
        }
    }

    var mine = gLevel.mines
    while (mine > 0) {
        const randomRow = Math.floor(Math.random() * size)
        const randomCol = Math.floor(Math.random() * size)

        if (board[randomRow][randomCol] !== MINE) {
            board[randomRow][randomCol] = MINE
            mine--
        }
    }

    console.table('board:', board);
    return board;
}




function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
      strHTML += '<tr>'
  
      for (var j = 0; j < board[0].length; j++) {
        var cell = board[i][j]
        var isMine = cell === MINE
        var className = isMine ? 'mine cell' : 'neg-count cell'
        var minesAroundCount = countNeighbors(i, j, board)
        var isCovered = true
        var isMarked = false

        if (minesAroundCount === '') {
            className = 'empty cell'
        }
        if (className === 'neg-count cell') {
            board[i][j] = `${minesAroundCount}`
        }

        strHTML += `<td 
            data-i="${i}" 
            data-j="${j}" 
            data-is-covered="${isCovered}" 
            data-is-marked="${isMarked}" 
            data-is-mine="${isMine}" 
            class="${className}">
            ${isMine ? '' : minesAroundCount} 
        </td>`;
      }
  
      strHTML += '</tr>'
    }
  
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
  }
  
  

  
  function countNeighbors(cellI, cellJ, mat) {
    var neighborsCount = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
      if (i < 0 || i >= mat.length) continue;
      for (var j = cellJ - 1; j <= cellJ + 1; j++) {
        if (i === cellI && j === cellJ) continue; // Skip the current cell itself
        if (j < 0 || j >= mat[i].length) continue;
        if (mat[i][j] === MINE) neighborsCount++;
    }
}
if (neighborsCount === 0) return ''
    return neighborsCount;
  }

function gameOver() {
    
    gGame.isOn = false
}

function restart(){
    gLevel.mines = 2
    onInit(gBoard)

}

function onCellClicked(){

}



  

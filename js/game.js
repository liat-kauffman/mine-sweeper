
'use strict'

const EMPTY = ''
const MINE = '💣'
const FLAG = '🚩'

const gLevel = {
    size: 4,
    mines: 2
}
var gBoard = []

const gGame = {
    isOn: false,
    markedCount: 0, 
    secsPassed: 0,
}

function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard)
    gGame.isOn = true
    gGame.markedCount = 0
}

function buildBoard() {
    const size = gLevel.size
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isCovered: true,
                isMine: false,
                isMarked: false
            }
        }
    }

    placeMines(board) 

    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (!board[i][j].isMine) {
                board[i][j].minesAroundCount = countNeighbors(i, j, board)
            }
        }
    }
    console.table(board);
    return board
}

function placeMines(board) {
    const size = gLevel.size;
    let minesPlaced = 0;
    while (minesPlaced < gLevel.mines) {
        const randomRow = Math.floor(Math.random() * size)
        const randomCol = Math.floor(Math.random() * size)

        if (!board[randomRow][randomCol].isMine) {
            board[randomRow][randomCol].isMine = true
            minesPlaced++
        }
    }
}

function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < board[0].length; j++) {
            const cell = board[i][j]
            let className = 'cell covered'

            if (cell.isMine) {
                className += ' mine' 
            } else if (cell.minesAroundCount === 0) {
                className += ' empty'
            } else {
                className += ' neg-count'
            }

            strHTML += `<td 
                id="cell-${i}-${j}" 
                data-i="${i}"
                data-j="${j}"
                onclick="onCellClicked(this)"
                class="${className}">
                ${cell.isMine ? MINE : (cell.minesAroundCount === 0 ? '' : cell.minesAroundCount)} 
                </td>`
        }

        strHTML += '</tr>'
    }

    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}


function countNeighbors(cellI, cellJ, mat) {
    var neighborsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue 
            if (j < 0 || j >= mat[i].length) continue
            if (mat[i][j].isMine) neighborsCount++
        }
    }
    return neighborsCount
}

function onCellClicked(elCell) {
    const i = +elCell.dataset.i
    const j = +elCell.dataset.j
    const cell = gBoard[i][j]

    if (!gGame.isOn || !cell.isCovered) return
    if (cell.isMarked) return

    cell.isCovered = false
    elCell.classList.remove('covered')
    elCell.classList.add('revealed')

    if (cell.isMine) {
        gameOver()
        revealAllMines()
        gGame.isWin = false
    } else if (cell.minesAroundCount === 0) {
        revealNeighbors(i, j)
    }
    checkWin()

}


function revealNeighbors(row, col) {
    for (var i = row - 1; i <= row + 1; i++) {
        for (var j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < gLevel.size && j >= 0 && j < gLevel.size && gBoard[i][j].isCovered && !gBoard[i][j].isMarked) {
                const elNeighborCell = document.getElementById(`cell-${i}-${j}`)
                onCellClicked(elNeighborCell)
            }
        }
    }
}

function revealAllMines() {
    for (let i = 0; i < gLevel.size; i++) {
        for (let j = 0; j < gLevel.size; j++) {
            if (gBoard[i][j].isMine) {
                const elCell = document.getElementById(`cell-${i}-${j}`)
                elCell.classList.remove('covered')
                elCell.classList.add('revealed')
            }
        }
    }
}


function checkWin() { 
    var allRevealed = true
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            if (!gBoard[i][j].isMine && gBoard[i][j].isCovered) {
                allRevealed = false;
                break
            }
        }
        if (!allRevealed) break
        
        

        if(gGame.countCovered === gLevel.mines) return allRevealed
        
       

    }
    return allRevealed
}

function countCovered() { 

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isCovered) {
                gGame.countCovered++
            }
        }
    }
}



function gameOver() {
    gGame.isOn = false
    smileyBtn()
}

function restart() {
    gLevel.mines = 2
    revealAllMines()
    smileyBtn()
    resetSmilyBtn()
    onInit()

}

function resetSmilyBtn(){
    var elSmilyBtn = document.querySelector('.restart-btn span')
    elSmilyBtn.innerText = '🙂'

}

function smileyBtn() {
    var elSmilyBtn = document.querySelector('.restart-btn span')

    if (!gGame.isOn) { 
        if (checkWin()) { 
          elSmilyBtn.innerText = '😆'
        } else {
          elSmilyBtn.innerText = '😭'
        }
    } else {
        elSmilyBtn.innerText = '🙂'
    }
    
}

// liat kauffman

'use strict'

const EMPTY = ''
const MINE = '💣'
const FLAG = '🚩'


const gLevel = {
    size: 4,
    mines: 2
}
const gBoard = {
    minesAroundCount: 0,
    isCovered: true,
    isMine: false,
    isMarked: false}


const gGame = {
    isOn: false,
    coveredCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function onInit(){
    
    renderBoard(buildBoard(gBoard))

    gGame.isOn = true
}


function buildBoard(board){
    const size = gLevel.size
    var board = []

    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++){

                if (gLevel.mines !== 0){
                    board[i][j] = MINE
                    gLevel.mines--
                } else {
                    board[i][j] = ''
                }

               
            }
        }
        
    console.table('board:', board)
    // setMinesNegCount(board)
    return board
}


function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'

        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j]
            if (cell === MINE){
                gBoard.isMine = true
            } else {
                gBoard.isMine = false
            }
            var className = gBoard.isMine ? 'mine hidden' : 'hidden'
            strHTML += `<td data-i="${i}" data-j="${j}" class="${className}">${cell}</td>`
        }

        strHTML += '</tr>'
    }   
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function gameOver() {
    
    gGame.isOn = false
}

function restart(){
    gLevel.mines = 2
    onInit()

}

function onCellClicked(){

}
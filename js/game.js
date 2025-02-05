
'use strict'

const EMPTY = ''
const MINE = '💣'
const FLAG = '🚩'

var gTimerInterval;


const gLevel = {
    size: 6,
    mines: 5,
    class: ''
}
var gBoard = []

const gGame = {
    countCovered: 0,
    isOn: false,
    markedLeft: 0, 
    secsPassed: 0,
    lives: 3
}


function onInit() {
    gBoard = buildBoard()
    renderBoard(gBoard)
    gGame.isOn = true
    gGame.countCovered = countCovered()
    gGame.markedLeft = gLevel.mines
    gGame.lives = 3
    updateLives()
    updateMarksLeft()
    displayHighScore()
    updateLevel()
}

function restart() {
    clearInterval(gTimerInterval)
    gTimerInterval = null
    gGame.secsPassed = 0
    gGame.lives = 3
    gGame.markedLeft = gLevel.mines

    document.querySelector('.timer').innerHTML = "00:00"
    gGame.isOn = true

    gBoard = buildBoard()
    renderBoard(gBoard)
    resetMsg()
    resetSmilyBtn()
    updateLives()
    updateMarksLeft()
    displayHighScore()
    
}


function updateLevel(elBtn){

    if (elBtn === 1){
        updateLevelbeginner()
        
        
    } 
    else if (elBtn === 2){
        updateLeveInter()
        
    }
    else if (elBtn=== 3){
        updateLevelExpert()
        
    }
    restart()
}

function updateLevelbeginner(){
    gLevel.size = 6
    gLevel.mines = 5

}

function updateLeveInter(){
    gLevel.size = 10
    gLevel.mines = 20

}

function updateLevelExpert(){
    gLevel.size = 15
    gLevel.mines = 40
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
    const size = gLevel.size
    var minesPlaced = 0
    while (minesPlaced < gLevel.mines) {
        const randomRow = Math.floor(Math.random() * size)
        const randomCol = Math.floor(Math.random() * size)
         
        var currCell = board[randomRow][randomCol]
        
        if (!currCell.isMine) {
            currCell.isMine = true
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
            var className = 'cell covered'

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
                oncontextmenu="onCellMarked(event, this)" 
                class="${className}">
                ${cell.isMine ? MINE :(cell.isMarked ? FLAG : (cell.minesAroundCount === 0 ? '' : cell.minesAroundCount))}
                 
                </td>`
        }

        strHTML += '</tr>'
    }

    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}


function onCellClicked(elCell) {

    if (!gGame.isOn) return

    if (gGame.secsPassed === 0) {
        startTimer()
    }

    const i = +elCell.dataset.i
    const j = +elCell.dataset.j
    const cell = gBoard[i][j]

    if (!cell || cell.isMarked || !cell.isCovered) return
    
    cell.isCovered = false
    elCell.classList.remove('covered')
    elCell.classList.add('revealed')

    if (cell.isMine) {
        elCell.textContent = MINE
        gGame.lives--
        updateLives()

        if (gGame.lives === 0) {
            revealAllMines()
            gameOver(false)
        } else {
            setTimeout(() => {
                cell.isCovered = true
                elCell.classList.add('covered')
                elCell.classList.remove('revealed')
                elCell.textContent = MINE
            }, 1000)
        }

    } else if (cell.minesAroundCount === 0) {
        revealNeighbors(i, j)
    }

    checkWin()
}

function onCellMarked(event, elCell) {
    event.preventDefault()

    if (!gGame.isOn) return
    

    const i = +elCell.dataset.i
    const j = +elCell.dataset.j
    const cell = gBoard[i][j]

    if (!cell.isCovered) return

    if (cell.isMarked) {

        cell.isMarked = false
        elCell.textContent = cell.minesAroundCount === 0 ? '' : cell.minesAroundCount
        gGame.markedLeft++
        elCell.classList.remove('marked')

    } else if (gGame.markedLeft > 0) {
        
        cell.isMarked = true
        elCell.textContent = FLAG
        gGame.markedLeft--
        elCell.classList.add('marked')
    }


    updateMarksLeft()
    checkWin()
}


function updateMarksLeft(){
    const elMarksCount = document.querySelector('.marks-count')
    elMarksCount.innerText =`marks: ${gGame.markedLeft}`
}

function updateLives(){
    const elLives =document.querySelector('.lives')
    elLives.innerText =`${'❤️ '.repeat(gGame.lives)}`
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
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            if (gBoard[i][j].isMine) {
                const elCell = document.getElementById(`cell-${i}-${j}`)
                elCell.classList.remove('covered')
                elCell.classList.add('revealed')
                elCell.style.color = 'black'
                elCell.style.backgroundColor = 'red'
                elCell.innerText = MINE
            }
        }
    }
}



function checkWin() {
    var allNonMinesRevealed = true
    var allMinesMarked = true

    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            const cell = gBoard[i][j]

            if (!cell.isMine && cell.isCovered) {
                allNonMinesRevealed = false
            }

            if (cell.isMine && !cell.isMarked) {
                allMinesMarked = false
            }
        }
    }

    if (allNonMinesRevealed || allMinesMarked) {
        gameOver(true)
        revealAllMines()
        return true
    }

    return false;
}

function gameOver(isWin) {
    gGame.isOn = false

    const elMsg = document.querySelector('.msg')

    if (isWin) {
        elMsg.innerText = '🎉 You won!'
        checkAndSaveHighScore()
    } else {
        revealAllMines()
        elMsg.innerText = '💥 Game over!'
    }

    updateSmiley(isWin)
}


function updateSmiley(isWin) {
    var elSmileyBtn = document.querySelector('.restart-btn span')
    elSmileyBtn.innerText = isWin ? '😎' : '😢'
    
}

function resetSmilyBtn(){
    var elSmilyBtn = document.querySelector('.restart-btn span')
    elSmilyBtn.innerText = '🙂'

}

function resetMsg(){
    const elMsg = document.querySelector('.msg')
    elMsg.innerText = ''
}



function startTimer() {
    if (gTimerInterval) return
    gGame.isOn = true
    var startTime = Date.now() - gGame.secsPassed * 1000

    gTimerInterval = setInterval(() => {
        if (!gGame.isOn) {
            clearInterval(gTimerInterval)
            gTimerInterval = null
            return
        }

        var elapsedTime = Date.now() - startTime
        gGame.secsPassed = Math.floor(elapsedTime / 1000) 

        var minutes = Math.floor(elapsedTime / 60000)
        var seconds = Math.floor((elapsedTime % 60000) / 1000)
        var milliseconds = Math.floor((elapsedTime % 1000) / 10) 

        document.querySelector('.timer').innerText =
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`
    }, 10) 
}

function resetTimer() {
    clearInterval(gTimerInterval)
    document.querySelector('.timer').innerHTML = "00:00"
}


function getLevelKey() {
    if (gLevel.size === 6 && gLevel.mines === 5) return "highScore-beginner"
    if (gLevel.size === 10 && gLevel.mines === 20) return "highScore-intermediate"
    if (gLevel.size === 15 && gLevel.mines === 40) return "highScore-expert"
}


function checkAndSaveHighScore(){
    const levelKey = getLevelKey()
    var bestTime = localStorage.getItem(levelKey)
    var currTime = gGame.secsPassed * 1000

    if (!bestTime || currTime < bestTime){
        localStorage.setItem(levelKey, currTime)
        displayHighScore()
    }
}

function displayHighScore(){
    const levelKey = getLevelKey()

    var bestTime = localStorage.getItem(levelKey)

    if (!bestTime) {
        bestTime = '0'
    } else {
        var minutes = Math.floor(bestTime / 60000)
        var seconds = Math.floor((bestTime % 60000) / 1000)
        var milliseconds = Math.floor((bestTime % 1000) / 10)
        bestTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`
    }

    document.querySelector('.high-score').innerText = `Best Score: ${bestTime}`;
}

function clearHighScore(){
    const levelKey = getLevelKey()
    localStorage.removeItem(levelKey)
    displayHighScore()
}

function countCovered() { 
    var count = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j].isCovered) {
                count++
                console.log(count)
            }
            
        }
    }
    return count
}


// liat kauffman

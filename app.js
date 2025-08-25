const gameBoard = document.querySelector("#gameboard") // # for an ID
const playerDisplayer = document.querySelector("#player")
const infoDisplay = document.querySelector("#info-display")
const width = 8
let playerGo = 'white'
playerDisplayer.textContent = 'white'

const startPieces = [ // Set the starting location for each piece
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook
]

function createBoard() { // Creates the chess board, alternating each square's color
    startPieces.forEach((startPiece, i) => {
        const square = document.createElement('div')
        square.classList.add('square')
        square.innerHTML = startPiece
        square.firstChild?.setAttribute('draggable', true)
        square.setAttribute('square-id', i)
        const row = Math.floor((63-i) / 8) + 1
        if (row % 2 == 0) {
            square.classList.add(i % 2 === 0 ? "beige" : "brown") // === for type coercion 
        } else {
            square.classList.add(i % 2 === 0 ? "brown" : "beige")
        }

        if ( i <= 15) { // Should make a global
            square.firstChild.firstChild.classList.add('black')
        }

        if (i >= 48) { // Should make a global
            square.firstChild.firstChild.classList.add('white')
        }
        gameBoard.append(square)
        reverseIds()
    })
}
createBoard() // Calls function

const allSquares = document.querySelectorAll(".square")
allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart)
    square.addEventListener('dragover', dragOver)
    square.addEventListener('drop', dragDrop)
})

let startPositionId // Initialize
let draggedElement

function dragStart(e) {
    startPositionId = e.target.parentNode.getAttribute('square-id')
    draggedElement = e.target
}

function dragOver(e) {
    e.preventDefault()
}

function dragDrop(e) {
    e.stopPropagation()
    const correctGo = draggedElement.firstChild.classList.contains(playerGo) // If dragged element is playerGo, correctGo = true
    const taken = e.target.classList.contains('piece') // If target contains a piece, taken = true
    const valid = checkIfValid(e.target)
    const opponentGo = playerGo === 'white' ? 'black' : 'white' // Change who the opponent is based on playerGo
    const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo) // True if target piece is owned by

    if (correctGo) { // adjust returns
        if (takenByOpponent && valid) {
            e.target.parentNode.append(draggedElement)
            e.target.remove()
            checkForWin()
            changePlayer()
            return
        } else if (taken && !takenByOpponent) {
            infoDisplay.textContent = "Invalid Move"
            setTimeout(() => infoDisplay.textContent = "", 2000)
            return
        } else if (valid) {
            e.target.append(draggedElement)
            checkForWin()
            changePlayer()
            return
        }  else{
            infoDisplay.textContent = "Invalid Move"
            setTimeout(() => infoDisplay.textContent = "", 2000)
            return
        }
    } else {
        infoDisplay.textContent = "Wrong Turn"
        setTimeout(() => infoDisplay.textContent = "", 2000)
        return
    }
}

function checkIfValid(target) {
    const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'))
    const startId = Number(startPositionId)
    const piece = draggedElement.id
    console.log('targetId', targetId)
    console.log('startId', startId)
    console.log('piece', piece)

    switch(piece) {
        case 'pawn' :
            const starterRow = [8,9,10,11,12,13,14,15]
            if (starterRow.includes(startId) && startId + width * 2 === targetId ||
                startId + width === targetId ||
                startId + width - 1 === targetId && document.querySelector(`[square-id = "${startId + width - 1}"]`).firstChild || // diagonal moves if opponent piece is present 
                startId + width + 1 === targetId && document.querySelector(`[square-id = "${startId + width + 1}"]`).firstChild ) // Note ` vs ' to allow variable interpolation using ${}
                { 
                    return true
            } 
            break;
        case 'knight' :
            if (startId + width * 2 - 1 === targetId ||
                startId + width * 2 + 1 === targetId ||
                startId + width - 2 === targetId||
                startId + width + 2 === targetId||
                startId - width * 2 - 1 === targetId ||
                startId - width * 2 + 1 === targetId ||
                startId - width - 2 === targetId||
                startId - width + 2 === targetId) 
                {
                    return true
            }
            break;
        case 'bishop' :
            if (
                startId + width + 1 === targetId ||
                startId + width * 2 + 2 === targetId && !document.querySelector(`[square-id = "${startId + width + 1 }"]`)?.firstChild ||
                startId + width * 3 + 3 === targetId && !document.querySelector(`[square-id = "${startId + width + 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 2 + 2 }"]`)?.firstChild ||
                startId + width * 4 + 4 === targetId && !document.querySelector(`[square-id = "${startId + width + 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 2 + 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 3 + 3 }"]`)?.firstChild ||
                startId + width * 5 + 5 === targetId && !document.querySelector(`[square-id = "${startId + width + 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 2 + 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 3 + 3 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 4 + 4 }"]`)?.firstChild ||
                startId + width * 6 + 6 === targetId && !document.querySelector(`[square-id = "${startId + width + 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 2 + 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 3 + 3 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 4 + 4 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 5 + 5 }"]`)?.firstChild ||
                startId + width * 7 + 7 === targetId && !document.querySelector(`[square-id = "${startId + width + 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 2 + 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 3 + 3 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 4 + 4 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 5 + 5 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 6 + 6 }"]`)?.firstChild ||
                startId + width - 1 === targetId ||
                startId + width * 2 - 2 === targetId && !document.querySelector(`[square-id = "${startId + width - 1 }"]`)?.firstChild ||
                startId + width * 3 - 3 === targetId && !document.querySelector(`[square-id = "${startId + width - 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 2 - 2 }"]`)?.firstChild ||
                startId + width * 4 - 4 === targetId && !document.querySelector(`[square-id = "${startId + width - 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 2 - 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 3 - 3 }"]`)?.firstChild ||
                startId + width * 5 - 5 === targetId && !document.querySelector(`[square-id = "${startId + width - 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 2 - 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 3 - 3 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 4 - 4 }"]`)?.firstChild ||
                startId + width * 6 - 6 === targetId && !document.querySelector(`[square-id = "${startId + width - 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 2 - 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 3 - 3 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 4 - 4 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 5 - 5 }"]`)?.firstChild ||
                startId + width * 7 - 7 === targetId && !document.querySelector(`[square-id = "${startId + width - 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 2 - 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 3 - 3 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 4 - 4 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 5 - 5 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 6 - 6 }"]`)?.firstChild ||
                startId - width + 1 === targetId ||
                startId - width * 2 + 2 === targetId && !document.querySelector(`[square-id = "${startId - width + 1 }"]`)?.firstChild ||
                startId - width * 3 + 3 === targetId && !document.querySelector(`[square-id = "${startId - width + 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 2 + 2 }"]`)?.firstChild ||
                startId - width * 4 + 4 === targetId && !document.querySelector(`[square-id = "${startId - width + 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 2 + 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 3 + 3 }"]`)?.firstChild ||
                startId - width * 5 + 5 === targetId && !document.querySelector(`[square-id = "${startId - width + 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 2 + 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 3 + 3 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 4 + 4 }"]`)?.firstChild ||
                startId - width * 6 + 6 === targetId && !document.querySelector(`[square-id = "${startId - width + 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 2 + 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 3 + 3 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 4 + 4 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 5 + 5 }"]`)?.firstChild ||
                startId - width * 7 + 7 === targetId && !document.querySelector(`[square-id = "${startId - width + 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 2 + 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 3 + 3 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 4 + 4 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 5 + 5 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 6 + 6 }"]`)?.firstChild ||
                startId - width - 1 === targetId ||
                startId - width * 2 - 2 === targetId && !document.querySelector(`[square-id = "${startId - width - 1 }"]`)?.firstChild ||
                startId - width * 3 - 3 === targetId && !document.querySelector(`[square-id = "${startId - width - 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 2 - 2 }"]`)?.firstChild ||
                startId - width * 4 - 4 === targetId && !document.querySelector(`[square-id = "${startId - width - 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 2 - 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3 }"]`)?.firstChild ||
                startId - width * 5 - 5 === targetId && !document.querySelector(`[square-id = "${startId - width - 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 2 - 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 4 - 4 }"]`)?.firstChild ||
                startId - width * 6 - 6 === targetId && !document.querySelector(`[square-id = "${startId - width - 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 2 - 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 4 - 4 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 5 - 5 }"]`)?.firstChild ||
                startId - width * 7 - 7 === targetId && !document.querySelector(`[square-id = "${startId - width - 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 2 - 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 4 - 4 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 5 - 5 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 6 - 6 }"]`)?.firstChild)
            {
                return true
            }
            break;
        case 'rook' :
            if (
                startId + width === targetId ||
                startId + width * 2 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`)?.firstChild ||
                startId + width * 3 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 2}"]`)?.firstChild ||
                startId + width * 4 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 3}"]`)?.firstChild ||
                startId + width * 5 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 3}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 4}"]`)?.firstChild ||
                startId + width * 6 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 3}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 4}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 5}"]`)?.firstChild ||
                startId + width * 7 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 3}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 4}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 5}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 6}"]`)?.firstChild ||
                startId - width === targetId ||
                startId - width * 2 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`)?.firstChild ||
                startId - width * 3 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 2}"]`)?.firstChild ||
                startId - width * 4 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 3}"]`)?.firstChild ||
                startId - width * 5 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 3}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 4}"]`)?.firstChild ||
                startId - width * 6 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 3}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 4}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 5}"]`)?.firstChild ||
                startId - width * 7 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 3}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 4}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 5}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 6}"]`)?.firstChild ||
                startId + 1 === targetId ||
                startId + 2 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`)?.firstChild ||
                startId + 3 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + 2}"]`)?.firstChild ||
                startId + 4 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + 3}"]`)?.firstChild ||
                startId + 5 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + 3}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + 4}"]`)?.firstChild ||
                startId + 6 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + 3}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + 4}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + 5}"]`)?.firstChild ||
                startId + 7 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + 3}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + 4}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + 5}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + 6}"]`)?.firstChild ||
                startId - 1 === targetId ||
                startId - 2 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`)?.firstChild ||
                startId - 3 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - 2}"]`)?.firstChild ||
                startId - 4 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - 3}"]`)?.firstChild ||
                startId - 5 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - 3}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - 4}"]`)?.firstChild ||
                startId - 6 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - 3}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - 4}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - 5}"]`)?.firstChild ||
                startId - 7 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - 3}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - 4}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - 5}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - 6}"]`)?.firstChild)
            {
                return true
            }
            break;
        case 'queen' :
            if (
                startId + width + 1 === targetId ||
                startId + width * 2 + 2 === targetId && !document.querySelector(`[square-id = "${startId + width + 1 }"]`)?.firstChild ||
                startId + width * 3 + 3 === targetId && !document.querySelector(`[square-id = "${startId + width + 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 2 + 2 }"]`)?.firstChild ||
                startId + width * 4 + 4 === targetId && !document.querySelector(`[square-id = "${startId + width + 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 2 + 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 3 + 3 }"]`)?.firstChild ||
                startId + width * 5 + 5 === targetId && !document.querySelector(`[square-id = "${startId + width + 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 2 + 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 3 + 3 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 4 + 4 }"]`)?.firstChild ||
                startId + width * 6 + 6 === targetId && !document.querySelector(`[square-id = "${startId + width + 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 2 + 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 3 + 3 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 4 + 4 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 5 + 5 }"]`)?.firstChild ||
                startId + width * 7 + 7 === targetId && !document.querySelector(`[square-id = "${startId + width + 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 2 + 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 3 + 3 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 4 + 4 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 5 + 5 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 6 + 6 }"]`)?.firstChild ||
                startId + width - 1 === targetId ||
                startId + width * 2 - 2 === targetId && !document.querySelector(`[square-id = "${startId + width - 1 }"]`)?.firstChild ||
                startId + width * 3 - 3 === targetId && !document.querySelector(`[square-id = "${startId + width - 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 2 - 2 }"]`)?.firstChild ||
                startId + width * 4 - 4 === targetId && !document.querySelector(`[square-id = "${startId + width - 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 2 - 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 3 - 3 }"]`)?.firstChild ||
                startId + width * 5 - 5 === targetId && !document.querySelector(`[square-id = "${startId + width - 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 2 - 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 3 - 3 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 4 - 4 }"]`)?.firstChild ||
                startId + width * 6 - 6 === targetId && !document.querySelector(`[square-id = "${startId + width - 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 2 - 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 3 - 3 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 4 - 4 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 5 - 5 }"]`)?.firstChild ||
                startId + width * 7 - 7 === targetId && !document.querySelector(`[square-id = "${startId + width - 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 2 - 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 3 - 3 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 4 - 4 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 5 - 5 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 6 - 6 }"]`)?.firstChild ||
                startId - width + 1 === targetId ||
                startId - width * 2 + 2 === targetId && !document.querySelector(`[square-id = "${startId - width + 1 }"]`)?.firstChild ||
                startId - width * 3 + 3 === targetId && !document.querySelector(`[square-id = "${startId - width + 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 2 + 2 }"]`)?.firstChild ||
                startId - width * 4 + 4 === targetId && !document.querySelector(`[square-id = "${startId - width + 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 2 + 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 3 + 3 }"]`)?.firstChild ||
                startId - width * 5 + 5 === targetId && !document.querySelector(`[square-id = "${startId - width + 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 2 + 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 3 + 3 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 4 + 4 }"]`)?.firstChild ||
                startId - width * 6 + 6 === targetId && !document.querySelector(`[square-id = "${startId - width + 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 2 + 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 3 + 3 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 4 + 4 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 5 + 5 }"]`)?.firstChild ||
                startId - width * 7 + 7 === targetId && !document.querySelector(`[square-id = "${startId - width + 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 2 + 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 3 + 3 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 4 + 4 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 5 + 5 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 6 + 6 }"]`)?.firstChild ||
                startId - width - 1 === targetId ||
                startId - width * 2 - 2 === targetId && !document.querySelector(`[square-id = "${startId - width - 1 }"]`)?.firstChild ||
                startId - width * 3 - 3 === targetId && !document.querySelector(`[square-id = "${startId - width - 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 2 - 2 }"]`)?.firstChild ||
                startId - width * 4 - 4 === targetId && !document.querySelector(`[square-id = "${startId - width - 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 2 - 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3 }"]`)?.firstChild ||
                startId - width * 5 - 5 === targetId && !document.querySelector(`[square-id = "${startId - width - 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 2 - 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 4 - 4 }"]`)?.firstChild ||
                startId - width * 6 - 6 === targetId && !document.querySelector(`[square-id = "${startId - width - 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 2 - 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 4 - 4 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 5 - 5 }"]`)?.firstChild ||
                startId - width * 7 - 7 === targetId && !document.querySelector(`[square-id = "${startId - width - 1 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 2 - 2 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 3 - 3 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 4 - 4 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 5 - 5 }"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 6 - 6 }"]`)?.firstChild ||
                startId + width === targetId ||
                startId + width * 2 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`)?.firstChild ||
                startId + width * 3 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 2}"]`)?.firstChild ||
                startId + width * 4 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 3}"]`)?.firstChild ||
                startId + width * 5 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 3}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 4}"]`)?.firstChild ||
                startId + width * 6 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 3}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 4}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 5}"]`)?.firstChild ||
                startId + width * 7 === targetId && !document.querySelector(`[square-id = "${startId + width}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 3}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 4}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 5}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + width * 6}"]`)?.firstChild ||
                startId - width === targetId ||
                startId - width * 2 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`)?.firstChild ||
                startId - width * 3 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 2}"]`)?.firstChild ||
                startId - width * 4 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 3}"]`)?.firstChild ||
                startId - width * 5 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 3}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 4}"]`)?.firstChild ||
                startId - width * 6 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 3}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 4}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 5}"]`)?.firstChild ||
                startId - width * 7 === targetId && !document.querySelector(`[square-id = "${startId - width}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 3}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 4}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 5}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - width * 6}"]`)?.firstChild ||
                startId + 1 === targetId ||
                startId + 2 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`)?.firstChild ||
                startId + 3 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + 2}"]`)?.firstChild ||
                startId + 4 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + 3}"]`)?.firstChild ||
                startId + 5 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + 3}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + 4}"]`)?.firstChild ||
                startId + 6 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + 3}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + 4}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + 5}"]`)?.firstChild ||
                startId + 7 === targetId && !document.querySelector(`[square-id = "${startId + 1}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + 3}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + 4}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + 5}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId + 6}"]`)?.firstChild ||
                startId - 1 === targetId ||
                startId - 2 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`)?.firstChild ||
                startId - 3 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - 2}"]`)?.firstChild ||
                startId - 4 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - 3}"]`)?.firstChild ||
                startId - 5 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - 3}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - 4}"]`)?.firstChild ||
                startId - 6 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - 3}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - 4}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - 5}"]`)?.firstChild ||
                startId - 7 === targetId && !document.querySelector(`[square-id = "${startId - 1}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - 2}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - 3}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - 4}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - 5}"]`)?.firstChild && !document.querySelector(`[square-id = "${startId - 6}"]`)?.firstChild)
                {
                    return true 
            }
            break;
        case 'king' :
            if (
                startId + 1 === targetId ||
                startId - 1 === targetId ||
                startId + width === targetId ||
                startId - width === targetId ||
                startId + width + 1 === targetId ||
                startId + width - 1 === targetId ||
                startId - width + 1 === targetId ||
                startId - width - 1 === targetId)
            {
                return true
            }
    }
}

function changePlayer() {
    if (playerGo == "black") {
        reverseIds()
        playerGo = "white"
        playerDisplayer.textContent = "white"
    } else{
        revertIds()
        playerGo = "black"
        playerDisplayer.textContent = "black"
    }
}

function reverseIds() {
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) => 
        square.setAttribute('square-id', (width * width - 1)- i))
}

function revertIds(){
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) => square.setAttribute('square-id', i))
}

function checkForWin(){
    const kings = Array.from(document.querySelectorAll('#king'))
    if (!kings.some(king => king.firstChild.classList.contains('white'))){
        infoDisplay.innerHTML = "Black Player wins!"
        const allSquares = document.querySelectorAll('.square')
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false))
    }
    if (!kings.some(king => king.firstChild.classList.contains('black'))){
        infoDisplay.innerHTML = "White Player wins!"
        const allSquares = document.querySelectorAll('.square')
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false))
    }
}






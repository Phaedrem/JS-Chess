const gameBoard = document.querySelector("#gameboard")
const playerDisplayer = document.querySelector("#player")
const infoDisplay = document.querySelector("#info-display")
const width = 8
let playerGo = 'black'
playerDisplayer.textContent = 'black'

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
        square.firstChild && square.firstChild.setAttribute('draggable', true)
        square.setAttribute('square-id', i)
        const row = Math.floor((63-i) / 8) + 1
        if (row % 2 == 0) {
            square.classList.add(i % 2 === 0 ? "beige" : "brown") // === for type coercion 
        } else {
            square.classList.add(i % 2 === 0 ? "brown" : "beige")
        }

        if ( i <= 15) {
            square.firstChild.firstChild.classList.add('black')
        }

        if (i >= 48) {
            square.firstChild.firstChild.classList.add('white')
        }
        gameBoard.append(square)
    })
}
createBoard() // Calls function

const allSquares = document.querySelectorAll(".square")
allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart)
    square.addEventListener('dragover', dragOver)
    square.addEventListener('drop', dragDrop)
})

let startPositionId
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
    const square = e.currentTarget;
    const correctGo = draggedElement.firstElementChild.classList.contains(playerGo)
    const taken = square.firstElementChild?.classList.contains('piece');
    const opponentGo = playerGo === 'white' ? 'black' : 'white'
    const takenByOpponent = square.firstElementChild?.classList.contains(opponentGo);
    console.log('playerGo', playerGo)
    console.log('opponentGo', opponentGo)
    console.log('e.target', e.currentTarget)
    

    if (correctGo) {
        // must check this first
        // if (takenByOpponent && valid) {
        //     e.target.parentNode.append(draggedElement)
        //     e.target.remove()
        //     changePlayer()
        //     return
        // }
        // then check this
        if (taken && !takenByOpponent) {
            infoDisplay.textContent = "Invalid Move"
            setTimeout(() => infoDisplay.textContent = "", 2000);
            return
        }
    }

    
    // e.target.append(draggedElement)
    
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





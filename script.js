const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const resetButton = document.getElementById('resetButton');
const playAIButton = document.getElementById('playAI');
let board = Array(9).fill(null);
let currentPlayer = 'X';
let isAITurn = false;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

resetButton.addEventListener('click', resetGame);
playAIButton.addEventListener('click', playAgainstAI);

function handleCellClick(e) {
    const index = e.target.dataset.index;
    if (board[index] || checkWinner()) return;

    makeMove(index, currentPlayer);
    
    if (checkWinner()) {
        message.textContent = `${currentPlayer} wins!`;
    } else if (board.every(cell => cell)) {
        message.textContent = 'Draw!';
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (isAITurn && currentPlayer === 'O') {
            setTimeout(AIMove, 500);
        }
    }
}

function makeMove(index, player) {
    board[index] = player;
    cells[index].textContent = player;
}

function checkWinner() {
    return winningCombinations.some(combination => {
        return combination.every(index => board[index] === currentPlayer);
    });
}

function resetGame() {
    board.fill(null);
    cells.forEach(cell => cell.textContent = '');
    currentPlayer = 'X';
    message.textContent = '';
    isAITurn = false;
}

function playAgainstAI() {
    resetGame();
    isAITurn = true;
    if (currentPlayer === 'O') {
        setTimeout(AIMove, 500);
    }
}

function AIMove() {
    const bestMove = getBestMove();
    makeMove(bestMove, currentPlayer);

    if (checkWinner()) {
        message.textContent = `${currentPlayer} wins!`;
    } else if (board.every(cell => cell)) {
        message.textContent = 'Draw!';
    } else {
        currentPlayer = 'X';
    }
}

function getBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    const scores = {
        'X': -1,
        'O': 1,
        'Draw': 0
    };

    let winner = getWinner();
    if (winner) return scores[winner];

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function getWinner() {
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    if (board.every(cell => cell)) {
        return 'Draw';
    }

    return null;
}

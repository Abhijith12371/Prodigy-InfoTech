const cells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restart');
const startButton = document.getElementById('start-game');
const playerChoiceDiv = document.getElementById('player-choice');
const gameBoardDiv = document.getElementById('game-board');
const messageParagraph = document.getElementById('message');
const playerSymbolSelect = document.getElementById('player-symbol');
const playerScoreDisplay = document.getElementById('player-score');
const computerScoreDisplay = document.getElementById('computer-score');
const normalModeButton = document.getElementById('normal-mode');
const asianModeButton = document.getElementById('asian-mode');
const difficultModeButton = document.getElementById('difficult-mode');

let currentPlayer;
let playerSymbol;
let computerSymbol;
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let playerScore = 0;
let computerScore = 0;
let isAsianMode = false;
let isDifficultMode = false;

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

const gameMusic = document.getElementById('game-music');
const clickSound = document.getElementById('click-sound');

function playGameMusic() {
    gameMusic.play();
}

function pauseGameMusic() {
    gameMusic.pause();
}

function playClickSound() {
    clickSound.currentTime = 0; 
    clickSound.play();
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

restartButton.addEventListener('click', restartGame);
startButton.addEventListener('click', startGame);
normalModeButton.addEventListener('click', () => setMode('normal'));
asianModeButton.addEventListener('click', () => setMode('asian'));
difficultModeButton.addEventListener('click', () => setMode('difficult'));

function startGame() {
    playerSymbol = playerSymbolSelect.value;
    computerSymbol = playerSymbol === 'X' ? 'O' : 'X';
    currentPlayer = playerSymbol;
    playerChoiceDiv.style.display = 'none';
    gameBoardDiv.style.display = 'grid';
    restartButton.style.display = 'block';
    messageParagraph.textContent = '';
    resetBoard();
    updateScores(); 
    playGameMusic();
}

function handleCellClick(e) {
    const index = e.target.dataset.index;
    if (gameBoard[index] !== '' || currentPlayer !== playerSymbol) return;
    gameBoard[index] = currentPlayer;
    e.target.textContent = currentPlayer;
    playClickSound();
    if (checkWin()) {
        if (!isAsianMode && currentPlayer === playerSymbol) {
            playerScore++;
            updateScores(); 
            messageParagraph.textContent = `${currentPlayer} wins! Congratulations!`;
        } else {
            computerScore++;
            updateScores();
            const sillyReasons = [
                "You are too slow!",
                "You are lazy!",
                "Your network is too fast!",
                "The computer is just too smart!"
            ];
            const randomReason = sillyReasons[Math.floor(Math.random() * sillyReasons.length)];
            messageParagraph.textContent = `Computer wins! ${randomReason}`;
        }
        resetBoard();

    } else if (gameBoard.every(cell => cell !== '')) {
        messageParagraph.textContent = `It's a draw!`;
        resetBoard();
        pauseGameMusic(); 
    } else {
        currentPlayer = computerSymbol;
        setTimeout(makeComputerMove, 500);
    }
}

function makeComputerMove() {
    let move;
    if (isAsianMode) {
        move = gameBoard.findIndex(cell => cell === ''); // Always choose the first available cell to ensure computer wins
    } else if (isDifficultMode) {
        move = getBestMove();
    } else {
        let emptyCells = gameBoard.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
        move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    gameBoard[move] = computerSymbol;
    cells[move].textContent = computerSymbol;

    if (checkWin()) {
        if (currentPlayer === computerSymbol) {
            computerScore++;
            updateScores(); 
            const sillyReasons = [
                "You are too slow!",
                "You are lazy!",
                "Your network is too fast!",
                "The computer is just too smart!"
            ];
            const randomReason = sillyReasons[Math.floor(Math.random() * sillyReasons.length)];
            messageParagraph.textContent = `Computer wins! ${randomReason}`;
        } else {
            playerScore++;
            updateScores();
            messageParagraph.textContent = `${currentPlayer} wins! Congratulations!`;
        }
        resetBoard();

    } else if (gameBoard.every(cell => cell !== '')) {
        messageParagraph.textContent = `It's a draw!`;
        resetBoard();
        pauseGameMusic(); 
    } else {
        currentPlayer = playerSymbol;
    }
}

function checkWin() {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return gameBoard[index] === currentPlayer;
        });
    });
}

function resetBoard() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.textContent = '';
    });
    currentPlayer = playerSymbol;
}

function restartGame() {
    resetBoard();
    messageParagraph.textContent = '';
    playerChoiceDiv.style.display = 'block';
    gameBoardDiv.style.display = 'none';
    restartButton.style.display = 'none';
    playerScore = 0;
    computerScore = 0;
    updateScores(); 
    pauseGameMusic(); 
}

function updateScores() {
    playerScoreDisplay.textContent = `Player: ${playerScore}`;
    computerScoreDisplay.textContent = `Computer: ${computerScore}`;
}

function setMode(mode) {
    isAsianMode = mode === 'asian';
    isDifficultMode = mode === 'difficult';
    messageParagraph.textContent = mode === 'asian'
        ? 'Asian Mode Activated'
        : mode === 'difficult'
        ? 'Difficult Mode Activated: Computer plays optimally!'
        : 'Normal Mode Activated';
}

// Minimax algorithm for difficult mode
function getBestMove() {
    let bestMove = null;
    let bestScore = -Infinity;

    gameBoard.forEach((cell, index) => {
        if (cell === '') {
            gameBoard[index] = computerSymbol;
            let score = minimax(gameBoard, 0, false);
            gameBoard[index] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = index;
            }
        }
    });

    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    if (checkWinCondition(board, computerSymbol)) return 10 - depth;
    if (checkWinCondition(board, playerSymbol)) return depth - 10;
    if (board.every(cell => cell !== '')) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        board.forEach((cell, index) => {
            if (cell === '') {
                board[index] = computerSymbol;
                let score = minimax(board, depth + 1, false);
                board[index] = '';
                bestScore = Math.max(score, bestScore);
            }
        });
        return bestScore;
    } else {
        let bestScore = Infinity;
        board.forEach((cell, index) => {
            if (cell === '') {
                board[index] = playerSymbol;
                let score = minimax(board, depth + 1, true);
                board[index] = '';
                bestScore = Math.min(score, bestScore);
            }
        });
        return bestScore;
    }
}

function checkWinCondition(board, symbol) {
    return winningCombinations.some(combination => {
        return combination.every(index => {
            return board[index] === symbol;
        });
    });
}

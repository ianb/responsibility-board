// Game state
let gameState = {
    answeredQuestions: {},
    currentQuestion: null,
    score: 0
};

// Initialize game
function initGame() {
    loadGameState();
    updateScoreDisplay();
    renderBoard();
    setupEventListeners();
}

// Load game state from localStorage
function loadGameState() {
    const saved = localStorage.getItem('jeopardyGameState');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            gameState.answeredQuestions = parsed.answeredQuestions || {};
            gameState.score = parsed.score || 0;
        } catch (e) {
            console.error('Error loading game state:', e);
        }
    }
}

// Save game state to localStorage
function saveGameState() {
    try {
        localStorage.setItem('jeopardyGameState', JSON.stringify({
            answeredQuestions: gameState.answeredQuestions,
            score: gameState.score
        }));
    } catch (e) {
        console.error('Error saving game state:', e);
    }
}

// Update score display
function updateScoreDisplay() {
    const scoreElement = document.getElementById('scoreValue');
    if (scoreElement) {
        scoreElement.textContent = gameState.score.toLocaleString();
    }
}

// Render the game board
function renderBoard() {
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';

    // Calculate grid dimensions
    const numCategories = QUESTIONS.length;
    const numRows = POINT_VALUES.length + 1; // +1 for category headers

    // Set grid template
    board.style.gridTemplateColumns = `repeat(${numCategories}, 1fr)`;
    board.style.gridTemplateRows = `auto repeat(${numRows - 1}, 1fr)`;

    // Create category headers
    QUESTIONS.forEach(category => {
        const header = document.createElement('div');
        header.className = 'category-header';
        header.textContent = category.category;
        board.appendChild(header);
    });

    // Create question cells
    POINT_VALUES.forEach((value, rowIndex) => {
        QUESTIONS.forEach((category, colIndex) => {
            const question = category.questions[rowIndex];
            const cell = document.createElement('div');
            cell.className = 'cell';

            const questionKey = `${colIndex}-${rowIndex}`;
            if (gameState.answeredQuestions[questionKey]) {
                cell.classList.add('answered');
                cell.textContent = '';
            } else {
                cell.textContent = `$${value}`;
                cell.addEventListener('click', () => showQuestion(colIndex, rowIndex));
            }

            board.appendChild(cell);
        });
    });

    updateScoreDisplay();
}

// Show question in modal
function showQuestion(categoryIndex, questionIndex) {
    const category = QUESTIONS[categoryIndex];
    const question = category.questions[questionIndex];
    const questionKey = `${categoryIndex}-${questionIndex}`;

    // Check if already answered
    if (gameState.answeredQuestions[questionKey]) {
        return;
    }

    // Store current question
    gameState.currentQuestion = {
        categoryIndex,
        questionIndex,
        questionKey,
        question: question.question,
        answer: question.answer,
        value: question.value
    };

    // Show modal
    const modal = document.getElementById('modal');
    const categoryName = modal.querySelector('.category-name');
    const pointValue = modal.querySelector('.point-value');
    const questionText = modal.querySelector('.question-text');
    const answerText = modal.querySelector('.answer-text');

    categoryName.textContent = category.category;
    pointValue.textContent = `$${question.value}`;
    questionText.textContent = question.question;
    answerText.textContent = question.answer;

    // Reset views
    document.getElementById('questionView').classList.remove('hidden');
    document.getElementById('answerView').classList.add('hidden');

    modal.classList.add('show');
}

// Hide modal
function hideModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('show');
    gameState.currentQuestion = null;
}

// Mark question as answered
function markQuestionAnswered(questionKey, correct) {
    gameState.answeredQuestions[questionKey] = {
        answered: true,
        correct: correct,
        timestamp: Date.now()
    };

    if (correct) {
        const question = QUESTIONS[gameState.currentQuestion.categoryIndex]
            .questions[gameState.currentQuestion.questionIndex];
        gameState.score += question.value;
    } else {
        const question = QUESTIONS[gameState.currentQuestion.categoryIndex]
            .questions[gameState.currentQuestion.questionIndex];
        gameState.score -= question.value;
    }

    saveGameState();
    hideModal();
    renderBoard();
}

// Setup event listeners
function setupEventListeners() {
    // Close modal
    const modal = document.getElementById('modal');
    const closeBtn = modal.querySelector('.close-btn');
    const showAnswerBtn = modal.querySelector('.show-answer-btn');
    const correctBtn = modal.querySelector('.correct-btn');
    const incorrectBtn = modal.querySelector('.incorrect-btn');

    closeBtn.addEventListener('click', hideModal);

    // Click outside modal to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    // Show answer
    showAnswerBtn.addEventListener('click', () => {
        document.getElementById('questionView').classList.add('hidden');
        document.getElementById('answerView').classList.remove('hidden');
    });

    // Mark as correct
    correctBtn.addEventListener('click', () => {
        if (gameState.currentQuestion) {
            markQuestionAnswered(gameState.currentQuestion.questionKey, true);
        }
    });

    // Mark as incorrect
    incorrectBtn.addEventListener('click', () => {
        if (gameState.currentQuestion) {
            markQuestionAnswered(gameState.currentQuestion.questionKey, false);
        }
    });

    // New game button
    document.getElementById('newGameBtn').addEventListener('click', () => {
        if (confirm('Start a new game? This will reset your progress.')) {
            gameState.answeredQuestions = {};
            gameState.score = 0;
            gameState.currentQuestion = null;
            saveGameState();
            hideModal();
            renderBoard();
        }
    });

    // Reset board button
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (confirm('Reset the board? All questions will be available again.')) {
            gameState.answeredQuestions = {};
            saveGameState();
            hideModal();
            renderBoard();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('show')) {
            if (e.key === 'Escape') {
                hideModal();
            } else if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (!document.getElementById('answerView').classList.contains('hidden')) {
                    // If answer is showing, default to correct
                    if (gameState.currentQuestion) {
                        markQuestionAnswered(gameState.currentQuestion.questionKey, true);
                    }
                } else {
                    // If question is showing, show answer
                    document.getElementById('questionView').classList.add('hidden');
                    document.getElementById('answerView').classList.remove('hidden');
                }
            }
        }
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initGame);

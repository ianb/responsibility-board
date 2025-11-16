// Game state
let gameState = {
  currentBoard: null,
  answeredQuestions: {},
  currentQuestion: null,
  players: [
    { name: "Player 1", score: 0, active: true },
    { name: "Player 2", score: 0, active: false },
    { name: "Player 3", score: 0, active: false },
    { name: "Player 4", score: 0, active: false },
    { name: "Player 5", score: 0, active: false },
  ],
  currentBuzzer: null,
  buzzerLocked: false,
};

// Audio elements
let buzzerSound = null;
let themeMusic = null;

// Initialize game
function initGame() {
  initAudio();
  loadGameState();
  setupEventListeners();
  renderPlayers();
  renderBoard();
}

// Initialize audio elements
function initAudio() {
  // Create buzzer sound
  buzzerSound = new Audio("audio/buzzer.wav");
  buzzerSound.volume = 0.8;

  // Create theme music
  themeMusic = new Audio("audio/theme-song-1.mp3");
  themeMusic.loop = true;
  themeMusic.volume = 0.35;
}

// Load game state from localStorage
function loadGameState() {
  // Always get a new random board
  const defaultBoard = getDefaultBoard();
  if (defaultBoard) {
    gameState.currentBoard = defaultBoard.name;
  }

  // Load board-specific data
  loadBoardState(gameState.currentBoard);
}

// Load state for a specific board
function loadBoardState(boardName) {
  if (!boardName) return;

  const saved = localStorage.getItem(`jeopardyGameState_${boardName}`);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      gameState.answeredQuestions = parsed.answeredQuestions || {};
      if (parsed.players) {
        // Merge saved players with defaults, preserving structure
        parsed.players.forEach((p, i) => {
          if (i < gameState.players.length) {
            gameState.players[i] = {
              ...gameState.players[i],
              ...p,
            };
          }
        });
      }
    } catch (e) {
      console.error("Error loading game state:", e);
      gameState.answeredQuestions = {};
    }
  } else {
    // No saved data for this board, start fresh
    gameState.answeredQuestions = {};
  }
}

// Save game state to localStorage
function saveGameState() {
  try {
    const boardName = gameState.currentBoard;
    if (boardName) {
      // Save board-specific data
      localStorage.setItem(
        `jeopardyGameState_${boardName}`,
        JSON.stringify({
          answeredQuestions: gameState.answeredQuestions,
          players: gameState.players,
        })
      );
    }
  } catch (e) {
    console.error("Error saving game state:", e);
  }
}

// Render players
function renderPlayers() {
  const container = document.getElementById("playersContainer");
  if (!container) return;

  container.innerHTML = "";

  gameState.players.forEach((player, index) => {
    const playerDiv = document.createElement("div");
    playerDiv.className = "player-score";
    if (!player.active) {
      playerDiv.classList.add("inactive");
    }
    playerDiv.innerHTML = `
            <div class="player-name">${
              player.name || `Player ${index + 1}`
            }</div>
            <div class="player-score-value">$${player.score.toLocaleString()}</div>
            <div class="player-key">${index + 1}</div>
        `;
    container.appendChild(playerDiv);
  });
}

// Handle buzzer
function handleBuzzer(playerIndex) {
  // Check if player index is valid
  if (playerIndex < 0 || playerIndex >= gameState.players.length) return;

  const player = gameState.players[playerIndex];
  if (!player.active) return;

  // Only allow buzzing if buzzer view is showing and buzzer not locked
  const buzzerView = document.getElementById("buzzerView");
  if (!buzzerView || buzzerView.classList.contains("hidden")) return;

  if (gameState.buzzerLocked) return;

  gameState.currentBuzzer = playerIndex;
  gameState.buzzerLocked = true;

  // Play buzzer sound
  if (buzzerSound) {
    buzzerSound.currentTime = 0;
    buzzerSound.play().catch((e) => {
      console.error("Error playing buzzer sound:", e);
    });
  }

  // Play theme music
  if (themeMusic) {
    themeMusic.currentTime = 0;
    themeMusic.play().catch((e) => {
      console.error("Error playing theme music:", e);
    });
  }

  // Show who buzzed in
  const buzzerDisplay = document.getElementById("buzzerDisplay");
  if (buzzerDisplay) {
    buzzerDisplay.innerHTML = `
            <div class="buzzer-active">
                <div class="buzzer-player-name">${player.name} buzzed in!</div>
                <div class="buzzer-instructions">Show answer to see response</div>
            </div>
        `;
  }

  // Highlight the player
  const playerDivs = document.querySelectorAll(".player-score");
  playerDivs.forEach((div, i) => {
    div.classList.remove("buzzed-in");
    if (i === playerIndex) {
      div.classList.add("buzzed-in");
    }
  });
}

// Render the game board
function renderBoard() {
  const board = document.getElementById("gameBoard");
  board.innerHTML = "";

  const currentBoardData = getBoard(gameState.currentBoard);
  if (!currentBoardData) {
    board.innerHTML = "<p>No board selected</p>";
    return;
  }

  const categories = currentBoardData.categories;
  const numCategories = categories.length;
  const numRows = POINT_VALUES.length + 1; // +1 for category headers

  // Set grid template
  board.style.gridTemplateColumns = `repeat(${numCategories}, 1fr)`;
  board.style.gridTemplateRows = `auto repeat(${numRows - 1}, 1fr)`;

  // Create category headers
  categories.forEach((category, colIndex) => {
    const header = document.createElement("div");
    header.className = "category-header";

    const title = document.createElement("span");
    title.className = "category-title";
    title.textContent = category.category;
    header.appendChild(title);

    const swapBtn = document.createElement("button");
    swapBtn.className = "swap-category-btn";
    swapBtn.type = "button";
    swapBtn.title = "Swap this category";
    swapBtn.textContent = "↻";
    swapBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      swapCategory(colIndex);
    });
    header.appendChild(swapBtn);

    board.appendChild(header);
  });

  // Create question cells
  POINT_VALUES.forEach((value, rowIndex) => {
    categories.forEach((category, colIndex) => {
      const question = category.questions[rowIndex];
      const cell = document.createElement("div");
      cell.className = "cell";

      const questionKey = `${colIndex}-${rowIndex}`;
      if (gameState.answeredQuestions[questionKey]) {
        cell.classList.add("answered");
        cell.textContent = "";
      } else if (question) {
        cell.textContent = `$${value}`;
        cell.addEventListener("click", () => showQuestion(colIndex, rowIndex));
      } else {
        // No question for this cell
        cell.classList.add("answered");
        cell.textContent = "";
      }

      board.appendChild(cell);
    });
  });
}

// Show question in modal
function showQuestion(categoryIndex, questionIndex) {
  const currentBoardData = getBoard(gameState.currentBoard);
  if (!currentBoardData) return;

  const category = currentBoardData.categories[categoryIndex];
  if (!category) return;

  const question = category.questions[questionIndex];
  if (!question) return;

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
    value: question.value,
  };

  // Reset buzzer state
  gameState.currentBuzzer = null;
  gameState.buzzerLocked = false;

  // Stop any playing theme music from previous question
  if (themeMusic) {
    themeMusic.pause();
    themeMusic.currentTime = 0;
  }

  // Show modal
  const modal = document.getElementById("modal");
  const categoryName = modal.querySelector(".category-name");
  const pointValue = modal.querySelector(".point-value");
  const questionText = modal.querySelector(".question-text");
  const answerText = modal.querySelector(".answer-text");

  categoryName.textContent = category.category;
  pointValue.textContent = `$${question.value}`;

  // Set question text in both buzzer view and question view
  const buzzerQuestionText = document
    .getElementById("buzzerView")
    .querySelector(".question-text");
  if (buzzerQuestionText) {
    buzzerQuestionText.textContent = question.question;
  }
  questionText.textContent = question.question;
  answerText.textContent = question.answer;

  // Reset views - show buzzer view first
  document.getElementById("buzzerView").classList.remove("hidden");
  document.getElementById("questionView").classList.add("hidden");
  document.getElementById("answerView").classList.add("hidden");

  // Reset buzzer display
  const buzzerDisplay = document.getElementById("buzzerDisplay");
  buzzerDisplay.innerHTML = "<p>Press keys 1-5 to buzz in</p>";

  // Clear buzzed-in highlighting
  document.querySelectorAll(".player-score").forEach((div) => {
    div.classList.remove("buzzed-in");
  });

  modal.classList.add("show");
}

// Show answer view
function showAnswerView() {
  const buzzerView = document.getElementById("buzzerView");
  const questionView = document.getElementById("questionView");
  const answerView = document.getElementById("answerView");
  const currentPlayerDiv = document.getElementById("currentPlayer");

  // Hide both buzzer and question views
  buzzerView.classList.add("hidden");
  questionView.classList.add("hidden");
  // Show answer view
  answerView.classList.remove("hidden");

  // Set current player display if someone buzzed in
  if (gameState.currentBuzzer !== null) {
    const player = gameState.players[gameState.currentBuzzer];
    if (currentPlayerDiv) {
      currentPlayerDiv.textContent = `${player.name} answered:`;
      currentPlayerDiv.className = "current-player";
    }
  } else {
    if (currentPlayerDiv) {
      currentPlayerDiv.textContent = "";
      currentPlayerDiv.className = "current-player hidden";
    }
  }
}

// Hide modal
function hideModal() {
  const modal = document.getElementById("modal");
  modal.classList.remove("show");
  gameState.currentQuestion = null;
  gameState.currentBuzzer = null;
  gameState.buzzerLocked = false;

  // Stop theme music
  if (themeMusic) {
    themeMusic.pause();
    themeMusic.currentTime = 0;
  }

  // Clear buzzed-in highlighting
  document.querySelectorAll(".player-score").forEach((div) => {
    div.classList.remove("buzzed-in");
  });
}

// Mark question as answered
function markQuestionAnswered(questionKey, correct, playerIndex = null) {
  const targetPlayerIndex =
    playerIndex !== null ? playerIndex : gameState.currentBuzzer;

  if (targetPlayerIndex === null) {
    // No buzzer, just mark as answered without scoring
    gameState.answeredQuestions[questionKey] = {
      answered: true,
      correct: null,
      timestamp: Date.now(),
    };
  } else {
    const player = gameState.players[targetPlayerIndex];

    gameState.answeredQuestions[questionKey] = {
      answered: true,
      correct: correct,
      playerIndex: targetPlayerIndex,
      timestamp: Date.now(),
    };

    if (correct) {
      player.score += gameState.currentQuestion.value;
    } else {
      player.score -= gameState.currentQuestion.value;
    }
  }

  // Stop theme music when question is answered
  if (themeMusic) {
    themeMusic.pause();
    themeMusic.currentTime = 0;
  }

  saveGameState();
  hideModal();
  renderBoard();
  renderPlayers();
}

// Setup event listeners
function setupEventListeners() {
  // Close modal
  const modal = document.getElementById("modal");
  const closeBtn = modal.querySelector(".close-btn");
  const showAnswerBtn = modal.querySelector(".show-answer-btn");
  const correctBtn = modal.querySelector(".correct-btn");
  const incorrectBtn = modal.querySelector(".incorrect-btn");
  const passBtn = modal.querySelector(".pass-btn");

  closeBtn.addEventListener("click", hideModal);

  // Click outside modal to close
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      hideModal();
    }
  });

  // Show answer from buzzer view
  const buzzerView = document.getElementById("buzzerView");
  const buzzerShowAnswerBtn = buzzerView
    ? buzzerView.querySelector(".show-answer-btn")
    : null;
  if (buzzerShowAnswerBtn) {
    buzzerShowAnswerBtn.addEventListener("click", showAnswerView);
  }

  // Show answer from question view
  if (showAnswerBtn) {
    showAnswerBtn.addEventListener("click", showAnswerView);
  }

  // Mark as correct
  if (correctBtn) {
    correctBtn.addEventListener("click", () => {
      if (gameState.currentQuestion) {
        markQuestionAnswered(
          gameState.currentQuestion.questionKey,
          true,
          gameState.currentBuzzer
        );
      }
    });
  }

  // Mark as incorrect
  if (incorrectBtn) {
    incorrectBtn.addEventListener("click", () => {
      if (gameState.currentQuestion) {
        markQuestionAnswered(
          gameState.currentQuestion.questionKey,
          false,
          gameState.currentBuzzer
        );
      }
    });
  }

  // Pass button
  if (passBtn) {
    passBtn.addEventListener("click", () => {
      // Pass - don't award points, but mark as answered
      if (gameState.currentQuestion) {
        markQuestionAnswered(gameState.currentQuestion.questionKey, null, null);
      }
    });
  }

  // Setup help button
  const helpBtn = document.getElementById("helpBtn");
  const helpModal = document.getElementById("helpModal");

  if (helpBtn && helpModal) {
    // Show help modal
    helpBtn.addEventListener("click", () => {
      helpModal.classList.add("show");
    });

    // Close help modal
    const helpCloseBtn = helpModal.querySelector(".close-btn");
    if (helpCloseBtn) {
      helpCloseBtn.addEventListener("click", () => {
        helpModal.classList.remove("show");
      });
    }

    // Close help modal when clicking outside
    helpModal.addEventListener("click", (e) => {
      if (e.target === helpModal) {
        helpModal.classList.remove("show");
      }
    });

    // Close help modal with Escape key (handled in existing keydown handler)
  }

  // Setup category count selector
  const categoryCountSelect = document.getElementById("categoryCountSelect");
  if (categoryCountSelect) {
    categoryCountSelect.addEventListener("change", (e) => {
      const value = e.target.value;
      setCategoryCount(value);

      // Reshuffle categories when the count changes
      const newBoard = reshuffleCategories();
      gameState.currentBoard = newBoard.name;

      gameState.answeredQuestions = {};
      gameState.currentQuestion = null;
      gameState.currentBuzzer = null;
      gameState.buzzerLocked = false;

      saveGameState();
      hideModal();
      renderBoard();
    });
  }

  // Setup players button
  const setupBtn = document.getElementById("setupPlayersBtn");
  if (setupBtn) {
    setupBtn.addEventListener("click", () => {
      const numActive = gameState.players.filter((p) => p.active).length;
      const numPlayers = prompt(`Enter number of players (1-5):`, numActive);

      if (numPlayers === null) return;

      const num = parseInt(numPlayers);
      if (isNaN(num) || num < 1 || num > 5) {
        alert("Please enter a number between 1 and 5");
        return;
      }

      // Update active players
      gameState.players.forEach((player, index) => {
        player.active = index < num;
        if (player.active && !player.name) {
          player.name = `Player ${index + 1}`;
        }
      });

      // Get player names
      for (let i = 0; i < num; i++) {
        const name = prompt(
          `Enter name for Player ${i + 1}:`,
          gameState.players[i].name
        );
        if (name !== null && name.trim()) {
          gameState.players[i].name = name.trim();
        }
      }

      saveGameState();
      renderPlayers();
    });
  }

  // New game button
  document.getElementById("newGameBtn").addEventListener("click", () => {
    if (
      confirm(
        "Start a new game? This will reset your progress and reshuffle categories."
      )
    ) {
      // Reshuffle categories
      const newBoard = reshuffleCategories();
      gameState.currentBoard = newBoard.name;

      // Reset game state
      gameState.answeredQuestions = {};
      gameState.players.forEach((p) => (p.score = 0));
      gameState.currentQuestion = null;
      gameState.currentBuzzer = null;
      gameState.buzzerLocked = false;
      saveGameState();
      hideModal();
      renderBoard();
      renderPlayers();
    }
  });

  // Reset board button
  document.getElementById("resetBtn").addEventListener("click", () => {
    if (
      confirm(
        "Reset the board? This will reshuffle categories and make all questions available again."
      )
    ) {
      // Reshuffle categories
      const newBoard = reshuffleCategories();
      gameState.currentBoard = newBoard.name;

      // Reset answered questions
      gameState.answeredQuestions = {};
      gameState.currentQuestion = null;
      gameState.currentBuzzer = null;
      gameState.buzzerLocked = false;
      saveGameState();
      hideModal();
      renderBoard();
    }
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Escape: Close any open modal
    if (e.key === "Escape") {
      if (helpModal && helpModal.classList.contains("show")) {
        e.preventDefault();
        helpModal.classList.remove("show");
        return;
      }
      if (modal.classList.contains("show")) {
        e.preventDefault();
        hideModal();
        return;
      }
    }

    if (modal.classList.contains("show")) {
      // Buzzer keys 1-5
      if (e.key >= "1" && e.key <= "5") {
        e.preventDefault();
        const playerIndex = parseInt(e.key) - 1;
        handleBuzzer(playerIndex);
        return;
      }

      // Spacebar: Show the answer
      if (e.key === " ") {
        e.preventDefault();
        const buzzerView = document.getElementById("buzzerView");
        const questionView = document.getElementById("questionView");

        // Only handle spacebar if we're in buzzer view or question view
        if (
          !buzzerView.classList.contains("hidden") ||
          !questionView.classList.contains("hidden")
        ) {
          showAnswerView();
        }
      }
    }
  });
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", initGame);

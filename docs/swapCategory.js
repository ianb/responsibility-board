// Swap out a specific category column for a new random one
function swapCategory(columnIndex) {
  const currentBoardData = getBoard(gameState.currentBoard);
  if (!currentBoardData) return;

  const categories = currentBoardData.categories;
  if (!categories || !categories[columnIndex]) return;

  // Build a set of category names currently on the board
  const usedNames = new Set(categories.map((c) => c.category));

  // Filter available categories that are not currently on the board
  const available = ALL_CATEGORIES.filter((c) => !usedNames.has(c.category));

  if (available.length === 0) {
    // No alternative categories left
    alert("No more unused categories available to swap in.");
    return;
  }

  // Pick a random new category
  const newCategory = available[Math.floor(Math.random() * available.length)];

  // Replace the category in the board
  categories[columnIndex] = newCategory;

  // Clear answered questions for this column
  Object.keys(gameState.answeredQuestions).forEach((key) => {
    const [colStr] = key.split("-");
    const col = parseInt(colStr, 10);
    if (col === columnIndex) {
      delete gameState.answeredQuestions[key];
    }
  });

  // Reset any currently open question
  gameState.currentQuestion = null;
  gameState.currentBuzzer = null;
  gameState.buzzerLocked = false;

  saveGameState();
  hideModal();
  renderBoard();
}

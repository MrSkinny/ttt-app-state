/* global $ */

const state = {
  board: Array(9).fill(null),
  xIsNext: true,
  winPattern: null
};

const GAME_EL = $('.game');

/**
 * Analyzes board to determine if win state occurred
 * @param {Array} board
 * @returns {Array|null} - Array of indexes that denote winning cells; null if no winner
 * */
function checkWinner(board) {
  const winPatterns = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [2, 4, 6], [0, 4, 8]];

  for (let i = 0; i < winPatterns.length; i++) {
    const winPattern = winPatterns[i];

    // Prevent win with three nulls by checking first cell isn't null
    if (!board[winPattern[0]]) continue;

    if (board[winPattern[0]] === board[winPattern[1]] && board[winPattern[1]] === board[winPattern[2]]) {
      return winPattern;
    }
  }

  return null;
}


// State modification functions
function resetBoard() {
  state.board = state.board.map(c => null);
  state.xIsNext = true;
  state.winPattern = null;
}

function setMove(cellNo) {
  if (state.winPattern || state.board[cellNo]) return;

  state.board[cellNo] = state.xIsNext ? 'X' : 'O';
  state.xIsNext = !state.xIsNext;
  const result = checkWinner(state.board);
  if (result) {
    state.winPattern = result;
  }
}

// Render function
function renderBoard() {
    let html = '';
  
    html += '<div class="board">';

    state.board.forEach((cell, ind) => {
        if (ind === 0 || ind === 3 || ind === 6) {
            html += '<div class="row">';
        }
        html += `
            <div class="cell ${state.winPattern && state.winPattern.includes(ind) ? 'win' : ''}" id="${ind}">
                <p>${cell ? cell : '&nbsp;'}</p>
            </div>             
        `;
        if (ind === 2 || ind === 5 || ind === 8) {
            html += '</div>';
        }
    });

    html += '</div>';

    GAME_EL.html(html);
}

// Event Listeners

$(() => {
  console.log('First board render...');
  renderBoard();

  $('.game').on('click', '.cell', e => {
    const id = $(e.target).closest('.cell').attr('id');
    setMove(id);
    renderBoard();
  });

  $('.controls').on('click', 'button', () => {
    resetBoard();
    renderBoard();
  });
});

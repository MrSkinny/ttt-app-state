/* global $ */

const appState = {
    board: Array(9).fill(null),
    xIsNext: true,
    hasWinner: false,
    winPattern: null
};

/**
 * @desc Analyzes board to determine if win state occurred
 * @param {Array} board
 * @returns {Array} - Array of indexes that denote winner or null
 * */
function checkWinner(board){
    const winPatterns = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [2,4,6], [0,4,8]];
    let result = null;
    winPatterns.forEach(winPattern => {
        if ( !board[winPattern[0]] || !board[winPattern[1]] || !board[winPattern[2]] ) return;
        if ( board[winPattern[0]] === board[winPattern[1]] && board[winPattern[1]] === board[winPattern[2]] ) {
            result = winPattern;
        }
    });
    return result;
}


// State modification functions
function resetBoard(state){
    state.board = state.board.map(c => null);
    state.xIsNext = true;
    state.hasWinner = false;
    state.winPattern = null;
}

function setMove(state, cellNo){
    if (state.hasWinner || state.board[cellNo]) return;

    state.board[cellNo] = state.xIsNext ? 'X' : 'O';
    state.xIsNext = !state.xIsNext;
    const result = checkWinner(state.board);
    if (result) {
        state.hasWinner = true;
        state.winPattern = result;
    }
}

// Render functions
function renderBoard(state, el){
    let html = '';
    const renderRows = (board, winPattern) => {
        let html = '';
        board.forEach((cell, ind) => {
             if (ind === 0 || ind === 3 || ind === 6) {
                 html += `<div class="row">`;
             }
             html += `
                <div class="cell ${winPattern && winPattern.includes(ind) ? 'win' : ''}" id="${ind}">
                    <p>${cell ? cell : '&nbsp;'}</p>
                </div>             
             `;
             if (ind === 2 || ind === 5 || ind === 8) {
                 html += `</div>`;
             }
        });
        return html;
    };
    
    html += `
        <div class="board">
            ${renderRows(state.board, state.winPattern)}
        </div>
    `;
    
    el.html(html);
}

// Event Listeners

$(() => {
    console.log('First board render...');
    renderBoard(appState, $('.game'));
    
    $('.game').on('click', '.cell', e => {
        const id = $(e.target).closest('.cell').attr('id'); 
        setMove(appState, id);
        renderBoard(appState, $('.game'));
    });
    
    $('.controls').on('click', 'button', e => {
        resetBoard(appState);
        renderBoard(appState, $('.game'));
    });
});

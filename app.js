/* global $ */
'use strict';

const state = {
  cell1 : '.',
  cell2 : '.',
  cell3 : '.',
  cell4 : '.',
  cell5 : '.',
  cell6 : '.',
  cell7 : '.',
  cell8 : '.',
  cell9 : '.',
  hits: 1
};

// State modification functions
const startNewGame = () => {
  state.cell1 = '.';
  state.cell2 = '.';
  state.cell3 = '.';
  state.cell4 = '.';
  state.cell5 = '.';
  state.cell6 = '.';
  state.cell7 = '.';
  state.cell8 = '.';
  state.cell9 = '.';
};

const clickACell = (cellID) => {
  console.log(cellID);
  
  const prop = 'cell' + cellID;
  if (state[prop] === '.' && state.hits % 2 === 0){
    state[prop] = 'o';
    state.hits += 1;
  }
  else if (state[prop] === '.' && state.hits % 2 !== 0){
    state[prop] = 'x';
    state.hits += 1;
  }   
  renderBoard(); 
};

// Render functions

const showWin = (first, second, third) => {
  console.log('the winners: ' + first + second + third);
};
//Evaluate win
const evalWin = () => {
  if (state.cell1 === state.cell2 && state.cell3 === state.cell2 && state.cell2 !== '.'){
    showWin(1,2,3);
  }
  if (state.cell1 === state.cell4 && state.cell7 === state.cell4 && state.cell4 !== '.'){
    showWin(1,4,7);
  }
  if (state.cell1 === state.cell5 && state.cell9 === state.cell5 && state.cell5 !== '.'){
    showWin(1,5,9);
  }
  if (state.cell2 === state.cell5 && state.cell8 === state.cell5 && state.cell5 !== '.'){
    showWin(2,5,8);
  }
  if (state.cell3 === state.cell5 && state.cell7 === state.cell5 && state.cell5 !== '.'){
    showWin(3,5,7);
  }
  if (state.cell3 === state.cell6 && state.cell9 === state.cell6 && state.cell6 !== '.'){
    showWin(3,6,9);
  }
  if (state.cell4 === state.cell5 && state.cell6 === state.cell5 && state.cell5 !== '.'){
    showWin(4,5,6);
  }
  if (state.cell7 === state.cell8 && state.cell9 === state.cell8 && state.cell8 !== '.'){
    showWin(7,8,9);
  }
  else return;
};

const generateCell = (id) => {
  const cellID = 'cell' + id;
  const cellState = state[cellID];
  return `<div class="cell" id="${id}">
  <p>${cellState}</p>
</div>`;
};

const renderBoard = () => {
  //join up rows
  let row1 = '';
  for (let i = 1; i <4; i ++){
    row1 += generateCell(i);
  }
  row1 = '<div class="row">' + row1 + '</div>';
  let row2 = '';
  for (let i = 4; i <7; i ++){
    row2 += generateCell(i);
  }
  row2 = '<div class="row">' + row2 + '</div>';
  let row3 = '';
  for (let i = 7; i < 10; i ++){
    row3 += generateCell(i);
  }
  row3 = '<div class="row">' + row3 + '</div>';

  let board = row1 + row2 + row3;
  // publish to DOM
  $('.board').html(board);
  
};


// Event Listeners
function handleCellClick () {
  $('.board').on('click','.cell', function(){
  //which cell clicked
    const cellID = (this.id);
    //invoke state modification
    clickACell(cellID);
    //invoke render function
    evalWin();
    renderBoard();
  });
}
function handleNewGame () {
  $('#new-game').on('click', function(){
  //reset state
    startNewGame();
    //invoke render function
    renderBoard();
  });
}

const main = () => {
  renderBoard();
  handleCellClick();
  handleNewGame();
};

$(main);
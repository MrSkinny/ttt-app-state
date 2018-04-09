/* global $ */
'use strict';

const state = {
  cell1 : '.',
  cell2 : 'o',
  cell3 : 'x',
  cell4 : 'x',
  cell5 : '.',
  cell6 : 'o',
  cell7 : 'x',
  cell8 : 'x',
  cell9 : '.'
};

// State modification functions
const startNewGame = () => {

};

const clickACell = () => {

};

// Render functions
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

$('.board').on('click','.cell', function(event){
  //which cell clicked
  const cell = (this.id);
  //invoke state modification
  clickACell(cell);
  //invoke render function
  renderBoard();
});

$('#new-game').on('click', function(event){
  //rest state
  state.cell1 = '.';
  state.cell2 = '.';
  state.cell3 = '.';
  state.cell4 = '.';
  state.cell5 = '.';
  state.cell6 = '.';
  state.cell7 = '.';
  state.cell8 = '.';
  state.cell9 = '.';
  //invoke render function
  renderBoard();
});

const main = () => {
  renderBoard();

};

$(main);
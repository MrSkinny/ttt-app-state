/* global $ */
'use strict';

const state = {
  cell1 : '',
  cell2 : '',
  cell3 : '',
  cell4 : '',
  cell5 : '',
  cell6 : '',
  cell7 : '',
  cell8 : '',
  cell9 : ''
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

  //invoke state modification

  //invoke render function
});

$('#new-game').on('click', function(event){
  //which cell clicked

  //invoke state modification

  //invoke render function
});

const main = () => {
  renderBoard();

};

$(main);
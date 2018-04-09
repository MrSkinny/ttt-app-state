/* global $ */
'use strict';

const state = {
  cell1 : {
    x : false,
    y : false
  },
  cell2 : {
    x : false,
    y : false
  },
  cell3 : {
    x : false,
    y : false
  },
  cell4 : {
    x : false,
    y : false
  },
  cell5 : {
    x : false,
    y : false
  },
  cell6 : {
    x : false,
    y : false
  },
  cell7 : {
    x : false,
    y : false
  },
  cell8 : {
    x : false,
    y : false
  },
  cell9 : {
    x : false,
    y : false
  }
};

// State modification functions
const startNewGame = () => {

};

const clickACell = () => {

};

// Render functions
const renderBoard = () => {

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
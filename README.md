![Screenshot](/../screenshots/images/ttt-image.png?raw=true)

# Learning Application State - with Tic Tac Toe!

This is an exercise for learning how to manage application state with the classic
Tic Tac Toe game. Complete the instructions below, then check your solution against
the example solution in the `gh-pages` branch on this repo. [Click Here](https://mrskinny.github.io/ttt-app-state) to
see the working app and target functionality.

## Objectives:

* When user arrives at app, they can immediately click cells to alternately place Xs and Os on each click
* When cell contains a value, clicking again will make no changes to state
* When a winning line has been created, the winning cells will highlight and no further moves can be played
* "New Game" can be clicked at any time to reset the board

## Instructions

1. Clone this repo
2. Start a new branch called `implement-game`
3. Study the `index.html`. The only dynamic part of the app will be happening inside the `<div class="game"></div>` element.
4. Build a state object that can handle every possible scenario as a user interacts with the app
5. Write state modification functions for every action a user can make in the app
    * Start new game
    * Click a cell 
6. Write a `renderBoard` function that receives a `state` object and renders all the HTML necessary to draw the Tic Tac Toe grid
7. Write event listeners for the two user actions. Each listener should:
    1. retrieve DOM info if applicable (e.g. which cell was clicked?)
    2. invoke a state modification function
    3. invoke the render function

------

## Walkthrough

Try to follow the instructions above on your own. If you get stuck, you can reference the walkthrough below:

* [How to Build the State Object](#how-to-build-the-state-object)
* [How to Write the State Modification Functions](#how-to-write-the-state-modification-functions)
  * [setMove](#setmove)
  * [newGame](#newgame)
* [How to Write the Render Functions](#how-to-write-the-render-functions)
* [How to Write the Event Listeners](#how-to-write-the-event-listeners)
  * [onCellClick](#oncellclick)
  * [onNewGameClick](#onnewgameclick)
* [How to Check For Winning Move](#how-to-check-for-winning-move)

### How to Build the State Object

Your state is just a collection of key-value pairs like any other Javascript object. Its sole purpose is to hold information about what the user sees at any given moment. Take careful note: it **holds information** and does NOT manage the behavior of the DOM. Think about what information your Tic Tac Toe game would need at every possible moment throughout the game's lifecycle. It can help to write out a bunch of example scenarios:

1) I load the app and see a blank grid
2) I click the top-left cell and a X appears in the cell
3) I click the center-left cell and a O appears in the cell
4) I click the center-left cell and nothing happens
5) I click to cause a three-X sequence across the top row. The top cells change color.
    * Further clicks on empty cells have no effect
6) I click 'New Game' (at any time) and all cells become blank

Now build a state object that could "describe" each scenario. Scenario #1 is easy. We'll use an array to represent the nine cells in our grid, array index 0 through 8, starting them with a default `null` value.

```javascript
// Scenario #1
{ board: Array(9).fill(null) }
```

We want scenario #2 to add the string `'X'` to array index `0`.  But how would the app know to place an `'X'` and not `'O'`?  We could read the `board` every time and know from the count of non-`null` cells which symbol to place next, but an easier option is to just create a boolean we 'flip' on every move:

```javascript
// Scenario #2:
{ 
    board: [ 'X', null, null, null, null, null, null, null, null ],
    xIsNext: false
}
```

This makes scenario #3 straightforward:

```javascript
// Scenario #3:
{ 
    board: [ 'X', null, null, 'O', null, null, null, null, null ],
    xIsNext: true
}
```

For scenario #4, there's nothing specific to denote in the `state` object. We just need to ensure our state modification function checks the value is `null` before it changes it to a symbol.

For scenario #5, there's two important things to handle: Identify which cells created the winning line and prevent a click in empty cells from adding new symbols. The winning line could be represented as an array of index values of the three winning cells. If that variable is `null`, then no winner has yet been found.

```javascript
// Scenario #5:
{
    board: [ 'X', 'O', 'O', 'X', null, null, 'X', null, null ],
    xIsNext: false,
    winPattern: [0, 3, 6]
}
```

The final scenario is a reset of all the fields we now have in our state:

```javascript
// Scenario #6
{
    board: [ null, null, null, null, null, null, null, null, null ],
    xIsNext: true,
    winPattern: null
}
```

Note, this is just one possible state solution. Arguably, `xIsNext` and `winPattern` are all extraneous as their values could be deduced from the `board` array at any given time. Deciding when to "cache" info in your state or compute it every time you need it is a pros/cons analysis we can cover later. For now, we're going with the most readable approach by using additional state properties.

### How to Write the Sztate Modification Functions

We know what our state looks like; now we need functions that allow us to change it. The best way to design these is map them to specific actions the user will perform in our app. 

#### setMove

The main action is the user clicks on a cell and the correct symbol is placed. So we want a function that will place a symbol into the appropriate index in our `board` array. Our function needs to know what cell to affect, and then based on state properties, decide whether to place an `'X'`, `'O'` or make no change. And finally, it needs to indicate the symbol changes on next click.

```javascript
function setMove(state, cellNo) {
    // if there is a winner, this action must do nothing and return
    if (state.winPattern) return;

    // if xIsNext, then place 'X'; otherwise, place 'O'
    state.board[cellNo] = state.xIsNext ? 'X' : 'O';

    // set xIsNext to the *opposite* boolean value of current xIsNext
    state.xIsNext = !state.xIsNext;
}
```

Eventually, we also need this action to check if the last move was a winning move and make additional state changes. Let's come back to that.

#### newGame

We also need an action for the "New Game" button. When a new game starts, we want to set our state back to its contents on app initialization.

```javascript
function newGame(state) {
    state.xIsNext = true;
    state.board = Array(9).fill(null);
    state.winPattern = null;
}
```

### How to Write the Render Functions

Every time we change our state, we should run a render function, which is responsible for clearing out all or parts of the DOM and then re-rendering them based only on the current state. 

The only dynamic part of our app is the board. As with state modification functions, our render function takes in the state. It then needs to generate a new HTML snippet and then fully replace the old content in the DOM with the newly generated HTML. A good approach to this is to cut the snippet of HTML from the static `index.html` that currently exists and put it into a template string. Then we can insert dynamic data from the state where appropriate:

```javascript
function renderBoard(state) {
    // renderRow function accepts start/end ids and generates a row of cells:
    const renderRow = (startId, endId) => {
        let html = '<div class="row">';
        for (let i = startId; i <= endId; i++) {
            html += `
                <div class="cell" id="${i}">
                    ${ /* insert html empty character if there's no content in array cell */ }
                    <p>${state.board[i] ? state.board[i] : '&nbsp;' }</p>
                </div>
            `;
        }
        html += '</div>';
        return html;
    };

    // run the renderRow() function for each row and concatenate into `html`
    let html = '';
    html += renderRow(0, 2);
    html += renderRow(3, 5);
    html += renderRow(6, 8);

    // insert `html` into DOM element
    $('.board').html(html);
}
```

### How to Write the Event Listeners

#### onCellClick

Working through the checklist:

  1. *Fetch data for the state mod function from the DOM (if applicable)*. This is applicable because we need to know WHICH cell was clicked. We can retrieve this from the `id` attribute on the `.cell` element.

  2. *Call a state modification function.* We need to call `setMove()` sending in the cell id.
  
  3. *Call the appropriate render function.* There's only one in this case.  

Since the board is being rendered by Javascript and not static HTML, we will need event delegation to detect a click on the cell. 

We can't control if the user clicks on the `<p>` element within the cell, or the outer area where the `<div class="cell">` is.  This means we need to use traversal with `closest()` to lock in on the `.cell` element.

```javascript
function onCellClick(event) {
    const cellId = $(event.target).closest('.cell').attr('id');
    setMove(appState, cellId);
    renderBoard(appState);
}

$('.board').on('click', '.cell', onCellClick);
```

#### onNewGameClick

Same checklist as above.  This time, we DON'T need any information from the DOM. Starting a new game has no dynamic input as there isn't some specific type of new game to start.

We also don't need event delegation as the "New Game" button is permanently on the DOM, in our static HTML.

```javascript
function onNewGameClick() {
    newGame(appState);
    renderBoard(appState);
}

$('#new-game').click(onNewGameClick);
```

### How to Check for Winning Move

We need a standalone function that can analyze the `board` array and determine if a win state has 
occurred.  Let's have the function return `null` if there's no win state; otherwise, return an array 
containing the winning cell ids.  This way we'll know if there's a winner and which cells to highlight
if there is.

Then we're going to need to call this function in our `setMove()` state modification function. And we're
also going to need to adjust our `renderBoard()` function so that it conditionally places the `.win` class
into the `.cell` element for all the winning cells.

```javascript
/**
 * Analyzes board to determine if win state occurred
 * @param {Array} board
 * @returns {Array|null} - Array of indexes that denote winning cells; null if no winner
 * */
function checkWinner(board){
    const winPatterns = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [2,4,6], [0,4,8]];

    for (let i = 0; i < winPatterns.length; i++) {
        const winPattern = winPatterns[i];

        // Prevent win with three nulls by checking first cell isn't null
        if ( !board[winPattern[0]] ) continue;

        if ( board[winPattern[0]] === board[winPattern[1]] && board[winPattern[1]] === board[winPattern[2]] ) {
            return winPattern;
        }
    }

    return null;
}
```

```javascript
function setMove(state, cellNo) {
    // [...other functionality...]

    const winPattern = checkWinner(state.board);
    if (winPattern) {
        state.winPattern = winPattern;
    }
}
```

Inside our inner `renderRow()` function's loop, we need to check for if the `cellId` exists in our
`winPattern` array:

```javascript
    // inside the renderRow() function
    // [...]
    for (let i = startId; i <= endId; i++) {
        // `winClass` is a string to be placed in the `class` attribute on the HTML element
        // it'll either be 'win' to match our css class or null if no class should be added
        const winClass = state.winPattern.includes(i) ? 'win' : null;

        html += `
            <div class="cell ${winClass}" id="${i}">
                <p>${state.board[i] ? state.board[i] : '&nbsp;' }</p>
            </div>
        `;
    }

``` 

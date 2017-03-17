![Screenshot](/../screenshots/images/ttt-image.png?raw=true)

## Learning Application State - with Tic Tac Toe!

This is an exercise for learning how to manage application state with the classic
Tic Tac Toe game. Complete the instructions below, then check your solution against
the example solution in the `solution` branch on this repo.

#### Objectives:

* When user arrives at app, they can immediately click cells to alternately place Xs and Os on each click
* When cell contains a value, clicking again will make no changes to state
* When a winning line has been created, the winning cells will highlight and no further moves can be played
* "New Game" can be clicked at any time to reset the board

#### Instructions

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

### Walkthrough

Try to follow the instructions above on your own. If you get stuck, you can reference the walkthrough below:

#### How to Build the state object

Your state is just a collection of key-value pairs like any other Javascript object. Its sole purpose is to hold information about what the user sees at any given moment. Take careful note: it **holds information** and does NOT manage the behavior of the DOM. Think about what information your Tic Tac Toe game would need at every possible moment throughout the game's lifecycle. It can help to write out a bunch of example scenarios:

1) I load the app and see a blank grid
2) I click the top-left cell and a X appears in the cell
3) I click the center-left cell and a O appears in the cell
4) I click the center-left cell and nothing happens
5) I click to cause a three-X sequence across the top row. The top cells change color.
    * Further clicks on empty cells have no effect
6) I click 'New Game' (at any time) and all cells become blank

Now build a state object that could "describe" each scenario. Scenario #1 is easy. We'll use an array to represent the nine cells in our grid, array index 0 through 8, starting them with a default `null` value.

```
// Scenario #1
{ board: Array(9).fill(null) }
```

We want scenario #2 to add the string `'X'` to array index `0`.  But how would the app know to place an `'X'` and not `'O'`?  We could read the `board` every time and know from the count of non-`null` cells which symbol to place next, but an easier option is to just create a boolean we 'flip' on every move:

```
// Scenario #2:
{ 
    board: [ 'X', null, null, null, null, null, null, null, null ],
    xIsNext: false
}
```

This makes scenario #3 straightforward:

```
// Scenario #3:
{ 
    board: [ 'X', null, null, 'O', null, null, null, null, null ],
    xIsNext: true
}
```

For scenario #4, there's nothing specific to denote in the `state` object. We just need to ensure our state modification function checks the value is `null` before it changes it to a symbol.

For scenario #5, there's two important things to handle: Identify which cells created the winning line and prevent a click in empty cells from adding new symbols. The winning line could be represented as an array of index values of the three winning cells. If that variable is `null`, then no winner has yet been found.

```
// Scenario #5:
{
    board: [ 'X', 'O', 'O', 'X', null, null, 'X', null, null ],
    xIsNext: false,
    winPattern: [0, 3, 6]
}
```

The final scenario is a reset of all the fields we now have in our state:

```
// Scenario #6
{
    board: [ null, null, null, null, null, null, null, null, null ],
    xIsNext: true,
    winPattern: null
}
```

Note, this is just one possible state solution. Arguably, `xIsNext` and `winPattern` are all extraneous as their values could be deduced from the `board` array at any given time. Deciding when to "cache" info in your state or compute it every time you need it is a pros/cons analysis we can cover later. For now, we're going with the most readable approach by using additional state properties.

#### How to write state modification functions

We know what our state looks like; now we need functions that allow us to change it. The best way to design these is map them to specific actions the user will perform in our app. 

The main action is the user clicks on a cell and the correct symbol is placed. So we want a function that will place a symbol into the appropriate index in our `board` array. Our function needs to know what cell to affect, and then based on state properties, decide whether to place an `'X'`, `'O'` or make no change.

```
function setMove(state, cellNo) {
    // if there is a winner, this action must do nothing and return
    if (state.winPattern) return;

    // if xIsNext, then place 'X'; otherwise, place 'O'
    state.board[cellNo] = state.xIsNext ? 'X' : 'O';
}
```

Eventually, we also need this action to check if the last move was a winning move and make additional state changes. Let's come back to that.

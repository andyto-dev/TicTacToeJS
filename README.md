# TicTacToeJS

## Description

This is an assignment after my upskilling on JS.

It is a game of Tic Tac Toe running in the browser, using only vanilla JavaScript and without importing external libraries.

### Requirements

- A 3x3 playing grid
- An indication of who is currently playing (Player 1 or Player 2)
- A reset/restart button to reset the grid and restart playing at any time
- When a player wins, the cells containing the winning streak should be highlighted and the game should stop - no further interactions with the grid will be possible. You can only start a new game.

### Bonus Points 

- After a game ends, offer the possibility to "review" the game. You can show some additional controls that allow going back and forward in time, in order to show all moves done by the players from the beginning of the game till the end.

### Graphical Aspect

There is no restriction or requirements on graphical aspect in this assignment. Bootstrap CSS was used to beautify the UI of the Tic Tac Toe game.

## How to Play

Simply choose a player and then start the game.

## File Structure

    .
    ├── index.html              # it is html file for displaying/ playing the game
    ├── css                     # Folder for CSS files, bootstrap CSS is used in this project
        ├── ...
    ├── js                      # The js folder holds all the javascripts used in the game
        ├── TicTacToeUI.js      # The javascript responsible for UI interaction
        ├── TicTactoeState.js   # The javascript for storing the game state and the game logic
    ├── svg                     # Folder storing svg images used
        ├── ...

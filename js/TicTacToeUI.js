import { TicTacToeState } from "./TicTacToeState.js";

const playerImages = ["svg/hollow-circle.svg", "svg/red-cross.svg"];
const playerBtns = Array.from(document.getElementsByClassName("playerBtn"));
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const resetBtn = document.getElementById("resetBtn");
// in other cases you used camelCase. Would be nice to stick to the same convention
const messageBox = document.getElementById("message-box");

// this is never reassigned. you should be able to use const.
let gameUI = Array.from(document.getElementsByClassName("game-ui"));
// 3 is a magic number. Have it in some const
let gameState = new TicTacToeState(3);

// do you need to have two for loops here?
// it seems that you went two times through the playerBtns array
// can you accomplish the same thing if you go through it once?
playerBtns.forEach(player => {
    // this event listener is anonymous which isn't the best idea if we want to use it in some other place.
    // it isn't a big deal here, and it's a good practice to have a separate function for event handling.
    // player.addEventListener('click', handlePlayerClick);
    player.addEventListener("click", (event) => {
        playerBtns.forEach(element => element.disabled = true);
        gameState.startGame(getPlayerIdFromButton(player));
        player.parentElement.classList.add("bg-current-player");
    })
});
gameUI.forEach(element => {
    // separate function for event handling.
    element.addEventListener("click", (event) => {
        if (!gameState.isGameStarted()) {
            updateMessage(createAlertMessage("alert-warning", "Please start the game by selecting a player."));
            return;
        }
        let currentPlayerId = gameState.currentPlayerId;
        // did you ever catch this error?
        // not sure if it's possible because every time that you catch a click event, it should have event.target.id
        if (!event.target.id) {
            updateMessage(createAlertMessage("alert-warning", "Please click on an empty position"));
            return;
        }
        let panel = document.getElementById(event.target.id);
        if (panel.childElementCount > 0) {
            updateMessage(createAlertMessage("alert-warning", "Please click on an empty position"));
            return;
        }
        panel.appendChild(createPlayerImage(currentPlayerId));
        let coordinate = event.target.id.match(/\d/g);
        let nextPlayerId = gameState.move(coordinate[0], coordinate[1], currentPlayerId);
        if (currentPlayerId === nextPlayerId) {
            updateMessage(createAlertMessage("alert-success", "Player " + currentPlayerId + " wins!!!"));
            changePlayerBackground(nextPlayerId, "bg-winner-player");
        }
        changePlayerBackground(nextPlayerId, "bg-current-player");
    })
});

// this is good, you have a separate function for event handling
// just a small improovement 
// you can just have undoBtn.addEventListener("click", undo);
// same for few lines below
undoBtn.addEventListener("click", () => undo());
redoBtn.addEventListener("click", () => redo());
resetBtn.addEventListener("click", () => resetGame());

// you are creating a function here. You don't want it's value to be changed. use const
let createPlayerImage = (playerId) => {
    let image = document.createElement("img");
    image.src = getPlayerImage(playerId);
    image.classList.add("mx-auto", "d-box");
    image.setAttribute("width", "200px");
    return image;
}
// const
let getPlayerImage = (playerId) => playerImages[playerId - 1];
// const
let getPlayerIdFromButton = (btn) => parseInt(btn.getAttribute("data-player-id"));
// const
let changePlayerBackground = (playerId, backgroundClass) => {
    playerBtns.forEach(player => {
        if (getPlayerIdFromButton(player) === playerId) {
            player.parentElement.classList.add(backgroundClass);
        } else {
            player.parentElement.classList.remove(backgroundClass);
        }
    })
}
// const
let clearPlayerBg = (playerBtn) => {
    Array.from(playerBtn.parentElement.classList).forEach(clazz => {
        if (clazz.startsWith("bg-")) {
            playerBtn.parentElement.classList.remove(clazz);
        }
    });
}
// const
let createAlertMessage = (alertStyle, text) => {
    let alert = document.createElement("div");
    alert.classList.add("alert", alertStyle)
    alert.setAttribute("role", "alert");
    alert.appendChild(document.createTextNode(text));
    return alert;
}
// const
let resetGame = () => {
    playerBtns.forEach(playerBtn => {
        playerBtn.disabled = false;
        clearPlayerBg(playerBtn);
        gameUI.forEach(panel => panel.childNodes.forEach(child => child.remove()));
    })
    updateMessage();
    gameState = new TicTacToeState(3);
}
// const
let undo = () => {
    let lastPlayerMove = gameState.undo();
    if (!lastPlayerMove) {
        updateMessage(createAlertMessage("alert-warning", "You don't have moves to undo."));
        return;
    }
    let lastPlayerMoveUI = document.getElementById("x"+lastPlayerMove.x+"y"+lastPlayerMove.y);
    lastPlayerMoveUI.childNodes.forEach(child => child.remove());
    changePlayerBackground(gameState.currentPlayerId, "bg-current-player");
}
// const
let redo = () => {
    let nextPlayerMove = gameState.redo();
    if (!nextPlayerMove) {
        updateMessage(createAlertMessage("alert-warning", "You don't have moves to redo."));
        return;
    }
    let nextPlayerMoveUI = document.getElementById("x"+nextPlayerMove.x+"y"+nextPlayerMove.y);
    nextPlayerMoveUI.appendChild(createPlayerImage(gameState.currentPlayerId));
    changePlayerBackground(gameState.currentPlayerId, "bg-current-player");
}
// const
let updateMessage = (alertElement) => {
    messageBox.childNodes.forEach(child => child.remove());
    if (alertElement) {
        messageBox.appendChild(alertElement);
    }
}

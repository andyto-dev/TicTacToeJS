import { TicTacToeState } from "./TicTacToeState.js";

const playerImages = ["svg/hollow-circle.svg", "svg/red-cross.svg"];
const playerBtns = Array.from(document.getElementsByClassName("playerBtn"));
const undoBtn = document.getElementById("undoBtn");
const redoBtn = document.getElementById("redoBtn");
const resetBtn = document.getElementById("resetBtn");
const messageBox = document.getElementById("message-box");

let gameUI = Array.from(document.getElementsByClassName("game-ui"));
let gameState = new TicTacToeState(3);

playerBtns.forEach(player => {
    player.addEventListener("click", (event) => {
        playerBtns.forEach(element => element.disabled = true);
        gameState.startGame(getPlayerIdFromButton(player));
        player.parentElement.classList.add("bg-current-player");
    })
});
gameUI.forEach(element => {
    element.addEventListener("click", (event) => {
        if (!gameState.isGameStarted()) {
            updateMessage(createAlertMessage("alert-warning", "Please start the game by selecting a player."));
            return;
        }
        let currentPlayerId = gameState.currentPlayerId;
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
undoBtn.addEventListener("click", () => undo());
redoBtn.addEventListener("click", () => redo());
resetBtn.addEventListener("click", () => resetGame());

let createPlayerImage = (playerId) => {
    let image = document.createElement("img");
    image.src = getPlayerImage(playerId);
    image.classList.add("mx-auto", "d-box");
    image.setAttribute("width", "200px");
    return image;
}
let getPlayerImage = (playerId) => playerImages[playerId - 1];
let getPlayerIdFromButton = (btn) => parseInt(btn.getAttribute("data-player-id"));
let changePlayerBackground = (playerId, backgroundClass) => {
    playerBtns.forEach(player => {
        if (getPlayerIdFromButton(player) === playerId) {
            player.parentElement.classList.add(backgroundClass);
        } else {
            player.parentElement.classList.remove(backgroundClass);
        }
    })
}
let clearPlayerBg = (playerBtn) => {
    Array.from(playerBtn.parentElement.classList).forEach(clazz => {
        if (clazz.startsWith("bg-")) {
            playerBtn.parentElement.classList.remove(clazz);
        }
    });
}
let createAlertMessage = (alertStyle, text) => {
    let alert = document.createElement("div");
    alert.classList.add("alert", alertStyle)
    alert.setAttribute("role", "alert");
    alert.appendChild(document.createTextNode(text));
    return alert;
}
let resetGame = () => {
    playerBtns.forEach(playerBtn => {
        playerBtn.disabled = false;
        clearPlayerBg(playerBtn);
        gameUI.forEach(panel => panel.childNodes.forEach(child => child.remove()));
    })
    updateMessage();
    gameState = new TicTacToeState(3);
}
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
let updateMessage = (alertElement) => {
    messageBox.childNodes.forEach(child => child.remove());
    if (alertElement) {
        messageBox.appendChild(alertElement);
    }
}

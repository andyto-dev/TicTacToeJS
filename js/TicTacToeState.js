export class TicTacToeState {
    constructor(size) {
        this.size = size;
        this.moves = [];
        this.undoMoves = [];
        this.currentPlayerId = -1;
    }

    winHorizontal = (steps, player) => {
        for (let y = 0; y < this.size; y++) {
            if (steps.filter(step => step.y === y && step.player === player).length === 3) {
                console.log("win horizontally");
                return true;
            }
        }
    }
    winVertical = (steps, player) => {
        for (let x = 0; x < this.size; x++) {
            if (steps.filter(step => step.x === x && step.player === player).length === 3) {
                console.log("win vertically");
                return true;
            }
        }
    }
    winDiagonal = (steps, player) => {
        return steps.filter(step => step.x === step.y && step.player === player).length === 3 ||
            steps.filter(step => step.x + step.y === this.size - 1 && step.player === player).length === 3;
    }
    startGame = (playerId) => this.currentPlayerId = playerId;
    isGameStarted = () => this.currentPlayerId > 0;
    switchPlayer = () => {
        switch(this.currentPlayerId) {
            case 1:
                this.currentPlayerId = 2;
                break;
            case 2:
                this.currentPlayerId = 1;
                break;
            case -1:
            default:
        }
        return this.currentPlayerId
    }
    move = (x,y,playerId) => {
        this.moves.push(new PlayerMove(x, y, playerId));
        if (this.checkWinner()) {
            let playerWon = this.currentPlayerId;
            this.currentPlayerId = -1;
            return playerWon;
        } else {
            this.switchPlayer();
            return this.currentPlayerId;
        }
    }
    checkWinner = () => {
        return this.winHorizontal(this.moves, this.currentPlayerId) || this.winVertical(this.moves, this.currentPlayerId) || this.winDiagonal(this.moves, this.currentPlayerId);
    }
    undo = () => {
        return this.undoRedo(this.moves, this.undoMoves);
    }
    redo = () => {
        return this.undoRedo(this.undoMoves, this.moves);
    }
    undoRedo = (popArray, pushArray) => {
        if (!this.isGameStarted() || popArray.length <= 0) {
            return;
        }
        let playerMove = popArray.pop();
        this.currentPlayerId = playerMove.player;
        pushArray.push(playerMove);
        return playerMove;
    }
}

class PlayerMove {
    constructor(x, y, player) {
        this.x = parseInt(x);
        this.y = parseInt(y);
        this.player = player;
    }
}
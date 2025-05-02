class Player {
    name: string;
    position: number;
    isBot: boolean


    constructor(name: string, isBot: boolean) {
        this.name = name;
        this.position = 0;
        this.isBot = isBot;
    }
}

class Board {
    snakesAndLadders: Record<number, number>;

    constructor() {
        this.snakesAndLadders = {
            3: 22,
            5: 8,
            17: 4,
            19: 7,
            27: 1
        };
    }

    getNewPosition(position: number): number {
        return this.snakesAndLadders[position] || position;
    }
}
class Dice {

    roll(): number {
        return Math.floor(Math.random() * 6) + 1;
    }
}

export class Game {
    players: Player[];
    board: Board;
    dice: Dice;
    currentPlayerIndex: number;
    gameOver: boolean;


    constructor(playerNames: string[]) {
        this.players = playerNames.map((name, index) => new Player(name, index !== 0)); // First player is human
        this.board = new Board();
        this.dice = new Dice();
        this.currentPlayerIndex = 0;
        this.gameOver = false;
    }




    start(): void {
        console.info("Game Started")

        while (!this.gameOver) {
            this.runGame();
        }

    }


    runGame(): void {

        const currentPlayer = this.players[this.currentPlayerIndex];
        const diceValue = this.dice.roll();

        if (currentPlayer.position === 0 && diceValue != 6 || diceValue != 1) {
            // turn the player
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        }
        let newPosition = currentPlayer.position + diceValue;

        // Prevent overshooting position 100
        if (newPosition > 100) {
            console.log(`${currentPlayer.name} rolled ${diceValue} but can't move.`);
        } else {
            newPosition = this.board.getNewPosition(newPosition);

            // Log if a snake or ladder is encountered
            if (newPosition !== currentPlayer.position + diceValue) {
                console.log(
                    `${currentPlayer.name} encountered a ${newPosition > currentPlayer.position ? "ladder" : "snake"
                    }! Moving to ${newPosition}.`
                );
            }

            currentPlayer.position = newPosition;
        }

        console.log(`${currentPlayer.name} is now at position ${currentPlayer.position}`);

        // Check for win condition
        if (currentPlayer.position === 100) {
            this.gameOver = true;
            console.log(`${currentPlayer.name} wins the game!`);
        }

        // Switch to the next player
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;


    }



}


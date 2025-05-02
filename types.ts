
export type ladder = [number, number]
export type snake = [number, number]

export type board = {
    ladders: ladder[],
    snakes: snake[],
    boardSize: number,
    board: number[],
}

export type player = {
    name: string,
    score: number,
    position: number,
}

export type game = {
    board: board,
    player1: player,
    player2: player,
}

export type dice = {
    value: number,
    isRolled: boolean,
}

export type boardState = {
    board: number[],
    ladders: ladder[],
    snakes: snake[],
}


// types/index.ts
export type Player = 'user' | 'bot';

export interface PositionMap {
    [key: number]: number;
}

export interface GameRules {
    ladders: PositionMap;
    snakes: PositionMap;
}

export interface GameState {
    userPosition: number;
    botPosition: number;
    userStarted: boolean;
    botStarted: boolean;
    currentTurn: Player;
    diceValue: number | null;
    gameOver: boolean;
    winner: Player | null;
    message: string;
}

export interface player {
    id: string;
    name: string;
    diceValue: number;
    position: number;
    started: boolean;
}
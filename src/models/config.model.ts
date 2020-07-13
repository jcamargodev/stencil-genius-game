import { GameStateType } from './game-state.model';

export interface ConfigGame {
    multiplyDifficulty: number;
    multiplyTime: number;
    minTime: number;
}

export interface GameData {
    gameState: GameStateType;
    score: number;
    personalRecord: number;
    remainingTime: number;
    config: ConfigGame;
}

import { GameStateType } from './game-state.model';

export interface ConfigGame {
    multiplyDifficulty: number;
    multiplyTime: number;
    minTime: number;
}

export interface GameData {
    gameState: GameStateType;
    difficulty: number;
    score: number;
    personalRecord: number;
    remainingTime: number;
    config: ConfigGame;
}

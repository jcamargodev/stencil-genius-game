import { ConfigGame, GameData } from '../models/config.model';

export const ConfigGameMock: ConfigGame = {
    multiplyDifficulty: 0.75,
    multiplyTime: 3,
    minTime: 10,
};

export const GameDataMock: GameData = {
    gameState: 'new',
    difficulty: 1,
    score: 0,
    personalRecord: 0,
    remainingTime: 0,
    config: ConfigGameMock,
};

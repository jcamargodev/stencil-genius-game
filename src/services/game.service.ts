import { BehaviorSubject, Observable, timer, Subject } from 'rxjs';
import { takeUntil, shareReplay } from 'rxjs/operators';

import { ButtonService } from './button.service';

import { GameDataMock } from '../mocks/config.mock';
import { GameStateType } from '../models/game-state.model';
import { ConfigGame } from '../models/config.model';

class GamerClass {
    private _sequence: number[] = [];
    private _input: number[] = [];
    private _onDestroy: Subject<null> = new Subject();
    private gameState$$: BehaviorSubject<GameStateType> = new BehaviorSubject(GameDataMock.gameState);
    private difficulty$$: BehaviorSubject<number> = new BehaviorSubject(GameDataMock.difficulty);
    private score$$: BehaviorSubject<number> = new BehaviorSubject(GameDataMock.score);
    private personalRecord$$: BehaviorSubject<number> = new BehaviorSubject(GameDataMock.personalRecord);
    private remainingTime$$: BehaviorSubject<number> = new BehaviorSubject(GameDataMock.remainingTime);
    private config$$: BehaviorSubject<ConfigGame> = new BehaviorSubject(GameDataMock.config);
    private config: ConfigGame;
    private buttons: HTMLGeniusButtonElement[];

    public gameState$: Observable<GameStateType> = this.gameState$$
        .asObservable()
        .pipe(shareReplay(), takeUntil(this._onDestroy));
    public difficulty$: Observable<number> = this.difficulty$$
        .asObservable()
        .pipe(shareReplay(), takeUntil(this._onDestroy));
    public score$: Observable<number> = this.score$$.asObservable().pipe(shareReplay(), takeUntil(this._onDestroy));
    public personalRecord$: Observable<number> = this.personalRecord$$
        .asObservable()
        .pipe(shareReplay(), takeUntil(this._onDestroy));
    public remainingTime$: Observable<number> = this.remainingTime$$
        .asObservable()
        .pipe(shareReplay(), takeUntil(this._onDestroy));
    public config$: Observable<ConfigGame> = this.config$$
        .asObservable()
        .pipe(shareReplay(), takeUntil(this._onDestroy));

    constructor() {
        this.config$.pipe(takeUntil(this._onDestroy)).subscribe((config: ConfigGame) => (this.config = config));
        ButtonService.buttons$
            .pipe(takeUntil(this._onDestroy))
            .subscribe((buttons: HTMLGeniusButtonElement[]) => (this.buttons = buttons));
    }

    public startGame() {
        this.gameState$$.next('memorize');
        this._input = [];
        timer(1000).subscribe(() => {
            const randomButton = Math.round(Math.random() * 3);
            this._renderSequence(randomButton);
        });
    }

    public checkSequence(input: number) {
        this._input = [...this._input, ...[input]];
        const currentIndex = this._input.length - 1;
        if (this._sequence[currentIndex] === input) {
            this._input.length === this._sequence.length && this._nextSequence();
            return true;
        } else {
            this._gameOver();
            return false;
        }
    }

    public destroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    public resetGame() {
        this._input = [];
        this._sequence = [];
        this.gameState$$.next('new');
        this.score$$.next(0);
        this.difficulty$$.next(1);
        this.remainingTime$$.next(0);
    }

    private _renderSequence(lastSequence: number) {
        const time = 1000 * this.config.multiplyDifficulty;
        this._sequence = [...this._sequence, ...[lastSequence]];
        this._sequence.forEach((sequence, index) => {
            timer(index * time).subscribe(() => {
                this.buttons[sequence].press();
            });
        });
        timer(this._sequence.length * time).subscribe(() => {
            this.gameState$$.next('playing');
            this.remainingTime$$.next(this._generateRemainingTime());
        });
    }

    private _nextSequence() {
        this.gameState$$.next('next-sequence');
        timer(2000).subscribe(() => {
            this.startGame();
        });
    }

    private _gameOver() {
        this.gameState$$.next('game-over');
        timer(1000).subscribe(() => {
            this.resetGame();
        });
    }

    private _generateRemainingTime(): number {
        const remaining = Math.round(this._sequence.length * this.config.multiplyTime);
        return remaining >= this.config.minTime ? remaining : this.config.minTime;
    }
}

export const GameService = new GamerClass();

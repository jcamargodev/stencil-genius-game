import { BehaviorSubject, interval, Observable, timer, Subject, Subscription } from 'rxjs';
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
    private score$$: BehaviorSubject<number> = new BehaviorSubject(GameDataMock.score);
    private score: number;
    private personalRecord$$: BehaviorSubject<number> = new BehaviorSubject(
        parseInt(window.localStorage.getItem('personalRecord')) || 0,
    );
    private personalRecord: number;
    private remainingTime$$: BehaviorSubject<number> = new BehaviorSubject(GameDataMock.remainingTime);
    private remainingTime: number;
    private config$$: BehaviorSubject<ConfigGame> = new BehaviorSubject(GameDataMock.config);
    private config: ConfigGame;
    private buttons: (HTMLGeniusButtonElement | HTMLGeniusCenterButtonElement)[];
    private remainingInterval: Subscription;

    public gameState$: Observable<GameStateType> = this.gameState$$
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
        this.score$.pipe(takeUntil(this._onDestroy)).subscribe((score: number) => (this.score = score));
        this.personalRecord$
            .pipe(takeUntil(this._onDestroy))
            .subscribe((personalRecord: number) => (this.personalRecord = personalRecord));
        this.remainingTime$
            .pipe(takeUntil(this._onDestroy))
            .subscribe((remainingTime: number) => (this.remainingTime = remainingTime));
        ButtonService.buttons$
            .pipe(takeUntil(this._onDestroy))
            .subscribe(
                (buttons: (HTMLGeniusButtonElement | HTMLGeniusCenterButtonElement)[]) => (this.buttons = buttons),
            );
    }

    public startGame() {
        this.remainingInterval?.unsubscribe();
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
        this.remainingTime$$.next(0);
        this.remainingInterval?.unsubscribe();
    }

    private _renderSequence(lastSequence: number) {
        const time = 1000 * this.config.multiplyDifficulty;
        this._sequence = [...this._sequence, ...[lastSequence]];
        this._sequence.forEach((sequence, index) => {
            timer(index * time).subscribe(() => {
                (this.buttons[sequence] as HTMLGeniusButtonElement).press();
            });
        });
        timer(this._sequence.length * time).subscribe(() => {
            this.gameState$$.next('playing');
            this.remainingTime$$.next(this._generateRemainingTime());
            this.remainingInterval = interval(1000).subscribe(() => {
                if (this.remainingTime > 0) {
                    this.remainingTime$$.next(this.remainingTime - 1);
                } else {
                    this._gameOver(true);
                }
            });
        });
    }

    private _nextSequence() {
        this.score$$.next(this.score + 1);
        this.gameState$$.next('next-sequence');
        timer(1000).subscribe(() => {
            this.startGame();
        });
    }

    private _gameOver(isTimeout: boolean = false) {
        isTimeout ? this.gameState$$.next('timeout') : this.gameState$$.next('game-over');
        this.buttons.forEach((button) => {
            (button as HTMLGeniusButtonElement)?.press && (button as HTMLGeniusButtonElement)?.press();
        });
        if (this.score > this.personalRecord) {
            window.localStorage.setItem('personalRecord', this.score.toString());
            this.personalRecord$$.next(this.score);
            timer(1000).subscribe(() => {
                this.gameState$$.next('record');
            });
            timer(3000).subscribe(() => {
                this.resetGame();
            });
        } else {
            timer(1000).subscribe(() => {
                this.resetGame();
            });
        }
    }

    private _generateRemainingTime(): number {
        const remaining = Math.round(this._sequence.length * this.config.multiplyTime);
        return remaining >= this.config.minTime ? remaining : this.config.minTime;
    }
}

export const GameService = new GamerClass();

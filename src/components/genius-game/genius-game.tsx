import { Component, Host, h, State } from '@stencil/core';
import { Subject, timer } from 'rxjs';
import classnames from 'classnames';

import { PlayStateType } from '../../models/play-state.model';

enum OrderButton {
    'redButton',
    'greenButton',
    'blueButton',
    'yellowButton',
}

interface ConfigGame {
    multiplyDifficulty: number;
    multiplyTime: number;
    minTime: number;
}

const config: ConfigGame = {
    multiplyDifficulty: 0.75,
    multiplyTime: 3,
    minTime: 10,
};

@Component({
    tag: 'genius-game',
    styleUrl: 'genius-game.scss',
    shadow: true,
})
export class GeniusGame {
    private redButton: HTMLGeniusButtonElement;
    private greenButton: HTMLGeniusButtonElement;
    private blueButton: HTMLGeniusButtonElement;
    private yellowButton: HTMLGeniusButtonElement;

    private sequence$: Subject<number> = new Subject();
    private sequence: number[] = [];
    private input$: Subject<number> = new Subject();
    private input: number[] = [];

    @State() playState: PlayStateType = 'new';
    @State() difficulty: number = 1;
    @State() score: number = 0;
    @State() personalRecord: number = 0;
    @State() remainingTime: number = 0;
    @State() config: ConfigGame = config;

    constructor() {
        this.redButtonRef = this.redButtonRef.bind(this);
        this.greenButtonRef = this.greenButtonRef.bind(this);
        this.blueButtonRef = this.blueButtonRef.bind(this);
        this.yellowButtonRef = this.yellowButtonRef.bind(this);
        this.handlePlayButton = this.handlePlayButton.bind(this);
        this.handleButton = this.handleButton.bind(this);
    }

    componentDidLoad() {
        this.redButton.addEventListener('click', () => {});
        this.greenButton.addEventListener('click', () => {});
        this.blueButton.addEventListener('click', () => {});
        this.yellowButton.addEventListener('click', () => {});

        this.sequence$.asObservable().subscribe((sequence) => this.renderSequence(sequence));
        this.input$.asObservable().subscribe((input) => this.checkSequence(input));
    }

    private redButtonRef(c: HTMLGeniusButtonElement) {
        this.redButton = c;
    }

    private greenButtonRef(c: HTMLGeniusButtonElement) {
        this.greenButton = c;
    }

    private blueButtonRef(c: HTMLGeniusButtonElement) {
        this.blueButton = c;
    }

    private yellowButtonRef(c: HTMLGeniusButtonElement) {
        this.yellowButton = c;
    }

    private handlePlayButton() {
        this.startGame();
    }

    private startGame() {
        this.input$ = new Subject();
        this.input$.asObservable().subscribe((input) => this.checkSequence(input));
        this.input = [];
        this.playState = 'memorize';
        timer(1000).subscribe(() => {
            const randomButton = Math.round(Math.random() * 3);
            this.sequence$.next(randomButton);
        });
    }

    private renderSequence(sequence: number) {
        const time = 1000 * this.config.multiplyDifficulty;
        this.sequence = [...this.sequence, ...[sequence]];
        this.sequence.forEach((sequence, index) => {
            timer(index * time).subscribe(() => {
                (this[`${OrderButton[sequence]}`] as HTMLGeniusButtonElement).press();
            });
        });
        timer(this.sequence.length * time).subscribe(() => {
            const remaining = Math.round(this.sequence.length * this.config.multiplyTime);
            this.playState = 'playing';
            this.remainingTime = remaining >= this.config.minTime ? remaining : this.config.minTime;
        });
    }

    private checkSequence(input: number) {
        this.input = [...this.input, ...[input]];
        const currentIndex = this.input.length - 1;
        console.log('sequence', this.sequence);
        console.log('input', this.input);
        if (this.sequence[currentIndex] === input) {
            this.input.length === this.sequence.length && this.startGame();
            return true;
        } else {
            this.handleError();
            return false;
        }
    }

    private handleButton(ev: CustomEvent<number>) {
        this.playState === 'playing' && this.input$.next(ev?.detail);
    }

    private handleError() {
        this.playState = 'game-over';
        timer(2000).subscribe(() => {
            this.resetGame();
        });
    }

    private resetGame() {
        this.sequence$ = new Subject();
        this.sequence$.asObservable().subscribe((sequence) => this.renderSequence(sequence));
        this.sequence = [];
        this.input$ = new Subject();
        this.input$.asObservable().subscribe((input) => this.checkSequence(input));
        this.input = [];
        this.playState = 'new';
        this.score = 0;
        this.difficulty = 1;
        this.remainingTime = 0;
    }

    private getYear() {
        return new Date().getFullYear();
    }

    render() {
        return (
            <Host>
                <header class="header">
                    <h1 class="header__title">Genius</h1>
                </header>
                <div class="game">
                    <div
                        class={classnames('genius', {
                            '--disabled': this.playState === 'memorize',
                        })}
                    >
                        <div class="genius__container">
                            <genius-button
                                type="top-left"
                                ref={this.redButtonRef}
                                onPress={this.handleButton}
                            ></genius-button>
                            <genius-button
                                type="top-right"
                                ref={this.greenButtonRef}
                                onPress={this.handleButton}
                            ></genius-button>
                            <genius-button
                                type="bottom-left"
                                ref={this.blueButtonRef}
                                onPress={this.handleButton}
                            ></genius-button>
                            <genius-button
                                type="bottom-right"
                                ref={this.yellowButtonRef}
                                onPress={this.handleButton}
                            ></genius-button>
                            <genius-center-button
                                action={this.playState}
                                remainingTime={this.remainingTime}
                                /**
                                 * onClick={this.handlePlayButton}
                                 *
                                 * Esse é o jeito mais fácil de fazer, mas precisamos explorar um pouco mais a API do Stencil e
                                 * fazer um outro tipo de solução que é tão performático quanto mas com um pouco mais de código,
                                 * sendo assim, podendo ter mais controle da entrada e saída do evento
                                 *
                                 */
                                onPress={this.handlePlayButton}
                            ></genius-center-button>
                        </div>
                    </div>
                </div>
                <aside class="score">
                    <genius-score label="Placar atual" score={this.score.toString()}></genius-score>
                    <genius-score label="Recorde pessoal" score={this.personalRecord.toString()}></genius-score>
                </aside>
                <footer class="footer">&copy; {this.getYear()} - PicPay Games</footer>
            </Host>
        );
    }
}

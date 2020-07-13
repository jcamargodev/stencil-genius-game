import { Component, Element, Host, h, State } from '@stencil/core';
import { Subject } from 'rxjs';
import classnames from 'classnames';

import { GameService } from '../../services/game.service';
import { ButtonService } from '../../services/button.service';

import { GameStateType } from '../../models/game-state.model';
import { takeUntil } from 'rxjs/operators';

@Component({
    tag: 'genius-game',
    styleUrl: 'genius-game.scss',
    shadow: true,
})
export class GeniusGame {
    private _onDestroy: Subject<null> = new Subject();

    @Element() host: HTMLGeniusGameElement;

    @State() gameState: GameStateType;
    @State() remainingTime: number;
    @State() score: number;
    @State() personalRecord: number;

    constructor() {
        this.onPressPlayButton = this.onPressPlayButton.bind(this);
        this.onPressButton = this.onPressButton.bind(this);
    }

    connectedCallback() {
        GameService.gameState$.pipe(takeUntil(this._onDestroy)).subscribe((gameState) => (this.gameState = gameState));
        GameService.score$.pipe(takeUntil(this._onDestroy)).subscribe((score) => (this.score = score));
        GameService.remainingTime$
            .pipe(takeUntil(this._onDestroy))
            .subscribe((remainingTime) => (this.remainingTime = remainingTime));
        GameService.personalRecord$
            .pipe(takeUntil(this._onDestroy))
            .subscribe((personalRecord) => (this.personalRecord = personalRecord));
    }

    componentDidLoad() {
        ButtonService.setButtons([
            this.host.shadowRoot.querySelector('genius-button.--top-left') as HTMLGeniusButtonElement,
            this.host.shadowRoot.querySelector('genius-button.--top-right') as HTMLGeniusButtonElement,
            this.host.shadowRoot.querySelector('genius-button.--bottom-left') as HTMLGeniusButtonElement,
            this.host.shadowRoot.querySelector('genius-button.--bottom-right') as HTMLGeniusButtonElement,
            this.host.shadowRoot.querySelector('genius-center-button') as HTMLGeniusCenterButtonElement,
        ]);
    }

    disconnectedCallback() {
        this._onDestroy.next();
        this._onDestroy.complete();
        GameService.destroy();
    }

    onPressPlayButton() {
        GameService.startGame();
    }

    onPressButton(ev: CustomEvent<number>) {
        this.gameState === 'playing' && GameService.checkSequence(ev?.detail);
    }

    getYear() {
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
                            '--disabled': this.gameState === 'memorize',
                        })}
                    >
                        <div class="genius__container">
                            <genius-button type="top-left" onPress={this.onPressButton} buttonId={0}></genius-button>
                            <genius-button type="top-right" onPress={this.onPressButton} buttonId={1}></genius-button>
                            <genius-button type="bottom-left" onPress={this.onPressButton} buttonId={2}></genius-button>
                            <genius-button
                                type="bottom-right"
                                onPress={this.onPressButton}
                                buttonId={3}
                            ></genius-button>
                            <genius-center-button
                                action={this.gameState}
                                remainingTime={this.remainingTime}
                                onPress={this.onPressPlayButton}
                            ></genius-center-button>
                        </div>
                    </div>
                </div>
                <aside class="score">
                    <genius-score
                        label={
                            this.score > this.personalRecord && this.personalRecord !== 0
                                ? 'Novo recorde'
                                : 'Placar atual'
                        }
                        score={this.score?.toString()}
                    ></genius-score>
                    <genius-score
                        label={
                            this.score > this.personalRecord && this.personalRecord !== 0
                                ? 'Recorde anterior'
                                : 'Recorde pessoal'
                        }
                        score={this.personalRecord?.toString()}
                    ></genius-score>
                </aside>
                <footer class="footer">&copy; {this.getYear()} - PicPay Games</footer>
            </Host>
        );
    }
}

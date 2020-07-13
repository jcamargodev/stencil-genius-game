import { Component, Element, Event, EventEmitter, Listen, Host, h, Method, Prop, State } from '@stencil/core';
import { takeUntil } from 'rxjs/operators';
import { timer, Subject } from 'rxjs';
import classnames from 'classnames';

import { GameService } from '../../services/game.service';
import { ButtonService } from '../../services/button.service';

import { GameStateType } from '../../models/game-state.model';
import { ButtonType } from './../../models/button.model';
import { ButtonMock } from './../../mocks/button.mock';

@Component({
    tag: 'genius-button',
    styleUrl: 'genius-button.scss',
    shadow: false,
})
export class GeniusButton {
    private audio: HTMLAudioElement;
    private gameState: GameStateType;
    private _buttons: (HTMLGeniusButtonElement | HTMLGeniusCenterButtonElement)[] = [];
    private _onDestroy: Subject<null> = new Subject();
    private _a11yActions = {
        Tab: () => this._buttons[4]?.focus(),
        Space: () => this.gameState !== 'memorize' && this.press(false, true),
        Enter: () => this.gameState !== 'memorize' && this.press(false, true),
        ArrowUp: () => this._buttonA11yMoveUp(),
        ArrowRight: () => this._buttonA11yMoveRight(),
        ArrowDown: () => this._buttonA11yMoveDown(),
        ArrowLeft: () => this._buttonA11yMoveLeft(),
    };

    @Element() host: HTMLGeniusButtonElement;

    @Listen('keydown')
    handleKeyDown(ev: KeyboardEvent) {
        ev.preventDefault();
        ev.stopPropagation();
        this._a11yActions[ev.code] && this._a11yActions[ev.code]();
    }

    @State() pressed: boolean = false;

    /**
     * type
     */
    @Prop() type: ButtonType = 'bottom-right';

    /**
     * buttonId
     */
    @Prop() buttonId!: number;

    /**
     * press
     */
    @Event({ eventName: 'press' }) onPress: EventEmitter<number>;

    /**
     * press
     */
    @Method()
    async press(playSound: boolean = true, handleClick: boolean = false) {
        return new Promise((res) => {
            this.pressed = true;
            playSound && this._playSound();
            handleClick && this.handleClick();
            timer(1000).subscribe(() => {
                this.pressed = false;
                return res();
            });
        });
    }

    constructor() {
        this.handleClick = this.handleClick.bind(this);
    }

    connectedCallback() {
        ButtonService.buttons$
            .pipe(takeUntil(this._onDestroy))
            .subscribe((buttons: HTMLGeniusButtonElement[]) => (this._buttons = buttons));

        GameService.gameState$.pipe(takeUntil(this._onDestroy)).subscribe((gameState) => (this.gameState = gameState));
    }

    componentDidLoad() {
        this.audio = this.host.querySelector('audio');
    }

    disconnectedCallback() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    public handleClick() {
        this._playSound();
        this.onPress.emit(ButtonMock[this.type].index);
    }

    private _playSound() {
        this.audio.pause;
        this.audio.currentTime = 0;
        this.audio.play();
    }

    private _buttonA11yMoveUp() {
        this.buttonId === 2 && this._buttons[0].focus();
        this.buttonId === 3 && this._buttons[1].focus();
    }

    private _buttonA11yMoveRight() {
        this.buttonId === 0 && this._buttons[1].focus();
        this.buttonId === 2 && this._buttons[3].focus();
    }

    private _buttonA11yMoveDown() {
        this.buttonId === 0 && this._buttons[2].focus();
        this.buttonId === 1 && this._buttons[3].focus();
    }

    private _buttonA11yMoveLeft() {
        this.buttonId === 1 && this._buttons[0].focus();
        this.buttonId === 3 && this._buttons[2].focus();
    }

    render() {
        return (
            <Host
                class={classnames(`genius__button --${this.type}`, {
                    '--pressed': this.pressed,
                })}
                onClick={this.handleClick}
                tabIndex={this.gameState === 'memorize' ? -1 : 0}
            >
                <audio src={`assets/sounds/${ButtonMock[this.type].sound}.mp3`}></audio>
                <div class="genius__button__focus-feedback"></div>
            </Host>
        );
    }
}

import { Component, Element, Event, EventEmitter, Host, h, Method, Prop, State } from '@stencil/core';
import classnames from 'classnames';
import { timer } from 'rxjs';

import { ButtonType } from './../../models/button.model';
import { ButtonMock } from './../../mocks/button.mock';

@Component({
    tag: 'genius-button',
    styleUrl: 'genius-button.scss',
    shadow: false,
})
export class GeniusButton {
    private audio: HTMLAudioElement;

    @Element() host: HTMLGeniusButtonElement;

    @State() pressed: boolean = false;

    /**
     * type
     */
    @Prop() type: ButtonType = 'bottom-right';

    /**
     * press
     */
    @Event({ eventName: 'press' }) onPress: EventEmitter<number>;

    /**
     * press
     */
    @Method()
    async press(playSound: boolean = true) {
        return new Promise((res) => {
            requestAnimationFrame(() => {
                this.pressed = true;
            });
            playSound && this.playSound();
            timer(1000).subscribe(() => {
                requestAnimationFrame(() => {
                    this.pressed = false;
                });
                return res();
            });
        });
    }

    constructor() {
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidLoad() {
        this.audio = this.host.querySelector('audio');
    }

    private handleClick() {
        this.playSound();
        this.onPress.emit(ButtonMock[this.type].index);
    }

    private playSound() {
        this.audio.pause;
        this.audio.currentTime = 0;
        this.audio.play();
    }

    render() {
        return (
            <Host
                class={classnames(`genius__button --${this.type}`, {
                    '--pressed': this.pressed,
                })}
                onClick={this.handleClick}
            >
                <audio src={`assets/sounds/${ButtonMock[this.type].sound}.mp3`}></audio>
            </Host>
        );
    }
}

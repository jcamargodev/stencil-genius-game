import { Component, Element, Event, EventEmitter, Host, h, Method, Prop, State } from '@stencil/core';
import classnames from 'classnames';
import { timer } from 'rxjs';

import { ButtonType } from './../../models/button-type.model';

enum ButtonSound {
    'top-left' = 'red',
    'top-right' = 'green',
    'bottom-left' = 'blue',
    'bottom-right' = 'yellow',
}

enum ButtonIndex {
    'top-left' = 0,
    'top-right' = 1,
    'bottom-left' = 2,
    'bottom-right' = 3,
}

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

    /**
     * press
     */
    @Event({ eventName: 'press' }) onPress: EventEmitter<number>;

    constructor() {
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidLoad() {
        this.audio = this.host.querySelector('audio');
    }

    private playSound() {
        this.audio.pause;
        this.audio.currentTime = 0;
        this.audio.play();
    }

    private handleClick() {
        this.playSound();
        this.onPress.emit(ButtonIndex[this.type]);
    }

    render() {
        return (
            <Host
                class={classnames(`genius__button --${this.type}`, {
                    '--pressed': this.pressed,
                })}
                onClick={this.handleClick}
            >
                <audio src={`assets/sounds/${ButtonSound[this.type]}.mp3`}></audio>
            </Host>
        );
    }
}

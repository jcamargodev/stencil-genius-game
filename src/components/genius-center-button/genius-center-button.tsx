import { Component, Event, Host, h, Prop, EventEmitter, Listen } from '@stencil/core';
import classnames from 'classnames';

import { PlayStateType } from './../../models/play-state.model';
import { PlayStateMock } from './../../mocks/play-state.mock';

@Component({
    tag: 'genius-center-button',
    styleUrl: 'genius-center-button.scss',
    shadow: false,
})
export class GeniusCenterButton {
    @Listen('click')
    handleClick() {
        this.action === 'new' && this.press.emit();
    }

    /**
     * action
     */
    @Prop() action: PlayStateType = 'new';

    /**
     * action
     */
    @Prop() remainingTime: number = 0;

    /**
     * press
     */
    @Event() press: EventEmitter<null>;

    render() {
        return (
            <Host
                class={classnames(`genius__action --${this.action}`, {
                    '--disabled': this.action !== 'new',
                    '--countdown': this.action === 'playing',
                })}
            >
                {Object.entries(PlayStateMock).map((playState) => (
                    <span class={classnames(`genius__action__label --${playState[0]}`)}>{playState[1].title}</span>
                ))}
                <span class="genius__action__countdown">{this.remainingTime}</span>
            </Host>
        );
    }
}

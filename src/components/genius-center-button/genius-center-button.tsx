import { Component, Event, Host, h, Prop, EventEmitter, Listen, State, Watch } from '@stencil/core';
import classnames from 'classnames';

import { GameStateType } from './../../models/game-state.model';
import { PlayStateMock } from './../../mocks/game-state.mock';

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
    @Prop() action: GameStateType = 'new';
    @Watch('action')
    watchAction(action: string, oldAction: string) {
        if (action !== oldAction) {
            const labelName = PlayStateMock[action]?.title;
            this.label = labelName.length > 0 ? labelName : this.label;
        }
    }

    /**
     * remainingTime
     */
    @Prop() remainingTime: number = 0;

    /**
     * press
     */
    @Event() press: EventEmitter<null>;

    @State() label: string = 'Começar';

    render() {
        return (
            <Host
                class={classnames(`genius__action --${this.action}`, {
                    '--disabled': this.action !== 'new',
                    '--countdown': this.action === 'playing',
                })}
            >
                <span class="genius__action__countdown">{this.remainingTime}</span>
                <span class={classnames(`genius__action__label`)}>{this.label}</span>
            </Host>
        );
    }
}

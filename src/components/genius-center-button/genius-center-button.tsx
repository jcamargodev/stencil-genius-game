import { Component, Event, Host, h, Prop, Element, EventEmitter, Listen, State, Watch } from '@stencil/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import classnames from 'classnames';

import { ButtonService } from '../../services/button.service';

import { GameStateType } from './../../models/game-state.model';
import { PlayStateMock } from './../../mocks/game-state.mock';

@Component({
    tag: 'genius-center-button',
    styleUrl: 'genius-center-button.scss',
    shadow: false,
})
export class GeniusCenterButton {
    private _buttons: (HTMLGeniusButtonElement | HTMLGeniusCenterButtonElement)[] = [];
    private _onDestroy: Subject<null> = new Subject();
    private _a11yActions = {
        Tab: () => this._buttons[0]?.focus(),
        Space: () => this.handleClick(),
        Enter: () => this.handleClick(),
    };

    @Element() host: HTMLGeniusCenterButtonElement;

    @Listen('click')
    handleClick() {
        this.action === 'new' && this.press.emit();
    }

    @Listen('keydown')
    handleKeyDown(ev: KeyboardEvent) {
        ev.preventDefault();
        ev.stopPropagation();
        this._a11yActions[ev.code]();
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

    @State() label: string = 'Iniciar';

    connectedCallback() {
        ButtonService.buttons$
            .pipe(takeUntil(this._onDestroy))
            .subscribe((buttons: HTMLGeniusButtonElement[]) => (this._buttons = buttons));
    }

    disconnectedCallback() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    render() {
        return (
            <Host
                class={classnames(`genius__action --${this.action}`, {
                    '--disabled': this.action !== 'new',
                    '--countdown': this.action === 'playing',
                })}
                tabIndex={0}
            >
                <span class="genius__action__countdown">{this.remainingTime}</span>
                <span class={classnames(`genius__action__label`)}>{this.label}</span>
            </Host>
        );
    }
}

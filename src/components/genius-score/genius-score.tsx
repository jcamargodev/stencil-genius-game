import { Component, Host, h, Prop } from '@stencil/core';

@Component({
    tag: 'genius-score',
    styleUrl: 'genius-score.scss',
    shadow: false,
})
export class GeniusScore {
    /**
     * label
     */
    @Prop() score: string = '0';

    /**
     * label
     */
    @Prop() label: string = '';

    render() {
        return (
            <Host class="score__card">
                <div class="score__card__value">{this.score}</div>
                <div class="score__card__label">{this.label}</div>
            </Host>
        );
    }
}

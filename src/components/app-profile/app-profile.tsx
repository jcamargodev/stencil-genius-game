import { Component, Prop, State, h, Host } from '@stencil/core';
import { sayHello } from '../../helpers/utils';
import { ToggleChangeEventDetail } from '@ionic/core';

@Component({
    tag: 'app-profile',
    styleUrl: 'app-profile.scss',
})
export class AppProfile {
    /**
     * name
     */
    @Prop() name: string;

    @State() state = false;

    constructor() {
        this.toggleHandleChange = this.toggleHandleChange.bind(this);
    }

    formattedName(): string {
        if (this.name?.length > 0) {
            return this.name.substr(0, 1).toUpperCase() + this.name.substr(1).toLowerCase();
        }
        return '';
    }

    toggleHandleChange(ev: CustomEvent<ToggleChangeEventDetail>) {
        this.state = ev.detail.checked;
    }

    render() {
        return (
            <Host>
                <ion-header>
                    <ion-toolbar color="primary">
                        <ion-buttons slot="start">
                            <ion-back-button defaultHref="/" />
                        </ion-buttons>
                        <ion-title>Profile: {this.name}</ion-title>
                    </ion-toolbar>
                </ion-header>
                ,
                <ion-content class="ion-padding">
                    <p>
                        {sayHello()}! My name is {this.formattedName()}. My name was passed in through a route param!
                    </p>

                    <ion-item>
                        <ion-label>Setting ({this.state.toString()})</ion-label>
                        <ion-toggle checked={this.state} onIonChange={this.toggleHandleChange} />
                    </ion-item>
                </ion-content>
            </Host>
        );
    }
}

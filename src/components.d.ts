/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { ButtonType } from "./models/button.model";
import { GameStateType } from "./models/game-state.model";
export namespace Components {
    interface GeniusButton {
        /**
          * buttonId
         */
        "buttonId": number;
        /**
          * press
         */
        "press": (playSound?: boolean, handleClick?: boolean) => Promise<unknown>;
        /**
          * type
         */
        "type": ButtonType;
    }
    interface GeniusCenterButton {
        /**
          * action
         */
        "action": GameStateType;
        /**
          * remainingTime
         */
        "remainingTime": number;
    }
    interface GeniusGame {
    }
    interface GeniusScore {
        /**
          * label
         */
        "label": string;
        /**
          * label
         */
        "score": string;
    }
}
declare global {
    interface HTMLGeniusButtonElement extends Components.GeniusButton, HTMLStencilElement {
    }
    var HTMLGeniusButtonElement: {
        prototype: HTMLGeniusButtonElement;
        new (): HTMLGeniusButtonElement;
    };
    interface HTMLGeniusCenterButtonElement extends Components.GeniusCenterButton, HTMLStencilElement {
    }
    var HTMLGeniusCenterButtonElement: {
        prototype: HTMLGeniusCenterButtonElement;
        new (): HTMLGeniusCenterButtonElement;
    };
    interface HTMLGeniusGameElement extends Components.GeniusGame, HTMLStencilElement {
    }
    var HTMLGeniusGameElement: {
        prototype: HTMLGeniusGameElement;
        new (): HTMLGeniusGameElement;
    };
    interface HTMLGeniusScoreElement extends Components.GeniusScore, HTMLStencilElement {
    }
    var HTMLGeniusScoreElement: {
        prototype: HTMLGeniusScoreElement;
        new (): HTMLGeniusScoreElement;
    };
    interface HTMLElementTagNameMap {
        "genius-button": HTMLGeniusButtonElement;
        "genius-center-button": HTMLGeniusCenterButtonElement;
        "genius-game": HTMLGeniusGameElement;
        "genius-score": HTMLGeniusScoreElement;
    }
}
declare namespace LocalJSX {
    interface GeniusButton {
        /**
          * buttonId
         */
        "buttonId": number;
        /**
          * press
         */
        "onPress"?: (event: CustomEvent<number>) => void;
        /**
          * type
         */
        "type"?: ButtonType;
    }
    interface GeniusCenterButton {
        /**
          * action
         */
        "action"?: GameStateType;
        /**
          * press
         */
        "onPress"?: (event: CustomEvent<null>) => void;
        /**
          * remainingTime
         */
        "remainingTime"?: number;
    }
    interface GeniusGame {
    }
    interface GeniusScore {
        /**
          * label
         */
        "label"?: string;
        /**
          * label
         */
        "score"?: string;
    }
    interface IntrinsicElements {
        "genius-button": GeniusButton;
        "genius-center-button": GeniusCenterButton;
        "genius-game": GeniusGame;
        "genius-score": GeniusScore;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "genius-button": LocalJSX.GeniusButton & JSXBase.HTMLAttributes<HTMLGeniusButtonElement>;
            "genius-center-button": LocalJSX.GeniusCenterButton & JSXBase.HTMLAttributes<HTMLGeniusCenterButtonElement>;
            "genius-game": LocalJSX.GeniusGame & JSXBase.HTMLAttributes<HTMLGeniusGameElement>;
            "genius-score": LocalJSX.GeniusScore & JSXBase.HTMLAttributes<HTMLGeniusScoreElement>;
        }
    }
}

import {GameScene} from "./GameScene.js";

class UiScene extends GameScene {
    constructor(uiId) {
        super();

        this.uiId = uiId;
        this.element = document.getElementById(this.uiId);

        this.hide()
    }

    show() {
        this.element.style.opacity = '1';
        this.element.style.pointerEvents = 'auto';
    }

    hide() {
        this.element.style.opacity = '0';
        this.element.style.pointerEvents = 'none';
    }

    addDomListener(selector, type, callback) {
        document.querySelector('#' + this.uiId + ' ' + selector).addEventListener(type, callback);
    }
}

export {UiScene};
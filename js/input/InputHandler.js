import {isButtonPressed, isMouseButtonPressed} from "./types/Keyboard.js";
import {isGamepadButtonPressed} from "./types/Gamepad.js";

import keybindings from './keybinds.json';
const inputs = keybindings.inputs;
const axis = keybindings.axis;

let types = {
    'keyboard': isButtonPressed,
    'mouse': isMouseButtonPressed,
    'gamepad': isGamepadButtonPressed
};

function getInput(name) {
    let filteredAxis = inputs.filter(o => o.name === name);
    if(filteredAxis.length !== 1) return false;

    let specifiedAxis = filteredAxis[0];

    for(const option of specifiedAxis.options) {
        if(types[option.type](option.key)) return true;
    }

    return false;
}

function addInputListener(name, callback) {

}

function getAxisMagnitude(type, direction) {
    let result = types[type](direction);

    if(result === true) result = 1;

    return typeof result === 'number' ? result : (result === true ? 1 : 0);
}

function getAxis(name) {
    let filteredAxis = axis.filter(o => o.name === name);
    if(filteredAxis.length !== 1) return 0;

    let specifiedAxis = filteredAxis[0];

    let direction = 0;

    for(const option of specifiedAxis.options) {
        direction += getAxisMagnitude(option.type, option.positive);
        direction -= getAxisMagnitude(option.type, option.negative);
    }

    return Math.min(Math.max(direction, -1), 1);
}

export { getInput, addInputListener, getAxis };
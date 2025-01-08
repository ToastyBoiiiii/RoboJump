import {ObjectScript} from "./ObjectScript.js";
import {ThirdPersonControls} from "../systems/ThirdPersonControls.js";

class CameraControlsScript extends ObjectScript {
    constructor() {
        super();
    }

    initialize(object, objects) {

    }

    update(delta, object, objects) {
        objects.filter(item => item instanceof ThirdPersonControls)[0].update(delta);
    }
}

export {CameraControlsScript}
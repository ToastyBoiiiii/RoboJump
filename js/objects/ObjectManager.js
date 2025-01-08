import * as THREE from "three";

import {resources} from "../systems/ResourceManager.js";
import {GameObject} from "./GameObject.js";
import {PlayerScript} from "../scripts/PlayerScript.js";
import {ThirdPersonControls} from "../systems/ThirdPersonControls.js";
import {CameraControlsScript} from "../scripts/CameraControls.js";
import {addPlayer} from "./Player.js";
import {addCamera} from "./Camera.js";
import {addLight} from "./Light.js";
import {addEnvironment} from "./Environment.js";

const gameObjects = {};

function initializeGameObjects() {
    addPlayer();
    addCamera()
    addLight();
    addEnvironment();
}

export {initializeGameObjects, gameObjects};
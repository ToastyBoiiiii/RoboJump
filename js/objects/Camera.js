import {GameObject} from "./GameObject.js";
import {CameraControlsScript} from "../scripts/CameraControls.js";
import * as THREE from "three";
import {ThirdPersonControls} from "../systems/ThirdPersonControls.js";
import {gameObjects} from "./ObjectManager.js";

function addCamera() {
    let tpsCamera = new GameObject("camera", null, {
        scripts: [new CameraControlsScript()]
    });

    let camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.01, 50);
    let controls = new ThirdPersonControls(camera, document.body, gameObjects["player"]);
    controls.maxPolarAngle = Math.PI-0.1;
    controls.minPolarAngle = 0.1;

    const blocker = document.getElementById( 'blocker' );
    const instructions = document.getElementById( 'instructions' );

    instructions.addEventListener('click', function () {
        controls.lock();
    });

    controls.addEventListener('lock', function () {
        instructions.style.display = 'none';
        blocker.style.display = 'none';
    });

    controls.addEventListener('unlock', function () {
        blocker.style.display = 'block';
        instructions.style.display = '';
    });

    tpsCamera.add(camera);
    tpsCamera.add(controls);

    gameObjects["camera"] = tpsCamera;
}

export { addCamera };
import {GameObject} from "./GameObject.js";
import * as THREE from "three";
import {gameObjects} from "./ObjectManager.js";

function addLight() {
    let light = new GameObject("light");

    light.add(new THREE.AmbientLight());

    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    let target = new THREE.Object3D();
    target.position.set(-0.5, -1, -0.5);
    directionalLight.target = target;
    directionalLight.castShadow = true;

    light.add(directionalLight);
    light.add(target);

    gameObjects["light"] = light;
}

export { addLight };
import {resources} from "../systems/ResourceManager.js";
import {GameObject} from "./GameObject.js";
import {gameObjects} from "./ObjectManager.js";

function addEnvironment() {
    for(const key in resources.model.environment) {
        gameObjects[key] = new GameObject(key, resources.model.environment[key].scene, {
            receiveShadow: true,
            castShadow: true,
        });
    }
}

export { addEnvironment };
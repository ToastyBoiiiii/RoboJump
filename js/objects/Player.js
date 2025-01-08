import {resources} from "../systems/ResourceManager.js";
import {GameObject} from "./GameObject.js";
import {PlayerScript} from "../scripts/PlayerScript.js";
import {gameObjects} from "./ObjectManager.js";

function addPlayer() {
    let playerModel = resources.model.characters.character;

    playerModel.scene.scale.set(0.5, 0.5, 0.5);

    gameObjects["player"] = new GameObject("player", playerModel.scene, {
        scripts: [new PlayerScript()],
        scalable: false
    });
}

export { addPlayer };
/**
 * Input:
 * List of scenes stored in external files
 *
 * Output:
 * function to change current scene to different scene
 * update function for the scene
 *
 * Future thinking
 * Loading screen or transitions should be used between scene changes
 * */
import * as THREE from 'three';
import {UiScene} from "./UiScene.js";
import {GameScene} from "./GameScene.js";
import {gameObjects} from "../objects/ObjectManager.js";
import {resources} from "../systems/ResourceManager.js";

let currentScene = null;

const scenes = {};

function initializeScenes() {
    // let mainMenu = new UiScene("mainMenu");

    let level1 = new GameScene();

    resources.image.skyboxes.cloud_skybox.mapping = THREE.EquirectangularReflectionMapping;
    level1.background = resources.image.skyboxes.cloud_skybox;

    level1.addGameObject(gameObjects["player"]);
    level1.addGameObject(gameObjects["light"]);
    level1.addGameObject(gameObjects["camera"]);

    level1.addGameObject(gameObjects["saw"]);
    level1.addGameObject(gameObjects["arrow"]);

    scenes["level1"] = level1;
}

function changeScene(scene) {
    currentScene = scenes[scene] ?? currentScene;
}

export {currentScene, initializeScenes, changeScene}

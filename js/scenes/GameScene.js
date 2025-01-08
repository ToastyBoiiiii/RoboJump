import * as THREE from "three";

class GameScene extends THREE.Scene {
    #camera = null;
    #gameObjects = [];

    constructor() {
        super();
    }

    addGameObject(object) {
        this.setCamera(object);

        this.#gameObjects.push(object);
        this.add(object);
    }

    getGameObjects() {
        return this.#gameObjects;
    }

    setCamera(object) {
        if(object instanceof THREE.PerspectiveCamera) {
            this.#camera = object;
        }

        if(!object.children || object.children.length === 0) return;

        for(let childObject of object.children) {
            this.setCamera(childObject)
        }
    }

    getCamera() {
        return this.#camera;
    }

    update(delta) {
        for(const gameObject of this.#gameObjects) {
            gameObject.update(delta);
        }
    }
}

export {GameScene};
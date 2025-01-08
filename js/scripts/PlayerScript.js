import * as THREE from "three";
import {ObjectScript} from "./ObjectScript.js";
import {getAxis} from "../input/InputHandler.js";

class PlayerScript extends ObjectScript {
    #velocity = new THREE.Vector3(0, 0, 0);
    #maxSpeed = 10;
    #maxAcceleration = 10;

    #gameObject;
    #objects;

    constructor() {
        super();
    }

    initialize(gameObject, objects) {
        this.#gameObject = gameObject;
        this.#objects = objects;
    }

    #movement(delta) {
        const playerInput = new THREE.Vector2(0, 0)

        playerInput.y = getAxis('Vertical');
        playerInput.x = getAxis('Horizontal');

        playerInput.clampLength(0, 1);

        let desiredVelocity = new THREE.Vector3(playerInput.x, 0, playerInput.y).multiplyScalar(this.#maxSpeed);
        let maxSpeedChange = this.#maxAcceleration * delta;

        if(this.#velocity.x < desiredVelocity.x) {
            this.#velocity.x = Math.min(this.#velocity.x + maxSpeedChange, desiredVelocity.x);
        } else if (this.#velocity.x > desiredVelocity.x) {
            this.#velocity.x = Math.max(this.#velocity.x - maxSpeedChange, desiredVelocity.x);
        }

        if(this.#velocity.z < desiredVelocity.z) {
            this.#velocity.z = Math.min(this.#velocity.z + maxSpeedChange, desiredVelocity.z);
        } else if (this.#velocity.z > desiredVelocity.z) {
            this.#velocity.z = Math.max(this.#velocity.z - maxSpeedChange, desiredVelocity.z);
        }

        let displacement = this.#velocity.clone().multiplyScalar(delta);

        this.#gameObject.position.add(displacement);
        
        if(!playerInput.equals(new THREE.Vector2(0, 0))) {
            this.#gameObject.lookAt(new THREE.Vector3(playerInput.x, 0, playerInput.y).add(this.#gameObject.position));
        }
    }

    update(delta) {
        this.#movement(delta);
    }
}

export {PlayerScript}
import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

class ThirdPersonControls extends PointerLockControls {
    constructor(camera, domElement, object) {
        super(camera, domElement);

        this.camera = camera;
        this.rotationalObject = object;

        this.heightAboveObject = 0.25;
        this.distanceToObject = 2;
    }

    update(delta) {
        super.update(delta);

        let objectPosition = this.rotationalObject ? this.rotationalObject.position : new THREE.Vector3(0, 0, 0);
        this.camera.position.copy(objectPosition.clone().add(new THREE.Vector3(0, this.heightAboveObject, 0)).add(new THREE.Vector3(0, 0, -1).applyEuler(this.camera.rotation).negate().multiplyScalar(this.distanceToObject)));
    }
}

export { ThirdPersonControls };
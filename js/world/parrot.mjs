import { Object3D } from "three";
import { resources } from "../ResourceManager.mjs";

class Parrot extends Object3D {
    constructor() {
        super();

        this.parrotRotation = 0;
        this.speed = 1;

        this.add(resources.model.characters.parrot.scene);
        this.scale.set(0.01, 0.01, 0.01);
        // mixer.clipAction(resources.model.characters.parrot.animations[0]).play();
    }

    update(delta) {
        this.parrotRotation += delta * this.speed;
        while(this.parrotRotation > Math.PI) this.parrotRotation -= Math.PI;

        this.position.set(Math.sin(this.parrotRotation), Math.cos(this.parrotRotation)*0.05+2, Math.cos(this.parrotRotation));
        this.rotation.set(this.parrotRotation + Math.PI/2);
    }
}

export { Parrot };
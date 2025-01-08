import * as THREE from 'three';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

class GameObject extends THREE.Object3D {
    name;
    objects = [];
    collider = undefined;

    constructor(name, objects, options) {
        super();

        this.name = name;

        if(objects) this.addObjects(objects);
        this.loadAnimations();
        this.setCollisionBox();
        this.setOptions(options);
        this.setShadow();
        this.enforceConstraints();

        this.initializeScripts();
    }

    add(object) {
        if(!(object instanceof THREE.Object3D)) {
            this.objects.push(object);
            return;
        }

        return super.add(object);
    }

    addObjects(objects) {
        if(objects.constructor.name === "Array") {
            for(let object of objects) {
                this.add(object);
            }
            return;
        }

        this.add(objects);
    }

    loadAnimations() {
        // todo: figure out htf animations work
        this.animations = undefined;
    }

    setCollisionBox() {
        // todo find collider scene somehow
        this.collider = new THREE.Box3().setFromObject(this.collider instanceof THREE.Object3D ? this.collider : this);
    }

    setOptions(options) {
        if(!options) options = {scripts: null, rotatable: null, scalable: null, castShadow: null, receiveShadow: null}

        this.scripts = options.scripts ?? []
        this.scalable = options.scalable ?? true;
        this.rotatable = options.rotatable ?? true;
        this.castShadow = options.castShadow ?? false;
        this.receiveShadow = options.receiveShadow ?? false;
    }

    setShadow() {
        if(this.children && this.children.length === 0) return;

        this.#setCastShadow(this, this.castShadow);
        this.#setReceiveShadow(this, this.receiveShadow);
    }

    #setCastShadow(object, value) {
        if(!object.children || object.children.length === 0) return;

        for(let childObject of object.children) {
            childObject.castShadow = value;
            if(childObject.children && childObject.children.length !== 0) this.#setCastShadow(childObject.children, value);
        }
    }

    #setReceiveShadow(object, value) {
        if(!object.children || object.children.length === 0) return;

        for(let childObject of object.children) {
            childObject.receiveShadow = value;
            if(childObject.children && childObject.children.length !== 0) this.#setReceiveShadow(childObject.children, value);
        }
    }

    enforceConstraints() {
        function resetRotation() {
            this.rotation.set(0, 0, 0);
            this.quaternion.set(0, 0, 0, 0);
        }

        if(!this.rotatable) {
            this.rotation._onChange(resetRotation);
            this.quaternion._onChange(resetRotation);
        }
    }

    initializeScripts() {
        this.scripts.forEach(script => {
            script.initialize(this, this.objects);
        })
    }

    update(delta) {
        this.scripts.forEach(script => {
            script.update(delta, this, this.objects);
        })
    }

    clone() {
        let objects = this.children;

        objects = objects.concat(this.objects);

        return new GameObject(this.name, objects, {
            'scripts': this.scripts,
            'scalable': this.scalable,
            'rotatable': this.rotatable
        });
    }
}

export {GameObject}
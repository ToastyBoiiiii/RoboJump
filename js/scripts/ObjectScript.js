class ObjectScript {
    constructor() {
        if (this.constructor === ObjectScript) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    initialize(object, objects) {
        throw new Error("Method initialize(object, objects) must be implemented.");
    }

    update(delta, object, objects) {
        throw new Error("Method update(delta, object, objects) must be implemented.");
    }
}

export { ObjectScript };
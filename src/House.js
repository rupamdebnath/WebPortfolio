import * as THREE from 'three';

export default class House {
    constructor(scene, position = new THREE.Vector3(0, 0, 0), rotation) {
        this.scene = scene;
        this.position = position;
        this.rotation = new THREE.Euler(
        THREE.MathUtils.degToRad(rotation.x),
        THREE.MathUtils.degToRad(rotation.y),
        THREE.MathUtils.degToRad(rotation.z)
        );
        this.init();
    }

    
}
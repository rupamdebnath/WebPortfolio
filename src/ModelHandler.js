import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

export default class ModelHandler {
    constructor(scene, path, onLoaded) {
        this.scene = scene;
        this.gltfLoader = new GLTFLoader();
        this.fbxLoader = new FBXLoader();
        this.mixer = null;
        this.model = null;
        this.onLoaded = onLoaded;

        this.load(path);
    }

    applyShadows(root, enabled = true) {
        root.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = enabled;
                child.receiveShadow = enabled;
            }
        });
    }

    load(path) {
        const extension = path.split('.').pop()?.toLowerCase();

        if (extension === 'fbx') {
            this.loadFbx(path);
            return;
        }

        this.loadGltf(path);
    }

    loadGltf(path) {
        this.gltfLoader.load(path, (gltf) => {
            this.model = gltf.scene;
            this.applyShadows(this.model, true);
            this.scene.add(this.model);
            if (this.onLoaded) {
                this.onLoaded(this.model);
            }

            // Setup Animations
            if (gltf.animations.length) {
                this.mixer = new THREE.AnimationMixer(this.model);
                const action = this.mixer.clipAction(gltf.animations[0]);
                action.play();
            }
        });
    }

    loadFbx(path) {
        this.fbxLoader.load(path, (fbx) => {
            this.model = fbx;
            this.applyShadows(this.model, true);
            this.scene.add(this.model);
            if (this.onLoaded) {
                this.onLoaded(this.model);
            }

            // FBX animations similar to gltf
            if (fbx.animations && fbx.animations.length) {
                this.mixer = new THREE.AnimationMixer(this.model);
                const action = this.mixer.clipAction(fbx.animations[0]);
                action.play();
            }
        });
    }

    update(deltaTime) {
        if (this.mixer) {
            this.mixer.update(deltaTime);
        }
    }
}

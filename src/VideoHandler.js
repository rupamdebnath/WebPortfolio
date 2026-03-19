import * as THREE from 'three';
import TextHandler from './TextHandler.js';
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

export default class VideoHandler {
    constructor(scene, camera, options = {}) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = options.renderer;
        this.screens = [];
        this.position = null;
        this.rotation = { x: 0, y: 0, z: 0 }; // degrees
        this.textHandler = null;
    }

    normalizeRotationDeg(rotation) {
        if (rotation && rotation.isEuler) {
            return {
                x: THREE.MathUtils.radToDeg(rotation.x),
                y: THREE.MathUtils.radToDeg(rotation.y),
                z: THREE.MathUtils.radToDeg(rotation.z)
            };
        }

        return {
            x: rotation?.x || 0,
            y: rotation?.y || 0,
            z: rotation?.z || 0
        };
    }

    addYouTubeScreen({
        videoId,
        position = new THREE.Vector3(0, 2, -6),
        rotation = { x: 0, y: 0, z: 0 },
        width = 1280,
        height = 720,
        worldScale = 0.003,
        controls = 1,
        start = 0,
        mute = 1
    }) {
        if (!videoId) {
            throw new Error('videoId is required for addYouTubeScreen');
        }

        const frame = document.createElement('div');
        frame.className = 'video-screen';
        frame.style.width = `${width}px`;
        frame.style.height = `${height}px`;

        const iframe = document.createElement('iframe');
        iframe.className = 'video-screen-iframe';
        iframe.width = String(width);
        iframe.height = String(height);
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = false;
        iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&playsinline=1&controls=${controls}&start=${start}&mute=${mute}`;

        frame.appendChild(iframe);

        const object = new CSS3DObject(frame);
        const rotationDeg = this.normalizeRotationDeg(rotation);
        object.position.copy(position);
        object.rotation.set(
            THREE.MathUtils.degToRad(rotationDeg.x),
            THREE.MathUtils.degToRad(rotationDeg.y),
            THREE.MathUtils.degToRad(rotationDeg.z)
        );
        object.scale.setScalar(worldScale);

        this.position = position;
        this.rotation = rotationDeg;

        this.scene.add(object);
        this.screens.push(object);

        return object;
    }

    setSize(width, height) {
        this.renderer.setSize(width, height);
    }

    render() {
        if (this.renderer) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    addText(renderer, content) {
        this.textHandler = new TextHandler(
            this.scene,
            this.camera,
            renderer,
            new THREE.Vector3(this.position.x, this.position.y + 1.8, this.position.z),
            this.rotation
        );
        this.textHandler.setSize(3, 2);
        this.textHandler.setFontSize(0.15);
        this.textHandler.setText(content);
        this.textHandler.setButtonInvisible(false);
    }

    dispose() {
        this.screens.forEach((screen) => {
            this.scene.remove(screen);
        });
        this.screens = [];

        if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
            this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
        }
    }
}

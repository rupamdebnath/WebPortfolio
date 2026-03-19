import * as THREE from 'three';
import ThreeMeshUI from 'three-mesh-ui';
import ButtonHandler from './ButtonHandler';

export default class TextHandler {
    constructor(scene, camera, renderer, position = new THREE.Vector3(0, 0, 0), rotation = { x: 0, y: 0, z: 0 }) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.position = position;
        const rotationDeg = rotation && rotation.isEuler
            ? {
                x: THREE.MathUtils.radToDeg(rotation.x),
                y: THREE.MathUtils.radToDeg(rotation.y),
                z: THREE.MathUtils.radToDeg(rotation.z)
            }
            : {
                x: rotation.x || 0,
                y: rotation.y || 0,
                z: rotation.z || 0
            };
        this.rotation = new THREE.Euler(
            THREE.MathUtils.degToRad(rotationDeg.x),
            THREE.MathUtils.degToRad(rotationDeg.y),
            THREE.MathUtils.degToRad(rotationDeg.z)
        );
        this.button = new ButtonHandler(
            scene,
            camera,
            renderer,
            new THREE.Vector3(0, 0, 0),
            new THREE.Euler(0, 0, 0)
        );
        this.init();
    }

    init() {
            this.container = new ThreeMeshUI.Block({
                width: 5,
                height: 5,
                padding: 0.05,
                contentDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontFamily: 'https://unpkg.com/three-mesh-ui/examples/assets/Roboto-msdf.json',
                fontTexture: 'https://unpkg.com/three-mesh-ui/examples/assets/Roboto-msdf.png',
                backgroundColor: new THREE.Color(0x222222),
                backgroundOpacity: 0.8,
            });
    
            // Set position from constructor
            this.container.position.copy(this.position);
            this.container.rotation.copy(this.rotation);
    
            this.scene.add(this.container);

                this.textBlock = new ThreeMeshUI.Block({
                    width: 4.6,
                    height: 4.1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundOpacity: 0
                });

            // Text
            this.text = new ThreeMeshUI.Text({
                content: "Test Text",
                fontSize: 0.2
            });

                this.button.setText('Close');
                this.button.clickCallback = () => this.close();

                // Move ButtonHandler button into this TextHandler panel.
                this.button.container.remove(this.button.button);
                this.scene.remove(this.button.container);

                this.textBlock.add(this.text);
                this.container.add(this.textBlock);
                this.container.add(this.button.button);
        }

    open() {
        this.container.visible = true;
    }
    
    close() {
        this.container.visible = false;
    }

    setSize(width, height) {
        this.container.set({ width, height });
        this.textBlock.set({ width, height });
    }

    setText(content) {
        this.text.set({ content });
    }

    setButtonInvisible(visible) {
        this.button.button.visible = visible;
    }

    setFontSize(size) {
        this.text.set({ fontSize: size });
    }
}
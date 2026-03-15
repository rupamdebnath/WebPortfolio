import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const scene = new THREE.Scene();

//Canvas
const canvas = document.querySelector('canvas.webgl');

//Texture Loader
const textureLoader = new THREE.TextureLoader();
const floorAlphaTexture = textureLoader.load('./textures/floor/alpha.jpg');
const floorColorTexture = textureLoader.load('./textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg');
const floorARMTexture = textureLoader.load('./textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg');
const floorNormalTexture = textureLoader.load('./textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.jpg');
const floorDisplacementTexture = textureLoader.load('./textures/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.jpg');

floorColorTexture.colorSpace = THREE.SRGBColorSpace;

floorColorTexture.repeat.set(8, 8);
floorARMTexture.repeat.set(8, 8);
floorNormalTexture.repeat.set(8, 8);
floorDisplacementTexture.repeat.set(8, 8);

floorColorTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;

floorColorTexture.wrapT = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

//Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({ 
        alphaMap: floorAlphaTexture,
        transparent: true,
        map: floorColorTexture,
        aomap: floorARMTexture,
        roughnessMap: floorARMTexture,
        metalnessMap: floorARMTexture,
        normalMap: floorNormalTexture,
        displacementMap: floorDisplacementTexture,
        displacementScale: 0.3,
        displacementBias: -0.2
    })
);
scene.add(floor);
floor.rotation.x = - Math.PI * 0.5; 

//House Container
const house = new THREE.Group();
scene.add(house);

//wall Texture
const wallColorTexture = textureLoader.load('./textures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.jpg');
const wallARMTexture = textureLoader.load('./textures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.jpg');
const wallNormalTexture = textureLoader.load('./textures/wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.jpg');
wallColorTexture.colorSpace = THREE.SRGBColorSpace;

//Walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({ 
        map: wallColorTexture,
        aomap: wallARMTexture,
        roughnessMap: wallARMTexture,
        metalnessMap: wallARMTexture,
        normalMap: wallNormalTexture
    })
);
walls.position.y = 2.5 / 2;
house.add(walls);

//Roof Texture
const roofColorTexture = textureLoader.load('./textures/roof/roof_slates_02_1k/roof_slates_02_diff_1k.jpg');
const roofARMTexture = textureLoader.load('./textures/roof/roof_slates_02_1k/roof_slates_02_arm_1k.jpg');
const roofNormalTexture = textureLoader.load('./textures/roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.jpg');
roofColorTexture.colorSpace = THREE.SRGBColorSpace;

roofColorTexture.repeat.set(5, 1);
roofARMTexture.repeat.set(5, 1);
roofNormalTexture.repeat.set(5, 1);
roofColorTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;
//Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ 
        map: roofColorTexture,
        aomap: roofARMTexture,
        roughnessMap: roofARMTexture,
        metalnessMap: roofARMTexture,
        normalMap: roofNormalTexture
    })
);
roof.position.y = 2.5 + 0.5;
roof.rotation.y = Math.PI / 4;
house.add(roof);

//Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2),
    new THREE.MeshStandardMaterial({ color: 'red'})
);
door.position.z = 2 + 0.01;
door.position.y = 1.1;
house.add(door);

//Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: 'green' });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.position.set(1.8, 0.2, 2.2);
bush1.scale.setScalar(0.5);
house.add(bush1);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.position.set(2.5, 0.2, 2.4);
bush2.scale.setScalar(0.3);
house.add(bush2);
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.position.set(-2.5, 0.2, 2.2);
bush3.scale.setScalar(0.4);
house.add(bush3);
const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.position.set(-3.1, 0.2, 2.4);
bush4.scale.setScalar(0.3);
house.add(bush4);

//Graves
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: 'gray' });
const graves = new THREE.Group();

for(let i = 0; i < 40; i++)
{
    const angle = Math.random() * Math.PI * 2;
    const radius = 5 + Math.random() * 4;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    const grave = new THREE.Mesh(graveGeometry, graveMaterial);
    grave.position.set(x, 0.1, z);
    grave.rotation.set(
        (Math.random() - 0.5) * 0.4, // Random rotation around X-axis
        (Math.random() - 0.5) * 0.4, // Random rotation around Y-axis
        (Math.random() - 0.5) * 0.4  // Random rotation around Z-axis
    );
    grave.scale.setScalar(0.4 + Math.random() * 0.5); // Random scale between 0.6 and 1
    graves.add(grave);
}
scene.add(graves);

//Light
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // White light, full intensity
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3); // White light, full intensity
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//Camera
const camera = new THREE.PerspectiveCamera( 75, sizes.width / sizes.height, 0.1, 1000 );
scene.add( camera );

//Controls
const controls = new OrbitControls( camera, canvas );
controls.enableDamping = true; // Adds inertia to the controls

//Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize( sizes.width, sizes.height );
renderer.outputColorSpace = THREE.SRGBColorSpace;

camera.position.z = 10;

//Resizing
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

function animate( time ) 
{
    controls.update();
    //cube.rotation.x = time / 2000;
    //cube.rotation.y = time / 1000;
    renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );
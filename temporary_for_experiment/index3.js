import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.querySelector('.wbgl');
const scene = new THREE.Scene()

const loader = new GLTFLoader();
 loader.load('MiniBot.glb', (gltf) => {
     const model = gltf.scene;
     model.scale.set(0.55,0.55,0.55)
     scene.add(model);

     // Check if the GLTF object has animations
     if (gltf.animations && gltf.animations.length > 0) {
        console.log('The GLB file contains animations.');
        gltf.animations.forEach((animation, index) => {
            console.log(`Animation ${index + 1}:`, animation);
        });

     // Apply the second animation ('Walk')
     const mixer = new THREE.AnimationMixer(model);
     const clip = gltf.animations[1]; // Assuming the second animation is 'Walk'
     const action = mixer.clipAction(clip);
     action.play();

     // Render loop
     const animate = () => {
         requestAnimationFrame(animate);
         mixer.update(0.01); // Update mixer with a small time delta
         renderer.render(scene, camera);
     };
     animate();
    } else {
        console.log('The GLB file does not contain any animations.');
    }

 });
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(2,2,5)
scene.add(light)

const light2 = new THREE.DirectionalLight(0xffffff, 1)
light2.position.set(-2,-2,-5)
scene.add(light2)

// Emerald green color
const emeraldGreen = new THREE.Color(0x2ecc71);

// Create spotlights from all directions
const spotlights = [];
const positions = [
    new THREE.Vector3(0, 5, 0), // Top
    new THREE.Vector3(0, -5, 0), // Bottom
    new THREE.Vector3(5, 0, 0), // Right
    new THREE.Vector3(-5, 0, 0), // Left
    new THREE.Vector3(0, 0, 5), // Front
    new THREE.Vector3(0, 0, -5), // Back
];
positions.forEach(position => {
    const spotlight = new THREE.AmbientLight(emeraldGreen, 1);
    spotlight.position.copy(position);
    spotlight.intensity = 0.8;
    scene.add(spotlight);
    spotlights.push(spotlight);
});

const sizes = {
    width: window.innerWidth,
    heigth: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.heigth, 0.1, 100)
camera.position.set(0,3,9)
scene.add(camera)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
});

// orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0,1,0);
controls.update();


const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI/2);
const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
//scene.add(groundMesh);

const spotLight = new THREE.SpotLight(0xffff00, 1, 0.1, 0.8, 0.5);
spotLight.position.set(0, 25, 0);
scene.add(spotLight);

renderer.setSize(sizes.width, sizes.heigth)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
renderer.shadowMap.enabled = true
renderer.gammaOutput = true
renderer.render(scene, camera)

function animate(){
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}
animate()
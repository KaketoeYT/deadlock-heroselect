// Three.js core + loaders + controls
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


// ====================
// SCENE SETUP
// ====================

// Maak de scene (hier komt alles in)
const scene = new THREE.Scene();


// ====================
// CAMERA
// ====================

// PerspectiveCamera(fov, aspect, near, far)
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

// Zet camera iets naar achter en omhoog
camera.position.set(1, 1.5, 1.5);


// ====================
// RENDERER
// ====================

// WebGL renderer (gebruikt GPU)
const renderer = new THREE.WebGLRenderer({ 
	antialias: true,
	alpha: true
});

// Volledig scherm
renderer.setSize(window.innerWidth, window.innerHeight);

// Renderer toevoegen aan scene-container in de view
document.getElementById('scene-container').appendChild(renderer.domElement);


// ====================
// CONTROLS
// ====================

// OrbitControls = muis draaien / zoomen
const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;     // smooth beweging
controls.dampingFactor = 0.05;     // hoe "zwaar" de beweging voelt
controls.target.set(0, 1, 0);      // focuspunt van de camera


// ====================
// LIGHTING
// ====================

// Richtingslicht (zoals zonlicht)
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

// Basis licht zodat schaduwkanten niet zwart zijn
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);


// ====================
// MODEL LOADING
// ====================

const loader = new GLTFLoader();

// Laad het 3D model uit public/models/
loader.load('/resources/models/mina_test.glb', function (gltf) {

	const model = gltf.scene;

	scene.add(model); // voeg model toe aan de scene

});


// ====================
// ANIMATION LOOP
// ====================

// Wordt ~60x per seconde aangeroepen
function animate() {
	requestAnimationFrame(animate);

	controls.update(); // nodig voor smooth damping

	renderer.render(scene, camera); // render scene vanuit camera
}

animate();


// ====================
// RESPONSIVE RESIZE
// ====================

// Zorgt dat aspect ratio correct blijft bij resize
window.addEventListener('resize', () => {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

});

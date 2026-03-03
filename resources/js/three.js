import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


// ====================
// SCENE
// ====================
const scene = new THREE.Scene();


// ====================
// CAMERA
// ====================
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
);
camera.position.set(3, 2, 0);


// ====================
// RENDERER (OPTIMIZED)
// ====================
const renderer = new THREE.WebGLRenderer({
	antialias: false,
	alpha: true,
	powerPreference: "high-performance"
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // cap resolution
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

document.getElementById('scene-container').appendChild(renderer.domElement);


// ====================
// CONTROLS
// ====================
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 1, 0);


// ====================
// LIGHTING (SIMPLER = FASTER)
// ====================
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);


// ====================
// MODEL LOADING (CACHED)
// ====================
const modelCache = new Map();
const loader = new GLTFLoader();
let currentModel = null;

window.loadHeroModel = function(heroName) {

	// If model already loaded → reuse clone
	if (modelCache.has(heroName)) {
		switchModel(modelCache.get(heroName).clone());

		console.log('Model loaded from cache:', heroName);

		return;
	}

	const path = `/resources/models/${heroName}.glb`;

	loader.load(path, (gltf) => {

		const model = gltf.scene;

		// Improve performance on meshes
		model.traverse(child => {
			if (child.isMesh) {
				child.frustumCulled = true;
				child.castShadow = false;
				child.receiveShadow = false;
			}
		});

		modelCache.set(heroName, model);
		switchModel(model.clone());

		console.log('Model loaded:', heroName);

	}, undefined, (error) => {
		console.error('Error loading model:', error);
	});
};


// Clean model switching
function switchModel(newModel) {

	if (currentModel) {
		scene.remove(currentModel);
	}

	currentModel = newModel;
	currentModel.position.set(1, -0.5, -1.5);
	currentModel.rotation.set(0, -.6, 0);

	scene.add(currentModel);
}


// Initial model
window.loadHeroModel('abrams');


// ====================
// ANIMATION LOOP
// ====================
function animate() {
	requestAnimationFrame(animate);
	controls.update();
	renderer.render(scene, camera);
}
animate();


// ====================
// RESPONSIVE RESIZE
// ====================
window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
});
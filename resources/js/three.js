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
	80,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

// Zet camera iets naar achter en omhoog
camera.position.set(3,2,0);


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

// Cache for loaded GLTF originals (not mounted into scene)
const modelCache = new Map();
let currentModel = null;

// Helper: dispose a model that was added to the scene
function disposeModel(root) {
	root.traverse((child) => {
		if (child.isMesh) {
			if (child.geometry) child.geometry.dispose();
			if (child.material) {
				if (Array.isArray(child.material)) {
					child.material.forEach(m => m.dispose());
				} else {
					child.material.dispose();
				}
			}
		}
	});
	scene.remove(root);
}

// Load (and cache) a model original without adding to scene. Returns a Promise
function loadAndCacheModel(heroName) {
	if (modelCache.has(heroName)) return Promise.resolve(modelCache.get(heroName));

	const path = `/resources/models/${heroName}.glb`;
	return new Promise((resolve, reject) => {
		loader.load(path, (gltf) => {
			modelCache.set(heroName, gltf.scene);
			resolve(gltf.scene);
		}, undefined, (err) => {
			reject(err);
		});
	});
}

// Preload multiple models (array of hero names)
window.preloadHeroModels = function(names) {
	const uniques = [...new Set(names)];
	return Promise.all(uniques.map(n => loadAndCacheModel(n).catch(err => {
		console.warn('Preload failed for', n, err);
		return null;
	})));
};

// Load a hero model by name (uses cache if available). Clones cached original for fast add.
window.loadHeroModel = async function(heroName) {
	try {
		let original = modelCache.get(heroName);
		if (!original) {
			original = await loadAndCacheModel(heroName);
		}

		// Remove previous model
		if (currentModel) {
			disposeModel(currentModel);
			currentModel = null;
		}

		// Clone original for the scene so cache remains untouched
		let clone;
		try {
			const mod = await import('three/examples/jsm/utils/SkeletonUtils.js');
			const SU = mod.SkeletonUtils || mod.default || mod;
			clone = SU.clone(original);
		} catch (e) {
			console.warn('SkeletonUtils import failed, falling back to Object3D.clone', e);
			clone = original.clone(true);
		}
		clone.position.set(1, -0.5, -1.5);
		clone.rotation.set(0, Math.PI / 2, 0);
		scene.add(clone);
		currentModel = clone;
	} catch (err) {
		console.error('Error loading model:', err);
	}
};

// Initial model (preload abrams then display)
loadAndCacheModel('abrams').then(() => window.loadHeroModel('abrams')).catch(err => console.error(err));


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

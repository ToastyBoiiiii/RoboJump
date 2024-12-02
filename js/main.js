import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { anisotropy, metalness, roughness, sin, TextureLoader } from "three/webgpu";
import { loadResources, resources } from "./ResourceManager.mjs";
const textureLoader = new THREE.TextureLoader();

// Setup (Die Klammern verwende ich nur um den Code in VS Code einklappen zu können)
let renderer, scene, container, camera, clock, time;

async function initialize(onComplete) {
  // Render
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  scene = new THREE.Scene();

  container = document.querySelector("#threejsContainer");
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera( 60, window.innerWidth/window.innerHeight,0.01, 50 );
  camera.position.set(0, 1, 5);

  // Initialize Variables
  time = 0;
  clock = new THREE.Clock();

  // Mouse Control
  var controls = new OrbitControls(camera, renderer.domElement);
  controls.update(); 

  // Resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Load resources
  loadResources(() => {
    console.log(resources);
  }, (progress) => {}, () => {});

  // Environment Texture
  const hdrUrl = './assets/images/kloppenheim_06_puresky_1k.hdr';
  new RGBELoader().load(hdrUrl, function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.background = texture;
    renderer.render( scene, camera );
  });

  onComplete();
}

// Animation
function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

initialize(animate);
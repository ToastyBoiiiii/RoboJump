import * as THREE from 'three';
import {changeScene, currentScene, initializeScenes} from "./scenes/SceneManager.js";
import {initializeProgressbar, updateLoadingScreen} from "./systems/LoadingScreen.js";
import {getAmountOfResources, loadResources, resources} from "./systems/ResourceManager.js";
import {initializeGameObjects} from "./objects/ObjectManager.js";

let renderer, camera, clock;

async function initialize(onComplete) {
  initializeProgressbar(4 + (await getAmountOfResources()), onComplete);

  // Render
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  let container = document.querySelector('#threejsContainer');
  container.appendChild(renderer.domElement);

  clock = new THREE.Clock();

  // Resize
  window.addEventListener('resize', () => {
    currentScene.getCamera().aspect = window.innerWidth / window.innerHeight;
    currentScene.getCamera().updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  updateLoadingScreen('Loaded render');

  // Load resources
  loadResources(() => {
    updateLoadingScreen('Loaded resources');

    initializeGameObjects();
    updateLoadingScreen('Loaded game objects');

    initializeScenes();
    changeScene('level1');
    updateLoadingScreen('Loaded scenes');
  }, (progress) => { updateLoadingScreen(`Loaded resource: ${progress}`) }, () => {});
}

function animate() {
  const delta = clock.getDelta();

  currentScene.update(delta);

  renderer.render(currentScene, currentScene.getCamera());
  requestAnimationFrame(animate);
}

initialize(animate);
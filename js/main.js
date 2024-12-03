import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

import { loadResources, resources, getAmountOfResources } from './ResourceManager.mjs';
import { initializeProgressbar, updateLoadingScreen } from './LoadingScreen.mjs';
import { isButtonPressed } from './InputHandler.mjs';

const textureLoader = new THREE.TextureLoader();

let renderer, scene, container, camera, clock, time, mixer, playerMixer, controls, playerWalkAnimation, playerIdleAnimation;

const moveSpeed = 2;
let robot, parrot;

async function initialize(onComplete) {
  initializeProgressbar(4 + (await getAmountOfResources()), onComplete);

  // Render
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  scene = new THREE.Scene();

  container = document.querySelector('#threejsContainer');
  container.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera( 60, window.innerWidth/window.innerHeight,0.01, 50 );
  camera.position.set(0, 1, 5);

  clock = new THREE.Clock();
  mixer = new THREE.AnimationMixer(scene);
  playerMixer = new THREE.AnimationMixer(scene);

  // Initialize Variables
  time = 0;

  // Mouse Control
  controls = new PointerLockControls(camera, document.body);
  controls.maxPolarAngle = Math.PI-0.1;
  controls.minPolarAngle = 0.1;

  const blocker = document.getElementById( 'blocker' );
  const instructions = document.getElementById( 'instructions' );

  instructions.addEventListener('click', function () {
    controls.lock();
  });

  controls.addEventListener('lock', function () {
    instructions.style.display = 'none';
    blocker.style.display = 'none';
  });

  controls.addEventListener('unlock', function () {
    blocker.style.display = 'block';
    instructions.style.display = '';
  });

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  updateLoadingScreen('Loaded render');

  // Load resources
  loadResources(() => {
    updateLoadingScreen('Loaded resources');
    initializeScene();
    updateLoadingScreen('Initialized scene');
  }, (progress) => { updateLoadingScreen(`Loaded resource: ${progress}`) }, () => {});

  // Environment Texture
  const hdrUrl = './assets/skyboxes/autumn_field_puresky_1k.hdr';
  new RGBELoader().load(hdrUrl, function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.background = texture;
    updateLoadingScreen('Loaded Skybox');
  });
}

function initializeScene() {
  robot = resources.model.npcs.character.scene;
  robot.scale.set(0.5, 0.5, 0.5);
  scene.add(robot);
  playerIdleAnimation = mixer.clipAction(resources.model.npcs.character.animations[1]);
  playerWalkAnimation = mixer.clipAction(resources.model.npcs.character.animations[2]);
  playerWalkAnimation.setDuration(0.7)
  playerIdleAnimation.play();
  
  parrot = resources.model.npcs.parrot.scene;
  parrot.scale.set(0.01, 0.01, 0.01);
  scene.add(parrot);
  mixer.clipAction(resources.model.npcs.parrot.animations[0]).play();
  

  let grass = resources.model.environment['block-grass-overhang-low-large'].scene;
  grass.position.y = -1;
  grass.scale.set(2, 2, 2);
  scene.add(grass);

  let objects = ['crate', 'chest', 'flowers', 'grass', 'tree-pine', 'tree'];

  for(let i = 0; i < 10; i++) {
    let randomObject = SkeletonUtils.clone(resources.model.environment[objects[Math.round(Math.random()*(objects.length-1))]].scene);
    randomObject.position.set(Math.random()*3-1.5, 0, Math.random()*3-1.5);
    randomObject.rotation.y = Math.random()*Math.PI*2;
    scene.add(randomObject);
  }
}

// Animation
function animate() { // TODO: Fix messy code by extracting it into own modules (main should only have to do the bare minimum)
  const delta = clock.getDelta();
  
  controls.update(delta);
  mixer.update(delta);
  time += delta;

  parrot.position.x = Math.sin(time)*(2+Math.cos(time*0.5)+Math.sin(time*0.2)/10);
  parrot.position.z = Math.cos(time)*(2+Math.sin(time*0.8)+Math.sin(time*0.5)/10);
  parrot.position.y = Math.cos(time*4.5)*0.05+2;
  parrot.rotation.y = time + Math.PI/2;

  camera.position.copy(robot.position.clone().add(new THREE.Vector3(0, 0.25, 0)).add(new THREE.Vector3(0, 0, -1).applyEuler(camera.rotation).negate().multiplyScalar(2)));

  let moveVector = new THREE.Vector3(0, 0, 0);

  let moveDirections = {
    'w': new THREE.Vector3(0, 0, -1),
    's': new THREE.Vector3(0, 0, 1),
    'a': new THREE.Vector3(-1, 0, 0),
    'd': new THREE.Vector3(1, 0, 0),
  };

  // TODO: Randomly turns when looking up
  for (const key in moveDirections) {
    if(isButtonPressed(key)) {
      moveVector.add(moveDirections[key].clone().applyEuler(camera.rotation).setComponent(1, 0));
    }
  }

  robot.position.add(moveVector.normalize().multiplyScalar(delta * moveSpeed));
  
  if(!moveVector.equals(new THREE.Vector3(0, 0, 0))) {
    robot.lookAt(robot.position.clone().add(moveVector));
    
    if(!playerWalkAnimation.isRunning()) {
      playerIdleAnimation.stop();
      playerWalkAnimation.play();
    }
  } else {
    if(!playerIdleAnimation.isRunning()) {
      playerWalkAnimation.stop();
      playerIdleAnimation.play();
    }
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

initialize(animate);

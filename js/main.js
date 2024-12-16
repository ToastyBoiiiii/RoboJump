import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

import { ThirdPersonControls } from './world/ThirdPersonControls.mjs';
import { loadResources, resources, getAmountOfResources } from './ResourceManager.mjs';
import { initializeProgressbar, updateLoadingScreen } from './LoadingScreen.mjs';
import { isButtonPressed } from './InputHandler.mjs';
import { Parrot } from './world/parrot.mjs';

let renderer, scene, container, camera, clock, mixer, controls, playerWalkAnimation, playerIdleAnimation;

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

  camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.01, 50);

  clock = new THREE.Clock();
  mixer = new THREE.AnimationMixer(scene);

  // Initialize Variables

  // Mouse Control
  controls = new ThirdPersonControls(camera, document.body);
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
  robot = resources.model.characters.character.scene;
  robot.scale.set(0.5, 0.5, 0.5);
  scene.add(robot);
  playerIdleAnimation = mixer.clipAction(resources.model.characters.character.animations[1]);
  playerWalkAnimation = mixer.clipAction(resources.model.characters.character.animations[2]);
  playerWalkAnimation.setDuration(0.7)
  playerIdleAnimation.play();
  
  parrot = new Parrot();
  scene.add(parrot);
  
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

  // scene.add(new THREE.AmbientLight());
  // scene.add(new THREE.DirectionalLight());

  // controls.rotationalObject = robot;
}

// Animation
function animate() { // TODO: Fix messy code by extracting it into own modules (main should only have to do the bare minimum)
  const delta = clock.getDelta();
  
  controls.update(delta);
  mixer.update(delta);

  parrot.update(delta);

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
    moveVector.normalize();
    
    let angle = Math.asin(moveVector.z);

    if(moveVector.x < 0) {
      angle = Math.PI - angle;
    }

    robot.quaternion.rotateTowards(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -angle + Math.PI/2, 0)), 0.1);

    if(!playerWalkAnimation.isRunning()) {
      playerWalkAnimation.play();
      playerIdleAnimation.stop();
    }
  } else {
    if(!playerIdleAnimation.isRunning()) {
      playerIdleAnimation.play();
      playerWalkAnimation.stop();
    }
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

initialize(animate);

import * as THREE from "three";
import * as dat from "three/examples/jsm/libs/dat.gui.module.js";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

import "./styles.css";
import { initStats } from "./util";

function main() {
  // create a scene, that will hold all our elements such as objects, cameras and lights.
  var scene = new THREE.Scene();
  var stats = initStats();

  // create a camera, which defines where we're looking at.
  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // create a render and set the size
  var renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(0x000000));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  // show axes in the screen
  // var axes = new THREE.AxesHelper(20);
  // scene.add(axes);

  // create the ground plane
  const planeGeometry = new THREE.PlaneGeometry(60, 20);
  const planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xaaaaaa
  });

  var plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -0.5 * Math.PI; // rotate and position the plane
  plane.position.set(15, 0, 0);
  plane.receiveShadow = true;

  // create a cube
  const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
  const cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0xff0000,
    wireframe: true
  });

  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.castShadow = true;
  cube.position.set(-4, 3, 0); // position the cube

  // create a sphere
  const sphereGeometry = new THREE.SphereGeometry(4, 40, 40);
  const sphereMaterial = new THREE.MeshLambertMaterial({
    color: 0x7777ff,
    wireframe: true
  });

  var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.castShadow = true;
  sphere.position.set(25, 4, 2); // position the sphere
  sphere.step = 0;

  // add objects to the scene
  scene.add(cube);
  scene.add(sphere);
  scene.add(plane);

  // position and point the camera to the center of the scene
  camera.position.set(-30, 40, 30);
  camera.lookAt(scene.position);

  var spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-10, 20, -5);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024);

  scene.add(spotLight);

  // add the output of the renderer to the html element
  document.getElementById("webgl-output").appendChild(renderer.domElement);

  // initialize the trackball controls and the clock which is needed
  const trackballControls = new TrackballControls(camera, renderer.domElement);
  var clock = new THREE.Clock();

  var controls = {
    rotationSpeed: 0.02,
    bouncingSpeed: 0.03
  };

  const gui = new dat.GUI();
  gui.add(controls, "rotationSpeed", 0, 0.5);
  gui.add(controls, "bouncingSpeed", 0, 0.5);

  function renderScene() {
    stats.update();
    trackballControls.update(clock.getDelta());
    rotateCube(cube, controls);
    bounceBall(sphere, controls);

    window.requestAnimationFrame(renderScene);
    renderer.render(scene, camera); // render the scene
  }

  window.addEventListener(
    "resize",
    () => onWindowResize(camera, renderer),
    false
  );
  renderScene();
}

function bounceBall(sphere, controls) {
  sphere.step += controls.bouncingSpeed;
  sphere.position.x = 20 + 10 * Math.cos(sphere.step);
  sphere.position.y = 2 + 10 * Math.abs(Math.sin(sphere.step));
}

function rotateCube(cube, controls) {
  cube.rotation.x += controls.rotationSpeed;
  cube.rotation.y += controls.rotationSpeed;
  cube.rotation.z += controls.rotationSpeed;
}

function onWindowResize(camera, renderer) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

main();

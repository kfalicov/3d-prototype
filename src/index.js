import * as THREE from "three";
import CapsuleGeometry from "./CapsuleGeometry";
import { BoxGeometry, Vector2, LinearMipMapLinearFilter } from "three";
import Player from "./player";
// global variables
var renderer;
var scene;
var camera;

var clock = new THREE.Clock();

function init(width, height, scale) {
  // create a scene, that will hold all our elements such as objects, cameras and lights.
  scene = new THREE.Scene();

  // create a camera, which defines where we're looking at.
  camera = new THREE.PerspectiveCamera(10, width / height, 0.1, 1000);

  // create a render, sets the background color and the size
  renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setClearColor(0xbbbbbb, 1.0);
  renderer.setSize(width, height);
  renderer.domElement.setAttribute(
    "style",
    `width: ${width * scale}px; height:${
      height * scale
    }px; image-rendering: pixelated`
  );

  // create a pill and add to scene
  var player = new Player();
  player.name = "player";
  scene.add(player);

  // position and point the camera to the center of the scene
  camera.position.x = 0;
  camera.position.y = 100;
  camera.position.z = -100;
  camera.lookAt(scene.position);

  // add the output of the renderer to the html element
  document.body.appendChild(renderer.domElement);

  setupKeyControls();

  // call the render function
  render();
}

//global inputs
const pressedKeys = [];
function setupKeyControls() {
  document.onkeydown = function (e) {
    pressedKeys[e.keyCode] = true;
  };
  document.onkeyup = function (e) {
    pressedKeys[e.keyCode] = false;
  };
}

//global physics on the pill
const acc = { x: 0.008, z: 0.008 };
const damp = { x: 0.004, z: 0.004 };
const vel = new Vector2(0, 0);
const term = { x: 0.1, z: 0.1 };
// const dir = new Vector2(0, 0);

function render() {
  renderer.render(scene, camera);
  var player = scene.getObjectByName("player");
  const { 65: left, 68: right, 83: down, 87: up } = pressedKeys;
  player.update(left, right, up, down);
  requestAnimationFrame(render);
}

// calls the init function when the window is done loading.
window.onload = () => init(320, 240, 2);

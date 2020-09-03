import * as THREE from "three";
import CapsuleGeometry from "./CapsuleGeometry";
import { BoxGeometry, Vector2, LinearMipMapLinearFilter } from "three";
// global variables
var renderer;
var scene;
var camera;

var clock = new THREE.Clock();

function init() {
  // create a scene, that will hold all our elements such as objects, cameras and lights.
  scene = new THREE.Scene();

  // create a camera, which defines where we're looking at.
  camera = new THREE.PerspectiveCamera(
    10,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // create a render, sets the background color and the size
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x000000, 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // create a pill and add to scene
  var pillGeometry = CapsuleGeometry(1, 1.5);
  var pillMaterial = new THREE.MeshNormalMaterial();
  var pill = new THREE.Mesh(pillGeometry, pillMaterial);
  pill.rotateX(1.57);
  pill.translateZ(-2);
  pill.name = "pill";
  scene.add(pill);

  var cubeGeometry = new BoxGeometry(0.5, 0.2, 0.8);
  var foot_l = new THREE.Mesh(cubeGeometry, pillMaterial);
  foot_l.name = "left";
  var foot_r = new THREE.Mesh(cubeGeometry, pillMaterial);
  foot_r.name = "right";
  scene.add(foot_l);
  scene.add(foot_r);

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

const lpos = { old: new Vector2(0, 0), target: new Vector2(0, 0) };
const rpos = { old: new Vector2(0, 0), target: new Vector2(0, 0) };
var lastUsedRight = false;
var elapsed = 0;
function walk(delta) {
  var pill = scene.getObjectByName("pill");
  var left = scene.getObjectByName("left");
  var right = scene.getObjectByName("right");
  let pillpos = new Vector2(pill.position.x, pill.position.z);
  let up = vel.length();
  elapsed += delta;
  if (elapsed > 0.25) {
    lastUsedRight = !lastUsedRight;
    if (lastUsedRight) {
      lpos.old = lpos.target;
      lpos.target = pillpos.clone().addScaledVector(vel, 20);
      console.log("left");
    } else {
      rpos.old = rpos.target;
      rpos.target = pillpos.clone().addScaledVector(vel, 20);
      console.log("right");
    }
    elapsed = 0;
  }
  let currentlpos = lpos.old.lerp(lpos.target, Math.min(elapsed / 0.5, 1));
  left.position.x = currentlpos.x;
  left.position.z = currentlpos.y;
  left.position.y = lastUsedRight
    ? Math.max(Math.sin(3.14 * elapsed * 4), 0) * up * 8
    : 0;

  let currentrpos = rpos.old.lerp(rpos.target, Math.min(elapsed / 0.5, 1));
  right.position.x = currentrpos.x;
  right.position.z = currentrpos.y;
  right.position.y = lastUsedRight
    ? 0
    : Math.max(Math.sin(3.14 * elapsed * 4), 0) * up * 8;

  pill.position.y = Math.abs(Math.sin(3.14 * elapsed * 4)) * up * 2 + 2;
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
const dir = new Vector2(0, 0);

function render() {
  renderer.render(scene, camera);
  var pill = scene.getObjectByName("pill");
  if (pressedKeys[65]) {
    vel.x += acc.x;
  }
  if (pressedKeys[68]) {
    vel.x -= acc.x;
  }
  if (pressedKeys[83]) {
    vel.y -= acc.z;
  }
  if (pressedKeys[87]) {
    vel.y += acc.z;
  }
  vel.x = vel.x > 0 ? Math.max(0, vel.x - damp.x) : Math.min(0, vel.x + damp.x);
  vel.x = THREE.MathUtils.clamp(vel.x, -term.x, term.x);
  pill.position.x += vel.x;
  vel.y = vel.y > 0 ? Math.max(0, vel.y - damp.z) : Math.min(0, vel.y + damp.z);
  vel.y = THREE.MathUtils.clamp(vel.y, -term.z, term.z);
  pill.position.z += vel.y;
  pill.rotation.x = 1.57 + 2 * vel.y;
  pill.rotation.y = -2 * vel.x;
  walk(clock.getDelta());
  requestAnimationFrame(render);
}

// calls the init function when the window is done loading.
window.onload = init;

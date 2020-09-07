import * as THREE from "three";
import CapsuleGeometry from "./CapsuleGeometry";

class Player extends THREE.Group {
  //   #body;
  //   #foot_left;
  //   #foot_right;
  constructor() {
    super();

    var pillGeometry = CapsuleGeometry(1, 1.5);
    pillGeometry.translate(0, 1.5, 0);
    var pillMaterial = new THREE.MeshNormalMaterial();
    let body = new THREE.Mesh(pillGeometry, pillMaterial);
    this.add(body);
    var origin = body.position.clone();

    var dir = new THREE.Vector3(0, 0, 0);
    var dirView = new THREE.ArrowHelper(dir, origin, 4, 0xffff00);
    this.add(dirView);

    var target = new THREE.Vector3(0, 0, 0);
    var targetView = new THREE.ArrowHelper(target, origin, 4, 0xff0000);
    this.add(targetView);

    var facing = new THREE.Vector3(0, 0, 0);
    var facingView = new THREE.ArrowHelper(facing, origin, 4, 0x0000ff);
    this.add(facingView);

    this.dir = dir;
    this.dirView = dirView;
    this.target = target;
    this.targetView = targetView;
    this.facing = facing;
    this.facingView = facingView;
    this.body = body;
    this.speed = 0;
    this.maxSpeed = 0.05;
    this.acc = 0.01;
    this.drag = 0.001;
  }

  update(l = false, r = false, u = false, d = false) {
    let xFactor = (l && 1) + (r && -1);
    let yFactor = (u && 1) + (d && -1);
    if (l || r || u || d) {
      this.target = new THREE.Vector3(xFactor, 0, yFactor);
      this.target.normalize();
      this.speed = Math.min(this.speed + this.acc, this.maxSpeed);
    } else {
      this.target.setLength(0);
      this.speed = Math.max(this.speed - this.drag, 0);
    }

    this.dir.add(this.target);
    this.dir.lerp(this.target, 0.1);
    this.body.translateOnAxis(this.dir, this.speed);

    this.targetView.setDirection(this.target);
    this.targetView.setLength(this.target.length() * 4);
    this.targetView.position.copy(this.body.position);

    this.dirView.setDirection(this.dir);
    this.dirView.setLength(this.dir.length());
    this.dirView.position.copy(this.body.position);

    this.facingView.setDirection(this.dir);
    this.facingView.position.copy(this.body.position);
  }
}

export default Player;

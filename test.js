//imports
import * as THREE from 'three';

// Create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const groundGeometry = new THREE.PlaneGeometry(20, 20); // Large plane
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.rotation.x = -Math.PI / 2; // Rotate to lay flat
groundMesh.position.y = -0.1; // Slightly below skateboard to avoid overlap
scene.add(groundMesh);

// Create skateboard object
const skateboardGeometry = new THREE.BoxGeometry(1, 0.2, 2);
const skateboardMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const skateboardMesh = new THREE.Mesh(skateboardGeometry, skateboardMaterial);
scene.add(skateboardMesh);

// Position the camera
camera.position.z = 5;
camera.position.y = 1;

// Create the skateboard class
class Skateboard {
  constructor() {
    this.position = skateboardMesh.position;
    this.velocity = new THREE.Vector3(0, 0, 0);
    this.gravity = new THREE.Vector3(0, -9.81 * 0.016, 0);
    this.friction = 0.98;
    //this.turningSpeed = 0.1;
    this.acceleration = 0.1; // Rate of speed increase
    //this.forwardForce = new THREE.Vector3(0, 0, -0.1);
  }

  applyForce(force) {
    this.velocity.add(force);
  }

//    turn(direction) {
//     this.velocity.x += direction * this.turningSpeed;
//    }

  update() {
    this.velocity.add(this.gravity);
    this.velocity.multiplyScalar(this.friction);
    this.position.add(this.velocity);

    if(this.velocity.length > 1) {
        this.velocity.normalize().multiplyScalar(1);
    }

    if (this.position.y < 0) {
        this.position.y = 0;
        this.velocity.y = 0; // Stop downward movement
      }
  }
}

const skateboard = new Skateboard();

// Handle user input
document.addEventListener('keydown', (event) => {
  if (event.code === 'ArrowUp') {
    skateboard.applyForce(new THREE.Vector3( 0, 0, -skateboard.acceleration));
  }
//   if (event.code === 'ArrowLeft') skateboard.turn(-1);
//   if (event.code === 'ArrowRight') skateboard.turn(1);
  if (event.code === "ArrowDown") {
    skateboard.applyForce(new THREE.Vector3( 0, 0, skateboard.acceleration)); // Slow down / Reverse
  }
});

// Animation loop
function animate() {
  skateboard.update();

  // Camera follows the skateboard
  const offset = new THREE.Vector3(0, 2, 5); // Position camera slightly above and behind
  const desiredPosition = skateboard.position.clone().add(offset);
  
  // Smoothing effect
  camera.position.lerp(desiredPosition, 0.1);
  camera.lookAt(skateboard.position);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
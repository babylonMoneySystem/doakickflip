//imports
import * as THREE from "three";
import { GLTFLoader } from "./node_modules/three/examples/jsm/loaders/GLTFLoader.js";

// Create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const groundGeometry = new THREE.PlaneGeometry(20, 20); // Large plane
const groundMaterial = new THREE.MeshBasicMaterial({
  color: 0xaaaaaa,
  side: THREE.DoubleSide,
});
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
groundMesh.rotation.x = -Math.PI / 2; // Rotate to lay flat
groundMesh.position.y = -0.1; // Slightly below skateboard to avoid overlap
scene.add(groundMesh);

// Create skateboard object
const skateboardGeometry = new THREE.BoxGeometry(1, 0.2, 2);
const skateboardMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const skateboardMesh = new THREE.Mesh(skateboardGeometry, skateboardMaterial);
// scene.add(skateboardMesh);

// Position the camera
camera.position.z = 5;
camera.position.y = 1;

// Create the skateboard class
class Skateboard {
  constructor(scene) {
    // Initialize the basic properties
    this.position = new THREE.Vector3(0, 0.1, 0); // Initial position
    this.velocity = new THREE.Vector3(0, 0, 0); // Initial velocity
    this.gravity = new THREE.Vector3(0, -9.81 * 0.016, 0); // Gravity force
    this.friction = 0.98; // Friction to slow down movement
    this.acceleration = 0.1; // Acceleration for forward movement
    this.moveDirection = new THREE.Vector3(); // Initialize movement direction

    // Load the skateboard model (GLTF) asynchronously
    const loader = new GLTFLoader();
    loader.load("skateboard.glb", (gltf) => {
      this.model = gltf.scene; // Store the model in this.model
      this.model.scale.set(0.1, 0.1, 0.1); // Scale the model
      this.model.position.set(0, 0.1, 0); // Set the position slightly above the ground
      this.model.rotation.y = Math.PI / 2;
      scene.add(this.model); // Add model to the scene
    });
  }

  applyForce(force) {
    this.velocity.add(force);
  }

  // Update skateboard physics and movement
  update() {
    // Apply gravity and friction
    this.velocity.add(this.gravity);
    this.velocity.multiplyScalar(this.friction);

    // Apply velocity to position
    this.position.add(this.velocity);

    // Prevent the skateboard from falling below the ground
    if (this.position.y < 0) {
      this.position.y = 0;
      this.velocity.y = 0; // Stop downward movement
    }

    // Update the skateboard model position
    if (this.model) {
      this.model.position.copy(this.position);
    }
  }

  // Move the skateboard based on input (key events)
  move() {
    if (this.velocity.length() > 1) {
      this.velocity.normalize().multiplyScalar(1); // Limit max speed
    }
  }
}

document.body.appendChild(renderer.domElement);

// Set up basic camera position
camera.position.z = 5;
camera.position.y = 1;

// Create an instance of Skateboard and pass the scene
const skateboard = new Skateboard(scene);

// Handle user input for movement
document.addEventListener("keydown", (event) => {
  if (event.code === "ArrowUp") {
    skateboard.applyForce(new THREE.Vector3(0, 0, -skateboard.acceleration)); // Move forward
  }
  if (event.code === "ArrowDown") {
    skateboard.applyForce(new THREE.Vector3(0, 0, skateboard.acceleration)); // Slow down / reverse
  }
  if (event.code === "ArrowLeft") {
    skateboard.applyForce(new THREE.Vector3(-skateboard.acceleration, 0, 0)); // Move left
  }
  if (event.code === "ArrowRight") {
    skateboard.applyForce(new THREE.Vector3(skateboard.acceleration, 0, 0)); // Move right
  }
});

// Animation loop
function animate() {
  skateboard.update(); // Update skateboard physics and movement

  // Camera follows the skateboard
  const offset = new THREE.Vector3(0, 2, 5); // Position camera slightly above and behind
  const desiredPosition = skateboard.position.clone().add(offset);

  // Smoothing effect
  camera.position.lerp(desiredPosition, 0.1);
  camera.lookAt(skateboard.position); // Always look at skateboard

  renderer.render(scene, camera);
  requestAnimationFrame(animate); // Continue the animation loop
}

animate();

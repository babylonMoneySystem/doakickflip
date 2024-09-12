//imports
import * as THREE from 'three';

//constants
const SPEED = 0.02
const KeyCode = {
    UP_KEY: 87,
    DOWN_KEY: 83,
    LEFT_KEY: 65,
    RIGHT_KEY: 68
  }

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 0.1, 4);
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;
camera.position.y = 2;

//Render loop
function animate() {

	renderer.render( scene, camera );

}

//Event Listeners
var keyMap = [];
document.addEventListener("keydown", onDocumentKeyDown, false);
document.addEventListener("keyup", onDocumentKeyUp, true);
function onDocumentKeyDown(event){ 
    var keyCode = event.keyCode;
    keyMap[keyCode] = true;
    executeMovement();
}
function onDocumentKeyUp(event){
    var keyCode = event.keyCode;
    keyMap[keyCode] = false;
    executeMovement();
}

//Skateboard positioning based on accelaration and friction
function executeMovement() {
    // up
    if (keyMap[KeyCode.UP_KEY] == true) {
        cube.position.y += SPEED;
        // down
    }  if (keyMap[KeyCode.DOWN_KEY] == true) {
        cube.position.y -= SPEED;
        // left
    }  if (keyMap[KeyCode.LEFT_KEY] == true) {
        cube.position.x -= SPEED;
        // right
    }  if (keyMap[KeyCode.RIGHT_KEY] == true) {
        cube.position.x += SPEED;
		pushSkateboard()
    }
};

// // physics
// function pushSkateboard(KeyCode) {

// 	cube.position.x += v_1*t a*tˆ2/2
// }
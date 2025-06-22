import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

let scene, camera, renderer, cake, topper;
const canvas = document.getElementById('cakeCanvas');

// Scene Setup
scene = new THREE.Scene();
scene.background = new THREE.Color(0xfff5f8);

camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
camera.position.set(0, 2, 5);

renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth - 320, window.innerHeight); // 320 for sidebar

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(3, 10, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.6));

// Cake base
const cakeGeometry = new THREE.CylinderGeometry(1, 1, 1.5, 32);
const cakeMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
cake = new THREE.Mesh(cakeGeometry, cakeMaterial);
cake.position.y = 0.75;
scene.add(cake);

// Load Topper
const loader = new GLTFLoader();
function loadTopper(name) {
  if (topper) {
    scene.remove(topper);
  }
  loader.load(`models/${name}.glb`, gltf => {
    topper = gltf.scene;
    topper.scale.set(0.5, 0.5, 0.5);
    topper.position.set(0, 1.7, 0);
    scene.add(topper);
  });
}
loadTopper('star'); // default

// Change Events
document.getElementById('flavor').addEventListener('change', e => {
  const flavor = e.target.value;
  const colors = {
    Chocolate: 0x8B4513,
    Vanilla: 0xFFFACD,
    Strawberry: 0xFFB6C1
  };
  cake.material.color.setHex(colors[flavor]);
});

document.getElementById('topper').addEventListener('change', e => {
  loadTopper(e.target.value);
});

// Animate
function animate() {
  requestAnimationFrame(animate);
  cake.rotation.y += 0.005;
  if (topper) topper.rotation.y += 0.005;
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth - 320, window.innerHeight);
});

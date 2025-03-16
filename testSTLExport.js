// Node.js script to test STLExporter with multiple objects
const fs = require('fs');
const path = require('path');
const THREE = require('three');

// Load the STLExporter
// We need to make it work with Node.js
eval(fs.readFileSync('./STLExporter.js', 'utf8'));

// Create a scene
const scene = new THREE.Scene();

// Create a 1x1x1 cube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.x = -2;
scene.add(cube);

// Create a 1x2x3 block
const blockGeometry = new THREE.BoxGeometry(1, 2, 3);
const blockMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const block = new THREE.Mesh(blockGeometry, blockMaterial);
block.position.x = 2;
scene.add(block);

// Export to STL
const exporter = new THREE.STLExporter();
const result = exporter.parse(scene, { binary: false }); // ASCII format

// Save to file
fs.writeFileSync('test.stl', result);

console.log('STL export completed. File saved as test.stl');

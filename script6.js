// This is the content of script6.js

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene-container').appendChild(renderer.domElement);

// Load the JSON data
fetch('csvjson.json')
    .then(response => response.json())
    .then(data => {
        // Extract heart rate data from the JSON
        const heartRateData = data.map(entry => parseFloat(entry.Value));

        // Create a function to generate the 3D graph based on heart rate data
        function createHeartRateGraph(data) {
            // Replace this with code to create a 3D graph using Three.js based on your heart rate data.
            // This typically involves creating geometries, materials, and positioning objects in the scene.
            // You'll need to create a custom algorithm to represent your data in 3D space.

            // Example: Create a cube for each data point
            const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

            data.forEach((heartRate, index) => {
                const cube = new THREE.Mesh(geometry, material);
                cube.position.set(index, heartRate / 100, 0);
                scene.add(cube);
            });
        }

        createHeartRateGraph(heartRateData);

        // Create an animation loop
        function animate() {
            requestAnimationFrame(animate);
            // Add your animation logic here, e.g., rotating objects.
            renderer.render(scene, camera);
        }

        animate();
    })
    .catch(error => {
        console.error("Error loading JSON data:", error);
    });
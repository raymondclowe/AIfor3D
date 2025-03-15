/**
 * Three.js Scene Manager
 * Handles scene setup, rendering, and animation
 * 
 * TODO: Add scene presets (different environments)
 * TODO: Add post-processing effects
 * TODO: Add scene export/import
 * TODO: Add performance monitoring
 */

import SceneObjectManager from './sceneObjects.js';

class SceneManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.objectManager = null;
        
        this.init();
    }
    
    /**
     * Initialize the 3D scene
     */
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a1a);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.camera.position.z = 5;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.width, this.height);
        this.container.appendChild(this.renderer.domElement);
        
        // Add grid
        const gridHelper = new THREE.GridHelper(10, 10, 0x555555, 0x333333);
        this.scene.add(gridHelper);
        
        // Add lights
        this.addLights();
        
        // Add orbit controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;
        
        // Create object manager
        this.objectManager = new SceneObjectManager(this.scene);
        
        // Create initial object
        this.currentObject = this.objectManager.createObject();
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Start animation loop
        this.animate();
    }
    
    /**
     * Add lights to the scene
     */
    addLights() {
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        const newWidth = this.container.clientWidth;
        const newHeight = this.container.clientHeight;
        
        this.camera.aspect = newWidth / newHeight;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(newWidth, newHeight);
    }
    
    /**
     * Animation loop
     */
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Slowly rotate the cube if it exists
        if (this.currentObject) {
            this.currentObject.rotation.x += 0.003;
            this.currentObject.rotation.y += 0.003;
        }
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
    
    /**
     * Get the object manager
     * @returns {SceneObjectManager} The object manager
     */
    getObjectManager() {
        return this.objectManager;
    }
}

// Export the SceneManager class
export default SceneManager;

/**
 * Scene Objects Manager
 * Handles 3D object creation and manipulation using code strings
 * 
 * TODO: Add physics integration
 */

class SceneObjectManager {
    constructor(scene) {
        this.scene = scene;
        this.currentObject = null;
        
        // default shape - 1x2x3 block
        this.objectCode = `
// Create a 1x2x3 block
const geometry = new THREE.BoxGeometry(1, 2, 3);
const material = new THREE.MeshNormalMaterial();
const block = new THREE.Mesh(geometry, material);

// Animation properties
block.rotation.x = 0;
block.rotation.y = 0;
block.rotation.z = 0;

// Add the block to the scene
scene.add(block);

return block;
`;


//         // Default cube code
//         this.objectCode = `
// // Create a cube
// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshNormalMaterial();
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// // Animation properties
// cube.rotation.x = 0;
// cube.rotation.y = 0;
// cube.rotation.z = 0;

// return cube;
// `;
    }
    
    /**
     * Set the object code for object creation
     * @param {string} code - Three.js code as a string
     */
    setObjectCode(code) {
        this.objectCode = code;
        // TODO: Add syntax validation
    }
    
    /**
     * Get the current object code
     * @returns {string} The current object code
     */
    getObjectCode() {
        return this.objectCode;
    }
    
    /**
     * Create object from object code
     * @returns {Object} The created 3D object
     */
    createObject() {
        // Remove current object if it exists
        if (this.currentObject) {
            this.scene.remove(this.currentObject);
        }
        
        try {
            // Create a function from the object code string
            // This is a simplified version - in production, this would need more security
            const createObjectFunction = new Function('THREE', 'scene', this.objectCode);
            
            // Execute the function with THREE and scene as parameters
            this.currentObject = createObjectFunction(THREE, this.scene);
            
            if (!this.currentObject) {
                throw new Error('Object code did not return an object');
            }
            
            return this.currentObject;
        } catch (error) {
            console.error('Error creating object from code:', error);
            // Fallback to triangle if code execution fails
            const geometry = new THREE.BufferGeometry();
            // Define three vertices for the triangle
            const vertices = new Float32Array([
                0, 1, 0,    // top vertex
                -1, -1, 0,  // bottom left vertex
                1, -1, 0    // bottom right vertex
            ]);
            // Add vertices to the geometry
            geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
            const material = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
            this.currentObject = new THREE.Mesh(geometry, material);
            this.scene.add(this.currentObject);
            
            return this.currentObject;
        }
    }
    
    /**
     * Update object properties
     * @param {Object} properties - Object properties to update
     */
    updateObject(properties) {
        if (!this.currentObject) return;
        
        // Apply properties to the current object
        Object.keys(properties).forEach(key => {
            if (typeof properties[key] === 'object' && this.currentObject[key]) {
                Object.assign(this.currentObject[key], properties[key]);
            } else {
                this.currentObject[key] = properties[key];
            }
        });
    }
    
    /**
     * Get current object state
     * @returns {Object} Object state
     */
    getObjectState() {
        if (!this.currentObject) return null;
        
        return {
            position: {
                x: this.currentObject.position.x,
                y: this.currentObject.position.y,
                z: this.currentObject.position.z
            },
            rotation: {
                x: this.currentObject.rotation.x,
                y: this.currentObject.rotation.y,
                z: this.currentObject.rotation.z
            },
            scale: {
                x: this.currentObject.scale.x,
                y: this.currentObject.scale.y,
                z: this.currentObject.scale.z
            }
        };
    }
    
}

// Export the SceneObjectManager class
export default SceneObjectManager;

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
        
        // Default code with multiple objects
        this.objectCode = `
// Create a 1x2x3 block
const blockGeometry = new THREE.BoxGeometry(1, 2, 3);
const blockMaterial = new THREE.MeshNormalMaterial();
const block = new THREE.Mesh(blockGeometry, blockMaterial);
block.position.x = 2;
block.position.y = 1; // Adjust to sit on the zero plane
// Add the block to the scene group
scene.add(block);

// Create a sphere
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshNormalMaterial();
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.x = -2;
sphere.position.y = 1; // Adjust to sit on the zero plane
// Add the sphere to the scene group
scene.add(sphere);

// Create a pyramid using cone geometry
const pyramidGeometry = new THREE.ConeGeometry(1, 2, 4);
const pyramidMaterial = new THREE.MeshNormalMaterial();
const pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial);
pyramid.position.x = 0;
pyramid.position.y = 1; // Adjust to sit on the zero plane
// Add the pyramid to the scene group
scene.add(pyramid);

// Return array of objects (optional)
return [block, sphere, pyramid];
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
     * Create objects from object code
     * @returns {Object|Array} The created 3D object(s)
     */
    createObject() {
        // Clear existing objects
        if (this.currentObject) {
            if (Array.isArray(this.currentObject)) {
                this.currentObject.forEach(obj => {
                    if (obj && obj.parent === this.scene) {
                        this.scene.remove(obj);
                    }
                });
            } else if (this.currentObject.parent === this.scene) {
                this.scene.remove(this.currentObject);
            }
        }
        
        try {
            // Create a function from the object code string
            // This is a simplified version - in production, this would need more security
            const createObjectFunction = new Function('THREE', 'scene', this.objectCode);
            
            // Execute the function with THREE and scene as parameters
            this.currentObject = createObjectFunction(THREE, this.scene);
            
            // Note: We don't throw an error if no object is returned
            // because objects might be added directly to the scene
            
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
     * @param {number} [index] - Index of object to update (if currentObject is an array)
     */
    updateObject(properties, index) {
        if (!this.currentObject) return;
        
        if (Array.isArray(this.currentObject)) {
            // If index is provided, update only that object
            if (index !== undefined && this.currentObject[index]) {
                const targetObject = this.currentObject[index];
                Object.keys(properties).forEach(key => {
                    if (typeof properties[key] === 'object' && targetObject[key]) {
                        Object.assign(targetObject[key], properties[key]);
                    } else {
                        targetObject[key] = properties[key];
                    }
                });
            } 
            // Otherwise update all objects with the same properties
            else {
                this.currentObject.forEach(obj => {
                    if (obj) {
                        Object.keys(properties).forEach(key => {
                            if (typeof properties[key] === 'object' && obj[key]) {
                                Object.assign(obj[key], properties[key]);
                            } else {
                                obj[key] = properties[key];
                            }
                        });
                    }
                });
            }
        } 
        // Single object case
        else {
            Object.keys(properties).forEach(key => {
                if (typeof properties[key] === 'object' && this.currentObject[key]) {
                    Object.assign(this.currentObject[key], properties[key]);
                } else {
                    this.currentObject[key] = properties[key];
                }
            });
        }
    }
    
    /**
     * Get current object state
     * @param {number} [index] - Index of object to get state for (if currentObject is an array)
     * @returns {Object|Array} Object state or array of object states
     */
    getObjectState(index) {
        if (!this.currentObject) return null;
        
        // Helper function to get state for a single object
        const getStateForObject = (obj) => {
            return {
                position: {
                    x: obj.position.x,
                    y: obj.position.y,
                    z: obj.position.z
                },
                rotation: {
                    x: obj.rotation.x,
                    y: obj.rotation.y,
                    z: obj.rotation.z
                },
                scale: {
                    x: obj.scale.x,
                    y: obj.scale.y,
                    z: obj.scale.z
                }
            };
        };
        
        if (Array.isArray(this.currentObject)) {
            // If index is provided, return state for that object
            if (index !== undefined && this.currentObject[index]) {
                return getStateForObject(this.currentObject[index]);
            }
            // Otherwise return array of states
            else {
                return this.currentObject.map(obj => obj ? getStateForObject(obj) : null);
            }
        }
        // Single object case
        else {
            return getStateForObject(this.currentObject);
        }
    }
    
}

// Export the SceneObjectManager class
export default SceneObjectManager;

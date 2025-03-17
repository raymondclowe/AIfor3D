/**
 * STL Exporter Module
 * Handles exporting Three.js objects to STL format
 */

/**
 * Calculate alignment transformation based on camera orientation
 * @param {THREE.Camera} camera - The scene camera
 * @returns {THREE.Matrix4} - Transformation matrix to align with grid
 */
function calculateAlignmentTransform(camera) {
    if (!camera) {
        console.warn('No camera found, using identity matrix');
        return new THREE.Matrix4().identity();
    }
    
    // Create target orientation aligned with grid
    const targetUp = new THREE.Vector3(0, 1, 0);
    const targetForward = new THREE.Vector3(0, 0, -1);
    
    // Get current camera orientation
    const cameraForward = new THREE.Vector3();
    camera.getWorldDirection(cameraForward);
    const cameraUp = camera.up.clone();
    
    // Create quaternion to align camera orientation with target
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(cameraForward, targetForward);
    
    // Create transformation matrix
    const matrix = new THREE.Matrix4();
    matrix.makeRotationFromQuaternion(quaternion);
    
    return matrix;
}

/**
 * Export object code as STL file
 * @param {string} objectCode - Three.js code as a string
 * @param {THREE.Group} [sceneGroup] - Optional scene group to export directly
 */
export function exportSTL(objectCode, sceneGroup) {
    // Check if STLExporter is available
    if (!THREE.STLExporter) {
        console.error('STLExporter not found. Make sure it is loaded.');
        alert('STLExporter not found. Make sure it is loaded.');
        return;
    }

    try {
        // Create STL exporter
        const exporter = new THREE.STLExporter();
        let stlData;
        
        // If sceneGroup is provided, clone it and apply alignment
        if (sceneGroup) {
            // Create a temporary scene with aligned objects
            const tempScene = new THREE.Scene();
            
            // Get camera from scene manager or fallback to default
            let camera = null;
            if (window.app && window.app.sceneManager) {
                // Try different camera access methods
                if (typeof window.app.sceneManager.getCamera === 'function') {
                    camera = window.app.sceneManager.getCamera();
                } else if (window.app.sceneManager.camera) {
                    camera = window.app.sceneManager.camera;
                } else if (window.app.sceneManager.scene && 
                         window.app.sceneManager.scene.camera) {
                    camera = window.app.sceneManager.scene.camera;
                }
            }
            
            // Calculate alignment transformation
            const alignmentMatrix = calculateAlignmentTransform(camera);
            
            // Clone and transform each object
            sceneGroup.traverse(child => {
                if (child instanceof THREE.Mesh) {
                    const cloned = child.clone();
                    cloned.applyMatrix4(alignmentMatrix);
                    cloned.rotation.set(0, 0, 0);
                    tempScene.add(cloned);
                }
            });
            
            // Generate STL string (ASCII format) from the transformed scene
            stlData = exporter.parse(tempScene, { binary: false });
            
            // Debug log the transformation matrix
            console.log('Applied alignment matrix:', alignmentMatrix);
            
            // Clean up (remove references to help garbage collection)
            tempScene.clear();
        } else {
            // Create a temporary scene
            const tempScene = new THREE.Scene();
            
            // Create a function from the object code string
            const createObjectFunction = new Function('THREE', 'scene', objectCode);
            
            // Execute the function with THREE and tempScene as parameters
            createObjectFunction(THREE, tempScene);
            
            // Generate STL string (ASCII format) from the entire scene
            stlData = exporter.parse(tempScene, { binary: false });
        }
        
        // Create blob from STL data
        const blob = new Blob([stlData], { type: 'application/octet-stream' });
        
        // Create download link
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'object.stl';
        link.click();
        
        // Clean up
        URL.revokeObjectURL(link.href);
        
        console.log('STL export successful');
    } catch (error) {
        console.error('Error exporting STL:', error);
        alert('Error exporting STL: ' + error.message);
    }
}

/**
 * Initialize STL export functionality
 */
export function initSTLExport() {
    const exportButton = document.getElementById('btn-export-stl');
    
    if (!exportButton) {
        console.error('Export STL button not found');
        return;
    }
    
    exportButton.addEventListener('click', () => {
        // Get object code and scene group from object manager
        if (window.app && window.app.objectManager) {
            const objectCode = window.app.objectManager.getObjectCode();
            // Get the scene group from the scene manager
            const sceneGroup = window.app.sceneManager ? window.app.sceneManager.getSceneGroup() : null;
            exportSTL(objectCode, sceneGroup);
        } else {
            console.error('Object manager not found');
            alert('Object manager not found');
        }
    });
    
    console.log('STL export initialized');
}

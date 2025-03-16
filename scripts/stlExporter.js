/**
 * STL Exporter Module
 * Handles exporting Three.js objects to STL format
 */

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
        
        // If sceneGroup is provided, use it directly
        if (sceneGroup) {
            // Generate STL string (ASCII format) from the scene group
            stlData = exporter.parse(sceneGroup, { binary: false });
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

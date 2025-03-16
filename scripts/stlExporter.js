/**
 * STL Exporter Module
 * Handles exporting Three.js objects to STL format
 */

/**
 * Export object code as STL file
 * @param {string} objectCode - Three.js code as a string
 */
export function exportSTL(objectCode) {
    // Check if STLExporter is available
    if (!THREE.STLExporter) {
        console.error('STLExporter not found. Make sure it is loaded.');
        alert('STLExporter not found. Make sure it is loaded.');
        return;
    }

    try {
        // Create a temporary scene
        const tempScene = new THREE.Scene();
        
        // Create a function from the object code string
        const createObjectFunction = new Function('THREE', 'scene', objectCode);
        
        // Execute the function with THREE and tempScene as parameters
        const object = createObjectFunction(THREE, tempScene);
        
        if (!object) {
            throw new Error('Object code did not return an object');
        }
        
        // Create STL exporter
        const exporter = new THREE.STLExporter();
        
        // Generate STL string (binary format)
        const stlData = exporter.parse(object, { binary: true });
        
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
        // Get object code from object manager
        if (window.app && window.app.objectManager) {
            const objectCode = window.app.objectManager.getObjectCode();
            exportSTL(objectCode);
        } else {
            console.error('Object manager not found');
            alert('Object manager not found');
        }
    });
    
    console.log('STL export initialized');
}

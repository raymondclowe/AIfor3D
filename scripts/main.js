/**
 * Main application entry point
 * Initializes chat and 3D scene components
 * 
 * TODO: Add configuration options
 * TODO: Add error handling and logging
 * TODO: Add state management
 * TODO: Add command processing system
 */

import ChatManager from './chat.js';
import SceneManager from './threeScene.js';

class Application {
    constructor() {
        // Initialize chat manager
        this.chatManager = new ChatManager();
        
        // Initialize scene manager
        this.sceneManager = new SceneManager('3d-container');
        
        // Get object manager reference
        this.objectManager = this.sceneManager.getObjectManager();
        
        // Initialize application
        this.init();
    }
    
    /**
     * Initialize the application
     */
    init() {
        // Load dummy conversation
        this.chatManager.loadDummyConversation();
        
        // TODO: Add command processing integration between chat and 3D scene
        // TODO: Add event listeners for object manipulation commands
        
        console.log('Application initialized');
        console.log('Object template:', this.objectManager.getTemplate());
    }
    
    /**
     * Process a command from the chat
     * @param {string} command - Command to process
     * @returns {string} Response message
     */
    processCommand(command) {
        // TODO: Implement command processing
        // This will be expanded to handle various commands for 3D object manipulation
        
        if (command.toLowerCase().includes('cube')) {
            return 'Creating a cube...';
        } else if (command.toLowerCase().includes('sphere')) {
            return 'Creating a sphere...';
        } else if (command.toLowerCase().includes('rotate')) {
            return 'Rotating the object...';
        } else if (command.toLowerCase().includes('color')) {
            return 'Changing the color...';
        } else {
            return 'Command not recognized. Try asking about the cube or sphere.';
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new Application();
});

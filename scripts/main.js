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
        
        // Add event listener for toggle rotation button
        const toggleRotationBtn = document.getElementById('btn-toggle-rotation');
        if (toggleRotationBtn) {
            let rotationEnabled = true; // Start with rotation enabled
            toggleRotationBtn.addEventListener('click', () => {
                rotationEnabled = !rotationEnabled;
                this.sceneManager.toggleSceneRotation(rotationEnabled);
                toggleRotationBtn.textContent = rotationEnabled ? 'Disable Rotation' : 'Enable Rotation';
            });
            // Set initial button text
            toggleRotationBtn.textContent = 'Disable Rotation';
        }
        
        // TODO: Add command processing integration between chat and 3D scene
        // TODO: Add event listeners for object manipulation commands
        
        console.log('Application initialized');
        console.log('Object code:', this.objectManager.getObjectCode());
    }
    
    /**
     * Process a command from the chat
     * @param {string} command - Command to process
     * @returns {string} Response message
     */
    processCommand(command) {
        // TODO: Implement command processing
        // This will be expanded to handle various commands for 3D object manipulation
        
        if (command.toLowerCase().includes('rotate')) {
            return 'Rotating the object...';
        } else if (command.toLowerCase().includes('color')) {
            return 'Changing the color...';
        } else {
            return 'Command not recognized. Try asking about object manipulation.';
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new Application();
});

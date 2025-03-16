/**
 * Editor Panel Manager
 * Handles code editing, preview, and template management
 * 
 * TODO: Add syntax validation
 * TODO: Add error highlighting
 * TODO: Add undo/redo history
 * TODO: Add template presets
 */

class EditorPanel {
    constructor() {
        // DOM elements
        this.editorSection = document.getElementById('editor-section');
        this.editorToggle = document.getElementById('editor-toggle');
        this.editorContainer = document.getElementById('code-editor');
        this.previewButton = document.getElementById('preview-button');
        this.saveButton = document.getElementById('save-button');
        this.cancelButton = document.getElementById('cancel-button');
        this.threeSection = document.querySelector('.three-section');
        
        // State
        this.isExpanded = false;
        this.isPreviewMode = false;
        
        // Template versions
        this.mainTemplate = null;
        this.editorTemplate = null;
        
        // Reference to SceneObjectManager (will be set later)
        this.objectManager = null;
        
        // Initialize CodeMirror
        this.initCodeMirror();
        
        // Initialize event listeners
        this.initEventListeners();
    }
    
    /**
     * Initialize CodeMirror editor
     */
    initCodeMirror() {
        this.editor = CodeMirror(this.editorContainer, {
            mode: 'javascript',
            theme: 'monokai',
            lineNumbers: true,
            indentUnit: 4,
            tabSize: 4,
            autoCloseBrackets: true,
            matchBrackets: true,
            lineWrapping: true
        });
        
        // Set editor size to fill container
        this.editor.setSize('100%', '100%');
    }
    
    /**
     * Initialize event listeners
     */
    initEventListeners() {
        // Toggle editor panel
        this.editorToggle.addEventListener('click', () => this.togglePanel());
        
        // Preview button
        this.previewButton.addEventListener('click', () => this.previewTemplate());
        
        // Save button
        this.saveButton.addEventListener('click', () => this.saveTemplate());
        
        // Cancel button
        this.cancelButton.addEventListener('click', () => this.cancelChanges());
    }
    
    /**
     * Set the object manager reference
     * @param {SceneObjectManager} objectManager - The object manager
     */
    setObjectManager(objectManager) {
        this.objectManager = objectManager;
        
        // Initialize templates
        this.mainTemplate = this.objectManager.getTemplate();
        this.editorTemplate = this.mainTemplate;
        
        // Set initial editor content
        this.editor.setValue(this.mainTemplate);
    }
    
    /**
     * Toggle panel expansion/collapse
     */
    togglePanel() {
        this.isExpanded = !this.isExpanded;
        
        if (this.isExpanded) {
            this.editorSection.classList.add('expanded');
            this.editorToggle.textContent = 'Collapse';
            
            // Make editor header visible even when collapsed
            this.editorSection.style.height = '300px';
            
            // Update editor size after expansion
            setTimeout(() => {
                this.editor.refresh();
            }, 300);
        } else {
            this.editorSection.classList.remove('expanded');
            this.editorToggle.textContent = 'Expand';
            
            // Keep header visible when collapsed
            this.editorSection.style.height = '40px';
            
            // Cancel any preview when collapsing
            if (this.isPreviewMode) {
                this.cancelChanges();
            }
        }
    }
    
    /**
     * Preview the current template
     */
    previewTemplate() {
        if (!this.objectManager) return;
        
        // Get current editor content
        this.editorTemplate = this.editor.getValue();
        
        try {
            // Set the template and create a new object
            this.objectManager.setTemplate(this.editorTemplate);
            this.objectManager.createObject();
            
            // Set preview mode
            this.isPreviewMode = true;
            this.threeSection.classList.add('preview-mode');
            
            console.log('Preview mode activated');
        } catch (error) {
            console.error('Error previewing template:', error);
            alert('Error previewing template: ' + error.message);
        }
    }
    
    /**
     * Save the current template
     */
    saveTemplate() {
        if (!this.objectManager) return;
        
        // Get current editor content
        this.editorTemplate = this.editor.getValue();
        
        try {
            // Update the main template
            this.mainTemplate = this.editorTemplate;
            
            // Set the template and create a new object
            this.objectManager.setTemplate(this.mainTemplate);
            this.objectManager.createObject();
            
            // Exit preview mode
            this.isPreviewMode = false;
            this.threeSection.classList.remove('preview-mode');
            
            console.log('Template saved');
        } catch (error) {
            console.error('Error saving template:', error);
            alert('Error saving template: ' + error.message);
        }
    }
    
    /**
     * Cancel changes and revert to main template
     */
    cancelChanges() {
        if (!this.objectManager) return;
        
        try {
            // Reset editor content to main template
            this.editor.setValue(this.mainTemplate);
            
            // Reset template and create a new object
            this.objectManager.setTemplate(this.mainTemplate);
            this.objectManager.createObject();
            
            // Exit preview mode
            this.isPreviewMode = false;
            this.threeSection.classList.remove('preview-mode');
            
            console.log('Changes canceled');
        } catch (error) {
            console.error('Error canceling changes:', error);
            alert('Error canceling changes: ' + error.message);
        }
    }
}

// Initialize the editor panel when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create editor panel
    window.editorPanel = new EditorPanel();
    
    // Set initial height to show header
    document.getElementById('editor-section').style.height = '40px';
    
    // Wait for the application to initialize
    setTimeout(() => {
        // Get object manager reference from the application
        if (window.app && window.app.objectManager) {
            window.editorPanel.setObjectManager(window.app.objectManager);
        } else {
            console.error('Object manager not found');
        }
    }, 500);
});

export default EditorPanel;

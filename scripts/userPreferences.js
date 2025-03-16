/**
 * User Preferences Module
 * Handles storing and retrieving user preferences
 */

class UserPreferences {
    constructor() {
        // Default preferences
        this.defaults = {
            stlExportFormat: 'binary' // Default to binary STL format
        };
        
        // Load preferences from localStorage
        this.preferences = this.loadPreferences();
    }
    
    /**
     * Load preferences from localStorage
     * @returns {Object} User preferences
     */
    loadPreferences() {
        try {
            const storedPrefs = localStorage.getItem('userPreferences');
            if (storedPrefs) {
                return JSON.parse(storedPrefs);
            }
        } catch (error) {
            console.error('Error loading preferences:', error);
        }
        
        // Return default preferences if none found
        return { ...this.defaults };
    }
    
    /**
     * Save preferences to localStorage
     */
    savePreferences() {
        try {
            localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
        } catch (error) {
            console.error('Error saving preferences:', error);
        }
    }
    
    /**
     * Get a preference value
     * @param {string} key - Preference key
     * @returns {any} Preference value
     */
    get(key) {
        return this.preferences[key] !== undefined 
            ? this.preferences[key] 
            : this.defaults[key];
    }
    
    /**
     * Set a preference value
     * @param {string} key - Preference key
     * @param {any} value - Preference value
     */
    set(key, value) {
        this.preferences[key] = value;
        this.savePreferences();
    }
}

// Create singleton instance
const userPreferences = new UserPreferences();

export default userPreferences;

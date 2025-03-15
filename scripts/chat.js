/**
 * Chat functionality module
 * Handles message display, user input, and simulated responses
 * 
 * TODO: Implement real chat backend integration
 * TODO: Add message history persistence
 * TODO: Add user authentication
 * TODO: Add support for rich content (images, links, etc.)
 */

// Dummy conversation for demonstration
const dummyConversation = [
    { sender: 'bot', text: "Hello! I'm your virtual assistant. How can I help you today?" },
    { sender: 'user', text: "Can you show me a 3D model?" },
    { sender: 'bot', text: "Of course! You can see a 3D cube on the right. Feel free to rotate, zoom, and pan using your mouse." },
    { sender: 'user', text: "How do I interact with it?" },
    { sender: 'bot', text: "Left-click and drag to rotate, right-click and drag to pan, and use the scroll wheel to zoom in and out." }
];

class ChatManager {
    constructor() {
        this.chatHistory = document.getElementById('chat-history');
        this.userInput = document.getElementById('user-input');
        this.sendButton = document.getElementById('send-button');
        
        this.setupEventListeners();
    }
    
    // Initialize chat with dummy conversation
    loadDummyConversation() {
        dummyConversation.forEach(message => {
            this.addMessage(message.text, message.sender);
        });
        this.scrollToBottom();
    }
    
    // Add a new message to the chat
    addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        messageElement.textContent = text;
        this.chatHistory.appendChild(messageElement);
        this.scrollToBottom();
    }
    
    // Scroll chat to the bottom
    scrollToBottom() {
        this.chatHistory.scrollTop = this.chatHistory.scrollHeight;
    }
    
    // Set up event listeners for user input
    setupEventListeners() {
        // Handle send button click
        this.sendButton.addEventListener('click', () => {
            this.handleUserInput();
        });
        
        // Handle Enter key press
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleUserInput();
            }
        });
    }
    
    // Process user input
    handleUserInput() {
        const text = this.userInput.value.trim();
        if (text !== '') {
            this.addMessage(text, 'user');
            this.userInput.value = '';
            
            // TODO: Implement actual command processing
            // TODO: Add integration with 3D object manipulation
            
            // Simulate bot response after a short delay
            setTimeout(() => {
                this.addMessage(`I received: "${text}". This is a simulated response.`, 'bot');
            }, 1000);
        }
    }
}

// Export the ChatManager class
export default ChatManager;

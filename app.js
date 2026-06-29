// Rule-based Chatbot 'Aether' logic

// Document Elements
const chatMessages = document.getElementById('chat-messages');
const typingIndicator = document.getElementById('typing-indicator');
const inputForm = document.getElementById('input-form');
const userInput = document.getElementById('user-input');
const suggestionContainer = document.getElementById('suggestion-container');
const clearBtn = document.getElementById('clear-btn');

// Predefined Suggestions / Quick Replies
const initialSuggestions = [
    "Tell me a joke",
    "What time is it?",
    "What can you do?",
    "Who are you?"
];

// Predefined Jokes list
const jokes = [
    "Why don't scientists trust atoms? Because they make up everything!",
    "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "How do select statements in SQL stay warm? They wear outer joins!",
    "Why do programmers wear glasses? Because they can't C#!",
    "I told my computer I needed a break, and now it won't stop sending me kit-kats.",
    "What do you call a factory that makes okay products? A satisfactory!"
];

// Predefined conversational rules mapping regex pattern to response generator/string
const conversationRules = [
    {
        pattern: /\b(hello|hi|hey|greetings|howdy|yo|good\s+morning|good\s+afternoon|good\s+evening)\b/i,
        responses: [
            "Hello there! I am Aether, your virtual rule-based companion. How can I help you today?",
            "Hey! Glad you stopped by. What's on your mind?",
            "Greetings! I hope you're having a wonderful day. How can I assist you?"
        ]
    },
    {
        pattern: /\b(who\s+are\s+you|what\s+is\s+your\s+name|your\s+name|who\s+created\s+you|what\s+are\s+you)\b/i,
        responses: [
            "I am Aether, a lightweight chatbot built using predefined rules and pattern-matching logic.",
            "My name is Aether! I'm a rule-based AI assistant designed to demonstrate conversational flow.",
            "I'm Aether, created as a demonstration of pattern matching and natural language flow."
        ]
    },
    {
        pattern: /\b(help|what\s+can\s+you\s+do|features|options|commands|capabilities|what\s+do\s+you\s+know)\b/i,
        responses: [
            "I'm trained on predefined rules! Here is what I can do:\n\n1. 🌟 Tell you a **joke**\n2. 🕒 Give you the **current time and date**\n3. 👋 Answer greetings & small talk\n4. 🚀 Respond to quick replies\n\nTry asking me 'What time is it?' or 'Tell me a joke'!"
        ]
    },
    {
        pattern: /\b(time|date|day|current\s+time|what\s+time|what\s+is\s+the\s+date)\b/i,
        responses: () => {
            const now = new Date();
            const dateStr = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            const timeStr = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            return `The current date is **${dateStr}** and the local time is **${timeStr}**.`;
        }
    },
    {
        pattern: /\b(joke|jokes|make\s+me\s+laugh|funny|tell\s+a\s+joke)\b/i,
        responses: () => {
            const randomIndex = Math.floor(Math.random() * jokes.length);
            return `Here's one for you:\n\n*${jokes[randomIndex]}* 🤖😄`;
        }
    },
    {
        pattern: /\b(how\s+are\s+you|how\s+is\s+it\s+going|how's\s+it\s+going|how\s+do\s+you\s+do|are\s+you\s+ok)\b/i,
        responses: [
            "As a rule-based bot, I don't have feelings, but my code is running perfectly! Thanks for asking. How are you doing?",
            "I'm functioning at peak efficiency! Ready to process your rules and queries. How is your day going?",
            "Doing great! Ready to chat. What's new with you?"
        ]
    },
    {
        pattern: /\b(thank|thanks|thank\s+you|awesome|cool|great|perfect|wonderful)\b/i,
        responses: [
            "You're very welcome! I'm happy to help.",
            "Anytime! Let me know if there's anything else you need.",
            "Awesome! Glad I could make things clear for you."
        ]
    },
    {
        pattern: /\b(bye|goodbye|see\s+you|exit|talk\s+to\s+you\s+later|farewell)\b/i,
        responses: [
            "Goodbye! Have a fantastic rest of your day. Hope to chat again soon!",
            "Farewell! Take care and feel free to reopen this chat anytime.",
            "Bye! Don't hesitate to reach out if you need more jokes or information."
        ]
    }
];

// Fallback responses when no rules match
const fallbackResponses = [
    "I didn't quite catch that. Could you try rephrasing? Or choose one of the options below.",
    "Hmm, that query doesn't match any of my predefined rules. Try asking me for help to see what I can do!",
    "I'm still learning! Try using keywords like 'help', 'joke', 'time', or 'who are you'.",
    "I can't answer that yet. Try selecting one of the quick options below!"
];

// Format time utility for chat bubbles
function getFormattedTime() {
    const now = new Date();
    return now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

// Escape HTML tags to prevent XSS
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// Convert simple markdown-like syntax to HTML (*italic*, **bold**, \n newlines)
function formatMarkdown(text) {
    let html = escapeHTML(text);
    // Bold: **text** -> <strong>text</strong>
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic: *text* -> <em>text</em>
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Line breaks: \n -> <br>
    html = html.replace(/\n/g, '<br>');
    return html;
}

// Scroll chat window to bottom
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Append Message Bubble to DOM
function appendMessage(sender, text) {
    const bubble = document.createElement('div');
    bubble.classList.add('message-bubble', sender);
    
    const senderName = sender === 'user' ? 'You' : 'Aether';
    const timestamp = getFormattedTime();
    const formattedContent = formatMarkdown(text);
    
    bubble.innerHTML = `
        <div class="bubble-meta">${senderName} &bull; ${timestamp}</div>
        <div class="bubble-content">${formattedContent}</div>
    `;
    
    chatMessages.appendChild(bubble);
    scrollToBottom();
}

// Get Bot Response based on user input (Regex Matching Engine)
function getBotResponse(input) {
    const cleanInput = input.trim();
    
    // Cycle through all rules to find a match
    for (const rule of conversationRules) {
        if (rule.pattern.test(cleanInput)) {
            // If response is a function, execute it
            if (typeof rule.responses === 'function') {
                return rule.responses();
            }
            // Otherwise, pick a random response from the array
            const randomIndex = Math.floor(Math.random() * rule.responses.length);
            return rule.responses[randomIndex];
        }
    }
    
    // Default fallback response if no match
    const randomFallbackIndex = Math.floor(Math.random() * fallbackResponses.length);
    return fallbackResponses[randomFallbackIndex];
}

// Simulate bot typing effect with dynamic delay
function triggerBotResponse(userMsg) {
    // Show typing indicator
    typingIndicator.style.display = 'block';
    scrollToBottom();
    
    // Disable inputs during typing simulation to enhance realism
    userInput.disabled = true;
    const sendBtn = inputForm.querySelector('button');
    if (sendBtn) sendBtn.disabled = true;

    // Simulate thinking delay between 600ms and 1100ms
    const delay = 600 + Math.random() * 500;
    
    setTimeout(() => {
        // Hide typing indicator
        typingIndicator.style.display = 'none';
        
        // Re-enable inputs
        userInput.disabled = false;
        if (sendBtn) sendBtn.disabled = false;
        userInput.focus();
        
        // Get and output bot response
        const botResponseText = getBotResponse(userMsg);
        appendMessage('bot', botResponseText);
    }, delay);
}

// Populate Quick Suggestions Chips
function renderSuggestions(suggestionsArray) {
    suggestionContainer.innerHTML = '';
    suggestionsArray.forEach(suggestion => {
        const chip = document.createElement('button');
        chip.classList.add('suggestion-chip');
        chip.textContent = suggestion;
        chip.type = 'button';
        chip.addEventListener('click', () => {
            handleUserMessage(suggestion);
        });
        suggestionContainer.appendChild(chip);
    });
}

// Main logic to process user input
function handleUserMessage(message) {
    if (!message || message.trim() === '') return;
    
    // Append user's message
    appendMessage('user', message);
    
    // Clear Input
    userInput.value = '';
    
    // Trigger Bot Response
    triggerBotResponse(message);
}

// Event Listeners
inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleUserMessage(userInput.value);
});

// Clear Chat Action
clearBtn.addEventListener('click', () => {
    chatMessages.innerHTML = '';
    initializeChat();
});

// Initialize the Chat on load
function initializeChat() {
    // Set initial suggestion chips
    renderSuggestions(initialSuggestions);
    
    // Intro sequence
    typingIndicator.style.display = 'block';
    setTimeout(() => {
        typingIndicator.style.display = 'none';
        appendMessage('bot', "Hello! I am **Aether**, your custom rule-based chatbot.\n\nI parse your messages using pattern matching algorithms to give instant responses. You can click on the suggestions below or type your own question to test me out!");
    }, 400);
}

// Kick off
initializeChat();

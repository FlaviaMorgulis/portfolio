// Chat Widget Functionality
const chatButton = document.getElementById("chatButton");
const chatWindow = document.getElementById("chatWindow");
const closeChat = document.getElementById("closeChat");
const chatInput = document.getElementById("chatInput");
const sendMessage = document.getElementById("sendMessage");
const chatMessages = document.getElementById("chatMessages");
const voiceButton = document.getElementById("voiceButton");
const speakerButton = document.getElementById("speakerButton");

// Voice settings
let voiceEnabled = true;
let recognition = null;
let isListening = false;

// Initialize Speech Recognition
if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    chatInput.value = transcript;
    isListening = false;
    voiceButton.classList.remove("listening");
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    isListening = false;
    voiceButton.classList.remove("listening");
  };

  recognition.onend = () => {
    isListening = false;
    voiceButton.classList.remove("listening");
  };
} else {
  // Hide voice button if not supported
  voiceButton.style.display = "none";
}

// Toggle chat window
chatButton.addEventListener("click", () => {
  chatWindow.classList.remove("chat-hidden");
  chatInput.focus();
});

closeChat.addEventListener("click", () => {
  chatWindow.classList.add("chat-hidden");
});

// Send message function
async function sendChatMessage() {
  const message = chatInput.value.trim();

  if (!message) return;

  // Add user message to chat
  addMessage(message, "user");
  chatInput.value = "";

  // Show typing indicator
  const typingIndicator = addTypingIndicator();

  try {
    // Send message to backend
    const response = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: message }),
    });

    const data = await response.json();

    // Remove typing indicator
    typingIndicator.remove();

    // Add bot response
    addMessage(data.response, "bot");

    // Speak the response if voice is enabled
    if (voiceEnabled) {
      speakText(data.response);
    }
  } catch (error) {
    typingIndicator.remove();
    addMessage("Sorry, something went wrong. Please try again.", "bot");
    console.error("Error:", error);
  }
}

// Add message to chat
function addMessage(text, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.className = sender === "user" ? "user-message" : "bot-message";

  const messagePara = document.createElement("p");
  messagePara.textContent = text;

  messageDiv.appendChild(messagePara);
  chatMessages.appendChild(messageDiv);

  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add typing indicator
function addTypingIndicator() {
  const typingDiv = document.createElement("div");
  typingDiv.className = "bot-message typing-indicator";
  typingDiv.innerHTML = "<p>Typing...</p>";
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return typingDiv;
}

// Event listeners
sendMessage.addEventListener("click", sendChatMessage);

chatInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendChatMessage();
  }
});

// Voice input button
voiceButton.addEventListener("click", () => {
  if (!recognition) {
    alert(
      "Speech recognition is not supported in this browser. Please use Chrome or Edge.",
    );
    return;
  }

  if (isListening) {
    recognition.stop();
    isListening = false;
    voiceButton.classList.remove("listening");
  } else {
    recognition.start();
    isListening = true;
    voiceButton.classList.add("listening");
  }
});

// Speaker toggle button
speakerButton.addEventListener("click", () => {
  voiceEnabled = !voiceEnabled;
  speakerButton.classList.toggle("muted", !voiceEnabled);

  if (!voiceEnabled) {
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
  }
});

// Text-to-speech function
function speakText(text) {
  if (!("speechSynthesis" in window)) {
    console.warn("Text-to-speech is not supported in this browser");
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  // Try to use a British female voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice =
    voices.find(
      (voice) =>
        voice.lang.startsWith("en-GB") &&
        voice.name.toLowerCase().includes("female"),
    ) ||
    voices.find((voice) => voice.lang.startsWith("en-GB")) ||
    voices.find(
      (voice) =>
        voice.lang.startsWith("en") &&
        voice.name.toLowerCase().includes("female"),
    ) ||
    voices.find((voice) => voice.lang.startsWith("en"));

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  window.speechSynthesis.speak(utterance);
}

// Load voices when they're ready
if ("speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    window.speechSynthesis.getVoices();
  };
}

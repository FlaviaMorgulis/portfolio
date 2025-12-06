// Chat Widget Functionality
const chatButton = document.getElementById("chatButton");
const chatWindow = document.getElementById("chatWindow");
const closeChat = document.getElementById("closeChat");
const chatInput = document.getElementById("chatInput");
const sendMessage = document.getElementById("sendMessage");
const chatMessages = document.getElementById("chatMessages");

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

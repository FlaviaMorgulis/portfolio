// Typewriter effect with 3 words cycling
const words = ["Technical Skills", "My Expertise", "What I Know"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const titleElement = document.getElementById("typewriter-title");
const typingSpeed = 100;
const deletingSpeed = 50;
const delayBetweenWords = 2000;

function type() {
  const currentWord = words[wordIndex];

  if (isDeleting) {
    titleElement.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
  } else {
    titleElement.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? deletingSpeed : typingSpeed;

  if (!isDeleting && charIndex === currentWord.length) {
    delay = delayBetweenWords;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
  }

  setTimeout(type, delay);
}

// Start typing when page loads
setTimeout(type, 500);

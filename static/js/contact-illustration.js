// Matrix-style binary rain for contact page
const canvas = document.getElementById("contact-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create binary code streams across entire page
function createBinaryStreams() {
  const streams = [];
  const numStreams = Math.floor(canvas.width / 50); // Stream every 50px

  for (let i = 0; i < numStreams; i++) {
    const x = Math.random() * canvas.width;
    const speed = 1 + Math.random() * 1.5;
    const chars = [];

    const streamLength = 25;
    for (let j = 0; j < streamLength; j++) {
      chars.push({
        char: Math.random() > 0.5 ? "1" : "0",
        y: -j * 20 - Math.random() * canvas.height,
        alpha: 1 - j / 25,
      });
    }

    streams.push({ x, speed, chars });
  }

  return streams;
}

let binaryStreams = createBinaryStreams();

// Draw binary streams
function drawBinaryStreams() {
  ctx.font = '14px "Courier New", monospace';
  ctx.textAlign = "center";

  binaryStreams.forEach((stream) => {
    stream.chars.forEach((char, index) => {
      char.y += stream.speed;

      if (char.y > canvas.height) {
        char.y = -20;
        char.char = Math.random() > 0.5 ? "1" : "0";
      }

      ctx.save();
      ctx.globalAlpha = char.alpha * 0.4;
      ctx.fillStyle = "#00ff41";
      ctx.shadowBlur = 5;
      ctx.shadowColor = "#00ff41";
      ctx.fillText(char.char, stream.x, char.y);
      ctx.restore();
    });
  });
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#0a0e27");
  gradient.addColorStop(0.5, "#16213e");
  gradient.addColorStop(1, "#1a1a2e");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw binary streams
  drawBinaryStreams();

  requestAnimationFrame(animate);
}

// Handle resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  binaryStreams = createBinaryStreams();
});

// Start animation
animate();

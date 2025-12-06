// Small Fibonacci golden ratio spiral for About page
const fibCanvas = document.getElementById("fibonacci-canvas");
const fibCtx = fibCanvas.getContext("2d");

fibCanvas.width = window.innerWidth;
fibCanvas.height = window.innerHeight;

let time = 0;

class FibParticle {
  constructor(angle, radius, index, position) {
    this.angle = angle;
    this.baseRadius = radius;
    this.radius = radius;
    this.index = index;
    this.size = Math.random() * 1.5 + 0.5;
    this.position = position;
  }

  update() {
    // Gentle rotation
    this.angle += 0.002;

    // Subtle pulsing
    this.radius = this.baseRadius + Math.sin(time + this.index * 0.1) * 2;

    // Position based on corner
    let offsetX, offsetY;
    if (this.position === "top-left") {
      offsetX = 250;
      offsetY = 250;
    } else {
      // bottom-right
      offsetX = fibCanvas.width - 250;
      offsetY = fibCanvas.height - 250;
    }

    this.x = offsetX + Math.cos(this.angle) * this.radius;
    this.y = offsetY + Math.sin(this.angle) * this.radius;
  }

  draw() {
    fibCtx.beginPath();
    fibCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

    // Golden/amber color scheme
    const hue = 45 + ((this.index * 0.5) % 60); // Gold to orange range
    const r = Math.sin((hue * Math.PI) / 180) * 127 + 200;
    const g = Math.sin(((hue + 60) * Math.PI) / 180) * 127 + 150;
    const b = 50;

    fibCtx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.7)`;
    fibCtx.shadowBlur = 8;
    fibCtx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.5)`;
    fibCtx.fill();
  }
}

const fibParticles = [];

// Create small Fibonacci spiral
function createFibonacciSpiral() {
  const totalParticles = 80; // Small spiral
  const positions = ["top-left", "bottom-right"];

  positions.forEach((position) => {
    for (let i = 0; i < totalParticles; i++) {
      const angle = i * 2.39996323; // Golden angle
      const radius = Math.sqrt(i) * 8; // Smaller scale
      fibParticles.push(new FibParticle(angle, radius, i, position));
    }
  });
}

// Animation loop
function animateFibonacci() {
  fibCtx.clearRect(0, 0, fibCanvas.width, fibCanvas.height);

  time += 0.01;
  fibParticles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  requestAnimationFrame(animateFibonacci);
}

// Window resize
window.addEventListener("resize", () => {
  fibCanvas.width = window.innerWidth;
  fibCanvas.height = window.innerHeight;
});

// Initialize
createFibonacciSpiral();
animateFibonacci();

// Particle animation that follows mouse
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
let mouse = {
  x: null,
  y: null,
  radius: 150,
};

// Track mouse position
window.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
});

// Particle class with colorful gradients
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 3 + 1;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = Math.random() * 30 + 1;
  }

  draw() {
    // Create gradient for colorful effect
    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.size * 2
    );
    gradient.addColorStop(0, "rgba(0, 212, 255, 0.8)");
    gradient.addColorStop(0.5, "rgba(123, 47, 247, 0.6)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = gradient;
    ctx.shadowBlur = 8;
    ctx.shadowColor = "rgba(0, 212, 255, 0.5)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  update() {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    let maxDistance = mouse.radius;
    let force = (maxDistance - distance) / maxDistance;
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;

    if (distance < mouse.radius) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx / 10;
      }
      if (this.y !== this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy / 10;
      }
    }
  }
}

// Create particles
function init() {
  particlesArray = [];
  let numberOfParticles = (canvas.width * canvas.height) / 9000;
  for (let i = 0; i < numberOfParticles; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    particlesArray.push(new Particle(x, y));
  }
}

// Connect nearby particles with lines
function connectParticles() {
  for (let i = 0; i < particlesArray.length; i++) {
    for (let j = i + 1; j < particlesArray.length; j++) {
      let dx = particlesArray[i].x - particlesArray[j].x;
      let dy = particlesArray[i].y - particlesArray[j].y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120) {
        ctx.strokeStyle = `rgba(0, 212, 255, ${(1 - distance / 120) * 0.15})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
        ctx.stroke();
      }
    }
  }
}

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.shadowBlur = 0;

  connectParticles();

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();
  }

  requestAnimationFrame(animate);
}

// Resize canvas
window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

init();
animate();

// Centered spiral for projects page
const canvas = document.getElementById("projects-spiral-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
let time = 0;

// Particle class
class Particle {
  constructor(angle, radius, index) {
    this.angle = angle;
    this.baseRadius = radius;
    this.radius = radius;
    this.index = index;
    this.size = Math.random() * 2 + 1;
    this.offsetAngle = Math.random() * Math.PI * 2;
  }

  update() {
    // Spiral rotation
    this.angle += 0.01;

    // Pulsing effect
    this.radius = this.baseRadius + Math.sin(time + this.index * 0.1) * 10;

    // Calculate position - centered in the middle of the page
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    this.x = centerX + Math.cos(this.angle) * this.radius;
    this.y = centerY + Math.sin(this.angle) * this.radius;

    // Mouse interaction - particles move away from cursor
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 100) {
      const force = (100 - distance) / 100;
      this.x += (dx / distance) * force * 20;
      this.y += (dy / distance) * force * 20;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

    // Rainbow gradient colors
    const hue = (this.index * 3 + time * 20) % 360;
    const r = Math.sin((hue * Math.PI) / 180) * 127 + 128;
    const g = Math.sin(((hue + 120) * Math.PI) / 180) * 127 + 128;
    const b = Math.sin(((hue + 240) * Math.PI) / 180) * 127 + 128;

    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.8)`;
    ctx.shadowBlur = 15;
    ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.6)`;
    ctx.fill();
  }
}

const particles = [];

// Create spiral particles (single centered spiral)
function createSpiral() {
  const spiralArms = 5;
  const particlesPerArm = 50;

  for (let arm = 0; arm < spiralArms; arm++) {
    for (let i = 0; i < particlesPerArm; i++) {
      const angle =
        (i / particlesPerArm) * Math.PI * 4 + (arm * Math.PI * 2) / spiralArms;
      const radius = (i / particlesPerArm) * 200 + 20;
      particles.push(new Particle(angle, radius, arm * particlesPerArm + i));
    }
  }
}

// Draw connecting lines between nearby particles
function drawConnections() {
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 0.5;

  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 50) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

// Animation loop
function animate() {
  ctx.fillStyle = "rgba(10, 10, 30, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  time += 0.01;

  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  drawConnections();

  requestAnimationFrame(animate);
}

// Mouse tracking
canvas.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Window resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Initialize
createSpiral();
animate();

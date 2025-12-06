// Moving spiral made from particles
const canvas = document.getElementById("human-particles-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
let time = 0;

// Particle class
class Particle {
  constructor(angle, radius, index, spiralPos) {
    this.angle = angle;
    this.baseRadius = radius;
    this.radius = radius;
    this.index = index;
    this.size = Math.random() * 2 + 1;
    this.offsetAngle = Math.random() * Math.PI * 2;
    this.spiralPos = spiralPos; // Store spiral position
  }

  update() {
    // Spiral rotation
    this.angle += 0.01;

    // Pulsing effect
    this.radius = this.baseRadius + Math.sin(time + this.index * 0.1) * 10;

    // Calculate position - use spiral's designated position
    const centerX = canvas.width * this.spiralPos.x;
    const centerY = canvas.height * this.spiralPos.y;

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

    // Gradient color based on angle
    const colorIndex = (this.angle + time * 0.5) % (Math.PI * 2);
    const r = Math.floor(Math.sin(colorIndex) * 127 + 128);
    const g = Math.floor(Math.sin(colorIndex + (Math.PI * 2) / 3) * 127 + 128);
    const b = Math.floor(Math.sin(colorIndex + (Math.PI * 4) / 3) * 127 + 128);

    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.8)`;
    ctx.shadowBlur = 15;
    ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.6)`;
    ctx.fill();
  }
}

const particles = [];

// Create multiple spirals across the page
function createSpiral() {
  const spiralArms = 5;
  const particlesPerArm = 40;

  // Create multiple spirals at different positions
  const spiralPositions = [
    { x: 0.25, y: 0.3, scale: 0.8 },
    { x: 0.75, y: 0.3, scale: 0.8 },
    { x: 0.5, y: 0.5, scale: 1.2 },
    { x: 0.2, y: 0.7, scale: 0.7 },
    { x: 0.8, y: 0.7, scale: 0.7 },
  ];

  spiralPositions.forEach((pos, spiralIndex) => {
    for (let arm = 0; arm < spiralArms; arm++) {
      for (let i = 0; i < particlesPerArm; i++) {
        const angle =
          (i / particlesPerArm) * Math.PI * 4 +
          (arm * Math.PI * 2) / spiralArms +
          spiralIndex * 0.5;
        const radius = (i / particlesPerArm) * 150 * pos.scale + 15;
        particles.push(
          new Particle(
            angle,
            radius,
            arm * particlesPerArm + i + spiralIndex * 1000,
            pos
          )
        );
      }
    }
  });
}

createSpiral();

// Mouse tracking
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  time += 0.02;

  // Draw connections between nearby particles
  particles.forEach((p1, i) => {
    if (i % 5 === 0) {
      // Only draw some connections to avoid clutter
      particles.forEach((p2, j) => {
        if (i < j && Math.abs(i - j) < 3) {
          p1.update();
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 50) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.3 * (1 - distance / 50)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
    }
  });

  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  requestAnimationFrame(animate);
}

animate();

// Resize handler
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

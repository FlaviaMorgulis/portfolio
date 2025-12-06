// Galaxy Spiral made of particles for Skills page
const canvas = document.getElementById("fibonacci-rectangles-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let time = 0;

class GalaxyParticle {
  constructor(angle, radius, armIndex, index, type = "normal") {
    this.angle = angle;
    this.baseRadius = radius;
    this.radius = radius;
    this.armIndex = armIndex;
    this.index = index;
    this.type = type; // 'core', 'star', 'dust', 'normal'

    // Varied particle sizes
    if (type === "star") {
      this.size = Math.random() * 2 + 2;
    } else if (type === "core") {
      this.size = Math.random() * 4 + 2;
    } else if (type === "dust") {
      this.size = Math.random() * 1 + 0.3;
    } else {
      this.size = (0.8 + radius / 250) * (Math.random() * 1.5 + 0.5);
    }

    // Random offset for variation
    this.radiusOffset = (Math.random() - 0.5) * (type === "dust" ? 50 : 25);
    this.angleOffset = (Math.random() - 0.5) * 0.4;
    this.offset = Math.random() * Math.PI * 2;

    // Color type
    this.colorType = Math.random();
    this.brightness = 0.7 + Math.random() * 0.3;
  }

  update() {
    // Differential rotation - faster near center like real galaxies
    let rotationSpeed;
    if (this.type === "core") {
      rotationSpeed = 0.002;
    } else {
      rotationSpeed = 0.0018 - (this.radius / 500) * 0.0012;
    }
    this.angle += rotationSpeed;

    // Gentle pulsing and turbulence
    const pulse = Math.sin(time * 0.4 + this.offset) * 1.5;
    const turbulence = Math.sin(time * 0.2 + this.index * 0.05) * 3;
    this.radius = this.baseRadius + this.radiusOffset + pulse + turbulence;

    // Center position
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    this.x = centerX + Math.cos(this.angle + this.angleOffset) * this.radius;
    this.y = centerY + Math.sin(this.angle + this.angleOffset) * this.radius;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

    const normalizedRadius = this.radius / 500;
    let r, g, b, alpha;

    // Bright stars scattered throughout
    if (this.type === "star") {
      r = 255;
      g = 250;
      b = 255;
      alpha = 0.8 + Math.sin(time * 2 + this.offset) * 0.2;
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.shadowBlur = 25 + Math.sin(time * 2 + this.offset) * 10;
      ctx.shadowColor = `rgba(255, 255, 255, 1)`;
      ctx.fill();
      return;
    }

    // Dust particles
    if (this.type === "dust") {
      const dustColor = Math.random();
      if (dustColor < 0.5) {
        r = 80 + Math.random() * 50;
        g = 50 + Math.random() * 40;
        b = 30;
      } else {
        r = 60;
        g = 40 + Math.random() * 30;
        b = 80 + Math.random() * 50;
      }
      alpha = 0.15 + Math.random() * 0.1;
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.shadowBlur = 3;
      ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.3)`;
      ctx.fill();
      return;
    }

    // Core particles - intense white/yellow
    if (normalizedRadius < 0.08 || this.type === "core") {
      const coreIntensity = 1 - normalizedRadius / 0.08;
      r = 255;
      g = 250 - coreIntensity * 20;
      b = 230 - coreIntensity * 100;
      alpha = 0.95;
    }
    // Inner arms - vibrant colors
    else if (normalizedRadius < 0.35) {
      const t = (normalizedRadius - 0.08) / 0.27;
      if (this.colorType < 0.25) {
        // Hot pink/magenta
        r = 255 - t * 50;
        g = 80 + t * 100;
        b = 255 - t * 80;
      } else if (this.colorType < 0.5) {
        // Orange/gold nebula
        r = 255;
        g = 160 + t * 40;
        b = 80 - t * 30;
      } else if (this.colorType < 0.75) {
        // Electric blue/cyan
        r = 80 - t * 30;
        g = 200 + t * 40;
        b = 255;
      } else {
        // Purple/violet
        r = 180 + t * 50;
        g = 100 - t * 50;
        b = 255;
      }
      alpha = 0.75 + Math.sin(time + this.offset) * 0.15;
    }
    // Outer arms - deeper space colors
    else {
      const t = (normalizedRadius - 0.35) / 0.65;
      if (this.colorType < 0.3) {
        // Deep purple/indigo
        r = 120 - t * 60;
        g = 60 - t * 40;
        b = 180 - t * 80;
      } else if (this.colorType < 0.6) {
        // Burnt orange/red (outer dust)
        r = 180 - t * 80;
        g = 80 - t * 60;
        b = 40 - t * 30;
      } else {
        // Deep blue
        r = 40 - t * 20;
        g = 80 - t * 50;
        b = 150 - t * 80;
      }
      alpha = (0.7 - t * 0.5) * this.brightness;
    }

    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;

    // Enhanced glow with color-specific intensity
    let blurSize;
    if (normalizedRadius < 0.1) {
      blurSize = 30 + this.size * 4;
    } else {
      blurSize = 15 + this.size * 2 + normalizedRadius * 10;
    }

    ctx.shadowBlur = blurSize;
    ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${Math.min(alpha * 1.2, 1)})`;
    ctx.fill();
  }
}

const particles = [];

// Create galaxy spiral with multiple arms
function createGalaxySpiral() {
  const numArms = 5;
  const particlesPerArm = 400;
  const maxRadius = 500;
  const tightness = 0.35;

  // Dense bright core
  for (let i = 0; i < 250; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 30 + Math.random() * Math.random() * 20;
    particles.push(new GalaxyParticle(angle, radius, -1, i, "core"));
  }

  // Scattered bright stars
  for (let i = 0; i < 80; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * maxRadius;
    particles.push(new GalaxyParticle(angle, radius, -1, i, "star"));
  }

  // Dust clouds
  for (let i = 0; i < 800; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 50 + Math.random() * (maxRadius - 50);
    particles.push(new GalaxyParticle(angle, radius, -1, i, "dust"));
  }

  // Spiral arms with varied density
  for (let arm = 0; arm < numArms; arm++) {
    const armOffset = (arm * Math.PI * 2) / numArms;

    for (let i = 0; i < particlesPerArm; i++) {
      const t = i / particlesPerArm;

      // Non-uniform distribution - denser in certain regions
      const density = 1 + Math.sin(t * Math.PI * 3) * 0.5;

      if (Math.random() < density) {
        const radius = Math.pow(t, 0.9) * maxRadius;
        const angle = armOffset + t * Math.PI * 7 * tightness;

        particles.push(new GalaxyParticle(angle, radius, arm, i, "normal"));

        // Add extra particles along arms for brightness variation
        if (Math.random() < 0.3) {
          const offset = (Math.random() - 0.5) * 0.2;
          particles.push(
            new GalaxyParticle(angle + offset, radius, arm, i, "normal")
          );
        }
      }
    }
  }
}

// Create static starfield background
function createStarfield() {
  // Create stars of different sizes
  const numStars = 400;

  for (let i = 0; i < numStars; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 1.5;
    const brightness = Math.random();

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);

    // White stars with varying brightness
    const alpha = 0.3 + brightness * 0.6;
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;

    if (brightness > 0.85) {
      // Bright stars get a glow
      ctx.shadowBlur = 4;
      ctx.shadowColor = `rgba(255, 255, 255, 0.8)`;
    }

    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Add some colored distant nebulae
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = 30 + Math.random() * 60;

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);

    // Random nebula colors
    const nebulaType = Math.random();
    if (nebulaType < 0.33) {
      gradient.addColorStop(0, "rgba(100, 50, 150, 0.08)");
      gradient.addColorStop(1, "rgba(100, 50, 150, 0)");
    } else if (nebulaType < 0.66) {
      gradient.addColorStop(0, "rgba(150, 80, 50, 0.08)");
      gradient.addColorStop(1, "rgba(150, 80, 50, 0)");
    } else {
      gradient.addColorStop(0, "rgba(50, 100, 150, 0.08)");
      gradient.addColorStop(1, "rgba(50, 100, 150, 0)");
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(x - size, y - size, size * 2, size * 2);
  }
}

// Draw static background once
function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#0a0e27");
  gradient.addColorStop(0.5, "#16213e");
  gradient.addColorStop(1, "#1a1a2e");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  createStarfield();
}

// Window resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawBackground();
});

// Initialize
drawBackground();

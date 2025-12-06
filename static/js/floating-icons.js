// Floating skill icons animation
const icons = document.querySelectorAll(".floating-icon");

icons.forEach((icon, index) => {
  // Random starting position
  const startX = Math.random() * window.innerWidth;
  const startY = Math.random() * window.innerHeight;

  icon.style.left = startX + "px";
  icon.style.top = startY + "px";

  // Random animation duration and delay
  const duration = 15 + Math.random() * 10; // 15-25 seconds
  const delay = Math.random() * 5; // 0-5 seconds delay

  icon.style.animationDuration = duration + "s";
  icon.style.animationDelay = delay + "s";

  // Mouse interaction
  let posX = startX;
  let posY = startY;
  let velocityX = (Math.random() - 0.5) * 2;
  let velocityY = (Math.random() - 0.5) * 2;

  function animate() {
    posX += velocityX;
    posY += velocityY;

    // Bounce off edges
    if (posX <= 0 || posX >= window.innerWidth - 60) {
      velocityX *= -1;
    }
    if (posY <= 0 || posY >= window.innerHeight - 60) {
      velocityY *= -1;
    }

    icon.style.left = posX + "px";
    icon.style.top = posY + "px";

    requestAnimationFrame(animate);
  }

  animate();
});

// Mouse interaction - icons move away from cursor
document.addEventListener("mousemove", (e) => {
  icons.forEach((icon) => {
    const rect = icon.getBoundingClientRect();
    const iconX = rect.left + rect.width / 2;
    const iconY = rect.top + rect.height / 2;

    const dx = iconX - e.clientX;
    const dy = iconY - e.clientY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 150) {
      const angle = Math.atan2(dy, dx);
      const force = (150 - distance) / 150;

      const currentLeft = parseFloat(icon.style.left);
      const currentTop = parseFloat(icon.style.top);

      icon.style.left = currentLeft + Math.cos(angle) * force * 10 + "px";
      icon.style.top = currentTop + Math.sin(angle) * force * 10 + "px";
    }
  });
});

// Add hover effect
icons.forEach((icon) => {
  icon.addEventListener("mouseenter", () => {
    icon.style.transform = "scale(1.5) rotate(360deg)";
  });

  icon.addEventListener("mouseleave", () => {
    icon.style.transform = "scale(1) rotate(0deg)";
  });
});

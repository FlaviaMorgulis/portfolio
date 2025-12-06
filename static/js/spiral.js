// 3D Spiral with multiple rings
const spiralContainer = document.querySelector(".spiral");

if (spiralContainer) {
  // Create multiple rings
  const numberOfRings = 8;

  for (let i = 0; i < numberOfRings; i++) {
    const ring = document.createElement("div");
    ring.className = "spiral-ring";

    // Set different rotations and delays for each ring
    const rotationX = (i * 45) % 360;
    const rotationY = (i * 30) % 360;
    const delay = i * 0.4;

    ring.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
    ring.style.animationDelay = `-${delay}s`;

    // Alternate colors
    if (i % 2 === 0) {
      ring.classList.add("cyan");
    } else {
      ring.classList.add("purple");
    }

    spiralContainer.appendChild(ring);
  }
}

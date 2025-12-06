// Parallax effect with 5 layers
const layers = document.querySelectorAll(".parallax-layer");

window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;

  layers.forEach((layer, index) => {
    const speed = (index + 1) * 0.15;
    const yPos = -(scrolled * speed);
    layer.style.transform = `translateY(${yPos}px)`;
  });
});

// Add mouse movement parallax
document.addEventListener("mousemove", (e) => {
  const mouseX = e.clientX / window.innerWidth - 0.5;
  const mouseY = e.clientY / window.innerHeight - 0.5;

  layers.forEach((layer, index) => {
    const depth = (index + 1) * 20;
    const moveX = mouseX * depth;
    const moveY = mouseY * depth;

    layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });
});

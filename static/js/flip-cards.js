// Flip cards on click (4 cards)
const flipCards = document.querySelectorAll(".flip-card");

flipCards.forEach((card) => {
  card.addEventListener("click", () => {
    card.querySelector(".flip-card-inner").classList.toggle("flipped");
  });
});

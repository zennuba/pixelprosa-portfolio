// ===== "Til toppen"-knap =====
// Laver en lille knap nederst til højre, der dukker op, når man har scrollet et stykke ned.
// Bruges på alle sider via global.js – derfor bygges den i JS i stedet for at stå i hver HTML-fil.

const SHOW_AFTER = 600; // vis knappen, når man har scrollet mere end 600 px ned

export function initBackToTop() {
  const link = document.createElement("a");
  link.className = "back-to-top";
  link.href = "#"; // "#" = toppen af siden. Blød scroll kommer fra scroll-behavior i _layout.scss
  link.innerHTML = `<span aria-hidden="true">↑</span> Til toppen`;
  document.body.append(link);

  // classList.toggle(klasse, betingelse): tilføjer klassen, når betingelsen er sand – ellers fjernes den
  function update() {
    link.classList.toggle("back-to-top--visible", window.scrollY > SHOW_AFTER);
  }

  window.addEventListener("scroll", update, { passive: true }); // passive: scroll bliver ikke langsommere
  update(); // tjek med det samme (fx hvis siden genindlæses midt på)
}

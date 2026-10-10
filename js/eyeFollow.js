// ===== Øjne der følger musen =====
// Et <img> er en "lukket kasse" – JS kan ikke se ind i det.
// Derfor henter vi SVG-filen som tekst og sætter den ind som rigtig <svg> i HTML'en.
// Så bliver pupillerne (class="pupil") elementer, vi kan flytte.

const MAX_MOVE = 6; // hvor langt pupillerne må bevæge sig (i SVG-enheder)

// 1. Byt <img> ud med den rigtige <svg>
async function inlineSvg(img) {
  const response = await fetch(img.src);

  // Sikkerhedstjek 1: blev filen fundet? (404 = ikke fundet)
  // Hvis ikke, lader vi det almindelige <img> blive stående.
  if (!response.ok) return null;

  const text = await response.text();

  // DOMParser laver teksten om til elementer, ligesom browseren gør med HTML
  const svg = new DOMParser().parseFromString(text, "image/svg+xml").documentElement;

  // Sikkerhedstjek 2: er det faktisk en <svg>? (en fejlside er HTML, ikke SVG)
  if (svg.nodeName !== "svg") return null;

  svg.classList.add(...img.classList); // behold klassen fra <img> (så CSS stadig virker)
  svg.setAttribute("aria-label", img.alt); // behold alt-teksten til skærmlæsere

  img.replaceWith(svg);
  return svg;
}

// 2. Flyt pupillerne i retning af musen
function followMouse(svg) {
  const pupils = [...svg.querySelectorAll(".pupil")];

  // Husk hvor hver pupil starter (midten af øjet)
  const start = pupils.map((pupil) => ({
    x: Number(pupil.getAttribute("cx")),
    y: Number(pupil.getAttribute("cy")),
  }));

  // viewBox-bredden bruges til at omregne mellem skærm-pixels og SVG-enheder
  const viewBoxWidth = svg.viewBox.baseVal.width;

  window.addEventListener("mousemove", (event) => {
    const box = svg.getBoundingClientRect(); // hvor står tegningen på skærmen?
    const scale = box.width / viewBoxWidth;

    // Midtpunktet mellem øjnene, omregnet til skærm-pixels.
    // Vi regner kun ÉN retning ud herfra, så begge øjne kigger samme vej (følges ad).
    const midX = start.reduce((sum, p) => sum + p.x, 0) / start.length;
    const midY = start.reduce((sum, p) => sum + p.y, 0) / start.length;
    const centerX = box.left + midX * scale;
    const centerY = box.top + midY * scale;

    // Pilen fra midtpunktet til musen
    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;
    const distance = Math.hypot(dx, dy) || 1; // || 1 undgår at dele med 0

    // Samme forskydning til begge pupiller: retning (pil gjort 1 lang) × MAX_MOVE
    const moveX = (dx / distance) * MAX_MOVE;
    const moveY = (dy / distance) * MAX_MOVE;

    pupils.forEach((pupil, i) => {
      pupil.setAttribute("cx", start[i].x + moveX);
      pupil.setAttribute("cy", start[i].y + moveY);
    });
  });
}

// 3. Det eneste vi eksporterer: én funktion, der gør det hele
export async function makeEyesFollow(img) {
  if (!img || !img.src.endsWith(".svg")) return; // virker kun på SVG-billeder

  const svg = await inlineSvg(img);
  if (!svg) return; // noget gik galt: behold billedet, som det er

  // Respektér brugere, der har slået animationer fra (tilgængelighed)
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) followMouse(svg);
}

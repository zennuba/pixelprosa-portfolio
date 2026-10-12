// lightbox.js – viser et billede i stort format, når man klikker på det
//
// Sådan virker det:
// 1. Vi laver ÉN <dialog> (HTML's indbyggede pop-up) og lægger den nederst i <body>.
// 2. Vi lytter efter klik på hele case-siden (event delegation) i stedet for på hvert billede.
//    Det virker også for billeder, der først bliver lavet af JavaScript bagefter.
// 3. Klikker man på en .case__zoom-knap, kopieres billedets src, alt og billedtekst over i dialogen.
// 4. Dialogen lukkes med krydset, ved klik udenfor billedet eller med Esc (det klarer <dialog> selv).

export function initLightbox(container) {
  const dialog = document.createElement("dialog");
  dialog.className = "lightbox";
  dialog.innerHTML = `
    <button class="lightbox__close" type="button" aria-label="Luk billedet">×</button>
    <figure class="lightbox__figure">
      <img class="lightbox__image" src="" alt="">
      <figcaption class="lightbox__caption"></figcaption>
    </figure>`;
  document.body.append(dialog);

  const bigImage = dialog.querySelector(".lightbox__image");
  const caption = dialog.querySelector(".lightbox__caption");
  const closeButton = dialog.querySelector(".lightbox__close");

  // Åbn: closest() finder knappen, også hvis man klikker direkte på billedet inde i den
  container.addEventListener("click", (event) => {
    const button = event.target.closest(".case__zoom");
    if (!button) return;

    const image = button.querySelector("img");
    bigImage.src = image.dataset.full || image.src; // den store udgave, hvis den findes
    bigImage.alt = image.alt;
    caption.textContent = image.dataset.caption || "";
    caption.hidden = !image.dataset.caption; // ingen billedtekst = ingen tom linje

    dialog.showModal();
  });

  // Luk med krydset
  closeButton.addEventListener("click", () => dialog.close());

  // Luk ved klik på det mørke område uden om billedet.
  // Klikker man på billedet, er event.target billedet – klikker man udenfor, er det selve dialogen.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}

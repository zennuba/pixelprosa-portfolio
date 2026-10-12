// ===== Kontaktsektion =====
// Bygges ud fra data/contact.json.
// Tomme felter ("") vises ikke.

class ContactSection {
  constructor(data) {
    this.data = data;
  }

  // Lille ikon foran et link. Genbruger ikon-klasserne fra headeren (.icon-link__icon--github osv.).
  // aria-hidden: ikonet er pynt – linkteksten fortæller allerede, hvor man kommer hen.
  #icon(name) {
    return `<span class="contact__icon icon-link__icon icon-link__icon--${name}" aria-hidden="true"></span>`;
  }

  // Hovedknap + de små tekst-links under den
  #links() {
    const { email, phone, linkedin, github, cv } = this.data;
    const tel = phone ? `tel:${phone.replace(/\s/g, "")}` : "";
    const links = [];

    // Hovedknappen: mail hvis den findes, ellers telefon
    const main = email
      ? `<a class="contact__button" href="mailto:${email}">Skriv til mig</a>`
      : `<a class="contact__button" href="${tel}">Ring til mig</a>`;

    if (email) links.push(`<button class="contact__link contact__copy" type="button" data-copy="${email}">${email} <span class="contact__copy-label">· kopiér</span></button>`);
    if (email && phone) links.push(`<a class="contact__link" href="${tel}">${phone}</a>`);
    if (linkedin) links.push(`<a class="contact__link" href="${linkedin}" target="_blank" rel="noopener noreferrer">${this.#icon("linkedin")}LinkedIn</a>`);
    if (github) links.push(`<a class="contact__link" href="${github}" target="_blank" rel="noopener noreferrer">${this.#icon("github")}GitHub</a>`);
    if (cv) links.push(`<a class="contact__link" href="${cv}" download>${this.#icon("download")}Download CV</a>`);

    return `
      <div class="contact__actions">
        ${main}
        <ul class="contact__links">${links.map((link) => `<li>${link}</li>`).join("")}</ul>
      </div>
      <p class="visually-hidden" aria-live="polite" data-copy-status></p>`;
  }

  render() {
    const { available, intro } = this.data;

    const section = document.createElement("section");
    section.className = "home-section contact";
    section.id = "kontakt";
    section.setAttribute("aria-labelledby", "kontakt-titel");
    section.innerHTML = `
      <p class="home-eyebrow">Næste skridt</p>
      <h2 class="contact__title" id="kontakt-titel">
        Lad os skabe noget <em class="contact__accent">sammen.</em>
      </h2>
      <p class="contact__intro">${intro} <span class="contact__available">${available}</span></p>
      ${this.#links()}`;

    this.#enableCopy(section);
    return section;
  }

  // Klik på mailen: kopiér den, og vis "kopieret ✓" i 2 sekunder
  #enableCopy(section) {
    const button = section.querySelector("[data-copy]");
    if (!button) return;
    const label = button.querySelector(".contact__copy-label");
    const status = section.querySelector("[data-copy-status]");

    button.addEventListener("click", async () => {
      await navigator.clipboard.writeText(button.dataset.copy);
      label.textContent = "· kopieret ✓";
      status.textContent = "Mailadressen er kopieret"; // læses højt af skærmlæsere
      setTimeout(() => (label.textContent = "· kopiér"), 2000);
    });
  }
}

export { ContactSection };

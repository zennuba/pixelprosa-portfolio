import { ToolOverview } from "./js/toolOverview.js";

//------------ CasePage sektion---------------------
// Casen er bygget som en ARTIKEL, ikke en formular:
//  1. Hero: spørgsmål + indledning + stort billede
//  2. Sidekolonne med fakta (rolle, periode, tools …)
//  3. Historien i kapitler: Udfordringen → Processen → Løsningen → Test → Målet → Det lærte jeg
//  4. Refleksionen som citat til sidst
// JSON-felterne er de samme som før – det er kun MÅDEN, de vises på, der er ændret.

class CasePage {
  constructor(caseData, images, icons) {
    this.caseData = caseData;
    this.images = images;
    this.icons = icons;
  }

  // ET KAPITEL i historien.
  // ...parts = "rest parameter": alle de felter, man giver med, samles i ét array.
  // Tekst bliver til <p>, arrays bliver til en liste. Tomme felter springes over,
  // og er ALLE tomme, vises kapitlet slet ikke.
  #chapter(title, ...parts) {
    const body = parts
      .filter((part) => part && part.length > 0)
      .map((part) =>
        Array.isArray(part)
          ? `<ul class="case__list">${part.map((item) => `<li>${item}</li>`).join("")}</ul>`
          : `<p>${part}</p>`,
      )
      .join("");

    if (!body) return "";

    return `
      <section class="case__chapter">
        <h2 class="case__chapter-title">${title}</h2>
        ${body}
      </section>`;
  }

  // ét faktum (label + værdi), springes over hvis tomt
  #fact(label, value) {
    if (!value) return "";
    return `<div class="case__fact"><dt>${label}</dt><dd>${value}</dd></div>`;
  }

  // Periode: "2026-04-07" → "apr. 2026". toLocaleDateString formaterer datoen på dansk.
  #period(date) {
    if (!date || !date.start) return "";
    const format = (iso) =>
      new Date(iso).toLocaleDateString("da-DK", { month: "short", year: "numeric" });
    return date.end ? `${format(date.start)} – ${format(date.end)}` : format(date.start);
  }

  // Links til prototype, GitHub og Figma (kun dem, der findes i JSON'en)
  #links(links) {
    if (!links) return "";
    const names = { prototype: "Se prototypen", github: "Koden på GitHub", figma: "Designet i Figma" };

    const items = Object.entries(links) // { github: "url" } → [["github", "url"]]
      .filter(([, url]) => url)
      .map(([key, url]) => `<li><a href="${url}" target="_blank" rel="noopener">${names[key] || key}</a></li>`)
      .join("");

    return items ? `<ul class="case__links">${items}</ul>` : "";
  }

  // finder et billede i image.json via id og laver et <img>
  // 1. find billedet  2. findes det ikke → vis ingenting  3. ellers → lav <img>
  #image(id) {
    const img = this.images.find((image) => image.id === id);
    if (!img) return "";
    return `<img class="case__image" src="${img.src}" alt="${img.alt}">`;
  }

  // Tegningen i heroen: lille "spot-illustration" ved siden af teksten – teksten er hovedsagen
  #heroImage(id) {
    const image = this.#image(id);
    return image ? `<figure class="case__hero-image">${image}</figure>` : "";
  }

  // GEST-statistik i et proces-trin (genbruger .gest-komponenten fra _gest.scss)
  // Tallet gemmes som tal i JSON'en og bruges to steder:
  // som tekst ("51,6 %") og som bjælkens længde (--value: 51.6)
  #stats(stats) {
    if (!stats || !stats.items || stats.items.length === 0) return "";

    const items = stats.items
      .map((item) => {
        const text = item.value.toLocaleString("da-DK", { minimumFractionDigits: 1 });
        return `
          <li class="gest__item gest__item--${item.color}">
            <span class="gest__value">${text} %</span>
            <span class="gest__label">${item.label}</span>
            <span class="gest__bar" style="--value: ${item.value}"></span>
          </li>`;
      })
      .join("");

    return `
      <section class="gest">
        <h4 class="gest__title">${stats.title}</h4>
        <ul class="gest__list">${items}</ul>
      </section>`;
  }

  // Processen: trinene ER en rækkefølge, derfor en nummereret liste (<ol>)
  #process(steps) {
    if (!steps || steps.length === 0) return "";

    const items = steps
      .map((step) => {
        const images = (step.images || []).map((id) => this.#image(id)).join("");

        // Uden billeder får teksten hele bredden (modifier --text-only)
        const modifier = images ? "" : " case__step--text-only";

        return `
          <li class="case__step${modifier}">
            <div class="case__step-text">
              <h3 class="case__step-title">${step.step}</h3>
              ${step.question ? `<p class="case__step-question"><strong>${step.question}</strong></p>` : ""}
              <p>${step.text || ""}</p>
              ${this.#stats(step.stats)}
            </div>
            ${images ? `<div class="case__step-media">${images}</div>` : ""}
          </li>`;
      })
      .join("");

    return `
      <section class="case__chapter case__chapter--wide">
        <h2 class="case__chapter-title">Processen</h2>
        <ol class="case__process">${items}</ol>
      </section>`;
  }

  // Refleksionen som citat – det sidste, læseren tager med sig
  #quote(text) {
    if (!text) return "";
    return `
      <figure class="case__quote">
        <blockquote><p>${text}</p></blockquote>
        <figcaption>Min refleksion</figcaption>
      </figure>`;
  }

  render(container) {
    const c = this.caseData;

    // Fanebladets titel følger samme mønster som de andre sider: "Side · PixelProsa Portfolio"
    document.title = `${c.title} · PixelProsa Portfolio`;

    // ToolOverview laver chips med ikon + navn – samme udseende som på Erfaring
    const overview = new ToolOverview("Tools og skills", c.tool, c.skill, this.icons);

    const article = document.createElement("article");
    article.className = "case";

    article.innerHTML = `
      <header class="case__hero">
        <div class="case__hero-text">
          <div class="page-title">
            <p class="page-title__kicker">${c.kicker}</p>
            <h1 class="page-title__heading">${c.title}</h1>
          </div>
          <p class="case__standfirst">${c.hook}</p>
          ${c.intro ? `<p class="case__intro">${c.intro}</p>` : ""}
        </div>
        ${this.#heroImage(c.heroImage)}
      </header>

      <div class="case__body">
        <aside class="case__facts" aria-label="Fakta om casen">
          <dl>
            ${this.#fact("Rolle", c.role)}
            ${this.#fact("Ansvar", c.responsibility)}
            ${this.#fact("Type", c.type)}
            ${this.#fact("Periode", this.#period(c.date))}
            ${this.#fact("Målgruppe", c.targetAudience)}
            ${this.#fact("Tools", overview.toolList())}
            ${this.#fact("Skills", overview.chipList(c.skill))}
            ${this.#fact("Metoder", overview.chipList(c.processMethod))}
            ${this.#fact("Se projektet", this.#links(c.links))}
          </dl>
        </aside>

        <div class="case__story">
          ${this.#chapter("Udfordringen", c.purpose, c.opportunities)}
          ${this.#process(c.process)}
          ${this.#chapter("Løsningen", c.finalSolution, c.design, c.prototype)}
          ${this.#chapter("Test og iteration", c.testIteration)}
          ${this.#chapter("Målet", c.achievementResult)}
          ${this.#chapter("Det lærte jeg", c.learning)}
        </div>
      </div>

      ${this.#quote(c.reflection)}
    `;

    container.append(article);
  }
}

//------------ PortfolioPage---------------------
class PortfolioPage {
  constructor(profile, projectGallery) {
    this.profile = profile;
    this.projectGallery = projectGallery;
  }

  render(container) {
    container.append(this.projectGallery.render());
  }
}

export { PortfolioPage, CasePage };

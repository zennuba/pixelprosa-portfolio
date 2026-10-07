//------------ CasePage sektion---------------------

//CasePage viser case study HVIS projektet har en

class CasePage {
  constructor(caseData, images, icons) {
    this.caseData = caseData;
    this.images = images;
    this.icons = icons;
  }

  //  (#): laver en sektion, men KUN hvis der er indhold
  #section(title, content) {
    if (!content || content.length === 0) return "";

    const body = Array.isArray(content)
      ? `<ul>${content.map((item) => `<li>${item}</li>`).join("")}</ul>`
      : `<p>${content}</p>`;

    return `
      <section class="case__section">
        <h2>${title}</h2>
        ${body}
      </section>`;
  }

  // ét faktum (label + værdi), springes over hvis tomt
  #fact(label, value) {
    if (!value) return "";
    return `<div><dt>${label}</dt><dd>${value}</dd></div>`;
  }

  // PRIVAT: en liste vist som tags
  #tags(label, list) {
    if (!list || list.length === 0) return "";
    const tags = list
      .map((item) => `<li class="project-card__category">${item}</li>`)
      .join("");
    return `<div><dt>${label}</dt><dd><ul class="case__tags">${tags}</ul></dd></div>`;
  }

  //  en liste vist som ikoner (fra tool.json + tech.json)
  // findes der intet ikon, vises navnet som tekst i stedet
  #iconTags(label, list) {
    if (!list || list.length === 0) return "";

    const items = list
      .map((name) => {
        const icon = this.icons.find((item) => item.name === name);
        if (!icon) return `<li class="project-card__category">${name}</li>`;
        return `<li class="case__icon"><img src="${icon.logo}" alt="${name}" title="${name}"></li>`;
      })
      .join("");

    return `<div><dt>${label}</dt><dd><ul class="case__tags">${items}</ul></dd></div>`;
  }

  // finder et billede i image.json via id og laver et <img>
  // 1. find billedet  2. findes det ikke → vis ingenting  3. ellers → lav <img>
  #image(id) {
    const img = this.images.find((image) => image.id === id);
    if (!img) return "";
    return `<img class="case__image" src="${img.src}" alt="${img.alt}">`;
  }

  // viser proces-trinene (Forstå, Undersøge …) med tekst og billeder
  #process(steps) {
    if (!steps || steps.length === 0) return "";

    // ét <li> for hvert trin
    const items = steps
      .map((step) => {
        const images = (step.images || [])
          .map((id) => this.#image(id))
          .join("");

        return `
          <li class="case__step">
            <div class="case__step-text">
              <p class="home-eyebrow">${step.ideoPhase || ""}</p>
              <h3>${step.step}</h3>
              <p>${step.text || ""}</p>
            </div>
            <div class="case__step-media">${images}</div>
          </li>`;
      })
      .join("");

    return `
      <section class="case__section">
        <h2>Proces</h2>
        <ol class="case__process">${items}</ol>
      </section>`;
  }

  render(container) {
    const c = this.caseData;
    const article = document.createElement("article");
    article.className = "case";

    article.innerHTML = `
      <header class="case__hero">
        <p class="home-eyebrow">${c.kicker}</p>
        <h1>${c.title}</h1>
        <p class="case__hook">${c.hook}</p>
        <p>${c.intro}</p>
        ${this.#image(c.heroImage)}
      </header>

      <dl class="case__facts">
        ${this.#fact("Rolle", c.role)}
        ${this.#fact("Type", c.type)}
        ${this.#fact("Målgruppe", c.targetAudience)}
        ${this.#tags("Skills", c.skill)}
        ${this.#iconTags("Tools", c.tool)}
        ${this.#tags("Metoder", c.processMethod)}
      </dl>

      ${this.#section("Formål", c.purpose)}
      ${this.#section("Ansvar", c.responsibility)}
      ${this.#section("Muligheder", c.opportunities)}
      ${this.#process(c.process)}
      ${this.#section("Design", c.design)}
      ${this.#section("Prototype", c.prototype)}
      ${this.#section("Læring", c.learning)}
      ${this.#section("Refleksion", c.reflection)}
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

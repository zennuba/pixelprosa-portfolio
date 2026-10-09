//------------ ToolOverview ---------------------
// Viser en oversigt over tools og skills som små "chips".
// Genbruges to steder:
//  - på Erfaring: hele oversigten med render()
//  - i casens faktaboks: kun listerne med toolList() og chipList()
//
// Tools vises med ikon + navn. Findes der intet ikon i tool.json/tech.json,
// vises kun navnet – så forsvinder et tool aldrig, selvom ikonet mangler.

class ToolOverview {
  constructor(title, tools, skills, icons) {
    this.title = title; // overskrift, fx "Tools og skills"
    this.tools = tools || []; // array af navne: ["Figma", "HTML"]
    this.skills = skills || []; // array af navne: ["User Experience"]
    this.icons = icons || []; // array fra tool.json + tech.json: { name, logo }
  }

  // Ét tool: find ikonet ud fra navnet
  #toolItem(name) {
    const icon = this.icons.find((item) => item.name === name);

    // alt="" fordi navnet står lige ved siden af – ellers læser skærmlæseren det to gange
    const image = icon && icon.logo
      ? `<img class="tool-overview__icon" src="${icon.logo}" alt="" width="20" height="20" loading="lazy">`
      : "";

    return `<li class="tool-overview__item">${image}${name}</li>`;
  }

  // OFFENTLIG: tools som <ul> med ikon + navn (bruges også i casens faktaboks)
  toolList() {
    if (this.tools.length === 0) return "";
    return `<ul class="tool-overview__list">${this.tools.map((name) => this.#toolItem(name)).join("")}</ul>`;
  }

  // OFFENTLIG: en liste af navne som tekst-chips (skills, metoder …)
  chipList(names) {
    if (!names || names.length === 0) return "";
    const items = names
      .map((name) => `<li class="tool-overview__item tool-overview__item--skill">${name}</li>`)
      .join("");
    return `<ul class="tool-overview__list">${items}</ul>`;
  }

  // Én gruppe med lille overskrift – springes over, hvis listen er tom
  // extraClass er valgfri – bruges til Skills, der skal fylde hele bredden
  #group(title, list, extraClass = "") {
    if (!list) return "";

    return `
      <div class="tool-overview__group ${extraClass}">
        <h3 class="tool-overview__title">${title}</h3>
        ${list}
      </div>`;
  }

  // Hvilken kategori hører et tool til? Står i "category" i tool.json/tech.json.
  // Mangler den, havner toolet under "Tools".
  #categoryOf(name) {
    const icon = this.icons.find((item) => item.name === name);
    return icon && icon.category ? icon.category : "Tools";
  }

  // Tools delt op i grupper: én gruppe pr. kategori (Sprog, Design, Værktøjer …).
  // Rækkefølgen følger rækkefølgen i JSON-filerne.
  #categoryGroups() {
    // 1. find alle kategorier – hver kun én gang
    const categories = [];
    this.tools.forEach((name) => {
      const category = this.#categoryOf(name);
      if (!categories.includes(category)) categories.push(category);
    });

    // 2. lav én gruppe pr. kategori med de tools, der hører til
    return categories
      .map((category) => {
        const names = this.tools.filter((name) => this.#categoryOf(name) === category);
        const list = `<ul class="tool-overview__list">${names.map((name) => this.#toolItem(name)).join("")}</ul>`;
        return this.#group(category, list);
      })
      .join("");
  }

  // Hele oversigten (bruges på Erfaring)
  render() {
    const section = document.createElement("section");
    section.className = "tool-overview";

    section.innerHTML = `
      <h2 class="tool-overview__heading">${this.title}</h2>
      ${this.#categoryGroups()}
      ${this.#group("Skills", this.chipList(this.skills), "tool-overview__group--wide")}
    `;

    return section;
  }
}

export { ToolOverview };

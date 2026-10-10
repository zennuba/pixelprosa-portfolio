
//----------- Timeline ---------------------
// Bygger én tidslinje m. "Uddannelse" og "Erfaring") ud fra en liste af punkter.
// Hvert punkt skal have formen:
// { title, place, date: { start, end }, description, responsibility }
//inaktiv på forsiden

class Timeline {
  constructor(title, items, variant = "vertical") {
    this.title = title; // overskrift, fx "Uddannelse"
    this.items = items; // array af punkter
    this.variant = variant; // "vertical" (standard, forsiden) eller "horizontal" (CV-siden)
  }

  // Laver "2021-12" + "2023-04" om til "2021–2023"
  formatDate(date) {
    const start = date.start.slice(0, 4);
    const end = date.end.slice(0, 4);

    if (start === end) {
      return start;
    }
    return `${start}–${end}`;
  }

  // Laver HTML til ét punkt
  renderItem(item) {
    // description bliver til <p>, responsibility bliver til <ul>
    let content = "";
    const labels = {
      education: "Uddannelse",
      experience: "Erfaring",
    };


    if (item.description) {
      content += `<p class="timeline__text">${item.description}</p>`;
    }

    if (item.responsibility && item.responsibility.length > 0) {
      content += `
        <ul class="timeline__list">
          ${item.responsibility.map((task) => `<li>${task}</li>`).join("")}
        </ul>
      `;
    }

    return `
    <li class="timeline__item timeline__item--${item.category}">
    <time class="timeline__date" datetime="${item.date.start}">
          ${this.formatDate(item.date)}
        </time>
        <details class="timeline__details">
          <summary class="timeline__summary">
          <span class="timeline__tag">${labels[item.category]}</span>
            <h3 class="timeline__title">${item.title}</h3>
            <p class="timeline__place">${item.place}</p>
          </summary>
          ${content}
        </details>
      </li>
    `;
  }

  // Bygger hele sektionen og returnerer den
  render() {
    const section = document.createElement("section");
    section.className = "timeline-section";

    const newItems = this.items.filter((item) => Number(item.date.start.slice(0, 4)) >= 2010);
    const oldItems = this.items.filter((item) => Number(item.date.start.slice(0, 4)) < 2010);

    section.innerHTML = `
      <h2 class="timeline-section__title">${this.title}</h2>
      <ul class="timeline timeline--${this.variant}">
        ${newItems.map((item) => this.renderItem(item)).join("")}
      </ul>
      <button class="timeline__toggle" type="button">Vis før 2010</button>
      <ul class="timeline timeline--${this.variant} timeline--old" hidden>
        ${oldItems.map((item) => this.renderItem(item)).join("")}
      </ul>
    `;

    const oldList = section.querySelector(".timeline--old");
    const button = section.querySelector(".timeline__toggle");

    button.addEventListener("click", () => {
      oldList.hidden = !oldList.hidden;
      button.textContent = oldList.hidden ? "Vis før 2010" : "Skjul før 2010";
    });

    return section;
  }
}

export { Timeline };
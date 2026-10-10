//------------ CompetenceSection ---------------------
// Bygger kompetence-oversigten øverst på CV-siden:
// - en blok pr. kompetencegruppe (UX-design, UI-design ...)
// (Værktøjerne er flyttet til ToolOverview – js/toolOverview.js)
// - en bred blok om arbejdsform (fed overskrift + kort tekst)

//------------ CompetenceSection ---------------------
// Bygger kompetenceoversigten på CV-siden.

class CompetenceSection {
  constructor(groups) {
    this.groups = groups;
  }

  renderGroup(group) {
    return `
      <div class="cv-skills__group">
        <h2 class="cv-skills__title">${group.title}</h2>
        <ul class="cv-skills__list">
          ${group.items.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  render() {
    const section = document.createElement("section");
    section.className = "cv-skills";
    section.setAttribute("aria-label", "Kompetencer");

    section.innerHTML = `
      ${this.groups.map((group) => this.renderGroup(group)).join("")}
    `;

    return section;
  }
}

export { CompetenceSection };

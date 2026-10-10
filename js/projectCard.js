class ProjectCard {
  constructor(
    title,
    description,
    team,
    category,
    caseId,
    duration,
    targetGroup,
    link,
    image,
    imageAlt,
  ) {
    this.title = title;
    this.description = description;
    this.team = team;
    this.category = category;
    this.caseId = caseId;
    this.duration = duration;
    this.targetGroup = targetGroup;
    this.link = link;
    this.image = image;
    this.imageAlt = imageAlt;
  }

  render() {
    const article = document.createElement("article");
    article.className = "project-card";

    // Billedet ligger altid i en "ramme" med fast størrelse,
    // så alle kort starter ens – også hvis et projekt mangler billede.
    let media = "";
    if (this.image) {
      media = `<img class="project-card__image" src="${this.image}" alt="${this.imageAlt || ""}">`;
    }

    let projectLink = "";
    if (this.link) {
      projectLink = `<a href="${this.link}" target="_blank" rel="noopener noreferrer">Se 1. semester portfolio</a>`;
    }

    const caseLink = this.caseId
      ? `<a class="project-card__link" href="case.html?id=${this.caseId}" aria-label="Se case: ${this.title}">→</a>`
      : "";

    // Kortets fem dele deler rækker via subgrid, så indholdet flugter på tværs.
    article.innerHTML = `
      <div class="project-card__media">${media}</div>

      <div class="project-card__categories">
        ${this.category
          .slice(0, 3)
          .map((category) => `<span class="project-card__category">${category}</span>`)
          .join("")}
      </div>

      <h3 class="project-card__title">${this.title}</h3>
      <p class="project-card__text">${this.description}</p>
      <div class="project-card__actions">${caseLink}${projectLink}</div>
    `;

    return article;
  }
}

export { ProjectCard };

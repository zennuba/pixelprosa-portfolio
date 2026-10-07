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

    let caseLink = "";

    if (this.caseId) {
      caseLink = `<a href="case.html?id=${this.caseId}">Se case study<span class="visually-hidden">: ${this.title}</span></a>`;
    }

    article.innerHTML = `
      <div class="project-card__categories">
        ${this.category
          .map(
            (category) => `
              <span class="project-card__category">
                ${category}
              </span>
            `,
          )
          .join("")}
      </div>

      <h3>${this.title}</h3>
      <p>${this.description}</p>

      <dl class="project-card__meta">
        <div><dt>Team</dt><dd>${this.team}</dd></div>
        <div><dt>Varighed</dt><dd>${this.duration}</dd></div>
        <div><dt>Målgruppe</dt><dd>${this.targetGroup}</dd></div>
      </dl>

      ${caseLink}
    `;

    if (this.image) {
      const image = document.createElement("img");
      image.className = "project-card__image";
      image.src = this.image;
      image.alt = this.imageAlt || "";
      article.prepend(image);
    }

    if (this.link) {
      const projectLink = document.createElement("a");
      projectLink.href = this.link;
      projectLink.textContent = "Se 1. semester portfolio";
      projectLink.target = "_blank";
      projectLink.rel = "noopener noreferrer";
      article.append(projectLink);
    }

    return article;
  }
}

export { ProjectCard };

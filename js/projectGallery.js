class ProjectGallery {
  constructor(projects) {
    this.projects = projects;
  }

  render() {
    const section = document.createElement("section");
    const heading = document.createElement("div");
    const projectList = document.createElement("div");

    // Samme sidetitel-komponent som på alle undersider (se .page-title i _components.scss)
    heading.className = "page-title";
    heading.innerHTML = `
      <p class="page-title__kicker">Cases</p>
      <h1 class="page-title__heading">Udvalgte projekter</h1>
    `;

    projectList.className = "project-list";
    this.projects.forEach((project) => projectList.append(project.render()));

    section.append(heading, projectList);
    return section;
  }
}

export { ProjectGallery };
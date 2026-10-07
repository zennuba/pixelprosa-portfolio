class ProjectGallery {
  constructor(projects) {
    this.projects = projects;
  }

  render() {
    const section = document.createElement("section");
    const heading = document.createElement("div");
    const projectList = document.createElement("div");

    heading.className = "home-section__heading";
    heading.innerHTML = `<h1>Udvalgte projekter</h1>`;

    projectList.className = "project-list";
    this.projects.forEach((project) => projectList.append(project.render()));

    section.append(heading, projectList);
    return section;
  }
}

export { ProjectGallery };
import { Timeline } from "./timeline.js";
import { ProjectCard } from "./js/projectCard.js";
import { ProjectGallery } from "./js/projectGallery.js";
import { ProfileSection } from "./js/profileSection.js";
import { PortfolioPage } from "./main.js";
import { loadCases } from "./js/caseLoader.js";

class HomePage {
  constructor(profile, projects, education, experience, skills, image) {
    this.profile = profile;
    this.projects = projects;
    this.education = education;
    this.experience = experience;
    this.skills = skills;
    this.image = image;
  }

  render(container) {
    const page = document.createElement("div");
    page.className = "home-page";

    const hero = document.createElement("section");
    hero.className = "home-hero";

    const introduction = this.profile.render();
    introduction.className = "home-hero__copy";

    const eyebrow = document.createElement("p");
    eyebrow.className = "home-eyebrow";
    eyebrow.textContent = "UX/UI · Frontend · AI ";
    introduction.prepend(eyebrow);

    const actions = document.createElement("div");
    actions.className = "home-hero__actions";
    actions.innerHTML = `
      <a class="button-link" href="#featured">Se udvalgte case stories</a>
      <a class="text-link" href="tel:+4526189650">Kontakt mig · 26 18 96 50</a>
    `;
    introduction.append(actions);

    const figure = document.createElement("figure");
    figure.className = "home-hero__figure";
    const image = document.createElement("img");
    image.src = this.image.src;
    image.alt = this.image.alt;
    const caption = document.createElement("figcaption");
    caption.textContent = this.image.caption;
    // Lille gimmick: en boble der kigger frem bag portrættet
    const hello = document.createElement("span");
    hello.className = "home-hero__hello";
    hello.textContent = "Hej, jeg er Lotte";
    figure.append(hello, image, caption);
    hero.append(introduction, figure);

    const featured = document.createElement("section");
    featured.className = "home-section home-featured";
    featured.id = "featured";

    const featuredHeading = document.createElement("div");
    featuredHeading.className = "home-section__heading";
    featuredHeading.innerHTML = `
      <div>
        <p class="home-eyebrow">Se udvalgte real life case stories</p>
        <h2>Cases med mennesker i centrum</h2>
      </div>
    `;

    const projectList = document.createElement("div");
    projectList.className = "project-list home-project-list";
    this.projects.forEach((project) => projectList.append(project.render()));
    featured.append(featuredHeading, projectList);

    const about = document.createElement("section");
    about.className = "home-section home-about";
    about.id = "om-mig";
    about.innerHTML = `
      <div class="home-about__intro">
        <p class="home-eyebrow">Kort om mig</p>
        <h2>Fra koordinering til digitale oplevelser</h2>
        <p>Som projektkoordinator på Syddansk Universitet fik jeg mennesker, processer og systemer til at hænge sammen. I dag gør jeg det samme digitalt: Jeg finder ud af, hvad brugeren har brug for, strukturerer det og bygger løsningen.</p>
        <p>Jeg bor i Odense og søger praktik fra januar 2027 – i Odense eller remote.</p>
      </div>
      <dl class="home-facts">
        <div>
          <dt>Uddannelse</dt>
          <dd>${this.education.title}</dd>
          <dd>${this.education.place}</dd>
        </div>
        <div>
          <dt>Erfaring</dt>
          <dd>${this.experience.title}</dd>
          <dd>${this.experience.place}</dd>
        </div>
        <div>
          <dt>Jeg arbejder med</dt>
          <dd class="home-skills"></dd>
        </div>
      </dl>
    `;

    const skillList = about.querySelector(".home-skills");
    this.skills.slice(0, 6).forEach((skill) => {
      const item = document.createElement("span");
      item.className = "project-card__category";
      item.textContent = skill.type;
      skillList.append(item);
    });

    page.append(hero, featured, about);
    container.replaceChildren(page);
  }
}

async function init() {
  const projectResponse = await fetch("data/project.json");
  const projectData = await projectResponse.json();

  const caseData = await loadCases();

  projectData.sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    if (b.semester !== a.semester) return b.semester - a.semester;
    return b.project - a.project;
  });

  const projects = projectData.map((project) => {
    const caseExists = caseData.find((item) => item.id === project.case);

    console.log(project.title, project.case, caseExists);

    let caseId = "";

    if (caseExists) {
      caseId = project.case;
    }

    return new ProjectCard(
      project.title,
      project.description,
      project.team,
      project.category,
      caseId,
      project.duration,
      project.targetGroup,
      project.link,
      project.image,
      project.imageAlt,
    );
  });

  const profile = new ProfileSection(
    "Multimediedesigner",
    "Digital designer med fokus på UX/UI, Frontend, human oriented AI.",
  );

  const homeContainer = document.getElementById("home");
  if (homeContainer) {
    const responses = await Promise.all([
      fetch("data/education.json"),
      fetch("data/experience.json"),
      fetch("data/skill.json"),
      fetch("data/image.json"),
    ]);
    const [educationData, experienceData, skillData, imageData] =
      await Promise.all(responses.map((response) => response.json()));

// erstatter: const educationTimeline = new Timeline("Uddannelse", educationData, "education") 
//const experienceTimeline = new Timeline("Erfaring", experienceData, "experience");  //opretter i stedet et array til alt på timeline

// 1. Hvert punkt skal være en en kategori hhv edu og exp
// ... =(spread). Det betyder "pak indholdet ud".

const educationItems = educationData.map((item) => ({ ...item, category: "education" }));
const experienceItems = experienceData.map((item) => ({ ...item, category: "experience" }));

// 2. De lægges sammen og sortéres, nyeste først, som timelineItems
const timelineItems = [...educationItems, ...experienceItems].sort((a, b) =>
  b.date.start.localeCompare(a.date.start)
);

console.log(timelineItems);

    const homePage = new HomePage(
      profile,
      projects,
      educationData[0],
      experienceData[0],
      skillData,
      imageData.find((image) => image.id === "lotteProfil"),
    );
    homePage.render(homeContainer);
    const timeline = new Timeline("Uddannelse og erfaring", timelineItems);
    homeContainer.querySelector(".home-page").append(timeline.render());
    return;
  }

  const portfolio = new PortfolioPage(
    profile,
    new ProjectGallery(projects),
  );

  portfolio.render(document.getElementById("portfolio"));
}

init();

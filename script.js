import { ProjectCard } from "./js/projectCard.js";
import { ProjectGallery } from "./js/projectGallery.js";
import { ProfileSection } from "./js/profileSection.js";
import { PortfolioPage } from "./main.js";
import { loadCases } from "./js/caseLoader.js";
import { ContactSection } from "./js/contactSection.js";
import { makeEyesFollow } from "./js/eyeFollow.js";

class HomePage {
  constructor(profile, projects, image, contact) {
    this.profile = profile;
    this.projects = projects;
    this.image = image;
    this.contact = contact; // ContactSection (kan mangle)
  }

  render(container) {
    const rotatingCta = container.querySelector(".home-hero__cta");
    const page = document.createElement("div");
    page.className = "home-page";

    const hero = document.createElement("section");
    hero.className = "home-hero";

    const introduction = this.profile.render();
    introduction.className = "home-hero__copy";

    // Navnet øverst – samme kicker som på Om mig og casene (.page-title__kicker)
    const kicker = document.createElement("p");
    kicker.className = "page-title__kicker";
    kicker.textContent = "Lotte Nielsen · multimediedesigner";
    introduction.prepend(kicker);

    // Ordskifteren ("Mangler du en kreativ praktikant?") står nu under teksten, før knapperne
    if (rotatingCta) introduction.append(rotatingCta);

    const actions = document.createElement("div");
    actions.className = "home-hero__actions";
    actions.innerHTML = `
      <a class="button-link" href="#featured">Se udvalgte case stories</a>
      <a class="text-link" href="omLotte.html">Om mig</a>
    `;
    introduction.append(actions);

    // Tegningen i hero – øjnene følger musen (makeEyesFollow kaldes i init)
    const figure = document.createElement("figure");
    figure.className = "home-hero__figure";
    const image = document.createElement("img");
    image.src = this.image.src;
    image.className = "home-hero__illustration";
    image.alt = this.image.alt;
    figure.append(image);
    hero.append(introduction, figure);

    const featured = document.createElement("section");
    featured.className = "home-section home-featured";
    featured.id = "featured";

    const featuredHeading = document.createElement("div");
    featuredHeading.className = "home-section__heading";
    featuredHeading.innerHTML = `
      <div>
        <p class="home-eyebrow">Fra 2. og 3. semester</p>
        <h2>Udvalgte cases</h2>
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
        <p>Som projektkoordinator i Danmarks Lærerforening fik jeg processer og systemer til at hænge sammen. I dag gør jeg det samme digitalt: Jeg finder ud af, hvad brugeren har brug for, strukturerer det og bygger løsningen.</p>
        <a class="text-link" href="omLotte.html">Læs mere om mig</a>
        </div>
    `;

    // Rækkefølge: hero → kort om mig → cases → kontakt
    // (så hero-knappen "Se udvalgte case stories" springer om mig over og lander på casene)
    page.append(hero, about, featured);
    if (this.contact) page.append(this.contact.render());
    container.replaceChildren(page);
  }
}

async function init() {
  const projectResponse = await fetch("data/project.json");
  const allProjects = await projectResponse.json();

  // Vis kun projekter med "published": true i project.json.
  // Sæt "published": false på et projekt, der ikke er klar endnu.
  const projectData = allProjects.filter((project) => project.published);

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
    "Jeg forbinder design, kode og mennesker",
    "Multimediedesigner med blik for UX, frontend og menneskecentreret AI. Fra første spørgsmål til færdig kode.",
  );

  const homeContainer = document.getElementById("home");
  if (homeContainer) {
    const imageResponse = await fetch("data/image.json");
    const imageData = await imageResponse.json();

    const contactResponse = await fetch("data/contact.json");
    // Forsiden: kontakt med foto (Om mig har fotoet øverst, så dér vises det ikke igen)
    const contact = new ContactSection(await contactResponse.json(), {
      photo: { src: "img/OmLotte/lotte-rund.webp", alt: "Foto af Lotte, der smiler med hagen hvilende på hånden" },
    });

    const homePage = new HomePage(
      profile,
      projects,
      imageData.find((image) => image.id === "lotteProfil"),
      contact,
    );
    homePage.render(homeContainer);
    // Gør tegningen "levende": øjnene følger musen
    makeEyesFollow(homeContainer.querySelector(".home-hero__illustration"));
    return;
  }

  const portfolio = new PortfolioPage(profile, new ProjectGallery(projects));

  portfolio.render(document.getElementById("portfolio"));
}

init();

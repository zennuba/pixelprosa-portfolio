// omLotte.js - bygger den datadrevne del af Om mig (omLotte.html)
// Henter data, bygger kompetence-oversigten, den lodrette karrierevej og kontakt-sektionen.

import { CompetenceSection } from "./js/competenceSection.js";
import { ToolOverview } from "./js/toolOverview.js";
import { Timeline } from "./js/timeline.js";
import { ContactSection } from "./js/contactSection.js";

async function initCv() {
  const responses = await Promise.all([
    fetch("data/competence.json"),
    fetch("data/tool.json"),
    fetch("data/tech.json"),
    fetch("data/education.json"),
    fetch("data/experience.json"),
    fetch("data/contact.json"),
  ]);
  const [competenceData, toolData, techData, educationData, experienceData, contactData] =
    await Promise.all(responses.map((response) => response.json()));

  // Samme fremgangsmåde som på forsiden (script.js):
  // giv hvert punkt en kategori, læg dem sammen og sortér nyeste først
  const educationItems = educationData.map((item) => ({
    ...item,
    category: "education",
  }));
  const experienceItems = experienceData.map((item) => ({
    ...item,
    category: "experience",
  }));
  const timelineItems = [...educationItems, ...experienceItems].sort((a, b) =>
    b.date.start.localeCompare(a.date.start),
  );

  const competence = new CompetenceSection(
    competenceData.groups,
    competenceData.workflow,
  );

  // Tools – samme komponent som i casene.
  // Kort og skarpt: kun tools med "highlight": true i JSON'en vises her.
  // Alle tools bliver stadig i JSON'en, så casene kan bruge dem.
  // Skills vises ikke her – kompetencerne øverst på siden ER dine skills.
  const icons = [...techData, ...toolData]; // Kode (tech.json) først, derefter programmerne
  const highlighted = icons.filter((tool) => tool.highlight);
  const toolNames = highlighted.map((tool) => tool.name);

  const overview = new ToolOverview("Tools", toolNames, [], icons).render();
  overview.classList.add("cv-page__overview"); // ekstra klasse: luft ned til Karrierevej

  // "horizontal" giver den vandrette udgave – forsiden bruger stadig den lodrette
  const timeline = new Timeline("Karrierevej", timelineItems, "vertical");

  // id'er = mål for ankermenuen i omLotte.html (href="#kompetencer" osv.).
  // De sættes her og ikke inde i komponenterne, fordi komponenterne også bruges andre steder.
  const skills = competence.render();
  skills.id = "kompetencer";
  overview.id = "tools";
  const career = timeline.render();
  career.id = "karrierevej";

  // Hero og "Mennesket bag skærmen" står i HTML'en – her bygges kun det, der kommer fra JSON
  const container = document.getElementById("cv-indhold");
  container.append(skills, overview, career);

  // Kontakt: samme komponent og samme foto som nederst på forsiden (ét sted at rette)
  const contact = new ContactSection(contactData, {
    photo: { src: "img/OmLotte/lotte-rund.webp", alt: "Foto af Lotte, der smiler med hagen hvilende på hånden" },
  });
  document.getElementById("kontakt-indhold").append(contact.render());
}

initCv();

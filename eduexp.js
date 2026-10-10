// eduexp.js - starter siden med uddannelse og erfaring (eduexp.html)
// Henter data, bygger kompetence-oversigten og den lodrette karrierevej.

import { CompetenceSection } from "./js/competenceSection.js";
import { ToolOverview } from "./js/toolOverview.js";

async function initCv() {
  const responses = await Promise.all([
    fetch("data/competence.json"),
    fetch("data/tool.json"),
    fetch("data/tech.json"),
    fetch("data/education.json"),
    fetch("data/experience.json"),
  ]);
  const [competenceData, toolData, techData, educationData, experienceData] =
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

  const container = document.getElementById("cv");
  container.append(competence.render(), overview, timeline.render());
}

initCv();

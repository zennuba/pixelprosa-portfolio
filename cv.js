// cv.js - starter CV-siden (timeline.html)
// Henter data, bygger kompetence-oversigten og den lodrette karrierevej.

import { Timeline } from "./js/timeline.js";
import { CompetenceSection } from "./js/competenceSection.js";

async function initCv() {
  const responses = await Promise.all([
    fetch("data/competence.json"),
    fetch("data/tool.json"),
    fetch("data/education.json"),
    fetch("data/experience.json"),
  ]);
  const [competenceData, toolData, educationData, experienceData] =
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
    toolData,
    competenceData.workflow,
  );

  // "horizontal" giver den vandrette udgave – forsiden bruger stadig den lodrette
  const timeline = new Timeline("Karrierevej", timelineItems, "vertical");

  const container = document.getElementById("cv");
  container.append(competence.render(), timeline.render());
}

initCv();

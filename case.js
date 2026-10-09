import { CasePage } from "./main.js";
import { loadCases } from "./js/caseLoader.js";

async function fetchJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Kunne ikke hente ${path} (HTTP ${response.status}).`);
  }
  return response.json();
}

function showLoadError(container, error) {
  console.error("Case-siden kunne ikke indlæses:", error);

  const section = document.createElement("section");
  section.className = "case__load-error";
  section.setAttribute("role", "alert");

  const heading = document.createElement("h1");
  heading.textContent = "Casen kunne ikke vises";

  const message = document.createElement("p");
  message.textContent = error.message;

  const hint = document.createElement("p");
  hint.textContent =
    "Kontrollér, at URL'en indeholder et gyldigt case-id, og at siden åbnes via en lokal webserver.";

  section.append(heading, message, hint);
  container.replaceChildren(section);
}

async function initCase() {
  const container = document.getElementById("case");
  if (!container) {
    throw new Error('HTML-siden mangler et element med id="case".');
  }

  try {
    const params = new URLSearchParams(window.location.search);
    const caseId = params.get("id");
    if (!caseId) {
      throw new Error("URL'en mangler et case-id, fx case.html?id=personal-portfolio.");
    }

    const data = await loadCases();
    const caseData = data.find((item) => item.id === caseId);
    if (!caseData) {
      throw new Error(`Der blev ikke fundet en case med id "${caseId}".`);
    }

    const [images, tools, techs] = await Promise.all([
      fetchJson("data/image.json"),
      fetchJson("data/tool.json"),
      fetchJson("data/tech.json"),
    ]);

    const casePage = new CasePage(caseData, images, tools.concat(techs));
    casePage.render(container);
  } catch (error) {
    const loadError =
      error instanceof Error ? error : new Error("Der opstod en ukendt fejl ved indlæsning af casen.");
    showLoadError(container, loadError);
  }
}

initCase().catch((error) => {
  const container = document.getElementById("case");
  if (container) showLoadError(container, error);
  else console.error("Case-siden kunne ikke indlæses:", error);
});

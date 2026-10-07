import { CasePage } from "./main.js";
import { loadCases } from "./js/caseLoader.js";

async function initCase() {
  const params = new URLSearchParams(window.location.search);
  const caseId = params.get("id");

  const data = await loadCases();

  const imageResponse = await fetch("data/image.json");
  const images = await imageResponse.json();

  // Hent ikon-listerne og saml dem til én liste
  const toolResponse = await fetch("data/tool.json");
  const tools = await toolResponse.json();
  const techResponse = await fetch("data/tech.json");
  const techs = await techResponse.json();
  const icons = tools.concat(techs);

  const caseData = data.find((item) => item.id === caseId);

  const casePage = new CasePage(caseData, images, icons);
  casePage.render(document.getElementById("case"));
}

initCase();

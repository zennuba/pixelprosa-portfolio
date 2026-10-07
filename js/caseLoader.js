// caseLoader.js - fordi jeg nu har opdelt cases i hver deres json
// caseLoader samler alle case-filer til ét array – ligesom den gamle case.json

const caseFiles = [
  "data/cases/cyber-hero.json",
  "data/cases/ai-playbook.json",
  "data/cases/personal-portfolio.json"
];

export async function loadCases() {
  const responses = await Promise.all(caseFiles.map((file) => fetch(file)));
  const cases = await Promise.all(responses.map((response) => response.json()));
  return cases;
}
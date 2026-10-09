// caseLoader.js - fordi jeg nu har opdelt cases i hver deres json
// caseLoader samler alle case-filer til ét array – ligesom den gamle case.json
//
// ===== SÅDAN LAVER DU EN NY CASE =====
// 1. Kopiér data/cases/_skabelon.json og giv kopien et nyt navn, fx min-case.json
// 2. Udfyld felterne (skabelonen fortæller, hvor hvert felt vises på siden)
//    - Alle cases har de SAMME felter i samme rækkefølge = en "datakontrakt"
//    - Tomt felt? Skriv null (tekst) eller [] (liste) – så skjules det automatisk
// 3. Tilføj filnavnet i listen herunder
// 4. Sæt "case": "<id>" på projektet i project.json, så kortet linker til casen
// _skabelon.json står IKKE i listen – den er kun en skabelon og vises aldrig.

const caseFiles = [
  "data/cases/cyber-hero.json",
  "data/cases/ai-playbook.json",
  "data/cases/personal-portfolio.json"
];

export async function loadCases() {
  const responses = await Promise.all(caseFiles.map((file) => fetch(file)));
  const failedResponse = responses.find((response) => !response.ok);
  if (failedResponse) {
    throw new Error(`Kunne ikke hente case-data (HTTP ${failedResponse.status}).`);
  }
  const cases = await Promise.all(responses.map((response) => response.json()));
  return cases;
}
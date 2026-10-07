class CasePage {
  constructor(caseData) {
    this.caseData = caseData;
  }

  render(container) {
    const article = document.createElement("article");

    article.innerHTML = `
      <p>${this.caseData.kicker}</p>
      <h1>${this.caseData.title}</h1>
      <p>${this.caseData.hook}</p>
      <p>${this.caseData.intro}</p>
    `;

    container.append(article);
  }
}
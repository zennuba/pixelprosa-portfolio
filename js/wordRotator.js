class WordRotator {
  // Private felter (#): kun klassen selv kan se og ændre dem
  #element;
  #words;
  #index = 0;
  #delay;

  constructor(element, words, delay = 2500) {
    this.#element = element;
    this.#words = words;
    this.#delay = delay;
  }

  start() {
    // Respektér brugere, der har slået animationer fra (tilgængelighed)
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!this.#element || reduceMotion) return;

    setInterval(() => this.#next(), this.#delay);
    this.#setWord();
  }

  #next() {
    this.#index = (this.#index + 1) % this.#words.length;
    this.#setWord();
  }

  #setWord() {
    this.#element.textContent = this.#words[this.#index];
    this.#element.dataset.tone = String((this.#index % 3) + 1);
  }
}

export { WordRotator };
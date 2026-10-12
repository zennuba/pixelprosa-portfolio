import { WordRotator } from "./wordRotator.js";
import { initThemeToggle } from "./toggleButton.js";

initThemeToggle();

const rotator = new WordRotator(document.querySelector(".word-rotator"), [
  "kreativ",
  "analytisk",
  "kaffe-elskende",
  "systematisk",
  "idérig",
  "over-tænkende",
  "dygtig",
  "fleksibel",
  "Ctrl+Z-afhængig",
  "nysgerrig",
  "skarp",
  "lærenem",
  "ambitiøs",
]);

rotator.start();

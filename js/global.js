import { WordRotator } from "./wordRotator.js";

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

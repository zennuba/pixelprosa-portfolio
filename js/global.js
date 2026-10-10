import { WordRotator } from "./wordRotator.js";
import { initThemeToggle } from "./toggleButton.js";
import { makeEyesFollow } from "./eyeFollow.js";

initThemeToggle();

// Tegningen af Lotte (Om mig og 404): laves om til ægte <svg>, så øjnene følger musen.
// Kommaet i selectoren betyder "ELLER": første billede, der matcher en af dem, bliver valgt.
// Findes ingen af dem på siden, gør funktionen ingenting.
makeEyesFollow(document.querySelector(".om-mig__billede img, .not-found__billede img"));

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

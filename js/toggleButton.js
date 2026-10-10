const THEME_STORAGE_KEY = "pixelprosa-theme";

function setTheme(theme, button) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";

  if (button) {
    button.setAttribute("aria-pressed", String(isDark));
    button.setAttribute(
      "aria-label",
      isDark ? "Skift til lyst tema" : "Skift til mørkt tema",
    );
    // Ikonet (måne/sol) skiftes med CSS ud fra aria-pressed – se _layout.scss
  }
}

export function initThemeToggle() {
  const button = document.querySelector("#theme-toggle");
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  setTheme(savedTheme === "dark" ? "dark" : "light", button);

  if (!button) return;

  button.addEventListener("click", () => {
    const nextTheme =
      document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    setTheme(nextTheme, button);
  });
}

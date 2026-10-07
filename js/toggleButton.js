const toggleBtn = document.querySelector("#theme-toggle");

function toggleTheme() {
  document.body.classList.toggle("dark");
}

toggleBtn.addEventListener("click", toggleTheme);

// Verifie si un theme existe dans le localStorage.
const savedTheme = localStorage.getItem("theme");

// Verifie le theme du navigateur / systeme.
const systemDarkMode = window.matchMedia("(prefers-color-scheme: dark)");

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.classList.toggle("dark-mode", isDark);

  if (document.body) {
    document.body.classList.toggle("dark-mode", isDark);
  }
}

export function setupDarkMode() {
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    applyTheme(systemDarkMode.matches ? "dark" : "light");
  }

  const handleSystemThemeChange = (event) => {
    if (!localStorage.getItem("theme")) {
      applyTheme(event.matches ? "dark" : "light");
    }
  };

  if (typeof systemDarkMode.addEventListener === "function") {
    systemDarkMode.addEventListener("change", handleSystemThemeChange);
    return;
  }

  if (typeof systemDarkMode.addListener === "function") {
    systemDarkMode.addListener(handleSystemThemeChange);
  }
}

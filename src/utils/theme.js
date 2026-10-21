// Light / dark mode. The choice is saved; the first visit follows the system setting.
export const getTheme = () =>
  document.documentElement.getAttribute("data-theme") ||
  localStorage.getItem("theme") ||
  (window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light");

export const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
};

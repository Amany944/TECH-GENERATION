import { parcours, projets, ressources } from "./data.js";
import { setupDarkMode } from "./darkmode.js";
import { createAccount, getAccounts } from "./localstorage.js";

const ageFilters = [
  { label: "Tous", value: "all" },
  { label: "6-9 ans", value: "6-9" },
  { label: "10-13 ans", value: "10-13" },
  { label: "14-19 ans", value: "14-19" }
];

const $ = (selector) => document.querySelector(selector);

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (text !== undefined) {
    element.textContent = text;
  }
  return element;
}

function clear(element) {
  element.replaceChildren();
}

function renderParcours() {
  const container = $("#parcoursContainer");
  if (!container) return;

  clear(container);

  parcours.forEach((item) => {
    const card = createElement("article", "surface-card rounded-lg border p-5 shadow-xl");
    const header = createElement("div", "flex items-start justify-between gap-4");
    const titleGroup = createElement("div");
    const title = createElement("h3", "surface-title text-xl font-black", item.title);
    const age = createElement("p", "accent-text mt-1 text-sm font-bold", `${item.id} ans`);
    const badge = createElement("span", "accent-badge rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide", "Atelier");
    const description = createElement("p", "muted-text mt-4 leading-7", item.description);
    const list = createElement("ul", "muted-text mt-5 grid gap-3 text-sm");

    titleGroup.append(title, age);
    header.append(titleGroup, badge);

    item.outcomes.forEach((outcome) => {
      const li = createElement("li", "flex items-center gap-3");
      const dot = createElement("span", "accent-dot h-2 w-2 rounded-full");
      li.append(dot, document.createTextNode(outcome));
      list.append(li);
    });

    card.append(header, description, list);
    container.append(card);
  });
}

function renderProjectFilters() {
  const container = $("#projectFilters");
  if (!container) return;

  clear(container);

  ageFilters.forEach((filter, index) => {
    const button = createElement("button", "filter-button rounded-lg border px-3 py-2 text-sm font-bold transition", filter.label);
    button.type = "button";
    button.dataset.age = filter.value;
    button.setAttribute("aria-pressed", index === 0 ? "true" : "false");
    button.addEventListener("click", () => {
      updateFilterState(filter.value);
      renderProjets(filter.value);
    });
    container.append(button);
  });

  updateFilterState("all");
}

function updateFilterState(activeValue) {
  document.querySelectorAll("#projectFilters button").forEach((button) => {
    const isActive = button.dataset.age === activeValue;
    button.setAttribute("aria-pressed", String(isActive));
    button.classList.toggle("is-active", isActive);
  });
}

function renderProjets(age = "all") {
  const grid = $("#projetsGrid");
  if (!grid) return;

  const visibleProjects = age === "all" ? projets : projets.filter((project) => project.age === age);
  clear(grid);

  visibleProjects.forEach((project) => {
    const card = createElement("article", "surface-card overflow-hidden rounded-lg border shadow-xl");
    const image = createElement("img", "h-56 w-full object-cover");
    const content = createElement("div", "p-5");
    const meta = createElement("p", "accent-text text-xs font-black uppercase tracking-wide", project.category);
    const title = createElement("h3", "surface-title mt-2 text-xl font-black", project.title);
    const ageLabel = createElement("p", "muted-text mt-3 text-sm", `Tranche d'âge : ${project.age} ans`);

    image.src = project.image;
    image.alt = project.title;
    image.loading = "lazy";

    content.append(meta, title, ageLabel);
    card.append(image, content);
    grid.append(card);
  });
}

function renderRessources() {
  const list = $("#ressourcesList");
  if (!list) return;

  clear(list);

  ressources.forEach((resource) => {
    const li = createElement("li");
    const link = createElement("a", "surface-card block rounded-lg border p-5 transition");
    const type = createElement("span", "accent-text text-xs font-black uppercase tracking-wide", resource.type);
    const title = createElement("span", "surface-title mt-2 block text-lg font-black", resource.title);
    const hint = createElement("span", "muted-text mt-3 block text-sm", "Ouvrir la ressource");

    link.href = resource.link;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.append(type, title, hint);
    li.append(link);
    list.append(li);
  });
}

function setupMobileMenu() {
  const button = $("#menuButton");
  const menu = $("#mobileMenu");
  if (!button || !menu) return;

  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    menu.classList.toggle("hidden", isOpen);
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      button.setAttribute("aria-expanded", "false");
      menu.classList.add("hidden");
    });
  });
}

function setupContactForm() {
  const form = $("#contactForm");
  const feedback = $("#formFeedback");
  if (!form || !feedback) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const accountInput = {
      student: {
        firstName: clean(formData.get("studentFirstName")),
        lastName: clean(formData.get("studentLastName")),
        age: Number(formData.get("studentAge")),
        desiredTrack: clean(formData.get("desiredTrack")),
        level: clean(formData.get("studentLevel"))
      },
      parent: {
        fullName: clean(formData.get("parentFullName")),
        phone: clean(formData.get("parentPhone")),
        email: clean(formData.get("parentEmail")).toLowerCase(),
        relationship: clean(formData.get("relationship"))
      },
      consent: {
        contact: formData.get("contactConsent") === "on"
      }
    };

    const validationMessage = validateAccount(accountInput);
    if (validationMessage) {
      showFeedback(feedback, validationMessage, "error");
      return;
    }

    try {
      const account = createAccount(accountInput);
      const totalAccounts = getAccounts().length;
      showFeedback(feedback, `Compte local créé pour ${account.student.firstName} ${account.student.lastName}. ${totalAccounts} compte(s) enregistré(s) dans ce navigateur.`, "success");
      form.reset();
    } catch (error) {
      showFeedback(feedback, "Impossible d'enregistrer le compte dans ce navigateur. Vérifiez que le stockage local est autorisé.", "error");
    }
  });
}

function clean(value) {
  return String(value || "").trim();
}

function validateAccount(account) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (account.student.firstName.length < 2 || account.student.lastName.length < 2) {
    return "Merci de renseigner le prénom et le nom de l'élève.";
  }

  if (!Number.isFinite(account.student.age) || account.student.age < 6 || account.student.age > 19) {
    return "L'âge de l'élève doit être compris entre 6 et 19 ans.";
  }

  if (account.parent.fullName.length < 2 || account.parent.phone.length < 6) {
    return "Merci de renseigner le nom complet et le téléphone du parent.";
  }

  if (!emailPattern.test(account.parent.email)) {
    return "Merci de renseigner une adresse email parent valide.";
  }

  if (!account.consent.contact) {
    return "L'autorisation de contact est nécessaire pour créer le compte local.";
  }

  return "";
}

function showFeedback(element, message, variant) {
  element.textContent = message;
  element.className = `rounded-lg border px-4 py-3 text-sm feedback-${variant}`;
}

function init() {
  setupDarkMode();
  renderParcours();
  renderProjectFilters();
  renderProjets();
  renderRessources();
  setupMobileMenu();
  setupContactForm();
}

document.addEventListener("DOMContentLoaded", init);

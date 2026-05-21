const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const nav = document.getElementById("mainNav");

menuBtn.addEventListener("click", () => {

    const isHidden = mobileMenu.classList.contains("hidden");

    // 👉 seulement sur mobile
    if (window.innerWidth < 768) {

        // 🔼 Aller EXACTEMENT au menu
        nav.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    // 👉 toggle menu
    mobileMenu.classList.toggle("hidden");
});
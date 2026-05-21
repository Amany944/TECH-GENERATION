// Script principal pour TECH GENERATION

// Fonction pour afficher une alerte au clic du bouton CTA
document.addEventListener('DOMContentLoaded', function() {
    const ctaBtn = document.getElementById('ctaBtn');
    
    if (ctaBtn) {
        ctaBtn.addEventListener('click', function() {
            alert('Merci de votre intérêt ! Nous vous contacterons bientôt.');
        });
    }

    // Smooth scroll pour les liens de navigation
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Animation au scroll
    const serviceCards = document.querySelectorAll('.service-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });

    console.log('TECH GENERATION - Site chargé avec succès!');
});
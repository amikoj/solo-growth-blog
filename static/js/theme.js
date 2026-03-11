// Function to set theme
function setTheme(theme) {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', theme);
}

// Initialize theme
const storedTheme = localStorage.getItem('theme');
const initialTheme = storedTheme || 'dark';
setTheme(initialTheme);

document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }

    // Mobile Menu
    const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    const mobileSidebarClose = document.getElementById('mobile-sidebar-close');
    const mobileSidebarOverlay = document.getElementById('mobile-sidebar-overlay');

    if (mobileMenuBtn && mobileSidebar && mobileSidebarOverlay) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileSidebar.classList.add('open');
            mobileSidebarOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        });

        const closeMenu = () => {
            mobileSidebar.classList.remove('open');
            mobileSidebarOverlay.classList.remove('show');
            document.body.style.overflow = '';
        };

        if (mobileSidebarClose) mobileSidebarClose.addEventListener('click', closeMenu);
        mobileSidebarOverlay.addEventListener('click', closeMenu);
    }
});

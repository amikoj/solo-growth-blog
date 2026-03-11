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

    const viewElements = Array.from(document.querySelectorAll('[data-view-key]'));
    if (viewElements.length) {
        const setView = (el, value) => {
            el.textContent = `${value} views`;
        };
        viewElements.forEach((el) => {
            const base = Number(el.dataset.viewBase || 0);
            setView(el, base);
        });
        const pageViewEl = document.querySelector('[data-view-page="true"][data-view-key]');
        const keys = Array.from(new Set(viewElements.map((el) => el.dataset.viewKey))).filter(Boolean);
        const fetchJson = async (url, options) => {
            try {
                const res = await fetch(url, options);
                if (!res.ok) return null;
                return await res.json();
            } catch (e) {
                return null;
            }
        };
        const updateViews = async () => {
            let counts = {};
            if (pageViewEl) {
                const pageKey = pageViewEl.dataset.viewKey;
                const data = await fetchJson('/api/views', {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ key: pageKey })
                });
                if (data && typeof data.count === 'number') {
                    counts[pageKey] = data.count;
                }
            }
            if (keys.length) {
                const batch = await fetchJson('/api/views/batch', {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ keys })
                });
                if (batch && batch.counts) {
                    counts = { ...batch.counts, ...counts };
                }
            }
            viewElements.forEach((el) => {
                const key = el.dataset.viewKey;
                const base = Number(el.dataset.viewBase || 0);
                const value = Math.max(base, Number(counts[key] || 0));
                setView(el, value);
            });
            const topReads = document.querySelector('.most-read-list');
            if (topReads) {
                const items = Array.from(topReads.querySelectorAll('.most-read-item'));
                const getItemCount = (item) => {
                    const viewEl = item.querySelector('.post-views');
                    if (!viewEl) return 0;
                    const key = viewEl.dataset.viewKey;
                    const base = Number(viewEl.dataset.viewBase || 0);
                    return Math.max(base, Number(counts[key] || 0));
                };
                items
                    .sort((a, b) => getItemCount(b) - getItemCount(a))
                    .forEach((item) => topReads.appendChild(item));
            }
        };
        updateViews();
    }
});

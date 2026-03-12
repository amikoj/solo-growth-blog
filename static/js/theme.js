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
    const searchIndexEl = document.getElementById('search-index');
    const searchModal = document.getElementById('search-modal');
    const searchToggle = document.getElementById('search-toggle');
    
    if (searchModal && searchToggle) {
        let items = [];
        try {
            if (searchIndexEl) {
                const content = searchIndexEl.textContent || '[]';
                // Try parsing. If content is empty or invalid, fallback to empty array.
                // We also check for potential HTML entity issues if safeJS didn't work as expected, 
                // but usually safeJS fixes it.
                const rawItems = JSON.parse(content) || [];
                const normalize = (value) => (value || '').toLowerCase();
                items = rawItems.map((item) => {
                    const tags = Array.isArray(item.tags) ? item.tags.join(' ') : '';
                    return {
                        ...item,
                        _text: [item.title, item.summary, item.content, tags].map(normalize).join(' ')
                    };
                });
                console.log('Search index loaded:', items.length, 'items');
            }
        } catch (e) {
            console.error('Failed to parse search index', e);
        }

        const input = document.getElementById('search-input');
        const resultList = document.querySelector('.search-results');
        const resultCount = document.querySelector('.search-result-count');
        const searchOverlay = document.getElementById('search-modal-overlay');
        const searchClose = document.getElementById('search-modal-close');
        
        const normalize = (value) => (value || '').toLowerCase();
        
        const highlightMatch = (text, query) => {
            if (!query || !text) return text;
            const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            return text.replace(regex, '<mark>$1</mark>');
        };

        const renderResults = (query) => {
            if (!resultList || !resultCount) return;
            const value = normalize(query).trim();
            resultList.innerHTML = '';
            
            if (!value) {
                resultCount.textContent = 'Type to search...';
                return;
            }

            const matches = items.filter((item) => item._text.includes(value));
            resultCount.textContent = `${matches.length} result${matches.length === 1 ? '' : 's'} found`;

            if (matches.length === 0) {
                resultList.innerHTML = '<li class="search-no-results">No results found</li>';
                return;
            }

            matches.slice(0, 50).forEach((item) => {
                const listItem = document.createElement('li');
                listItem.className = 'search-result-item';
                
                const link = document.createElement('a');
                link.className = 'search-result-title';
                link.href = item.url;
                link.innerHTML = highlightMatch(item.title || 'Untitled', query);
                listItem.appendChild(link);
                
                if (item.date) {
                    const meta = document.createElement('div');
                    meta.className = 'search-result-meta';
                    meta.textContent = item.date;
                    listItem.appendChild(meta);
                }
                
                const snippetSource = (item.summary || item.content || '').trim();
                if (snippetSource) {
                    const snippet = snippetSource.length > 150 
                        ? `${snippetSource.slice(0, 150)}...` 
                        : snippetSource;
                    const snippetEl = document.createElement('p');
                    snippetEl.className = 'search-result-snippet';
                    snippetEl.innerHTML = highlightMatch(snippet, query);
                    listItem.appendChild(snippetEl);
                }
                
                resultList.appendChild(listItem);
            });
        };

        const openSearch = () => {
            searchModal.classList.add('is-open');
            searchModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            if (input) {
                input.focus();
                // Clear previous results but keep text if any? Or clear text?
                // Let's keep text if user wants to refine
                if (input.value) renderResults(input.value);
                else resultCount.textContent = 'Type to search...';
            }
        };

        const closeSearch = () => {
            searchModal.classList.remove('is-open');
            searchModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        };

        if (input) {
            input.addEventListener('input', (event) => {
                renderResults(event.target.value);
            });
        }

        searchToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            openSearch();
        });

        if (searchOverlay) {
            searchOverlay.addEventListener('click', closeSearch);
        }

        if (searchClose) {
            searchClose.addEventListener('click', closeSearch);
        }

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && searchModal.classList.contains('is-open')) {
                closeSearch();
            }
            // Optional: Command/Ctrl + K to open search
            if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
                event.preventDefault();
                openSearch();
            }
        });
    }
});

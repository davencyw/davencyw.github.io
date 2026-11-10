// Shared behaviour for every page: theme, nav, scroll reveals.
(function () {
    const root = document.documentElement;
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---- Theme ------------------------------------------------------------

    function storedTheme() {
        try {
            return localStorage.getItem('theme');
        } catch (e) {
            return null;
        }
    }

    function applyTheme(theme) {
        if (theme) {
            root.setAttribute('data-theme', theme);
        } else {
            root.removeAttribute('data-theme');
        }
        const effective = theme || (darkQuery.matches ? 'dark' : 'light');
        root.setAttribute('data-theme-effective', effective);
        document.dispatchEvent(new CustomEvent('themechange', { detail: effective }));
    }

    darkQuery.addEventListener('change', () => applyTheme(storedTheme()));

    document.querySelectorAll('.theme-toggle').forEach((btn) => {
        btn.addEventListener('click', () => {
            const next = root.getAttribute('data-theme-effective') === 'dark' ? 'light' : 'dark';
            try {
                localStorage.setItem('theme', next);
            } catch (e) {
                // Private mode: the toggle still works for this page view.
            }
            applyTheme(next);
        });
    });

    // ---- Nav reveal: show the pill once the reader leaves the top ---------

    const revealNav = document.querySelector('.site-nav[data-reveal-on-scroll]');
    const sentinel = document.querySelector('.nav-sentinel');
    if (revealNav && sentinel && 'IntersectionObserver' in window) {
        new IntersectionObserver(([entry]) => {
            revealNav.classList.toggle('nav-shown', !entry.isIntersecting);
        }).observe(sentinel);
    } else if (revealNav) {
        revealNav.classList.add('nav-shown');
    }

    // ---- Mobile nav -------------------------------------------------------

    const nav = document.querySelector('.site-nav');
    const burger = document.querySelector('.nav-burger');

    function setNav(open) {
        nav.classList.toggle('nav-open', open);
        burger.setAttribute('aria-expanded', String(open));
        burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        document.body.style.overflow = open ? 'hidden' : '';
    }

    if (nav && burger) {
        burger.addEventListener('click', () => setNav(!nav.classList.contains('nav-open')));
        nav.querySelectorAll('.nav-overlay a').forEach((a) => a.addEventListener('click', () => setNav(false)));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('nav-open')) {
                setNav(false);
                burger.focus();
            }
        });
    }

    // ---- Scroll reveal ----------------------------------------------------

    const revealables = document.querySelectorAll('[data-reveal]');
    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealables.forEach((el) => el.classList.add('is-in'));
    } else {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-in');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px' });
        revealables.forEach((el) => revealObserver.observe(el));
    }

    // ---- Scroll spy for in page sections ----------------------------------

    const spyLinks = document.querySelectorAll('.nav-links a[data-section]');
    if (spyLinks.length && 'IntersectionObserver' in window) {
        // Every top level section is watched, so the hero clears the highlight.
        const spyObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                spyLinks.forEach((a) => {
                    if (a.dataset.section === entry.target.id) {
                        a.setAttribute('aria-current', 'location');
                    } else {
                        a.removeAttribute('aria-current');
                    }
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        document.querySelectorAll('main > section').forEach((section) => spyObserver.observe(section));
    }

    // ---- Footer year ------------------------------------------------------

    document.querySelectorAll('[data-year]').forEach((el) => {
        el.textContent = new Date().getFullYear();
    });
})();

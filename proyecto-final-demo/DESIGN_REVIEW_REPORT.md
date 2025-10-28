# Design Review - Action Items
**José Pérez Portfolio - October 28, 2025**

## Critical Fixes

### 1. Consolidate Color System
**Files:** `style.css`, `plan-1ano-professional.css`

Replace all color variables with unified system:

```css
:root {
    /* Primary Palette */
    --primary-900: #0f172a;
    --primary-700: #334155;
    --primary-500: #64748b;
    
    /* Accent Palette */
    --accent-600: #0891b2;
    --accent-500: #06b6d4;
    --accent-400: #22d3ee;
    
    /* Neutrals */
    --gray-50: #f8fafc;
    --gray-100: #f1f5f9;
    --gray-200: #e2e8f0;
    --white: #ffffff;
}
```

**Actions:**
- Find/replace: `var(--color-accent)` → `var(--accent-600)`
- Find/replace: `var(--teal-600)` → `var(--accent-600)`
- Remove: All `--color-*` and `--teal-*` definitions

---

### 2. Standardize Hero Section
**Files:** All HTML files

Use ONE hero style across all pages:

```css
.hero-professional {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    padding: var(--space-2xl) var(--space-lg);
    text-align: center;
    position: relative;
    overflow: hidden;
}

.hero-professional::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(8, 145, 178, 0.1) 0%, transparent 70%);
    animation: hero-glow 8s ease-in-out infinite;
}

@keyframes hero-glow {
    0%, 100% { transform: translate(0, 0); opacity: 0.5; }
    50% { transform: translate(10%, 10%); opacity: 0.8; }
}
```

**Actions:**
- Remove `.hero-enhanced` CSS (unused)
- Ensure all pages use `.hero-professional`

---

### 3. Consolidate Spacing System
**Files:** `style.css`, `plan-1ano-professional.css`

```css
:root {
    --space-xs: 0.5rem;   /* 8px */
    --space-sm: 1rem;     /* 16px */
    --space-md: 1.5rem;   /* 24px */
    --space-lg: 2rem;     /* 32px */
    --space-xl: 3rem;     /* 48px */
    --space-2xl: 4rem;    /* 64px */
}
```

**Actions:**
- Find/replace: `--spacing-` → `--space-`
- Remove old `--spacing-*` definitions

---

### 4. Unify Card System
**Files:** All CSS files

Single card component:

```css
.card {
    background: var(--white);
    border-left: 4px solid var(--accent-600);
    border-radius: 8px;
    padding: var(--space-lg);
    margin-bottom: var(--space-lg);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
}

.card:hover {
    box-shadow: 0 8px 16px rgba(0,0,0,0.15);
    transform: translateY(-4px);
}

.card-header {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    margin-bottom: var(--space-md);
    padding-bottom: var(--space-sm);
    border-bottom: 2px solid var(--gray-200);
}

.icon-circle {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(8, 145, 178, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
}

.card-title {
    font-size: var(--text-2xl);
    font-weight: 600;
    color: var(--primary-900);
    margin: 0;
}
```

**Actions:**
- Find/replace: `.card-professional` → `.card`
- Find/replace: `.card-header-professional` → `.card-header`
- Find/replace: `.icon-circle-professional` → `.icon-circle`
- Remove duplicate card CSS

---

### 5. Typography Scale
**Files:** All CSS files

```css
:root {
    --text-xs: 0.75rem;    /* 12px */
    --text-sm: 0.875rem;   /* 14px */
    --text-base: 1rem;     /* 16px */
    --text-lg: 1.125rem;   /* 18px */
    --text-xl: 1.25rem;    /* 20px */
    --text-2xl: 1.5rem;    /* 24px */
    --text-3xl: 1.875rem;  /* 30px */
    --text-4xl: 2.25rem;   /* 36px */
    --text-5xl: 3rem;      /* 48px */
}

h1 { font-size: var(--text-5xl); font-weight: 700; line-height: 1.2; }
h2 { font-size: var(--text-4xl); font-weight: 600; line-height: 1.3; }
h3 { font-size: var(--text-2xl); font-weight: 600; line-height: 1.4; }
p { font-size: var(--text-base); line-height: 1.6; }
```

**Actions:**
- Replace hardcoded font sizes with variables
- Ensure consistency across all pages

---

## Animation Improvements

### 6. Enhance World Trade Map
**File:** `carreras-visuals.css`

Add sequential route activation (matching neural network quality):

```css
.trade-route#route1 {
    animation: activate-trade-route 8s infinite;
    animation-delay: 0s;
}

.trade-route#route2 {
    animation: activate-trade-route 8s infinite;
    animation-delay: 1.5s;
}

@keyframes activate-trade-route {
    0% { 
        stroke: rgba(8, 145, 178, 0.2); 
        stroke-width: 2;
    }
    10% { 
        stroke: rgba(8, 145, 178, 0.9); 
        stroke-width: 4;
        filter: drop-shadow(0 0 8px rgba(8, 145, 178, 0.6));
    }
    20% { 
        stroke: rgba(8, 145, 178, 0.4); 
        stroke-width: 2;
    }
    100% { 
        stroke: rgba(8, 145, 178, 0.2); 
    }
}

.cargo {
    opacity: 0;
    animation: cargo-appear 8s infinite;
}

@keyframes cargo-appear {
    0%, 8% { opacity: 0; }
    10%, 18% { opacity: 1; }
    20%, 100% { opacity: 0; }
}
```

---

### 7. Improve Graph Theory Animation
**File:** `carreras-visuals.css`

Add pathfinding animation:

```css
.graph-edge.highlight {
    stroke: var(--accent-600);
    stroke-width: 3;
    animation: path-highlight 3s ease-in-out infinite;
}

@keyframes path-highlight {
    0%, 100% { 
        stroke-dasharray: 0, 1000;
        stroke: var(--accent-600);
    }
    50% { 
        stroke-dasharray: 1000, 0;
        stroke: var(--accent-400);
        filter: drop-shadow(0 0 8px var(--accent-500));
    }
}

.graph-node:nth-child(1) { animation: node-activate 4s infinite; animation-delay: 0s; }
.graph-node:nth-child(2) { animation: node-activate 4s infinite; animation-delay: 0.8s; }
.graph-node:nth-child(3) { animation: node-activate 4s infinite; animation-delay: 1.6s; }
.graph-node:nth-child(4) { animation: node-activate 4s infinite; animation-delay: 2.4s; }

@keyframes node-activate {
    0%, 20%, 100% { 
        fill: var(--accent-600);
        r: 15;
    }
    10% { 
        fill: var(--accent-400);
        r: 20;
        filter: drop-shadow(0 0 15px var(--accent-500));
    }
}
```

---

### 8. Enhance Analytics Dashboard
**File:** `carreras-visuals.css`

Add staggered animations:

```css
.kpi-card:nth-child(1) { animation-delay: 0s; }
.kpi-card:nth-child(2) { animation-delay: 0.2s; }
.kpi-card:nth-child(3) { animation-delay: 0.4s; }

@keyframes grow-bar-bounce {
    0% { height: 0; }
    60% { height: calc(var(--height) * 1.1); }
    80% { height: calc(var(--height) * 0.95); }
    100% { height: var(--height); }
}
```

---

## Responsive Design Fixes

### 9. Navigation Menu
**File:** `style.css`

Add intermediate breakpoints:

```css
@media (max-width: 920px) {
    .nav-menu {
        gap: var(--space-xs);
        font-size: 0.9rem;
    }
}

@media (max-width: 768px) {
    .nav-menu {
        flex-wrap: wrap;
        justify-content: center;
    }
}

@media (max-width: 640px) {
    .nav-menu {
        flex-direction: column;
        align-items: stretch;
    }
    
    .nav-menu li a {
        display: block;
        text-align: center;
        padding: var(--space-sm);
    }
}
```

---

### 10. Hero Stats Layout
**File:** `plan-1ano-professional.css`

Convert to CSS Grid:

```css
.hero-stats-professional {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: var(--space-md);
    max-width: 800px;
    margin: 0 auto;
}

@media (max-width: 640px) {
    .hero-stats-professional {
        grid-template-columns: repeat(2, 1fr);
        gap: var(--space-sm);
    }
}

@media (max-width: 400px) {
    .hero-stats-professional {
        grid-template-columns: 1fr;
    }
}
```

---

### 11. Cards Grid System
**File:** All CSS files

Standardize grid:

```css
.cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-md);
    margin-bottom: var(--space-xl);
}

@media (min-width: 1200px) {
    .cards-grid {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }
}

@media (max-width: 640px) {
    .cards-grid {
        grid-template-columns: 1fr;
    }
}
```

---

## Performance Optimizations

### 12. TradingView Widget Lazy Load
**File:** `carreras.html`

Replace synchronous load:

```html
<div class="tradingview-widget-container" data-lazy-load style="min-height: 400px;">
    <div class="loading-placeholder">📈 Cargando gráfico S&P 500...</div>
</div>

<script>
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Load TradingView script here
            const script = document.createElement('script');
            script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
            script.async = true;
            entry.target.appendChild(script);
            observer.unobserve(entry.target);
        }
    });
});
observer.observe(document.querySelector('[data-lazy-load]'));
</script>
```

---

### 13. Animation Performance
**File:** All CSS files

Add will-change for GPU acceleration:

```css
.nn-connection,
.trade-route,
.bar,
.graph-edge {
    will-change: transform, opacity;
}
```

---

## Polish Items

### 14. University Logos
**File:** `carreras.html`

Standardize styling:

```css
.univ-logo-img {
    width: 80px;
    height: 80px;
    object-fit: contain;
    filter: grayscale(100%) brightness(0.8);
    transition: all 0.3s ease;
}

.univ-logo-img:hover {
    filter: grayscale(0%) brightness(1);
    transform: scale(1.1);
}
```

---

### 15. Badge System
**File:** All CSS files

Standardize badges:

```css
.badge {
    display: inline-flex;
    align-items: center;
    gap: var(--space-xs);
    padding: 6px 14px;
    border-radius: 16px;
    font-size: var(--text-sm);
    font-weight: 500;
    transition: all 0.2s ease;
}

.badge.primary { background: var(--accent-600); color: var(--white); }
.badge.secondary { background: var(--gray-200); color: var(--primary-700); }
.badge:hover { transform: scale(1.05); }
```

---

### 16. Collapsible Sections Enhancement
**File:** `carreras-visuals.css`

Improve transitions:

```css
.toggle-icon {
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    display: inline-block;
}

.section-content {
    opacity: 1;
    transition: max-height 0.5s ease, opacity 0.3s ease, padding 0.5s ease;
}

.section-toggle:not(:checked) + .section-header + .section-content {
    opacity: 0;
}
```

---

## Code Organization

### 17. CSS Structure Refactor
**Current:** 3 files with duplication

**Proposed Structure:**
```
styles/
├── 01-variables.css      /* Colors, spacing, typography */
├── 02-base.css          /* Reset, global styles */
├── 03-layout.css        /* Grid, containers */
├── 04-components.css    /* Cards, buttons, badges */
├── 05-animations.css    /* All keyframes */
├── 06-visualizations.css /* SVG graphics */
└── 07-responsive.css    /* Media queries */
```

**Actions:**
- Extract CSS variables to `01-variables.css`
- Move animations to `05-animations.css`
- Consolidate components to `04-components.css`
- Remove duplicates

---

### 18. Remove Unused CSS
**Files:** All CSS files

Classes to remove:
- `.hero-enhanced` (not used)
- `.ticker-tape` (removed feature)
- Any `-old` or `-backup` suffixed classes

**Action:** Search and remove unused selectors

---

## Implementation Priority

**Week 1 - Critical:**
1. Consolidate color system (#1)
2. Standardize hero sections (#2)
3. Unify card system (#4)
4. Consolidate spacing (#3)

**Week 2 - Enhancements:**
5. Typography scale (#5)
6. World Trade Map animation (#6)
7. Graph Theory animation (#7)
8. Analytics enhancements (#8)

**Week 3 - Responsive:**
9. Navigation menu (#9)
10. Hero stats layout (#10)
11. Cards grid system (#11)

**Week 4 - Performance & Polish:**
12. Lazy load widgets (#12)
13. Animation performance (#13)
14. CSS refactor (#17)
15. Remove unused CSS (#18)

---

**Total Actions:** 18 concrete implementation items
**Estimated Impact:** +11 point grade improvement (B+ → A-)

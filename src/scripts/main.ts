// ============================================
// AINO-STYLE CHARACTER SCRAMBLE
// Per-character cursor scramble + text reveal
// ============================================
const DENSE_CHARS = '$MBNQOW@&R8GD6S9H#E5UK0A2XP34ZC%VIF17YTJL*';
const REVEAL_CHARS = DENSE_CHARS + '[]?}{()<>|=+\\/^!";*_:~,\'-.` ';

function quinticOut(t: number) {
  return 1 + (--t) * t * t * t * t;
}

function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// Whole-text scramble (hover on links/headings)
function scrambleText(el: HTMLElement) {
  const original = el.dataset.text || el.textContent || '';
  if (!el.dataset.text) el.dataset.text = original;

  let iteration = 0;
  const total = original.length + 10;

  function step() {
    el.textContent = original
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' ';
        if (i < iteration - 4) return original[i];
        return DENSE_CHARS[Math.floor(Math.random() * DENSE_CHARS.length)];
      })
      .join('');
    iteration++;
    if (iteration <= total) {
      (el as any)._scrambleFrame = requestAnimationFrame(step);
    } else {
      el.textContent = original;
    }
  }

  if ((el as any)._scrambleFrame) cancelAnimationFrame((el as any)._scrambleFrame);
  iteration = 0;
  (el as any)._scrambleFrame = requestAnimationFrame(step);
}

function restoreText(el: HTMLElement) {
  if ((el as any)._scrambleFrame) cancelAnimationFrame((el as any)._scrambleFrame);
  if (el.dataset.text) el.textContent = el.dataset.text;
}

// Scroll-triggered text reveal (aino's fadein scramble)
function scrambleReveal(el: HTMLElement) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: { node: Text; original: string }[] = [];

  let node: Text | null;
  while ((node = walker.nextText() as Text | null)) {
    if (node.textContent && node.textContent.trim()) {
      nodes.push({ node, original: node.textContent });
      node.textContent = node.textContent.replace(/\S/g, ' ');
    }
  }

  let charIndex = 0;
  const totalChars = nodes.reduce((s, n) => s + n.original.length, 0);
  const speed = 1.5; // ms per char delay
  const duration = 350; // ms per char resolve

  for (const { node: textNode, original } of nodes) {
    for (let i = 0; i < original.length; i++) {
      if (original[i] === ' ' || original[i] === '\n') {
        charIndex++;
        continue;
      }
      const delay = charIndex * speed;
      const targetChar = original[i];
      const charIdx = i;
      const startTime = performance.now() + delay;

      function animate() {
        const elapsed = performance.now() - startTime;
        if (elapsed < 0) {
          requestAnimationFrame(animate);
          return;
        }
        const progress = easeInOutQuad(Math.min(elapsed / duration, 1));
        if (progress >= 0.99) {
          const text = textNode.textContent || '';
          textNode.textContent = text.substring(0, charIdx) + targetChar + text.substring(charIdx + 1);
          return;
        }
        const rIdx = Math.floor((1 - progress) * (REVEAL_CHARS.length - 1));
        const text = textNode.textContent || '';
        textNode.textContent = text.substring(0, charIdx) + REVEAL_CHARS[rIdx] + text.substring(charIdx + 1);
        requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
      charIndex++;
    }
  }
}

// TreeWalker helper
declare global {
  interface TreeWalker {
    nextText(): Node | null;
  }
}
TreeWalker.prototype.nextText = TreeWalker.prototype.nextNode;

// ============================================
// HOVER SCRAMBLE BINDINGS
// ============================================
function addScramble(el: HTMLElement) {
  if ((el as any)._hasScramble) return;
  (el as any)._hasScramble = true;
  el.addEventListener('mouseenter', () => scrambleText(el));
  el.addEventListener('mouseleave', () => restoreText(el));
}

function addScrambleOnParent(el: HTMLElement, parent: HTMLElement) {
  if ((el as any)._hasScramble) return;
  (el as any)._hasScramble = true;
  parent.addEventListener('mouseenter', () => scrambleText(el));
  parent.addEventListener('mouseleave', () => restoreText(el));
}

function initHoverChar() {
  // All links except compound components
  document.querySelectorAll<HTMLElement>('a:not(.project-row):not(.post-card)').forEach(addScramble);
  // Headings
  document.querySelectorAll<HTMLElement>('h1, h2, h3').forEach(addScramble);
  // Explicit elements
  document.querySelectorAll<HTMLElement>('[data-hoverchar]').forEach(addScramble);
  // Buttons
  document.querySelectorAll<HTMLElement>('button').forEach(addScramble);
  // Project rows: only name
  document.querySelectorAll<HTMLElement>('.project-row').forEach((row) => {
    const name = row.querySelector<HTMLElement>('.project-name');
    if (name) addScrambleOnParent(name, row);
  });
  // Post cards: only title
  document.querySelectorAll<HTMLElement>('.post-card').forEach((card) => {
    const title = card.querySelector<HTMLElement>('.title');
    if (title) addScrambleOnParent(title, card);
  });
}

// ============================================
// SCROLL ANIMATIONS — fadein + scramble reveal
// ============================================
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          el.classList.add('visible');
          // Scramble reveal for section headers
          if (el.classList.contains('section-header')) {
            const h2 = el.querySelector('h2');
            if (h2) scrambleReveal(h2 as HTMLElement);
          }
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -60px 0px' }
  );
  document.querySelectorAll('.fadein, .section-header').forEach((el) => observer.observe(el));
}

// ============================================
// TYPEWRITER (home hero)
// ============================================
function initTypewriter() {
  const el = document.querySelector<HTMLElement>('[data-typewriter]');
  if (!el) return;
  const text = el.dataset.typewriter || el.textContent || '';
  el.textContent = '';
  el.style.borderRight = '2px solid var(--fg)';
  let i = 0;
  function type() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(type, 40 + Math.random() * 40);
    } else {
      setTimeout(() => { el.style.borderRight = 'none'; }, 1500);
    }
  }
  setTimeout(type, 300);
}

// ============================================
// MULTI-LINE TYPEWRITER (tagline)
// ============================================
function initTaglineTypewriter() {
  const container = document.querySelector<HTMLElement>('[data-typewriter-lines]');
  if (!container) return;
  const lines = Array.from(container.querySelectorAll<HTMLElement>('[data-line]'));
  if (!lines.length) return;
  const texts = lines.map((line) => {
    const t = line.textContent || '';
    line.textContent = '';
    line.style.opacity = '0';
    line.style.height = '0';
    line.style.overflow = 'hidden';
    return t;
  });
  let lineIdx = 0;
  function typeLine() {
    if (lineIdx >= lines.length) return;
    const line = lines[lineIdx];
    const text = texts[lineIdx];
    line.style.opacity = '1';
    line.style.height = '';
    line.style.overflow = '';
    line.style.borderRight = '2px solid var(--fg)';
    let charIdx = 0;
    function typeChar() {
      if (charIdx <= text.length) {
        line.textContent = text.slice(0, charIdx);
        charIdx++;
        setTimeout(typeChar, 25 + Math.random() * 25);
      } else {
        line.style.borderRight = 'none';
        lineIdx++;
        setTimeout(typeLine, 100);
      }
    }
    typeChar();
  }
  // Wait for h1 typewriter on home page, start immediately on other pages
  const hasH1Typewriter = document.querySelector('[data-typewriter]');
  setTimeout(typeLine, hasH1Typewriter ? 900 : 200);
}

// ============================================
// LIVE CLOCK (footer)
// ============================================
function initClock() {
  const el = document.querySelector<HTMLElement>('.footer-time');
  if (!el) return;
  function tick() {
    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' });
    const time = now.toLocaleTimeString('en-US', { hour12: false });
    el.textContent = `${day} ${time}`;
    setTimeout(tick, 200);
  }
  tick();
}

// ============================================
// CHARACTER TRAIL — monospace chars spawn at cursor and dissolve
// ============================================
function initCharTrail() {
  if (window.innerWidth < 641) return; // skip on mobile

  const chars = '$MBNQOW@&R8GD6S9H#E5UK0A2XP34ZC%VIF17YTJL*';
  const container = document.querySelector<HTMLElement>('.cursor-trail');
  if (!container) return;

  let lastX = 0, lastY = 0;
  const minDist = 30; // minimum px between spawns

  document.addEventListener('mousemove', (e) => {
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    if (dx * dx + dy * dy < minDist * minDist) return;

    lastX = e.clientX;
    lastY = e.clientY;

    const span = document.createElement('span');
    span.textContent = chars[Math.floor(Math.random() * chars.length)];
    span.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top: ${e.clientY}px;
      pointer-events: none;
      color: var(--fg);
      font-family: inherit;
      font-size: 0.85em;
      opacity: 0.5;
      transform: translate(-50%, -50%);
      transition: opacity 0.8s ease-out, transform 0.8s ease-out;
      z-index: 9999;
    `;
    container.appendChild(span);

    requestAnimationFrame(() => {
      span.style.opacity = '0';
      span.style.transform = `translate(-50%, ${-20 - Math.random() * 20}px)`;
    });

    setTimeout(() => span.remove(), 800);
  });
}

// ============================================
// SCROLL PROGRESS BAR (blog posts)
// ============================================
function initScrollProgress() {
  const bar = document.querySelector<HTMLElement>('.scroll-progress');
  if (!bar) return;

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ============================================
// STAGGERED LIST REVEAL
// ============================================
function initStaggeredReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll<HTMLElement>('.project-row, .archive-list li');
          items.forEach((item, i) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(6px)';
            item.style.transition = `opacity 0.4s ease ${i * 0.03}s, transform 0.4s ease ${i * 0.03}s`;
            requestAnimationFrame(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            });
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.project-showcase, .archive-list').forEach((el) => observer.observe(el));
}


// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('header nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.textContent = nav.classList.contains('open') ? 'Close' : 'Menu';
    });
  }
}

// ============================================
// INIT
// ============================================
function init() {
  initScrollAnimations();
  initMobileMenu();
  initHoverChar();
  initTypewriter();
  initTaglineTypewriter();
  initClock();
  initCharTrail();
  initScrollProgress();
  initStaggeredReveal();
}

document.addEventListener('DOMContentLoaded', init);

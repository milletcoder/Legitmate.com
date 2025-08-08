/* =====================================================================
   Legal Eagle Single-Page Demo – app.js
   Author: AI assistant | July 2025
   ---------------------------------------------------------------------
   This script powers the interactive parts of Legal Eagle's marketing
   page.  Features implemented:
     • Accessible hamburger + mobile navigation
     • Testimonials slider (auto + manual controls)
     • Blog list & article reader (in-memory MD content)
     • Simple dashboard with dummy KPI chart via Chart.js
     • Compliance calendar CRUD with modal dialog & localStorage-free state
   ===================================================================== */

/* --------------------------- Helper Functions --------------------------- */
const $ = (selector, ctx = document) => ctx.querySelector(selector);
const $$ = (selector, ctx = document) => [...ctx.querySelectorAll(selector)];

function trapFocus(modal) {
  const focusable = $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', modal);
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  function loop(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
  modal.addEventListener('keydown', loop);
  return () => modal.removeEventListener('keydown', loop);
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Safe Markdown-to-HTML converter used by the legacy marketing page.
 * Avoids tricky regex literals that previously caused a syntax error.
 * This file is written in ESM style for Next.js.
 */

/**
 * Convert a subset of Markdown into HTML.
 * - Supports headings (#, ##, ###), bold (**text**), italic (*text*), links [text](url), inline code `code`
 * - Wraps paragraphs and preserves basic line breaks
 * - Escapes HTML first for safety
 * @param {string} input
 * @returns {string}
 */
function markdownToHtml(input) {
  if (typeof input !== "string") return ""
  // Headings
  let out = input
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1>$1</h1>")
  // Bold, italics, inline code
  out = out
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
  // Simple paragraphs
  out = out.replace(/^(?!<h\d>|<ul>|<ol>|<li>|<p>|<code>)([^\n]+)\n?/gm, "<p>$1</p>")
  return out
}

export { markdownToHtml }

/* ---------------------------- Global State ----------------------------- */
const state = {
  testimonials: [
    {
      name: 'Rohit | Knitwear Co.',
      quote: 'We responded to a ₹5 lakh GST demand in under an hour. No CA fees!',
      avatar: 'https://unsplash.it/80/80?image=1062'
    },
    {
      name: 'Anjali | Spice D2C',
      quote: "Legal Eagle's calendar pinged me before every GSTR-3B. Stress → 0.",
      avatar: 'https://unsplash.it/80/80?image=1005'
    },
    {
      name: 'Mohan | SaaS Edge',
      quote: 'Investors loved our compliance deck powered by their dashboard KPIs.',
      avatar: 'https://unsplash.it/80/80?image=64'
    }
  ],
  articles: {
    'understanding-common-gst-notices': {
      title: 'Understanding Common GST Notices',
      body: `## Overview\nThe Goods and Services Tax regime issues several types of notices. \n\n> **Callout**: Ignoring a notice can freeze your GSTN, halting operations.\n\n### 1. **GSTR-3A – Non-filing**\nIssued when you miss filing returns. Respond by filing ASAP and paying late fees.\n\n### 2. **ASMT-10 – Discrepancy**\nTax officer spots mismatch. Provide reconciliation statements.\n\n*This article is educational and not legal advice.*`
    },
    'msme-guide-to-timely-filing': {
      title: 'The MSME Guide to Timely Filing',
      body: `## Why Deadlines Matter\nPenalties compound monthly.\n\n### Calendar Method\n1. Mark due-dates in Legal Eagle.\n2. Sync to Google Calendar.\n\n### Automation\nOur Telegram bot nudges you 3 days before.`
    },
    'when-to-hire-a-chartered-accountant': {
      title: 'When to Hire a Chartered Accountant',
      body: `For turnovers > ₹5 Cr, complexity goes up. Consider external CA when:\n\n- You receive more than 3 notices per quarter.\n- Input credit spans 4+ states.`
    }
  },
  deadlines: [],
  currentSection: 'home'
};

/* ---------------------------- Navigation ------------------------------ */
const nav = {
  hamburger: $('#hamburger'),
  mobileMenu: $('#mobile-menu'),
  navList: $('.nav__list'),
};

function showSection(sectionId) {
  // Hide all sections first
  const sections = ['home', 'features', 'pricing', 'blog', 'security', 'dashboard'];
  sections.forEach(id => {
    const section = $(`#${id}`);
    if (section) {
      if (id === sectionId) {
        section.classList.remove('hidden');
        section.style.display = 'block';
      } else {
        section.classList.add('hidden');
        section.style.display = 'none';
      }
    }
  });
  
  // Special handling for dashboard
  if (sectionId === 'dashboard') {
    $('#dashboard').classList.remove('hidden');
    $('#dashboard').style.display = 'block';
    // Initialize dashboard if first time
    if (!draftChart) {
      initDashboard();
    }
  }
  
  state.currentSection = sectionId;
}

function initMobileNav() {
  // Clone desktop links into mobile
  nav.mobileMenu.innerHTML = `<ul role="list">${nav.navList.innerHTML}</ul>`;
  
  const toggle = () => {
    const expanded = nav.hamburger.getAttribute('aria-expanded') === 'true';
    nav.hamburger.setAttribute('aria-expanded', String(!expanded));
    nav.mobileMenu.classList.toggle('hidden');
  };
  
  nav.hamburger.addEventListener('click', toggle);
  
  // Handle navigation clicks
  const handleNavClick = (e) => {
    e.preventDefault();
    const href = e.target.getAttribute('href');
    if (href && href.startsWith('#')) {
      const sectionId = href.substring(1);
      showSection(sectionId);
      // Close mobile menu if open
      nav.hamburger.setAttribute('aria-expanded', 'false');
      nav.mobileMenu.classList.add('hidden');
    }
  };
  
  // Add click handlers to both desktop and mobile nav
  $$('.nav__link').forEach(link => link.addEventListener('click', handleNavClick));
  $$('#mobile-menu a').forEach(link => link.addEventListener('click', handleNavClick));
}

/* --------------------------- Testimonials ----------------------------- */
function initTestimonials() {
  const track = $('#slider-track');
  state.testimonials.forEach(t => {
    const div = document.createElement('div');
    div.className = 'slider__item flex flex-col items-center text-center gap-8';
    div.innerHTML = `
      <img src="${t.avatar}" alt="${t.name} portrait" width="80" height="80" style="border-radius:50%" />
      <blockquote>"${t.quote}"</blockquote>
      <cite>— ${t.name}</cite>
    `;
    track.appendChild(div);
  });
  let idx = 0;
  const prevBtn = $('.slider__control.prev');
  const nextBtn = $('.slider__control.next');
  const update = () => {
    track.style.transform = `translateX(-${idx * 100}%)`;
  };
  prevBtn.addEventListener('click', () => {
    idx = (idx - 1 + state.testimonials.length) % state.testimonials.length;
    update();
  });
  nextBtn.addEventListener('click', () => {
    idx = (idx + 1) % state.testimonials.length;
    update();
  });
  // Auto cycle every 6s
  setInterval(() => {
    nextBtn.click();
  }, 6000);
}

/* ---------------------------- Blog Logic ------------------------------ */
function initBlog() {
  const list = $('#blog-list');
  const post = $('#blog-post');
  // Populate list
  Object.entries(state.articles).forEach(([slug, art]) => {
    const card = document.createElement('article');
    card.className = 'card blog-card';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', art.title);
    card.innerHTML = `<div class="card__body"><h3>${art.title}</h3><p>${art.body.slice(0, 80)}…</p></div>`;
    const open = () => showArticle(slug);
    card.addEventListener('click', open);
    card.addEventListener('keypress', e => { if (e.key === 'Enter') open(); });
    list.appendChild(card);
  });

  function showArticle(slug) {
    const art = state.articles[slug];
    if (!art) return;
    post.classList.remove('hidden');
    list.classList.add('hidden');
    
    // Use simple HTML formatting instead of marked.parse since marked might not be available
    const formattedBody = markdownToHtml(art.body);
    
    post.innerHTML = `
      <button class="btn btn--outline btn--sm mb-8" aria-label="Back to articles" id="back-to-list">← Back</button>
      <h2>${art.title}</h2>
      <div class="prose">${formattedBody}</div>
    `;
    
    $('#back-to-list').addEventListener('click', () => {
      post.classList.add('hidden');
      list.classList.remove('hidden');
    });
  }
}

/* ----------------------------- Dashboard ------------------------------ */
let draftChart;
function initDashboard() {
  // Show dummy chart
  const ctx = $('#draftChart').getContext('2d');
  draftChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Drafts',
        data: [3, 2, 5, 4, 7, 6],
        backgroundColor: '#1FB8CD'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
  // Set KPIs
  $('#kpi-drafts').textContent = '27';
  $('#kpi-deadlines').textContent = state.deadlines.length;
  // Render calendar table
  renderCalendarTable();
}

function renderCalendarTable() {
  const tbody = $('#calendar-body');
  tbody.innerHTML = '';
  if (state.deadlines.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="3">No deadlines yet.</td>`;
    tbody.appendChild(tr);
  } else {
    state.deadlines.forEach(dl => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${dl.title}</td>
        <td>${formatDate(dl.date)}</td>
        <td>${dl.category}</td>
      `;
      tbody.appendChild(tr);
    });
  }
  $('#kpi-deadlines').textContent = state.deadlines.length;
}

/* ------------------------ Compliance Modal ---------------------------- */
const modal = {
  root: $('#deadline-modal'),
  closeBtn: $('#close-modal'),
  cancelBtn: $('#cancel-modal'),
  form: $('#deadline-form'),
  openBtn: $('#add-deadline-btn')
};
let removeTrap = null;

function openModal() {
  modal.root.classList.remove('hidden');
  modal.root.style.display = 'flex';
  removeTrap = trapFocus(modal.root);
  $('#deadline-title').focus();
}

function closeModal() {
  modal.root.classList.add('hidden');
  modal.root.style.display = 'none';
  if (removeTrap) removeTrap();
  modal.form.reset();
  modal.openBtn.focus();
}

function initModal() {
  // Ensure modal starts hidden
  modal.root.classList.add('hidden');
  modal.root.style.display = 'none';
  
  modal.openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openModal();
  });
  
  modal.closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeModal();
  });
  
  modal.cancelBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeModal();
  });
  
  // Close on backdrop click
  modal.root.addEventListener('click', (e) => {
    if (e.target === modal.root) {
      closeModal();
    }
  });
  
  // Close on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.root.classList.contains('hidden')) {
      closeModal();
    }
  });
  
  modal.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = $('#deadline-title').value.trim();
    const date = $('#deadline-date').value;
    const category = $('#deadline-category').value;
    
    if (!title || !date) {
      alert('Please fill out all required fields');
      return;
    }
    
    state.deadlines.push({ 
      id: Date.now().toString(), 
      title, 
      date, 
      category 
    });
    
    renderCalendarTable();
    closeModal();
  });
}

/* ------------------------------ Init ---------------------------------- */
function init() {
  initMobileNav();
  initTestimonials();
  initBlog();
  initModal();
  
  // Start with home section visible
  showSection('home');
  
  // Year in footer
  $('#year').textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', init);

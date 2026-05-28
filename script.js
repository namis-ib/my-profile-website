const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const sections = $$('main section[id]');
const navLinks = $$('.nav a');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(section => observer.observe(section));

$('#year').textContent = new Date().getFullYear();

const html = document.documentElement;
const themeToggle = $('#themeToggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
html.dataset.theme = savedTheme;
updateThemeButton(savedTheme);
themeToggle.addEventListener('click', () => {
  const next = html.dataset.theme === 'dark' ? 'light' : 'dark';
  html.dataset.theme = next;
  localStorage.setItem('theme', next);
  updateThemeButton(next);
});
function updateThemeButton(theme) {
  themeToggle.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i><span>Light</span>' : '<i class="fa-solid fa-moon"></i><span>Dark</span>';
}

$$('.filter').forEach(button => button.addEventListener('click', () => {
  $$('.filter').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
  const filter = button.dataset.filter;
  $$('.project-card').forEach(card => {
    card.style.display = filter === 'all' || card.dataset.category.includes(filter) ? 'block' : 'none';
  });
}));

const modal = $('#searchModal');
const input = $('#searchInput');
const results = $('#results');
const searchItems = [
  { title: 'About Me', target: '#about', keywords: 'profile cyber security analyst wintel' },
  { title: 'Resume / Experience', target: '#experience', keywords: 'datacom service desk systems engineer' },
  { title: 'Portfolio Projects', target: '#projects', keywords: 'siem azure honeypot soar' },
  { title: 'Education & Certifications', target: '#education', keywords: 'rmit security plus isc2 certificate' },
  { title: 'Tech Stack', target: '#skills', keywords: 'active directory powershell azure wazuh splunk' },
  { title: 'Contact', target: '#contact', keywords: 'email melbourne open to work' }
];
function openSearch() { modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); input.value = ''; renderResults(''); setTimeout(() => input.focus(), 50); }
function closeSearch() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); }
$('#openSearch').addEventListener('click', openSearch);
modal.addEventListener('click', (event) => { if (event.target === modal) closeSearch(); });
document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openSearch(); }
  if (event.key === 'Escape') closeSearch();
});
input.addEventListener('input', () => renderResults(input.value));
function renderResults(query) {
  const q = query.toLowerCase();
  const matches = searchItems.filter(item => `${item.title} ${item.keywords}`.toLowerCase().includes(q));
  results.innerHTML = matches.map(item => `<div class="result" data-target="${item.target}">${item.title}<br><small>${item.keywords}</small></div>`).join('') || '<div class="result">No matching section found</div>';
  $$('.result[data-target]').forEach(result => result.addEventListener('click', () => {
    closeSearch();
    document.querySelector(result.dataset.target).scrollIntoView({ behavior: 'smooth' });
  }));
}

async function getVisitorCount() {
  const counter = $('#counter');
  try {
    const key = 'namis-portfolio-visits';
    const visits = Number(localStorage.getItem(key) || 0) + 1;
    localStorage.setItem(key, visits);
    counter.textContent = visits.toLocaleString();
  } catch {
    counter.textContent = 'N/A';
  }
}
getVisitorCount();

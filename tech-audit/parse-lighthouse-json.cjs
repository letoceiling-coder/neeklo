/**
 * Парсит lh-*-desktop.json и lh-*-mobile.json, выводит таблицу Lighthouse в Markdown.
 * Запуск: node tech-audit/parse-lighthouse-json.cjs
 */

const fs = require('fs');
const path = require('path');

const OUT = __dirname;

const ROWS = [
  { label: 'Главная', desktop: 'lh-index-desktop', mobile: 'lh-index-mobile' },
  { label: 'Mini App', desktop: 'lh-products-mini-app-desktop', mobile: 'lh-products-mini-app-mobile' },
  { label: 'AI-агент', desktop: 'lh-products-ai-agent-desktop', mobile: 'lh-products-ai-agent-mobile' },
  { label: 'AI-видео', desktop: 'lh-products-ai-video-desktop', mobile: 'lh-products-ai-video-mobile' },
  { label: 'Автоматизация', desktop: 'lh-products-automation-desktop', mobile: 'lh-products-automation-mobile' },
  { label: 'CRM', desktop: 'lh-products-crm-desktop', mobile: 'lh-products-crm-mobile' },
  { label: 'Услуги (каталог)', desktop: 'lh-services-desktop', mobile: 'lh-services-mobile' },
  { label: 'Портфолио', desktop: 'lh-work-desktop', mobile: 'lh-work-mobile' },
  { label: 'Кейсы', desktop: 'lh-cases-desktop', mobile: 'lh-cases-mobile' },
  { label: 'О нас', desktop: 'lh-about-desktop', mobile: 'lh-about-mobile' },
  { label: 'Каталог/цены', desktop: 'lh-products-desktop', mobile: 'lh-products-mobile' },
];

const URLS = ['/', '/products/mini-app', '/products/ai-agent', '/products/ai-video', '/products/automation', '/products/crm', '/services', '/work', '/cases', '/about', '/products'];

function score(file) {
  const p = path.join(OUT, file + '.json');
  if (!fs.existsSync(p)) return null;
  try {
    const j = JSON.parse(fs.readFileSync(p, 'utf8'));
    const c = j.categories || {};
    const s = (id) => { const v = c[id]?.score; return v == null ? null : Math.round(v * 100); };
    return { perf: s('performance'), a11y: s('accessibility'), bp: s('best-practices'), seo: s('seo') };
  } catch {
    return null;
  }
}

function cell(v) {
  return v != null ? String(v) : '—';
}

const lines = [
  '| Страница | URL | Perf | A11y | BP | SEO | Perf (M) | A11y (M) | BP (M) | SEO (M) |',
  '|----------|-----|------|------|-----|-----|----------|----------|--------|----------|',
];

for (let i = 0; i < ROWS.length; i++) {
  const r = ROWS[i];
  const u = URLS[i];
  const d = score(r.desktop);
  const m = score(r.mobile);
  lines.push('| ' + [r.label, u, cell(d?.perf), cell(d?.a11y), cell(d?.bp), cell(d?.seo), cell(m?.perf), cell(m?.a11y), cell(m?.bp), cell(m?.seo)].join(' | ') + ' |');
}

console.log(lines.join('\n'));

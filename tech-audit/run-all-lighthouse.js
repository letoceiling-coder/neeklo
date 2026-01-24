#!/usr/bin/env node
/**
 * Запуск Lighthouse для всех страниц (desktop + mobile), сохранение JSON.
 * Использование: node tech-audit/run-all-lighthouse.js [BASE_URL]
 * Пример: node tech-audit/run-all-lighthouse.js https://neeklo.ru
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const BASE = process.argv[2] || 'https://neeklo.ru';
const OUT = path.join(__dirname);

const PAGES = [
  { path: '/', name: 'index' },
  { path: '/products/mini-app', name: 'products-mini-app' },
  { path: '/products/ai-agent', name: 'products-ai-agent' },
  { path: '/products/ai-video', name: 'products-ai-video' },
  { path: '/products/automation', name: 'products-automation' },
  { path: '/products/crm', name: 'products-crm' },
  { path: '/services', name: 'services' },
  { path: '/work', name: 'work' },
  { path: '/cases', name: 'cases' },
  { path: '/about', name: 'about' },
  { path: '/products', name: 'products' },
];

function runLighthouse(url, outPath, formFactor) {
  return new Promise((resolve, reject) => {
    const args = [
      url,
      '--only-categories=performance,accessibility,best-practices,seo',
      '--output=json',
      `--output-path=${outPath}`,
      '--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage',
      '--max-wait-for-load=45000',
      '--quiet',
    ];
    if (formFactor === 'desktop') {
      args.push('--form-factor=desktop', '--screenEmulation.disabled=true');
    }
    const cp = spawn('npx', ['--yes', 'lighthouse', ...args], {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true,
    });
    let stderr = '';
    cp.stderr?.on('data', (d) => { stderr += d; });
    cp.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`exit ${code}`))));
  });
}

function run() {
  const tasks = [];
  for (const { path: p, name } of PAGES) {
    const url = BASE + (p === '/' ? '' : p);
    tasks.push(
      runLighthouse(url, path.join(OUT, `lh-${name}-desktop.json`), 'desktop')
        .then(() => console.log(`  ${name} desktop ok`))
        .catch((e) => console.warn(`  ${name} desktop failed:`, e.message))
    );
    tasks.push(
      runLighthouse(url, path.join(OUT, `lh-${name}-mobile.json`), 'mobile')
        .then(() => console.log(`  ${name} mobile ok`))
        .catch((e) => console.warn(`  ${name} mobile failed:`, e.message))
    );
  }
  return Promise.all(tasks);
}

run().then(() => {
  console.log('Done. Run: node tech-audit/parse-lighthouse-json.cjs');
}).catch((e) => {
  console.error(e);
  process.exit(1);
});

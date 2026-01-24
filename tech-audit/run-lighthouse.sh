#!/bin/bash
# Пакетный прогон Lighthouse для ключевых страниц
# Использование: ./tech-audit/run-lighthouse.sh [BASE_URL]
# Пример: ./tech-audit/run-lighthouse.sh https://neeklo.ru

BASE="${1:-https://neeklo.ru}"
OUT_DIR="$(dirname "$0")"
mkdir -p "$OUT_DIR"

PAGES=(
  "/"
  "/products/mini-app"
  "/products/ai-agent"
  "/products/ai-video"
  "/products/automation"
  "/products/crm"
  "/services"
  "/work"
  "/cases"
  "/about"
  "/products"
)

if ! command -v lighthouse &>/dev/null; then
  echo "Lighthouse не найден. Установите: npm i -g lighthouse"
  exit 1
fi

for path in "${PAGES[@]}"; do
  name=$(echo "$path" | sed 's|^/||;s|/|-|g;s|-$||;s/^$/index/')
  url="${BASE}${path}"
  out="${OUT_DIR}/lighthouse-${name}.html"
  echo "Running: $url -> $out"
  lighthouse "$url" --output=html --output-path="$out" --quiet --chrome-flags="--headless --no-sandbox" 2>/dev/null || true
done

echo "Готово. Отчёты в $OUT_DIR"

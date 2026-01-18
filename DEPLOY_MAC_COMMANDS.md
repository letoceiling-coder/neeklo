# 🍎 Команды для macOS - Быстрая настройка деплоя

## ⚡ Быстрая настройка SSH (рекомендуется)

```bash
# 1. Проверить/создать SSH ключ
if [ ! -f ~/.ssh/id_ed25519.pub ]; then
    ssh-keygen -t ed25519 -C "your-email@example.com"
fi

# 2. Скопировать ключ в буфер обмена
pbcopy < ~/.ssh/id_ed25519.pub

# 3. Добавить ключ в ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# 4. Проверить SSH подключение
ssh -T git@github.com

# 5. Удалить старые креденшалы
security delete-internet-password -s github.com 2>/dev/null

# 6. Переключить remote на SSH
cd ~/path/to/neeklo  # Замените на путь к проекту
git remote set-url origin git@github.com:letoceiling-coder/neeklo.git

# 7. Проверить
git remote -v
php artisan deploy --dry-run
```

## 🔧 Настройка Git (если не настроено)

```bash
git config --global user.name "letoceiling-coder"
git config --global user.email "your-email@example.com"
git config --global credential.helper osxkeychain
```

## ✅ Проверка настроек

```bash
# Проверить remote
git remote -v

# Проверить Git user
git config --global user.name

# Проверить SSH подключение
ssh -T git@github.com

# Проверить SSH ключи в ssh-agent
ssh-add -l
```

## 🔐 Если используете Personal Access Token (HTTPS)

```bash
# 1. Удалить старые креденшалы
security delete-internet-password -s github.com 2>/dev/null

# 2. Переключить на HTTPS
git remote set-url origin https://github.com/letoceiling-coder/neeklo.git

# 3. При первом push ввести:
# Username: letoceiling-coder
# Password: [ваш токен]
```

## 📝 Полная инструкция

Смотрите подробную инструкцию в файле `DEPLOY_SETUP.md`


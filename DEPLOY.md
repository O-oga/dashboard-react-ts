# Инструкция по настройке автоматического деплоя

## Два способа автоматизации

### Вариант 1: Через Portainer Webhook (рекомендуется - проще)

Используйте workflow `.github/workflows/deploy-webhook.yml`

### Вариант 2: Через Portainer API (больше контроля)

Используйте workflow `.github/workflows/deploy.yml`

---

## Вариант 1: Настройка через Webhook

### Преимущества:
- Проще в настройке
- Не требует API ключей
- Portainer сам управляет обновлением стека

### Настройка:

1. **Создайте webhook в Portainer:**
   - Откройте ваш стек в Portainer
   - Перейдите в раздел **Webhooks**
   - Нажмите **Add webhook**
   - Скопируйте URL webhook

2. **Добавьте webhook URL в GitHub Secrets:**
   - Settings → Secrets and variables → Actions
   - Добавьте secret: `PORTAINER_WEBHOOK_URL` с URL вашего webhook

3. **Убедитесь, что используется правильный workflow:**
   - Переименуйте `.github/workflows/deploy-webhook.yml` в `.github/workflows/deploy.yml`
   - Или удалите старый `deploy.yml`

4. **Настройте docker-compose.yml в Portainer:**
   - Используйте образ из GitHub Container Registry: `ghcr.io/YOUR_USERNAME/YOUR_REPO:latest`
   - Замените `YOUR_USERNAME` и `YOUR_REPO` на ваши значения

---

## Вариант 2: Настройка через API

### Настройка GitHub Secrets

В настройках вашего GitHub репозитория (Settings → Secrets and variables → Actions) добавьте следующие secrets:

1. **PORTAINER_URL** - URL вашего Portainer сервера (например: `https://portainer.example.com` или `http://192.168.1.100:9000`)
2. **PORTAINER_API_KEY** - API ключ из Portainer
3. **PORTAINER_STACK_ID** - ID стека в Portainer (можно найти в URL при просмотре стека)
4. **PORTAINER_ENDPOINT_ID** - ID окружения (endpoint) в Portainer (обычно 1 для локального Docker)

## Получение API ключа Portainer

1. Войдите в Portainer
2. Перейдите в **Settings** → **Users**
3. Создайте или выберите пользователя
4. В разделе **API Keys** создайте новый ключ
5. Скопируйте ключ и добавьте его в GitHub Secrets как `PORTAINER_API_KEY`

## Получение Stack ID и Endpoint ID

### Stack ID:
1. Откройте стек в Portainer
2. Посмотрите на URL: `.../stacks/{STACK_ID}/...`
3. Число после `/stacks/` - это ваш `PORTAINER_STACK_ID`

### Endpoint ID:
1. Обычно это `1` для локального Docker окружения
2. Или перейдите в **Environments** и посмотрите ID в списке

## Создание стека в Portainer (если еще не создан)

1. В Portainer перейдите в **Stacks**
2. Нажмите **Add stack**
3. Выберите ваш endpoint
4. Название: `dashboard-react`
5. Вставьте содержимое файла `docker-compose.yml`
6. **Важно**: Измените `image: dashboard-react:latest` на `image: ghcr.io/YOUR_USERNAME/dashboard-react:latest`
7. Создайте стек


## Настройка доступа к GitHub Container Registry

### Для GitHub Actions (автоматический билд):
- Используется встроенный `GITHUB_TOKEN` - настраивать ничего не нужно

### Для Portainer (нужно для деплоя):

Если образ приватный, нужно настроить аутентификацию в Portainer:

1. **В Portainer:**
   - Перейдите в **Registries**
   - Нажмите **Add registry**
   - Выберите **Custom**
   - Имя: `ghcr.io`
   - URL: `ghcr.io`
   - Username: ваш GitHub username
   - Password: создайте Personal Access Token в GitHub с правами `read:packages`

2. **Создание GitHub Personal Access Token:**
   - GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Создайте токен с правами `read:packages`
   - Используйте этот токен как пароль в Portainer registry

### Публичный доступ (проще):
1. Сделайте образ публичным:
   - Settings → Packages → ваш package → Package settings → Change visibility → Make public
2. Аутентификация в Portainer не потребуется

## Тестирование

После настройки:

1. Сделайте push в ветку `main`
2. Проверьте статус в **Actions** вкладке GitHub репозитория
3. В Portainer проверьте, что стек обновился и использует новый образ


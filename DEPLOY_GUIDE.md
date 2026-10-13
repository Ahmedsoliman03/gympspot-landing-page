# 📦 Deploy Guide – GymSpot

> **Scope** – This guide consolidates every piece of information we discussed in the chat: the **server layout**, the **docker‑compose configuration**, the **GitHub Actions pipeline**, the **GitHub secrets**, the two projects (`gym‑web` and `gymspot‑landing‑page`), the **common typo / password / token issues**, and a full step‑by‑step walkthrough you can follow each time you need to deploy.

---

## 1️⃣ Overview of the Architecture

```
VPS (173.212.251.90) – user: gymspot
│
└─ /home/gymspot/
   └─ gymspot/                     ← root of the Docker stack
       ├─ docker-compose.yml       ← orchestrates all services
       ├─ backend/                ← Django API (built locally previously)
       ├─ whatsapp-service/       ← tiny Node service (Baileys)
       ├─ gym-web/                ← source of the main React/Next front‑end
       ├─ landing-page/           ← source of the landing‑page Next.js app
       └─ nginx/
           └─ nginx.conf           ← reverse‑proxy config
```

### 1.1 What each container does

| Service | Image (runtime) | What it serves |
|--------|-----------------|----------------|
| **postgres** | `postgres:16-alpine` | Primary relational DB (holds all core data). |
| **redis** | `redis:7-alpine` | Cache, pub/sub and a lightweight message bus. |
| **whatsapp‑service** | built from `./whatsapp-service` | Handles WhatsApp integration via Baileys. |
| **backend** | built from `./backend` | Django API (`/api/*`). |
| **gym‑web** | `ghcr.io/ahmedsoliman03/gym-web:latest` | The main web app (React/Next) – reachable via `/web` (or a sub‑domain). |
| **landing‑page** | `ghcr.io/ahmedsoliman03/gymspot-landing-page:latest` | The public landing page (`https://gymspot.fit`). |
| **nginx** | `nginx:alpine` | Terminates TLS, proxies `/` → `landing-page` and `/web` → `gym‑web`. |

> **Why a single `docker‑compose.yml`?** It guarantees all containers share the same network (`gymspot‑network`) and can talk to each other by name (e.g., `backend` can reach `postgres` at `postgres:5432`). Nginx is the only publicly exposed service (ports 80/443).

---

## 2️⃣ The **docker‑compose.yml** (the source of truth)

Below is the **fixed** version (the typo that broke the pipeline has been corrected – the `landing-page` block is now properly indented).

```yaml
services:

  postgres:
    image: postgres:16-alpine
    container_name: gymspot_postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-gymspot}
      POSTGRES_USER: ${POSTGRES_USER:-gymspot_user}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-GymSpOt8_*2026#}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-gymspot_user} -d ${POSTGRES_DB:-gymspot}"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - gymspot-network

  redis:
    image: redis:7-alpine
    container_name: gymspot_redis
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - gymspot-network

  whatsapp-service:
    build:
      context: ./whatsapp-service
      dockerfile: Dockerfile
    container_name: gymspot_whatsapp
    restart: unless-stopped
    depends_on:
      redis:
        condition: service_healthy
    environment:
      PORT: 3001
      REDIS_URL: redis://redis:6379
      API_KEY: ${WHATSAPP_SERVICE_API_KEY:-7c0ac4edc9cbc67492b65bd263a19cc76063ea032f29695d7646b1bebec439e9}
      WHATSAPP_PHONE_NUMBER: ${WHATSAPP_PHONE_NUMBER:-201116132415}
    volumes:
      - whatsapp_auth_data:/app/auth_info_baileys
    networks:
      - gymspot-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: gymspot_backend
    restart: unless-stopped
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      whatsapp-service:
        condition: service_started
    env_file:
      - ./backend/.env
    environment:
      DJANGO_SETTINGS_MODULE: config.settings.prod
      DATABASE_URL: postgres://${POSTGRES_USER:-gymspot_user}:${POSTGRES_PASSWORD:-GymSpOt8_*2026#}@postgres:5432/${POSTGRES_DB:-gymspot}
      REDIS_URL: redis://redis:6379/1
      WHATSAPP_SERVICE_URL: http://whatsapp-service:3001
      WHATSAPP_SERVICE_API_KEY: ${WHATSAPP_SERVICE_API_KEY:-7c0ac4edc9cbc67492b65bd263a19cc76063ea032f29695d7646b1bebec439e9}
    volumes:
      - django_static:/app/staticfiles
      - django_media:/app/media
    networks:
      - gymspot-network

  landing-page:
    image: ghcr.io/ahmedsoliman03/gymspot-landing-page:latest
    container_name: gymspot_landing
    environment:
      - NEXT_PUBLIC_APP_URL=https://gymspot.fit/platform
      - NEXT_PUBLIC_SITE_URL=https://gymspot.fit
    restart: unless-stopped
    networks:
      - gymspot-network

  gym-web:
    image: ghcr.io/ahmedsoliman03/gym-web:latest
    container_name: gymspot_web
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000
      - NEXT_PUBLIC_WS_URL=wss://gymspot.fit
      - NEXT_PUBLIC_SITE_URL=https://gymspot.fit/platform
      - NEXT_PUBLIC_SUPPORT_PHONE=201159133110
      - NEXT_PUBLIC_GOOGLE_CLIENT_ID=1084455359833-v9bc1a931lgqd2fjc6uco9gcd43t8u7l.apps.googleusercontent.com
    restart: always
    networks:
      - gymspot-network

  nginx:
    image: nginx:alpine
    container_name: gymspot_nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - django_static:/app/staticfiles:ro
      - django_media:/app/media:ro
      - certbot_etc:/etc/letsencrypt:ro
      - certbot_var:/var/www/certbot:ro
    depends_on:
      - backend
      - landing-page
      - gym-web
    networks:
      - gymspot-network

volumes:
  postgres_data:
  redis_data:
  whatsapp_auth_data:
  django_static:
  django_media:
  certbot_etc:
  certbot_var:

networks:
  gymspot-network:
    driver: bridge
```

### 2.1 Key take‑aways

* **Indentation matters** – `landing-page:` must have its `image`, `container_name`, etc. indented **four spaces** under it. The original file had them at the top level, causing the “additional properties not allowed” validation error.
* **`restart: unless-stopped`** (or `always`) ensures the container recovers automatically after a reboot.
* **Environment variables** (`NEXT_PUBLIC_*`, DB credentials, etc.) are injected at runtime; never hard‑code secrets directly in the file (see § 7).

---

## 3️⃣ CI/CD Pipeline – GitHub Actions (both repositories)

Both `gym-web` and `gymspot‑landing‑page` use the **same workflow**. Below is the complete file (`.github/workflows/deploy.yml`) for the landing page; the `gym‑web` workflow is identical except for the image name and the service name.

```yaml
name: Build & Deploy Landing Page to Production

on:
  push:
    branches: [ "master" ]          # triggers on every push to master
  workflow_dispatch:                # allows manual runs from the UI

permissions:
  contents: read
  packages: write   # needed to push to GHCR (GitHub Container Registry)

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ghcr.io/ahmedsoliman03/gymspot-landing-page:latest
          build-args: |
            NEXT_PUBLIC_APP_URL=https://gymspot.fit/platform
            NEXT_PUBLIC_SITE_URL=https://gymspot.fit
          cache-from: type=gha        # GitHub Actions cache (speed)
          cache-to: type=gha,mode=max

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Server via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          port: ${{ secrets.SSH_PORT || 22 }}
          script_stop: true
          script: |
            echo "=== Pulling latest landing image..."
            cd /home/gymspot/gymspot || cd ~/gymspot
            docker compose pull landing-page
            echo "=== Restarting landing container..."
            docker compose up -d --no-deps landing-page
            echo "=== Cleaning unused images..."
            docker image prune -f
            echo "=== Landing page deployment completed successfully!"
```

### 3.1 Why each step exists

| Step | Command / Action | Reason |
|------|------------------|--------|
| `checkout` | `actions/checkout@v4` | Retrieves repository files inside the runner. |
| `setup‑buildx` | `docker/setup-buildx-action@v3` | Enables multi‑arch builds and layer caching. |
| `docker/login-action` | Auth to `ghcr.io` using `${{ secrets.GITHUB_TOKEN }}` | Grants **write** permission to push images. |
| `docker/build‑push-action` | `docker build … && docker push …` | Produces a Docker image from the repo's `Dockerfile` and uploads it to GHCR. |
| `appleboy/ssh-action` | Opens SSH connection to the VPS with the stored private key | Allows the runner to execute remote commands safely, without a password. |
| `docker compose pull landing-page` | Pull the freshly‑pushed image onto the server | Guarantees the VPS runs the **exact** image just built. |
| `docker compose up -d --no-deps landing-page` | Restart **only** the landing‑page container | Zero‑downtime for the rest of the stack. |
| `docker image prune -f` | Remove dangling images | Keeps disk usage low on the VPS. |

---

## 4️⃣ Secrets – Where They Live & Why They’re Needed

| Secret (GitHub) | Where it’s stored | What it’s used for | Why we need it |
|-----------------|-------------------|--------------------|----------------|
| `SERVER_HOST` | Repository → Settings → Secrets & variables → Actions | IP address of the VPS (`173.212.251.90`) | SSH target for the deploy step. |
| `SERVER_USER` | Same location | Username on the VPS (`gymspot`) | SSH login name. |
| `SSH_PRIVATE_KEY` | Same location (multi‑line) | Private SSH key (no passphrase) | Password‑less, secure SSH for the runner. |
| `SSH_PORT` (optional) | Same location | Custom SSH port (defaults to 22) | Flexibility if you change the daemon port. |
| `GITHUB_TOKEN` (auto‑provided) | Runner environment | Auth to GHCR (push images) | GHCR is private by default; this token has `write:packages`. |
| **Runtime environment vars** (e.g., `POSTGRES_PASSWORD`, `NEXT_PUBLIC_*`) | Declared in `docker‑compose.yml` (or `.env` files) | Propagated to containers at start‑up | Required for DB connection, API base URLs, etc. |
| **Future secret handling** | Ideally Docker secrets / `.env` not tracked in Git | Sensitive values (DB passwords, API keys) | Prevents leaking secrets in source control. |

> **Common typo** – The original workflow referenced `landing` instead of `landing-page`. That mismatch caused `docker compose pull landing` to fail. We corrected the service name **everywhere** (see § 2).

> **Password/token leakage** – The `POSTGRES_PASSWORD` (`GymSpOt8_*2026#`) and the WhatsApp `API_KEY` were hard‑coded in the compose file. In production you should move them to GitHub secrets (`PG_PASSWORD`, `WHATSAPP_API_KEY`) and inject them via the SSH script (`export …`).

---

## 5️⃣ Deploy Flow – What Happens When You Push

1. **You push a commit**
   ```bash
   git push origin master
   ```
2. **GitHub Actions triggers** the `build-and-push` job.
3. **Docker image is built** from the repo’s `Dockerfile`.
4. **Image is pushed** to `ghcr.io/…/gymspot‑landing‑page:latest`.
5. **Deploy job runs** (only after a successful build).  
   * SSH connects to the VPS using the stored private key.
   * Runs the script that:
     1. `cd` into the folder containing `docker‑compose.yml`.
     2. Pulls the new image.
     3. Restarts only the `landing-page` service (`docker compose up -d --no-deps landing-page`).
     4. Prunes old images.
6. GitHub marks the workflow **✅** if all steps succeed.

If any step fails (e.g., the image doesn’t exist, SSH auth fails), the workflow shows a **red ❌** and the logs display the exact error (see § 6).

---

## 6️⃣ Troubleshooting the “Image not found” Error

> **Error**
> ```
> Error response from daemon: failed to resolve reference 
> ghcr.io/ahmedsoliman03/gymspot-landing-page:latest: not found
> ```

### 6.1 Possible causes

| Cause | How to verify | Fix |
|-------|---------------|-----|
| **Typo in image name** (e.g., `gympspot‑landing‑page` or wrong user) | Visit the GHCR page: `https://github.com/organizations/ahmedsoliman03/packages?repo=gymspot-landing-page` and copy the exact name. | Update the `tags:` line in the workflow to the correct name, commit, and push. |
| **Build job never pushed** – image build failed. | Open the Actions run → look at the **Build and Push** step for any error messages (e.g., missing `Dockerfile`, npm build failure). | Fix the underlying Dockerfile / build‑args, then push a new commit. |
| **Private package – VPS cannot pull** (runner has token, but the VPS does not). | Manually test on the VPS: `docker login ghcr.io -u <your‑github‑user> -p <PAT with write:packages>` then `docker pull ghcr.io/…/gymspot-landing-page:latest`. | Either make the GHCR package **public**, or store a Personal Access Token in a server‑side secret and run `docker login` before `docker compose pull`. |
| **Cache/stale tag** – the `latest` tag points to an image that was deleted. | Run `docker image ls ghcr.io/ahmedsoliman03/gymspot-landing-page` on the VPS. | Use a **unique tag** (`:${{ github.sha }}`) in the workflow, or re‑push the missing image. |

### 6.2 Quick manual test (run on the VPS)

```bash
# log in (once) with a PAT that has write:packages
docker login ghcr.io -u AhmedSoliman03 -p <PAT>

# pull the image
docker pull ghcr.io/ahmedsoliman03/gymspot-landing-page:latest
```

If the pull succeeds, re‑run the GitHub workflow (push an empty commit). If it fails, adjust the name or visibility as described.

---

## 7️⃣ Secrets & Sensitive Data – Best Practices

### 7.1 What’s currently *wrong*

* **Hard‑coded passwords** (`POSTGRES_PASSWORD`, WhatsApp `API_KEY`) are in plain text inside `docker‑compose.yml`. 
* Some **typos** (`landing` vs. `landing-page`) caused the pipeline to look for a non‑existent service. 
* **GitHub Token** (`GITHUB_TOKEN`) is fine – it’s automatically scoped to the repo, but never expose it in logs.

### 7.2 Recommended remediation (minimal effort)

1. **Create GitHub secrets** for each sensitive value:
   * `PG_PASSWORD` – value of `POSTGRES_PASSWORD`.
   * `WHATSAPP_API_KEY` – the WhatsApp service key.
   * (Optionally) `DJANGO_SECRET_KEY`, `EMAIL_HOST_PASSWORD`, etc.
2. **Update the SSH deploy script** (inside the workflow) to export those secrets before pulling:
   ```yaml
   script: |
     export POSTGRES_PASSWORD="${{ secrets.PG_PASSWORD }}"
     export WHATSAPP_SERVICE_API_KEY="${{ secrets.WHATSAPP_API_KEY }}"
     cd /home/gymspot/gymspot || cd ~/gymspot
     docker compose pull landing-page
     docker compose up -d --no-deps landing-page
   ```
3. **Modify `docker-compose.yml`** to reference the exported variables:
   ```yaml
   environment:
     - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
     - WHATSAPP_SERVICE_API_KEY=${WHATSAPP_SERVICE_API_KEY}
   ```
4. *(Optional) Use Docker secrets* for an even tighter security model – they are stored encrypted on the host and never appear in `docker inspect` output.

### 7.3 Future‑proofing

* **Rotate secrets** regularly (e.g., every 90 days).
* **Audit the repo** for any stray secret strings (`git grep -i password`), remove them, and commit a clean history (use `git filter‑branch` if needed).

---

## 8️⃣ Deploy Checklist – Ready‑to‑Run Commands

| Step | Command (run locally) | Purpose |
|------|-----------------------|---------|
| **1. Verify GHCR image exists** | `docker login ghcr.io -u <user> -p <PAT>`<br>`docker pull ghcr.io/ahmedsoliman03/gymspot-landing-page:latest` | Confirms the image is publishable and reachable. |
| **2. Push a commit** | `git commit --allow-empty -m "ci: trigger deploy"`<br>`git push` | Triggers the GitHub Actions pipeline. |
| **3. Watch the pipeline** | Open <https://github.com/Ahmedsoliman03/gympspot-landing-page/actions> | Ensure “Build‑and‑Push” and “Deploy” jobs finish successfully. |
| **4. SSH into VPS** | `ssh -i ~/.ssh/gymspot_key gymspot@173.212.251.90` | Optional – verify everything manually. |
| **5. Verify containers** | `docker compose ps` | Should show `gymspot_landing` running with the new image ID. |
| **6. Test the live site** | Open `https://gymspot.fit` (landing page) and `https://gymspot.fit/web` (or the appropriate route for `gym‑web`). | Confirm the UI loads correctly. |
| **7. Clean old images** (if you have disk pressure) | `docker image prune -f` | Removes dangling images. |

---

## 9️⃣ Project‑Specific Deploy Details

### 9.1 `gym‑web`
* **Image name**: `ghcr.io/ahmedsoliman03/gym-web:latest`.
* **Docker‑compose service name**: `gym-web`.
* **Workflow changes**: only the `tags:` line (`gym-web`) and the `docker compose pull gym-web` / `up -d --no-deps gym-web` commands in the SSH script.

### 9.2 `gymspot‑landing‑page`
* **Image name**: `ghcr.io/ahmedsoliman03/gymspot-landing-page:latest`.
* **Docker‑compose service name**: `landing-page`.
* **Workflow changes**: ensure the **service name** in the script matches (`landing-page`). This is the piece that caused the earlier error.

> **Both pipelines share the same SSH secret** – a single VPS hosts both containers, so you don’t need separate keys.

---

## 10️⃣ Common Typos & Gotchas (the “what went wrong” section)

| Symptom | Root cause | Fix |
|---------|------------|-----|
| `docker compose pull landing-page` → *additional properties 'landing-page' not allowed* | `landing-page` service block not indented in `docker-compose.yml`. | Re‑indent the block (see the corrected file). |
| “Image not found” | Wrong image name (`gympspot‑landing‑page` vs `gymspot‑landing‑page`) or image never pushed. | Verify the exact GHCR package name and update the workflow. |
| “Permission denied (publickey)” | SSH private key not added to GitHub secrets or wrong key format. | Re‑add the key (multi‑line) to `SSH_PRIVATE_KEY` and ensure the key file on the VPS matches the public part. |
| Hard‑coded password exposed in repository | Direct value in `docker‑compose.yml`. | Move to secrets (see § 7). |
| `docker compose up -d --no-deps landing-page` does nothing | Service name mismatch (`landing` vs `landing-page`). | Use the exact service name defined in the compose file. |

---

## 11️⃣ Quick Reference Commands (Copy‑Paste)

**On your local machine (triggering a deploy)**

```bash
# 1️⃣ Trigger the pipeline
git commit --allow-empty -m "ci: manual trigger"
git push

# 2️⃣ (Optional) Watch the run in the browser
open https://github.com/Ahmedsoliman03/gympspot-landing-page/actions
```

**On the VPS (manual verification / emergency rollback)**

```bash
# SSH in
ssh -i ~/.ssh/gymspot_key gymspot@173.212.251.90

# Verify containers
docker compose ps

# Pull latest landing page image (if you suspect the pipeline failed)
cd /home/gymspot/gymspot || cd ~/gymspot
docker compose pull landing-page
docker compose up -d --no-deps landing-page

# View logs (debug)
docker compose logs -f landing-page

# Roll back to previous image (if you tagged one)
# Example: if you kept a tag `previous`
docker compose pull landing-page:previous
docker compose up -d --no-deps landing-page:previous
```

---

## 12️⃣ Final Checklist Before You Celebrate

| ✅ | Item |
|----|------|
| **Image name correct** | Verify GHCR package name matches workflow `tags:`. |
| **Service name consistent** | `landing-page` appears exactly in `docker‑compose.yml` and in the SSH script. |
| **Secrets added** | `SERVER_HOST`, `SERVER_USER`, `SSH_PRIVATE_KEY`, plus any runtime secrets (DB password, API keys). |
| **Workflow syntax valid** | No YAML indentation errors (GitHub will reject malformed files). |
| **Docker‑compose file validated** | Run `docker compose config` locally to ensure it parses. |
| **Deploy run** | After a push, watch GitHub Actions → both jobs succeed. |
| **Live site works** | Open `https://gymspot.fit` and `https://gymspot.fit/web` (or the appropriate route) and confirm UI loads without errors. |
| **No secrets in Git** | Run `git grep -i password` and `git grep -i token` – nothing should show up. |

---

### 🎉 You’re ready!

Follow the checklist, keep the secrets out of source control, and the next push to `master` will automatically rebuild **both** the landing page and the main GymSpot web app, pull the new images to the VPS, and bring the updated containers up with zero downtime.

If you hit any other error (e.g., a new typo shows up in the workflow script), just drop the exact log line here and we can adjust the guide accordingly. Happy deploying!

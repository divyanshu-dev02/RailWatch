# 🚀 RailWatch Production Deployment Guide (100% Free Cloud Stack)

RailWatch is architected to run seamlessly either locally with Docker Compose or completely free on the cloud using **Aiven (MySQL)**, **Render (Spring Boot API)**, and **Vercel (React Frontend)**.

---

## 1. Local One-Command Deployment (Docker Compose)

Prerequisites: [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

```bash
# Clone and enter directory
cd railway_congestion

# Build and start all 3 services (MySQL + Spring Boot + React Vite Nginx)
docker compose up --build -d

# View live logs
docker compose logs -f
```

- **Frontend App**: [http://localhost](http://localhost) (or [http://localhost:5173](http://localhost:5173))
- **Backend API**: [http://localhost:8084](http://localhost:8084)
- **Database**: `localhost:3306` (Pre-seeded with 10 junctions, 20+ trains, and 35+ reservations)

---

## 2. 100% Free Cloud Deployment Walkthrough

### Part A: Free Managed Cloud MySQL (Aiven)
1. Sign up at [aiven.io](https://aiven.io) (Free tier / Trial with zero credit card required).
2. Create a new **MySQL** service (Version 8.0, Free tier / Startup plan).
3. From the Aiven Service Overview, copy:
   - `Host`
   - `Port`
   - `User` (`avnadmin`)
   - `Password`
   - `Database name` (`defaultdb` or create `railway_congestion`)
4. Construct your JDBC URL:
   ```text
   jdbc:mysql://<aiven-host>:<port>/defaultdb?ssl-mode=REQUIRED&allowPublicKeyRetrieval=true
   ```

### Part B: Free Backend Deployment (Render)
1. Push your repository to GitHub.
2. Sign in to [render.com](https://render.com).
3. Click **New +** ➔ **Web Service** ➔ Select your GitHub repo.
4. Render will auto-detect the root `Dockerfile` and `render.yaml`.
5. Under **Environment Variables**, set:
   - `SPRING_DATASOURCE_URL`: `<your-aiven-jdbc-url>`
   - `SPRING_DATASOURCE_USERNAME`: `<your-aiven-user>`
   - `SPRING_DATASOURCE_PASSWORD`: `<your-aiven-password>`
   - `PORT`: `8084`
6. Click **Deploy Web Service**.
7. Copy your assigned Render API URL (e.g., `https://railwatch-api.onrender.com`).
   *Note: On first startup, RailWatch's `DataInitializer` will automatically detect the fresh database and seed the 10 stations, trains, and reservations automatically!*

### Part C: Free Frontend Deployment (Vercel)
1. Sign in to [vercel.com](https://vercel.com).
2. Click **Add New Project** ➔ Import your repository.
3. Set **Root Directory** to `frontend`.
4. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://railwatch-api.onrender.com` (your Render backend URL from Part B).
5. Click **Deploy**.
6. Your RailWatch monitoring platform is live worldwide with SSL and CDN edge caching!

---

## 3. Local Development (Without Docker)

### Run Backend:
```bash
# Verify local MySQL is running on port 3306
./mvnw.cmd spring-boot:run
```

### Run Frontend:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

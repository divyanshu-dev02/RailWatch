# Smart Railway Station Congestion Monitoring System - Setup Guide

Welcome to the **RailWatch** setup guide! This document explains how to set up, connect, and run the complete Full-Stack web application.

---

## 📌 Prerequisites
1. **Java JDK 17+** installed
2. **Maven** installed (or use the included `mvnw` wrapper)
3. **Node.js** (v18+) and npm installed
4. **MySQL Server** installed and running

---

## Step 1: Database Setup 🗄️

1. Open your MySQL client (e.g., MySQL Workbench, phpMyAdmin, or command line).
2. Execute the provided SQL file to create the database, tables, and sample data.
   ```sql
   source /path/to/railway_congestion.sql;
   ```
   *Alternatively, just copy the entire contents of `railway_congestion.sql` and run it.*

3. Ensure your `application.properties` credentials match your local MySQL server:
   *(File: `src/main/resources/application.properties`)*
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/railway_congestion
   spring.datasource.username=your_mysql_username
   spring.datasource.password=your_mysql_password
   ```
   *Update `username` and `password` if yours are different!*

### Production-safe configuration

The backend accepts database settings through environment variables rather than committed credentials:

- `DATABASE_URL`, `DATABASE_USERNAME`, and `DATABASE_PASSWORD`
- `CORS_ALLOWED_ORIGINS`: comma-separated exact frontend origins; wildcard (`*`) is rejected
- `DEMO_ENABLED`: defaults to `false`; demo endpoints also require the Spring `demo` profile

Only `GET` and preflight `OPTIONS` requests are enabled by CORS. The API returns an `X-Request-Id` correlation header, and unexpected server errors are logged server-side with a sanitized response.

---

## Step 2: Running the Spring Boot Backend ⚙️

1. Open a terminal in the root directory: `railway_congestion/`
2. Run the application using the Maven wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(On Windows Command Prompt, use `mvnw.cmd spring-boot:run`)*

3. The backend server will start on port `8080`.
   - Verify it's running: `http://localhost:8080/stations` (should return JSON data).

---

## Step 3: Running the React Frontend 💻

1. Open a **new** terminal in the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies (if not already done):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. The frontend will start at `http://localhost:5173`. Open this URL in your browser.

---

## 🎯 How to Use the App

1. **Wait for Services**: Ensure both backend (`8080`) and frontend (`5173`) are running.
2. **Search by Station:**
   - Click the **"🏢 Search by Station"** tab.
   - Select a station from the dynamic dropdown (e.g., *New Delhi Railway Station*).
   - Keep the default date (`2026-04-27`) or change it.
   - Click **Check Congestion**. The system will scan all train reservations from that station, sum the passengers, and return a LOW, MEDIUM, or HIGH alert card.
3. **Search by PNR:**
   - Click the **"🔍 Search by PNR"** tab.
   - Try a sample PNR from the SQL file, e.g., `12345678` (High) or `32345678` (Low).
   - Enter it and click **Search**. You'll see the exact train details and the station congestion status.
4. **Analytics Dashboard:**
   - Scroll down to compare station volumes, inspect the network trend, click a station for history, review the congestion watchlist, and export the visible snapshot as CSV.
   - Toggle **Dark Mode** via the moon icon in the navbar.

## 📡 Data lifecycle and freshness

Today, RailWatch reads operational data from the configured MySQL database through the Spring Boot API:

1. `station`, `train`, and `reservation` records are created by the Flyway migration in `src/main/resources/db/migration/V1__baseline.sql`.
2. The dashboard requests the selected journey date from `GET /api/dashboard`.
3. Station history is loaded from `GET /api/stations/{stationId}/history`.
4. When the `demo` profile and `DEMO_ENABLED=true` are used, the backend publishes simulated station updates through `GET /api/congestion/stream` (SSE). This is for development only; it is not a real railway provider.
5. The frontend displays the latest API/SSE timestamp, highlights stations above the congestion threshold, and exports the visible snapshot with its journey date.

For production, replace the seed/demo path with a scheduled provider or file-import pipeline. That pipeline should fetch the latest source data, validate and normalize it, persist an import batch and source timestamp, deduplicate records, and expose failures and stale-data status. The dashboard must not imply that data is live when the provider has not successfully updated it.

This is useful because operators need more than one congestion number: they can compare stations, inspect history, identify high-congestion locations, verify data freshness, and share a timestamped snapshot. The charts are an operational visualization layer; their accuracy depends on the quality and freshness of the ingestion pipeline behind them.

---

### Project Structure Overview

```text
railway_congestion/
├── frontend/                # React.js + Vite Frontend
│   ├── src/
│   │   ├── components/      # UI components (Navbar, Cards, Charts)
│   │   ├── pages/           # Dashboard page
│   │   ├── services/        # Axios API integration
│   │   ├── index.css        # Tailwind & Glassmorphism styles
│   │   └── App.jsx          # Router setup
│   └── package.json         # Node dependencies
├── src/main/java/           # Spring Boot Backend
│   └── com/example/...
│       ├── config/          # CORS global config
│       ├── controller/      # REST API Endpoints
│       ├── dto/             # Data Transfer Objects
│       ├── model/           # JPA Entities (Station, Train, Reservation)
│       ├── repository/      # Spring Data JPA interfaces
│       └── service/         # Business logic (Congestion calculations)
├── src/main/resources/      # Backend properties
└── railway_congestion.sql   # Database schema and mock data
```

Enjoy your Smart Railway Station Congestion Monitoring System! 🚆

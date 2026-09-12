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
   spring.datasource.username=root
   spring.datasource.password=Manish1234
   ```
   *Update `username` and `password` if yours are different!*

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
   - Scroll down to see the real-time passenger volume bar chart.
   - Toggle **Dark Mode** via the moon icon in the navbar.

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

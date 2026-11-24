# Deploy RailWatch

These steps deploy the current app as a public demo using Railway for the Spring Boot API and MySQL, and Vercel for the React/Vite frontend. They do not make RailWatch ready for live railway operations: the current Flyway migrations include synthetic sample data, and no live railway data provider is configured.

## 1. Deploy the API and database on Railway

1. Create a Railway project and add a MySQL 8.0+ service.
2. Add this GitHub repository as a service from the repository root. Railway will detect the root `Dockerfile`.
3. Add database variables to the backend service, using Railway variable references. Replace `MySQL` below with the name of your database service if it differs:

   ```text
   DATABASE_URL=jdbc:mysql://${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}?serverTimezone=UTC
   DATABASE_USERNAME=${{MySQL.MYSQLUSER}}
   DATABASE_PASSWORD=${{MySQL.MYSQLPASSWORD}}
   FLYWAY_ENABLED=true
   DEMO_ENABLED=false
   PNR_LOOKUP_ENABLED=false
   ```

4. After creating the Vercel frontend in the next section, set `CORS_ALLOWED_ORIGINS` to its exact HTTPS origin, for example `https://railwatch-demo.vercel.app`. Add multiple comma-separated origins only if needed. Wildcard origins are intentionally rejected.
5. Set the Railway health check path to `/actuator/health`. Railway supplies `PORT`; the app is configured to use it.
6. Deploy the MySQL service before the backend. On first startup, Flyway creates the schema and applies migrations. Check the deployment logs and health endpoint before using the frontend.

Do not set the Spring profile to `local`: it uses an in-memory H2 database and `create-drop`, which is not persistent.

## 2. Deploy the frontend on Vercel

1. Import the same GitHub repository as a Vercel project.
2. Set **Root Directory** to `frontend`.
3. Use the Vite defaults, or explicitly set:
   - Install command: `npm ci`
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add this build-time environment variable, replacing the value with the public Railway backend URL and omitting a trailing slash:

   ```text
   VITE_API_BASE_URL=https://your-railwatch-api.up.railway.app
   VITE_PNR_LOOKUP_ENABLED=false
   ```

5. Deploy the frontend, copy its production origin into Railway's `CORS_ALLOWED_ORIGINS`, then redeploy the backend if needed.

`frontend/vercel.json` routes application paths back to the Vite entry point. The API base URL is embedded at build time, so redeploy Vercel after changing it.

## 3. Verify the deployment

- `https://<railway-api-domain>/actuator/health` returns `status: UP`.
- The Vercel page loads without API or CORS errors.
- Dashboard data, station search, history, and the SSE connection work over HTTPS.
- Railway logs show Flyway completed successfully and the backend is listening on Railway's assigned port.

The current migrations seed synthetic station, train, and reservation records for demonstration. Treat the deployed dataset as sample data, not live railway data. Before using a production database for real operations, separate demo seeds from production migrations, validate all migrations against MySQL, configure backups and monitoring, and connect an authorized live data provider.

## Security notes

- Database credentials are required environment variables; the backend has no root/blank-password fallback. Store them in Railway's secret variables, not in source control.
- `.env` files are ignored by Git and excluded from the Docker build. Never put database credentials, API secrets, or other private values in `VITE_*` variables: Vite embeds them in public browser assets.
- PNR lookup is disabled by default in both the API and production UI. Keep it disabled until authentication and authorization are implemented; CORS is not access control. The local development profile enables it only for the synthetic dataset.
- Do not load real passenger or PNR data into this public demo. Its dashboard is not an authenticated private-data interface.

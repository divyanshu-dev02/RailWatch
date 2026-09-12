# =========================================================================
# RailWatch Spring Boot Backend Multi-Stage Dockerfile
# Stage 1: Build JAR using Maven
# Stage 2: Production Eclipse Temurin 17 JRE Minimal Image
# =========================================================================

# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder
WORKDIR /build

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and package
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine AS runner
WORKDIR /app

# Create non-root system user for security
RUN addgroup -S railwatch && adduser -S railwatch -G railwatch

# Copy built JAR from builder stage
COPY --from=builder /build/target/*.jar app.jar

# Set ownership
RUN chown -R railwatch:railwatch /app
USER railwatch

# Container environment
ENV PORT=8084
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError"

EXPOSE 8084

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8084/stations || exit 1

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

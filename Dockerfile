FROM eclipse-temurin:21-jdk-jammy AS build

WORKDIR /workspace
COPY . .
RUN bash mvnw -B package

FROM eclipse-temurin:21-jre-jammy

WORKDIR /app
COPY --from=build --chown=10001:10001 /workspace/target/*.jar /app/app.jar
USER 10001:10001

EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "/app/app.jar"]

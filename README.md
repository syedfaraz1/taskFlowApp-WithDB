# TaskFlow

A small Spring Boot task manager with a clean, dark-themed UI. Built for Docker practice — no Dockerfile included on purpose, so you can write it yourself.

## Stack
- Java 17, Spring Boot 3.3.2 (Web + Thymeleaf + Actuator)
- MySQL storage via Spring Data JPA — REST API + server-rendered page
- Vanilla HTML/CSS/JS frontend (no build step, no npm needed)

## Run it locally (without Docker, to confirm it works)
Spin up a local MySQL with the included compose file (only starts the database, not the app — the app itself is still yours to containerize):
```bash
docker compose up -d
```
This starts MySQL on `localhost:3306` with database `taskflow`, user `taskflow`, password `taskflow` (matches the defaults in `application.properties`).

Then run the app:
```bash
mvn spring-boot:run
```
Then open http://localhost:8080

The schema is created automatically on startup (`spring.jpa.hibernate.ddl-auto=update`), and a few demo tasks are seeded on first run.

### Connection settings
The datasource is driven by environment variables, with sane local defaults baked in:

| Variable      | Default    |
|---------------|------------|
| `DB_HOST`     | localhost  |
| `DB_PORT`     | 3306       |
| `DB_NAME`     | taskflow   |
| `DB_USER`     | taskflow   |
| `DB_PASSWORD` | taskflow   |

When you containerize the app, point `DB_HOST` at your MySQL container/service name.

Or build a jar and run it:
```bash
mvn clean package
java -jar target/taskflow.jar
```

## API
| Method | Path                  | Description         |
|--------|------------------------|----------------------|
| GET    | /api/tasks             | list all tasks       |
| POST   | /api/tasks              | create a task        |
| PUT    | /api/tasks/{id}         | update a task        |
| PATCH  | /api/tasks/{id}/toggle  | toggle completed     |
| DELETE | /api/tasks/{id}         | delete a task        |

Health check for later Docker healthchecks: `GET /actuator/health`

## Your turn (Docker practice)
Some things to think about as you write the Dockerfile:
- Use a multi-stage build: a Maven/JDK image to build the jar, then copy just the jar into a slim JRE image (e.g. `eclipse-temurin:17-jre-alpine`)
- Expose port `8080`
- `ENTRYPOINT ["java", "-jar", "app.jar"]`
- Try `docker build -t taskflow:1.0 .` then `docker run -p 8080:8080 taskflow:1.0`
- Bonus: add a `HEALTHCHECK` that hits `/actuator/health`
- Bonus: try `.dockerignore` to keep `target/` and `.git/` out of the build context

Ping me once it's containerized — happy to review your Dockerfile, or we can move on to the Spring Boot + MySQL project next.

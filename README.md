# GramWork

GramWork is a robust, production-ready microservices-based platform backend for connecting laborers and employers, built with Java, Spring Boot, and modern cloud-native patterns.

## 📊 Architecture

The backend consists of several interconnected microservices, managed through an API Gateway, with centralized configuration and service discovery.

```text
Frontend → API Gateway → Microservices → Databases & Message Queues
              ↓              ↓
         Eureka Server   Config Server
```

## 🏗️ Core Services

| Service | Port | Description |
|---------|------|-------------|
| **API Gateway** | 8080 | Single entry point, routing, and JWT validation |
| **Config Server** | 8888 | Centralized configuration for all services |
| **Eureka Server** | 8761 | Service registry and discovery |
| **Auth** | 8086 | Authentication & authorization |
| **Laborer Profile** | 8081 | Worker/Laborer profile management |
| **Employer Profile** | 8089 | Employer profile management |
| **Job** | 8083 | Job posting & management |
| **Assignment Service**| 8084 | Work assignment management |
| **Payment Service** | 8088 | Payment processing & invoices |
| **NotificationService**| 8082 | Email, SMS, Push notifications |
| **Attendence** | - | Worker attendance tracking |
| **AiMatchingService** | - | AI-powered job-to-worker matching |
| **AiAnalysisService** | - | AI-based analysis for insights |
| **ReviewService** | - | Rating and reviews management |

## 🔧 Technology Stack

- **Java 21** - Core Language
- **Spring Boot 3.2.1** - Microservices Framework
- **Spring Cloud 2023.0.0** - Cloud patterns (Gateway, Eureka, Config)
- **MongoDB 7.0** - Primary NoSQL Database
- **Redis 7** - Caching & Rate Limiting
- **RabbitMQ 3.12** - Asynchronous Message Broker
- **Docker** - Containerization & orchestration

## 🚀 Quick Start

### Prerequisites
- JDK 21 installed (`JAVA_HOME` set correctly)
- Maven 3.8+ 
- Docker and Docker Compose (for infrastructure)

### 1. Run Infrastructure (Databases & Queues)

A `docker-compose.yml` file is provided in the `Backend` directory to easily start up MongoDB, Redis, and RabbitMQ.

```bash
cd Backend
cp .env.example .env
docker-compose up -d
```

### 2. Start Services Locally

You can start the services manually using Maven. Make sure to start them in the correct order so that they can register with Eureka and fetch their configs.

```bash
cd Backend

# 1. Start Config Server
cd config-server && mvn spring-boot:run

# 2. Start Eureka Server
cd ../eureka-server && mvn spring-boot:run

# 3. Start API Gateway
cd ../api-gateway && mvn spring-boot:run

# 4. Start Domain Services (Auth, Job, etc.)
cd ../Auth && mvn spring-boot:run
```

### 3. Build Entire Project

To compile and build all services:
```bash
cd Backend
mvn clean install
```

## 🔐 Authentication

The application uses **JWT (JSON Web Tokens)** for securing endpoints. 
- Obtain a token via the `Auth` service (`POST /api/auth/login`).
- Pass the token in the `Authorization` header as `Bearer <token>` when making requests through the API Gateway.

## 📄 License

Copyright © GramWork. All rights reserved.

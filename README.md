# 🚀 GramWork

> **Enterprise Workforce Management Platform** built using **Java, Spring Boot Microservices, and Spring Cloud**.

GramWork is a scalable, cloud-native backend platform that connects **employers** with **verified workers** through **real-time location-based discovery**, **AI-powered recommendations**, **secure authentication**, and **digital workforce management**.

The project follows a **Microservices Architecture** with centralized configuration, service discovery, asynchronous messaging, secure REST APIs, and cloud storage, making it suitable for enterprise-scale backend applications.

---

# 🏗️ System Architecture

```text
                                +----------------------+
                                |  Web / Mobile App   |
                                | Employer • Worker   |
                                |      Admin          |
                                +----------+----------+
                                           |
                                           v
                                +----------------------+
                                |     API Gateway      |
                                | Routing • Security   |
                                +----------+-----------+
                                           |
                   +-----------------------+------------------------+
                   |                                                |
                   v                                                v
          +--------------------+                         +----------------------+
          |   Eureka Server    |                         |   Config Server      |
          | Service Discovery  |                         | Centralized Config   |
          +--------------------+                         +----------------------+
                                           |
--------------------------------------------------------------------------------------------------------------
|            |             |             |             |             |            |            |             |
v            v             v             v             v             v            v            v             v
+-----------+ +-----------+ +-----------+ +-----------+ +-----------+ +-----------+ +-----------+ +-----------+ +-----------+
|   Auth    | |  Worker   | | Employer  | |    Job    | |Assignment | | Attendance| |  Payment  | |  Review   | | AI Service|
|  Service  | |  Service  | |  Service  | |  Service  | |  Service  | |  Service  | |  Service  | |  Service  | | Matching &|
| JWT/RBAC  | | Profile   | | Profiles  | | GeoSearch | | Workflow  | | Tracking  | | Invoice   | | Moderation| | Analysis  |
+-----------+ +-----------+ +-----------+ +-----------+ +-----------+ +-----------+ +-----------+ +-----------+ +-----------+
        \          |             |              |              |              |             |             |          /
         \         |             |              |              |              |             |             |         /
          -----------------------------------------------------------------------------------------------
                                               |
                                   +-------------------------------+
                                   |   Notification Service        |
                                   | RabbitMQ + WebSocket          |
                                   +-------------------------------+
                                               |
                         +------------------------------------------------------+
                         | MongoDB | Redis | Amazon S3                          |
                         | GeoSpatial | OTP Cache | Secure Document Storage     |
                         +------------------------------------------------------+
```

---

# ✨ Key Features

## 🔐 Authentication & Security

- JWT Authentication
- Spring Security
- Role-Based Access Control (**Admin**, **Employer**, **Worker**)
- OTP Verification using Redis
- Secure REST APIs

---

## 📍 Real-Time Worker Discovery

- Live GPS location updates
- MongoDB GeoSpatial (2dsphere) indexing
- Find nearby workers within a configurable radius
- Distance-based worker recommendations

---

## 🤖 AI-Powered Features

### AI Worker Recommendation

The AI engine recommends the most suitable worker by analyzing:

- ⭐ Worker Rating
- 📅 Attendance History
- 💼 Completed Jobs
- 🎯 Experience
- 📊 Reliability Score
- 📝 Employer Reviews

---

### 🛡️ AI Review Moderation

Automatically detects:

- Spam Reviews
- Fake Reviews
- Toxic Comments
- Abusive Language
- Fraudulent Reviews

---

## ✅ Worker Verification

- Aadhaar Document Upload
- Shramik Card Upload
- Secure document storage using **Amazon S3**
- Helps reduce fake worker profiles

---

## 💼 Job & Assignment Management

- Job Posting
- Nearby Worker Matching
- Assignment Management
- Worker Availability
- Assignment Status Tracking

---

## 📅 Attendance Management

- Daily Attendance
- Work Completion Verification
- Attendance History
- Performance Tracking

---

## 💳 Payment Service

- Secure Payment Workflow
- Payment History
- Automatic PDF Invoice Generation
- Invoice Download

---

## 💬 Real-Time Messaging & Notifications

- RabbitMQ Event Processing
- WebSocket Live Messaging
- In-App Notifications
- Assignment Updates
- Attendance Updates
- Payment Notifications

---

# 🏛️ Microservices

| Service | Port | Description |
|----------|------|-------------|
| **API Gateway** | 8080 | Centralized routing, authentication & load balancing |
| **Config Server** | 8888 | Centralized configuration management |
| **Eureka Server** | 8761 | Service registry & discovery |
| **Auth Service** | 8086 | Authentication, JWT & RBAC |
| **Worker Profile Service** | 8081 | Worker profiles & verification |
| **Employer Profile Service** | 8089 | Employer management |
| **Job Service** | 8083 | Job posting & nearby worker search |
| **Assignment Service** | 8084 | Assignment lifecycle |
| **Attendance Service** | — | Attendance & work verification |
| **Payment Service** | 8088 | Payments & PDF invoices |
| **Notification Service** | 8082 | RabbitMQ & WebSocket notifications |
| **Review Service** | — | Ratings & AI review moderation |
| **AI Service** | — | AI matching, recommendations & analytics |

---

# 🛠️ Technology Stack

### Backend

- Java 21
- Spring Boot
- Spring Cloud
- Spring Security
- OpenFeign

### Spring Cloud

- API Gateway
- Eureka Service Discovery
- Config Server

### Database & Storage

- MongoDB
- Redis
- Amazon S3

### Messaging

- RabbitMQ
- WebSocket

### DevOps

- Docker
- Docker Compose
- Maven

### AI

- Worker Recommendation
- Review Moderation
- Worker Analysis

---

# 🚀 Getting Started

## Prerequisites

- Java JDK 21
- Maven 3.8+
- Docker
- Docker Compose

---

## 1️⃣ Start Infrastructure

```bash
cd Backend
cp .env.example .env
docker compose up -d
```

This starts:

- MongoDB
- Redis
- RabbitMQ

---

## 2️⃣ Start Core Services

```bash
# Config Server
cd config-server
mvn spring-boot:run

# Eureka Server
cd ../eureka-server
mvn spring-boot:run

# API Gateway
cd ../api-gateway
mvn spring-boot:run
```

---

## 3️⃣ Start Domain Services

```bash
cd ../Auth && mvn spring-boot:run

cd ../laborer-profile && mvn spring-boot:run

cd ../employer-profile-service && mvn spring-boot:run

cd ../Job && mvn spring-boot:run

cd ../Assignment-Service && mvn spring-boot:run

cd ../Attendence && mvn spring-boot:run

cd ../paymentService && mvn spring-boot:run

cd ../NotificationService && mvn spring-boot:run

cd ../ReviewService && mvn spring-boot:run

cd ../AiMatchingService && mvn spring-boot:run

cd ../AiAnalysisService && mvn spring-boot:run
```

---

## 4️⃣ Build the Project

```bash
mvn clean install
```

---

# 🔐 Authentication

Authenticate through the **Auth Service**.

```http
POST /api/auth/login
```

Include the JWT in every protected request:

```http
Authorization: Bearer <JWT_TOKEN>
```

---

# 📂 Repository

**GitHub:** https://github.com/Doctor22d/GramWork

---

# 📚 Skills Demonstrated

- Enterprise Java Development
- Backend System Design
- Microservices Architecture
- Spring Cloud Ecosystem
- Distributed Systems
- REST API Development
- Secure Authentication & Authorization
- Event-Driven Architecture
- Real-Time Communication
- AI Integration
- MongoDB GeoSpatial Search
- Amazon S3 Cloud Storage
- RabbitMQ Messaging
- WebSocket Communication
- Docker Containerization
- PDF Invoice Generation
- Scalable Backend Development

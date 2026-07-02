-- Initialize databases for GramWork microservices
-- This script runs automatically when PostgreSQL container starts for the first time

-- Create databases for each microservice
CREATE DATABASE gramwork_auth;
CREATE DATABASE gramwork_profile;
CREATE DATABASE gramwork_job;
CREATE DATABASE gramwork_assignment;
CREATE DATABASE gramwork_attendance;
CREATE DATABASE gramwork_payment;
CREATE DATABASE gramwork_matching;
CREATE DATABASE gramwork_notification;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE gramwork_auth TO gramwork;
GRANT ALL PRIVILEGES ON DATABASE gramwork_profile TO gramwork;
GRANT ALL PRIVILEGES ON DATABASE gramwork_job TO gramwork;
GRANT ALL PRIVILEGES ON DATABASE gramwork_assignment TO gramwork;
GRANT ALL PRIVILEGES ON DATABASE gramwork_attendance TO gramwork;
GRANT ALL PRIVILEGES ON DATABASE gramwork_payment TO gramwork;
GRANT ALL PRIVILEGES ON DATABASE gramwork_matching TO gramwork;
GRANT ALL PRIVILEGES ON DATABASE gramwork_notification TO gramwork;

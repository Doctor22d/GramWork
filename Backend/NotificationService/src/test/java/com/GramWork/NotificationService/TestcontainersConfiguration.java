package com.GramWork.NotificationService;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.testcontainers.containers.MongoDBContainer;
import org.testcontainers.containers.RabbitMQContainer;
import org.testcontainers.utility.DockerImageName;

/**
 * Testcontainers configuration for NotificationService integration tests.
 *
 * Spins up MongoDB + RabbitMQ containers (matching the actual runtime stack)
 * and exposes them as Spring beans with @ServiceConnection so Spring Boot
 * auto-wires the connection properties into the application context.
 */
@TestConfiguration(proxyBeanMethods = false)
class TestcontainersConfiguration {

	@Bean
	@ServiceConnection
	MongoDBContainer mongoContainer() {
		return new MongoDBContainer(DockerImageName.parse("mongo:7"));
	}

	@Bean
	@ServiceConnection
	RabbitMQContainer rabbitContainer() {
		return new RabbitMQContainer(DockerImageName.parse("rabbitmq:3.12-management"));
	}

}
package com.gramwork.AiAnalysisService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableMongoAuditing
@EnableDiscoveryClient
public class AiAnalysisServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AiAnalysisServiceApplication.class, args);
	}

}

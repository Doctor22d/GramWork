package com.gramwork.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * Spring Cloud Config Server
 * Provides centralized configuration management for all GramWork microservices
 * 
 * @author GramWork Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableConfigServer
@EnableDiscoveryClient
public class ConfigServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ConfigServerApplication.class, args);
        System.out.println("""
            
            ╔══════════════════════════════════════════════════════════╗
            ║                                                          ║
            ║       GramWork Config Server Started Successfully       ║
            ║                                                          ║
            ║   Server:    http://localhost:8888                      ║
            ║   Health:    http://localhost:8888/actuator/health      ║
            ║                                                          ║
            ║   Config Format:                                         ║
            ║   /{application}/{profile}[/{label}]                    ║
            ║   /{application}-{profile}.yml                          ║
            ║                                                          ║
            ╚══════════════════════════════════════════════════════════╝
            
            """);
    }
}

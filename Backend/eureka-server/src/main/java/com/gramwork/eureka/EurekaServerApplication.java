package com.gramwork.eureka;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

/**
 * Eureka Service Discovery Server
 * Provides service registration and discovery for GramWork microservices
 * 
 * @author GramWork Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableEurekaServer
public class EurekaServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
        System.out.println("""
            
            ╔══════════════════════════════════════════════════════════╗
            ║                                                          ║
            ║       GramWork Eureka Server Started Successfully       ║
            ║                                                          ║
            ║   Dashboard: http://localhost:8761                      ║
            ║   Health:    http://localhost:8761/actuator/health      ║
            ║                                                          ║
            ╚══════════════════════════════════════════════════════════╝
            
            """);
    }
}

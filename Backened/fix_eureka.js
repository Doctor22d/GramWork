const fs = require('fs');
const path = require('path');

const services = [
    'AiMatchingService',
    'Assignment-Service',
    'Attendence',
    'Job',
    'NotificationService',
    'paymentService'
];

services.forEach(service => {
    const serviceDir = path.join(__dirname, service);
    if (!fs.existsSync(serviceDir)) {
        console.log(`Skipping ${service}, directory not found.`);
        return;
    }

    // 1. Fix pom.xml
    const pomPath = path.join(serviceDir, 'pom.xml');
    if (fs.existsSync(pomPath)) {
        let pom = fs.readFileSync(pomPath, 'utf8');
        
        // Fix Spring Boot version
        pom = pom.replace(/<artifactId>spring-boot-starter-parent<\/artifactId>\s*<version>4\.\d+\.\d+<\/version>/, '<artifactId>spring-boot-starter-parent</artifactId>\n\t\t<version>3.2.1</version>');
        
        // Fix Spring Cloud version
        pom = pom.replace(/<spring-cloud\.version>202\d\.\d+\.\d+<\/spring-cloud\.version>/, '<spring-cloud.version>2023.0.0</spring-cloud.version>');

        // Add eureka-client dependency if not present
        if (!pom.includes('spring-cloud-starter-netflix-eureka-client')) {
            pom = pom.replace(/<\/dependencies>/, '\t\t<dependency>\n\t\t\t<groupId>org.springframework.cloud</groupId>\n\t\t\t<artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>\n\t\t</dependency>\n\t</dependencies>');
        }
        
        // Add dependencyManagement if not present (only if spring-cloud-dependencies missing entirely)
        if (!pom.includes('spring-cloud-dependencies')) {
            const depMgmt = `
\t<dependencyManagement>
\t\t<dependencies>
\t\t\t<dependency>
\t\t\t\t<groupId>org.springframework.cloud</groupId>
\t\t\t\t<artifactId>spring-cloud-dependencies</artifactId>
\t\t\t\t<version>2023.0.0</version>
\t\t\t\t<type>pom</type>
\t\t\t\t<scope>import</scope>
\t\t\t</dependency>
\t\t</dependencies>
\t</dependencyManagement>
`;
            pom = pom.replace(/<\/dependencies>\s*<build>/, `</dependencies>\n${depMgmt}\n\t<build>`);
        }

        fs.writeFileSync(pomPath, pom);
        console.log(`Updated pom.xml for ${service}`);
    }

    // 2. Fix application.yml / application.yaml
    const resDir = path.join(serviceDir, 'src', 'main', 'resources');
    const yamlExts = ['application.yml', 'application.yaml', 'application.properties'];
    let foundConfig = false;
    yamlExts.forEach(ext => {
        const confPath = path.join(resDir, ext);
        if (fs.existsSync(confPath)) {
            foundConfig = true;
            let conf = fs.readFileSync(confPath, 'utf8');
            if (!conf.includes('eureka123')) {
                if (ext.endsWith('properties')) {
                    conf += `\neureka.client.serviceUrl.defaultZone=http://eureka:eureka123@localhost:8761/eureka/\n`;
                } else {
                    conf += `\neureka:\n  client:\n    service-url:\n      defaultZone: http://eureka:eureka123@localhost:8761/eureka/\n`;
                }
                fs.writeFileSync(confPath, conf);
                console.log(`Updated ${ext} for ${service}`);
            }
        }
    });
    
    // Create application.yml if no config file found
    if (!foundConfig && fs.existsSync(resDir)) {
        const confPath = path.join(resDir, 'application.yml');
        const conf = `\neureka:\n  client:\n    service-url:\n      defaultZone: http://eureka:eureka123@localhost:8761/eureka/\n`;
        fs.writeFileSync(confPath, conf);
        console.log(`Created application.yml for ${service}`);
    }

    // 3. Fix main Java class
    const srcDir = path.join(serviceDir, 'src', 'main', 'java');
    
    const findJavaFile = (dir) => {
        let results = [];
        const list = fs.readdirSync(dir);
        list.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat && stat.isDirectory()) {
                results = results.concat(findJavaFile(filePath));
            } else if (file.endsWith('Application.java')) {
                results.push(filePath);
            }
        });
        return results;
    };

    if (fs.existsSync(srcDir)) {
        const javaFiles = findJavaFile(srcDir);
        javaFiles.forEach(javaPath => {
            let javaCode = fs.readFileSync(javaPath, 'utf8');
            if (!javaCode.includes('@EnableDiscoveryClient')) {
                javaCode = javaCode.replace(/import org\.springframework\.boot\.autoconfigure\.SpringBootApplication;/, 'import org.springframework.boot.autoconfigure.SpringBootApplication;\nimport org.springframework.cloud.client.discovery.EnableDiscoveryClient;');
                javaCode = javaCode.replace(/@SpringBootApplication/, '@SpringBootApplication\n@EnableDiscoveryClient');
                fs.writeFileSync(javaPath, javaCode);
                console.log(`Updated ${path.basename(javaPath)} for ${service}`);
            }
        });
    }
});
console.log('Done!');

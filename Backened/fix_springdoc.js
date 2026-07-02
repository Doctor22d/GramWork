const fs = require('fs');
const path = require('path');

const services = [
    'AiMatchingService',
    'Assignment-Service',
    'Attendence',
    'Job',
    'laborer-profile',
    'NotificationService',
    'paymentService'
];

services.forEach(service => {
    const pomPath = path.join(__dirname, service, 'pom.xml');
    if (fs.existsSync(pomPath)) {
        let pom = fs.readFileSync(pomPath, 'utf8');
        
        // Regex to replace ANY springdoc version with 2.3.0
        // We look for <groupId>org.springdoc</groupId> block and replace the <version> inside it
        // Or simpler: just replace all versions for springdoc-openapi-starter-webmvc-ui
        
        pom = pom.replace(/(<artifactId>springdoc-openapi-[^<]+<\/artifactId>\s*<version>)([^<]+)(<\/version>)/g, '$12.3.0$3');
        
        fs.writeFileSync(pomPath, pom);
        console.log(`Updated springdoc version in ${service}/pom.xml`);
    }
});

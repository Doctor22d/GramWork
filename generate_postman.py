import json

collection = {
    "info": {
        "name": "GramWork Microservices",
        "description": "Collection to seed and test all GramWork microservices sequentially.",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "variable": [
        {"key": "employerId", "value": ""},
        {"key": "workerId", "value": ""},
        {"key": "jobId", "value": ""},
        {"key": "assignmentId", "value": ""},
        {"key": "paymentId", "value": ""}
    ],
    "item": [
        {
            "name": "1. Laborer Profile (Port 8081)",
            "item": [
                {
                    "name": "1. Register Employer",
                    "event": [
                        {
                            "listen": "test",
                            "script": {
                                "exec": [
                                    "var jsonData = pm.response.json();",
                                    "pm.collectionVariables.set(\"employerId\", jsonData.employerId);"
                                ],
                                "type": "text/javascript"
                            }
                        }
                    ],
                    "request": {
                        "method": "POST",
                        "header": [{"key": "Content-Type", "value": "application/json"}],
                        "body": {
                            "mode": "raw",
                            "raw": json.dumps({
                                "employerName": "Ramesh Kumar",
                                "employerEmail": "ramesh.kumar@example.com",
                                "employerPhone": "9876543210",
                                "aadhaarNumber": "123456789012"
                            }, indent=4)
                        },
                        "url": {"raw": "http://localhost:8081/api/employer/register", "protocol": "http", "host": ["localhost"], "port": "8081", "path": ["api", "employer", "register"]}
                    }
                },
                {
                    "name": "2. Register Worker",
                    "event": [
                        {
                            "listen": "test",
                            "script": {
                                "exec": [
                                    "var jsonData = pm.response.json();",
                                    "pm.collectionVariables.set(\"workerId\", jsonData.userId);"
                                ],
                                "type": "text/javascript"
                            }
                        }
                    ],
                    "request": {
                        "method": "POST",
                        "header": [{"key": "Content-Type", "value": "application/json"}],
                        "body": {
                            "mode": "raw",
                            "raw": json.dumps({
                                "name": "Suresh Worker",
                                "age": 30,
                                "gender": "MALE",
                                "phone": "9123456780",
                                "aadhaarNumber": "098765432109",
                                "aadhaarVerified": True,
                                "village": "Palampur",
                                "latitude": 28.7041,
                                "longitude": 77.1025,
                                "yearsOfExperience": 5,
                                "dailyWage": 500.0,
                                "availability": "AVAILABLE",
                                "workingHours": "09:00-17:00",
                                "preferredCategories": ["FARMING", "CONSTRUCTION"],
                                "languagesKnown": ["Hindi", "English"],
                                "rating": 4.5,
                                "reviews": 10,
                                "skill": "Mason",
                                "totalJobsCompleted": 15,
                                "reliabilityScore": 9.5
                            }, indent=4)
                        },
                        "url": {"raw": "http://localhost:8081/api/worker/register-worker", "protocol": "http", "host": ["localhost"], "port": "8081", "path": ["api", "worker", "register-worker"]}
                    }
                }
            ]
        },
        {
            "name": "2. Job Service (Port 8082)",
            "item": [
                {
                    "name": "3. Post Job",
                    "event": [
                        {
                            "listen": "test",
                            "script": {
                                "exec": [
                                    "var jsonData = pm.response.json();",
                                    "pm.collectionVariables.set(\"jobId\", jsonData.jobId);"
                                ],
                                "type": "text/javascript"
                            }
                        }
                    ],
                    "request": {
                        "method": "POST",
                        "header": [{"key": "Content-Type", "value": "application/json"}],
                        "body": {
                            "mode": "raw",
                            "raw": "{\n    \"employerId\": \"{{employerId}}\",\n    \"employerName\": \"Ramesh Kumar\",\n    \"title\": \"Farm Harvest Labor\",\n    \"description\": \"Need laborers for wheat harvesting\",\n    \"category\": \"FARMING\",\n    \"requiredSkills\": \"Harvesting, Manual Labor\",\n    \"requiredWorkers\": 5,\n    \"wage\": 600.0,\n    \"duration\": \"5 days\",\n    \"urgencyLevel\": \"HIGH\",\n    \"latitude\": 28.7041,\n    \"longitude\": 77.1025,\n    \"address\": \"Farm 42, Green Belt\",\n    \"village\": \"Palampur\",\n    \"pincode\": \"110042\",\n    \"workImages\": [],\n    \"startDate\": \"2026-06-10T09:00:00\"\n}"
                        },
                        "url": {"raw": "http://localhost:8082/api/job/postjob", "protocol": "http", "host": ["localhost"], "port": "8082", "path": ["api", "job", "postjob"]}
                    }
                }
            ]
        },
        {
            "name": "3. Assignment Service (Port 8083)",
            "item": [
                {
                    "name": "4. Create Assignment",
                    "event": [
                        {
                            "listen": "test",
                            "script": {
                                "exec": [
                                    "var jsonData = pm.response.json();",
                                    "pm.collectionVariables.set(\"assignmentId\", jsonData.assignmentId);"
                                ],
                                "type": "text/javascript"
                            }
                        }
                    ],
                    "request": {
                        "method": "POST",
                        "header": [{"key": "Content-Type", "value": "application/json"}],
                        "body": {
                            "mode": "raw",
                            "raw": "{\n    \"jobId\": \"{{jobId}}\",\n    \"workerId\": \"{{workerId}}\",\n    \"employerId\": \"{{employerId}}\",\n    \"matchScore\": 0.95,\n    \"totalWage\": 3000.0,\n    \"startedDate\": \"2026-06-10T09:00:00\",\n    \"finishDate\": \"2026-06-15T18:00:00\"\n}"
                        },
                        "url": {"raw": "http://localhost:8083/api/assignments/createAssignment", "protocol": "http", "host": ["localhost"], "port": "8083", "path": ["api", "assignments", "createAssignment"]}
                    }
                },
                {
                    "name": "5. Accept Assignment",
                    "request": {
                        "method": "POST",
                        "header": [{"key": "Content-Type", "value": "application/json"}],
                        "body": {
                            "mode": "raw",
                            "raw": "{\n    \"workerId\": \"{{workerId}}\",\n    \"JobID\": \"{{jobId}}\"\n}"
                        },
                        "url": {"raw": "http://localhost:8083/api/assignments/{{assignmentId}}/accept", "protocol": "http", "host": ["localhost"], "port": "8083", "path": ["api", "assignments", "{{assignmentId}}", "accept"]}
                    }
                }
            ]
        },
        {
            "name": "4. Attendance Service (Port 8085)",
            "item": [
                {
                    "name": "6. Create Attendance",
                    "request": {
                        "method": "POST",
                        "header": [],
                        "url": {"raw": "http://localhost:8085/api/attendance/{{assignmentId}}/create", "protocol": "http", "host": ["localhost"], "port": "8085", "path": ["api", "attendance", "{{assignmentId}}", "create"]}
                    }
                }
            ]
        },
        {
            "name": "5. Assignment Complete (Port 8083)",
            "item": [
                {
                    "name": "7. Complete Assignment",
                    "request": {
                        "method": "PUT",
                        "header": [{"key": "Content-Type", "value": "application/json"}],
                        "body": {
                            "mode": "raw",
                            "raw": "{\n    \"workerId\": \"{{workerId}}\",\n    \"JobID\": \"{{jobId}}\"\n}"
                        },
                        "url": {"raw": "http://localhost:8083/api/assignments/{{assignmentId}}/complete", "protocol": "http", "host": ["localhost"], "port": "8083", "path": ["api", "assignments", "{{assignmentId}}", "complete"]}
                    }
                }
            ]
        },
        {
            "name": "6. Payment Service (Port 8084)",
            "item": [
                {
                    "name": "8. Create Payment",
                    "event": [
                        {
                            "listen": "test",
                            "script": {
                                "exec": [
                                    "var jsonData = pm.response.json();",
                                    "pm.collectionVariables.set(\"paymentId\", jsonData.id);"
                                ],
                                "type": "text/javascript"
                            }
                        }
                    ],
                    "request": {
                        "method": "POST",
                        "header": [{"key": "Content-Type", "value": "application/json"}],
                        "body": {
                            "mode": "raw",
                            "raw": "{\n    \"assignmentId\": \"{{assignmentId}}\",\n    \"paymentMethod\": \"UPI\",\n    \"paidBy\": \"{{employerId}}\"\n}"
                        },
                        "url": {"raw": "http://localhost:8084/api/payment/create", "protocol": "http", "host": ["localhost"], "port": "8084", "path": ["api", "payment", "create"]}
                    }
                },
                {
                    "name": "9. Generate Invoice",
                    "request": {
                        "method": "POST",
                        "header": [{"key": "Content-Type", "value": "application/json"}],
                        "body": {
                            "mode": "raw",
                            "raw": "{\n    \"paymentID\": \"{{paymentId}}\"\n}"
                        },
                        "url": {"raw": "http://localhost:8084/api/invoice/createInvoice", "protocol": "http", "host": ["localhost"], "port": "8084", "path": ["api", "invoice", "createInvoice"]}
                    }
                }
            ]
        }
    ]
}

with open(r'c:\Users\deepanshu pundir\OneDrive\Desktop\GramWork\GramWork_Postman_Collection.json', 'w') as f:
    json.dump(collection, f, indent=4)
print("Postman collection generated successfully.")

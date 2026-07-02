import urllib.request
import json
import time

def make_request(url, method="GET", data=None):
    headers = {"Content-Type": "application/json"}
    req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8") if data else None, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode("utf-8")
            if res_body:
                try:
                    return json.loads(res_body)
                except:
                    return res_body
            return None
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code} for {url}: {e.read().decode()}")
        raise
    except Exception as e:
        print(f"Error for {url}: {e}")
        raise

try:
    print("1. Registering Employer...")
    employer_res = make_request("http://localhost:8081/api/employer/register", method="POST", data={
        "employerName": "Ramesh Kumar",
        "employerEmail": "ramesh.kumar@example.com",
        "employerPhone": "9876543210",
        "aadhaarNumber": "123456789012"
    })
    employer_id = employer_res.get("employerId")
    print(f"   Success! Employer ID: {employer_id}\n")

    print("2. Registering Worker...")
    worker_res = make_request("http://localhost:8081/api/worker/register-worker", method="POST", data={
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
    })
    
    # The worker registration endpoint returns a plain string, so we need to get the worker ID via a search or we can assume we know how to fetch it.
    # Wait, the response might not return the workerId. Let's check the API.
    # From research: Worker Controller returns `String` ("user Registered Successfully") for POST /register-worker.
    # But how do we get the worker ID?
    # Maybe we can fetch by phone number? Wait, there is no get by phone API in the controller.
    # The findnearbyWorker returns a list of workers. We can use that!
    print("   Success! Fetching Worker ID via nearbyWorker...")
    nearby_res = make_request("http://localhost:8081/api/employer/nearbyWorker", method="POST", data={
        "latitude": 28.7041,
        "longitude": 77.1025,
        "radius": 10.0
    })
    # nearby_res should be a list of workers
    worker_id = None
    for w in nearby_res:
        if w.get("phone") == "9123456780":
            worker_id = w.get("userId")
            break
    print(f"   Worker ID found: {worker_id}\n")

    if not worker_id:
        raise Exception("Could not find registered worker.")

    print("3. Posting Job...")
    job_res = make_request("http://localhost:8082/api/job/postjob", method="POST", data={
        "employerId": employer_id,
        "employerName": "Ramesh Kumar",
        "title": "Farm Harvest Labor",
        "description": "Need laborers for wheat harvesting",
        "category": "FARMING",
        "requiredSkills": "Harvesting, Manual Labor",
        "requiredWorkers": 5,
        "wage": 600.0,
        "duration": "5 days",
        "urgencyLevel": "HIGH",
        "latitude": 28.7041,
        "longitude": 77.1025,
        "address": "Farm 42, Green Belt",
        "village": "Palampur",
        "pincode": "110042",
        "workImages": [],
        "startDate": "2026-06-10T09:00:00"
    })
    job_id = job_res.get("jobId")
    print(f"   Success! Job ID: {job_id}\n")

    print("4. Creating Assignment...")
    assignment_res = make_request("http://localhost:8083/api/assignments/createAssignment", method="POST", data={
        "jobId": job_id,
        "workerId": worker_id,
        "employerId": employer_id,
        "matchScore": 0.95,
        "totalWage": 3000.0,
        "startedDate": "2026-06-10T09:00:00",
        "finishDate": "2026-06-15T18:00:00"
    })
    assignment_id = assignment_res.get("assignmentId")
    print(f"   Success! Assignment ID: {assignment_id}\n")

    print("5. Accepting Assignment...")
    make_request(f"http://localhost:8083/api/assignments/{assignment_id}/accept", method="POST", data={
        "workerId": worker_id,
        "JobID": job_id
    })
    print("   Success! Assignment Accepted.\n")

    print("6. Creating Attendance...")
    make_request(f"http://localhost:8085/api/attendance/{assignment_id}/create", method="POST")
    print("   Success! Attendance Created.\n")

    print("7. Completing Assignment...")
    make_request(f"http://localhost:8083/api/assignments/{assignment_id}/complete", method="PUT", data={
        "workerId": worker_id,
        "JobID": job_id
    })
    print("   Success! Assignment Completed.\n")

    print("8. Creating Payment...")
    payment_res = make_request("http://localhost:8084/api/payment/create", method="POST", data={
        "assignmentId": assignment_id,
        "paymentMethod": "UPI",
        "paidBy": employer_id
    })
    payment_id = payment_res.get("id")
    print(f"   Success! Payment ID: {payment_id}\n")

    print("9. Generating Invoice...")
    invoice_res = make_request("http://localhost:8084/api/invoice/createInvoice", method="POST", data={
        "paymentID": payment_id
    })
    invoice_id = invoice_res.get("id")
    print(f"   Success! Invoice ID: {invoice_id}\n")

    print("\n✅ All data successfully seeded across all microservices!")

except Exception as e:
    print(f"Failed during seeding process: {e}")

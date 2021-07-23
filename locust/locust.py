from locust import HttpUser, between, task
import json
import random

class WebsiteUser(HttpUser):
    wait_time = between(2, 5)

    serialno_values = []
        
    @task
    def post(self):
        seedValue = random.randrange(1000, 25000)
        random.seed(seedValue)
        payload = {
            "serialno": seedValue,
            "model": "Corolla",
            "vehicleType": "Toyota",
            "mileage": 200
        }
        headers = {'content-type': 'application/json'}

        # Adding seedValue to an array for later usage
        self.serialno_values.append(seedValue)
        
        with  self.client.post("/vehicle/", data=json.dumps(payload), headers=headers, catch_response=True) as response:
            # print(response.text)
            if response.status_code == 200:
                response.success()
            else:
                response.failure("Request failes")

        self.client.get("/Toyota/"+str(seedValue))
        with self.client.get("/Toyota/"+str(random.choice(self.serialno_values)), catch_response=True) as response:
            print(response.text)

from locust import HttpUser, between, task
import json
import random
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

class WebsiteUser(HttpUser):
    wait_time = between(0.1, 0.3)

    serialno_values = []
    
    @task
    def post(self):
        seedValue = random.randrange(1000, 25000)
        random.seed(seedValue)
        milageValue = random.randrange(100, 500000)
        random.seed(milageValue)
        payload = {
            "serialno": seedValue,
            "model": "Corolla",
            "vehicleType": "Toyota",
            "mileage": milageValue
        }
        headers = {'content-type': 'application/json'}

        # Adding seedValue to an array for later usage
        self.serialno_values.append(seedValue)
        
        self.client.post("/vehicle/", verify=False, data=json.dumps(self.payload), headers=self.headers)
            # print(response.text)
            # if response.status_code == 200:
            #     response.success()
            # else:
            #     response.failure("Request failes")

        self.client.get("/Toyota/"+str(self.seedValue), verify=False)
        self.client.get("/Toyota/"+str(random.choice(self.serialno_values)), verify=False)

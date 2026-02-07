#!/usr/bin/env python
import sys
import json
import time

# Give the server a moment to be ready
time.sleep(1)

try:
    import requests
    response = requests.post(
        'http://127.0.0.1:5000/chat',
        json={'message': 'Tell me about Flavia experience with Flask'},
        timeout=10
    )
    print("Status Code:", response.status_code)
    print("Response:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)

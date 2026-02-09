"""
Standalone Keep-Alive Script for Render Free Tier

This script pings Render app periodically to prevent it from sleeping.
Can be runed this locally, on another server, or use a service like:
- GitHub Actions (free cron jobs)
- cron-job.org (free external cron service)
- PythonAnywhere (free tier allows scheduled tasks)

Usage:
    python keep_alive.py

Environment Variables:
    RENDER_APP_URL - Render app URL (e.g., https://your-app.onrender.com)
"""

import requests
import time
import os
from datetime import datetime

# Configure Render app URL here
RENDER_APP_URL = os.getenv('RENDER_APP_URL', 'https://your-app.onrender.com')
PING_INTERVAL_MINUTES = 14  # Render sleeps after 15 minutes of inactivity


def ping_app():
    """Send a GET request to keep the app alive."""
    try:
        url = f"{RENDER_APP_URL.rstrip('/')}/health"
        response = requests.get(url, timeout=30)
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"[{timestamp}] Ping successful: {response.status_code}")
        return True
    except requests.exceptions.RequestException as e:
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"[{timestamp}] Ping failed: {e}")
        return False


def run_continuous():
    """Run the keep-alive in a continuous loop."""
    print(f"Starting keep-alive for: {RENDER_APP_URL}")
    print(f"Ping interval: {PING_INTERVAL_MINUTES} minutes")
    print("-" * 50)

    while True:
        ping_app()
        time.sleep(PING_INTERVAL_MINUTES * 60)


if __name__ == '__main__':
    # For continuous local running
    run_continuous()

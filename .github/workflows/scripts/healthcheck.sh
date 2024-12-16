#!/bin/bash
port="$1"
timeout="${2:-120}"

# Function to check if the app is running
check_health() {
  while ! nc -z localhost "${port}" && [ "${timeout}" -gt 0 ]; do
    sleep 1
    timeout=$((timeout-1))
    if [ $((timeout % 10)) -eq 0 ]; then
      echo "Still waiting for app to start... ${timeout}s remaining"
    fi
  done
}

# Check if the script is running inside Docker container
if [ -f /.dockerenv ]; then
  echo "Running inside Docker container"
  check_health

  if [ "${timeout}" -eq 0 ]; then
    echo "Timeout waiting for application to start"
    echo "Container logs:"
    docker logs talawa-admin-app-container
    exit 1
  fi
  echo "Port check passed, verifying health endpoint..."
else
  echo "Running outside Docker container"
  check_health

  if [ "${timeout}" -eq 0 ]; then
    echo "Timeout waiting for application to start"
    exit 1
  fi
  echo "App started successfully on port ${port}"
fi

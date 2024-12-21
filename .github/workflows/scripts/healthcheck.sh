#!/bin/bash

# Validate input parameters
if [ -z "$1" ]; then
    echo "Error: Port number is required"
    echo "Usage: $0 <port> [timeout]"
    exit 1
fi

if ! [[ "$1" =~ ^[0-9]+$ ]] || [ "$1" -lt 1 ] || [ "$1" -gt 65535 ]; then
    echo "Error: Invalid port number. Must be between 1 and 65535"
    exit 1
fi

if [ ! -z "$2" ] && ! [[ "$2" =~ ^[0-9]+$ ]]; then
    echo "Error: Timeout must be a positive number"
    exit 1
fi

port="$1"
timeout="${2:-120}"

# Function to check if the app is running
check_health() {
  if ! command -v nc >/dev/null 2>&1; then
    echo "Error: netcat (nc) is not installed"
    exit 1
  fi
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

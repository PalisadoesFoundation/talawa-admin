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
TEMP_FILES=""

# Function to check if the app is running
check_health() {
    if ! command -v nc >/dev/null 2>&1; then
        echo "Error: netcat (nc) is not installed"
        exit 1
    fi

    local status=1
    while ! nc -z localhost "${port}" && [ "${timeout}" -gt 0 ]; do
        sleep 1
        timeout=$((timeout - 1))
        if [ $((timeout % 10)) -eq 0 ]; then
            echo "Still waiting for app to start on port ${port}... ${timeout}s remaining"
        fi
    done

    if nc -z localhost "${port}" >/dev/null 2>&1; then
        status=0
    fi
    return $status
}

# Default container name, can be overridden by environment variable
CONTAINER_NAME="${CONTAINER_NAME:-talawa-admin-app-container}"

# Cleanup function
cleanup() {
    echo "Cleaning up..."
    # Kill any background processes started by this script
    jobs -p | xargs -r kill
    # Remove any temporary files if created
    [ -n "${TEMP_FILES}" ] && rm -f ${TEMP_FILES}
    exit "${1:-1}"
}

# Set up signal handling
trap 'cleanup' SIGINT SIGTERM SIGHUP EXIT

# Function to handle timeout
handle_timeout() {
    echo "Timeout waiting for application to start"
    if [ -f /.dockerenv ]; then
        echo "Container logs:"
        docker logs "${CONTAINER_NAME}" 2>/dev/null || echo "Failed to retrieve container logs"
    fi
    cleanup 1
}

# Check if the script is running inside Docker container
if [ -f /.dockerenv ]; then
    echo "Running inside Docker container"
    check_health || handle_timeout
else
    echo "Running outside Docker container"
    check_health || handle_timeout
fi

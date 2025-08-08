#!/bin/bash

# This script performs a health check to ensure an application is running on a specified port.
# The script uses netcat (nc) to check if the port is open, with a configurable timeout.
# It also includes optional logic to fetch Docker container logs if the health check fails during a Docker-based test.

# Variables:
# port="$1"        - The port to check (passed as the first argument to the script).
# timeout="${2:-120}" - The maximum time in seconds to wait for the application to start. Defaults to 120 seconds if not provided.
# is_docker_test="${3:-false}" - A flag to indicate whether the script is being run in a Docker-based test. Defaults to false.

# Logic:
# 1. Print a message indicating the start of the health check.
# 2. Enter a loop to repeatedly check if the port is open using `nc -z localhost "${port}"`.
#    - If the port is not open and the timeout has not expired, sleep for 1 second and decrement the timeout.
#    - Print a status message every 10 seconds with the remaining time.
# 3. If the timeout expires, print an error message and, if in Docker test mode, fetch Docker logs for debugging.
# 4. If the port is detected as open, print a success message and exit.

# Script:

port="$1"
timeout="${2:-120}"
is_docker_test="${3:-false}"


# Validate required port parameter
if [ -z "${port}" ] || ! [[ "${port}" =~ ^[0-9]+$ ]] || [ "${port}" -lt 1 ] || [ "${port}" -gt 65535 ]; then
  echo "Error: Invalid or missing port number. Must be between 1-65535"
  exit 1
fi

# Validate timeout parameter
if ! [[ "${timeout}" =~ ^[0-9]+$ ]] || [ "${timeout}" -lt 1 ]; then
  echo "Error: Invalid timeout value. Must be a positive integer"
  exit 1
fi

# Validate is_docker_test parameter
if [ "${is_docker_test}" != "true" ] && [ "${is_docker_test}" != "false" ]; then
  echo "Error: is_docker_test must be either 'true' or 'false'"
  exit 1
fi

echo "Starting health check with ${timeout}s timeout"
while [ "${timeout}" -gt 0 ]; do
  if nc -z localhost "${port}" 2>/dev/null; then
    break
  elif [ $? -ne 1 ]; then
    echo "Error: Failed to check port ${port} (nc command failed)"
    exit 1
  fi
  sleep 1
  timeout=$((timeout-1))
  if [ $((timeout % 10)) -eq 0 ]; then
    echo "Waiting for app to start on port ${port}... ${timeout}s remaining"
    # Try to get more information about the port status
    netstat -an | grep "${port}" || true
  fi
done

if [ "${timeout}" -eq 0 ]; then
  echo "Error: Timeout waiting for application to start on port ${port}"
  echo "System port status:"
  netstat -an | grep "${port}" || true
  if [ "${is_docker_test}" = "true" ]; then
    echo "Fetching Docker container logs..."
    if ! docker logs talawa-admin-app-container; then
      echo "Error: Failed to fetch logs from container talawa-admin-app-container"
    fi
  fi
  exit 1
fi
echo "App started successfully on port ${port}"


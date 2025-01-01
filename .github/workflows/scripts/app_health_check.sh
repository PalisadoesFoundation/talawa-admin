# .github/workflows/scripts/app_health_check.sh
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

echo "Starting health check with ${timeout}s timeout"
while ! nc -z localhost "${port}" && [ "${timeout}" -gt 0 ]; do
  sleep 1
  timeout=$((timeout-1))
  if [ $((timeout % 10)) -eq 0 ]; then
    echo "Still waiting for app to start... ${timeout}s remaining"
  fi
done

if [ "${timeout}" -eq 0 ]; then
  echo "Timeout waiting for application to start"
  if [ "${is_docker_test}" = "true" ]; then
    echo "Fetching Docker container logs..."
    docker logs talawa-admin-app-container
  fi
  exit 1
fi
echo "App started successfully on port ${port}"


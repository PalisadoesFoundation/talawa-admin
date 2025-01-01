# .github/workflows/scripts/health_check_no.sh
#!/bin/bash

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

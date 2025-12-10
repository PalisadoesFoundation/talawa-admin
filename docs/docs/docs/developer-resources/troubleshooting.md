---
id: troubleshooting
title: Troubleshooting
slug: /developer-resources/troubleshooting
sidebar_position: 100
---

## Introduction

This page provides basic troubleshooting steps for the applications.

## Docker

When running the application using docker it may seem difficult at first to troubleshoot failures. This section covers some basic troubleshooting strategies.

### Status Validation

You can get a summary of all the running docker containers using the `docker ps` command.

It will provide this information under these headings:

1. **CONTAINER ID**: Container IDs
1. **IMAGE**: Image names on which the containers are based
1. **COMMAND**: The command that created the containers
1. **CREATED**: The time of containers
1. **STATUS**: Whether or not the containers are healthy
1. **PORTS**: The exposed ports they use
1. **NAMES**: The names of the running containers

Here is an example:

```
CONTAINER ID   IMAGE           COMMAND                CREATED        STATUS        PORTS                    NAMES
3a6743b03029   docker-app      "docker-entrypoint.s…" 42 minutes ago Up 41 minutes 0.0.0.0:4321->4321/tcp   docker-app-1
f86a9f480819   talawa-api-dev  "/bin/bash /init-dat…" 42 minutes ago Up 42 minutes 0.0.0.0:4000->4000/tcp   talawa-api-dev
83ae5ff56a3f   redis:8.0       "docker-entrypoint.s…" 42 minutes ago Up 42 minutes 0.0.0.0:6379->6379/tcp   talawa-api-redis
44c8a0f38b04   minio/minio     "/usr/bin/docker-ent…" 42 minutes ago Up 42 minutes 0.0.0.0:9000->9001/tcp   talawa-api-minio-1
3a9deccdb68e   caddy/caddy:2.9 "caddy run --config …" 42 minutes ago Up 42 minutes 0.0.0.0:9080->9080/tcp   caddy-service
132dacf0aff4   mongo           "/bin/bash /init-mon…" 42 minutes ago Up 42 minutes 0.0.0.0:27017->27017/tcp mongo
```

You can get information on each of the headings by using filters like this:

1. CONTAINER ID: `docker ps --format '{{.ID}}'`
1. IMAGE: `docker ps --format '{{.Names}}'`
1. COMMAND: `docker ps --format '{{.Command}}'`
1. CREATED: `docker ps --format '{{.RunningFor}}'`
1. STATUS: `docker ps --format '{{.Status}}'`
1. PORTS: `docker ps --format '{{.Ports}}'`
1. NAMES: `docker ps --format '{{.Names}}'`

### Accessing The Container CLI

You can access the CLI of each container using the docker interactive TTY mode flags `-it`.

Here is an example accessing the `/bin/bash` CLI of the `talawa-api-dev` container:

```bash
$ docker exec -it talawa-api-dev /bin/bash
root@f86a9f480819:/usr/src/app# ls
CODEOWNERS          Caddyfile         Dockerfile.prod
CODE_OF_CONDUCT.md  DOCUMENTATION.md  INSTALLATION.md
CONTRIBUTING.md     Dockerfile.dev    ISSUE_GUIDELINES.md
root@f86a9f480819:/usr/src/app# exit
$
```

Here is an example accessing the `/bin/mongosh` CLI of the `mongo` container:

```bash
$ docker exec -it mongo /bin/mongosh
...
...
...
rs0 [direct: primary] test> show databases
admin        80.00 KiB
config      356.00 KiB
local         1.92 MiB
talawa-api    2.49 MiB
rs0 [direct: primary] test> exit
$
```

### Viewing Container Logs

You can view the container logs in real time by using the `docker logs -f` command. The output will update dynamically as you run the app.

In this case we see the logs of the `mongo` container. The `-n 10` flag makes the output start with the most recent 10 rows of logs which makes the output less verbose.

```bash
$ docker logs -f mongo -n 10
```

```
mongosh","version":"6.12.0|2.3.8"},"platform":"Node.js v20.18.1, LE","os":{"name":"linux","architecture":"x64","version":"3.10.0-327.22.2.el7.x86_64","type":"Linux"},"env":{"container":{"runtime":"docker"}}}}}
{"t":{"$date":"2025-02-22T01:14:08.038+00:00"},"s":"I",  "c":"NETWORK",  "id":51800,   "ctx":"conn2194","msg":"client metadata","attr":{"remote":"127.0.0.1:36844","client":"conn2194","negotiatedCompressors":[],"doc":{"application":{"name":"mongosh 2.3.8"},"driver":{"name":"nodejs|mongosh","version":"6.12.0|2.3.8"},"platform":"Node.js v20.18.1, LE","os":{"name":"linux","architecture":"x64","version":"3.10.0-327.22.2.el7.x86_64","type":"Linux"},"env":{"container":{"runtime":"docker"}}}}}
{"t":{"$date":"2025-02-22T01:14:08.040+00:00"},"s":"I",  "c":"NETWORK",  "id":6788700, "ctx":"conn2193","msg":"Received first command on ingress connection since session start or auth handshake","attr":{"elapsedMillis":2}}
{"t":{"$date":"2025-02-22T01:14:08.040+00:00"},"s":"I",  "c":"NETWORK",  "id":22943,   "ctx":"listener","msg":"Connection accepted","attr":{"remote":"127.0.0.1:36848","uuid":{"uuid":{"$uuid":"1ef5fcbd-4913-45fe-bc66-7bc3600a941a"}},"connectionId":2195,"connectionCount":24}}
{"t":{"$date":"2025-02-22T01:14:08.043+00:00"},"s":"I",  "c":"NETWORK",  "id":22943,   "ctx":"listener","msg":"Connection accepted","attr":{"remote":"127.0.0.1:36854","uuid":{"uuid":{"$uuid":"48522796-7b00-46df-a5d1-3e2a9ec7edd8"}},"connectionId":2196,"connectionCount":25}}
```


<!-- add Non Docker Troubleshooting -->


## Non-Docker Production Server Troubleshooting

This section covers troubleshooting for Talawa Admin running in a non-Docker production environment.

### Finding and Reading Application Logs

#### Console Output (Direct Execution)

When running the app with `npm start` or `npm run serve`, logs appear directly in the terminal:

```bash
# Run and save logs to a file
npm start > app.log 2>&1

# Run in background and save logs
nohup npm start > app.log 2>&1 &

# View logs in real-time
tail -f app.log
```

#### PM2 Logs

PM2 provides comprehensive logging capabilities:

```bash
# View real-time logs for all apps
pm2 logs

# View logs for specific app
pm2 logs talawa-admin

# View last 100 lines of logs
pm2 logs talawa-admin --lines 100

# View only error logs
pm2 logs talawa-admin --err

# View only output logs
pm2 logs talawa-admin --out

# Clear all logs
pm2 flush

# Log file locations:
# Linux/Mac: ~/.pm2/logs/
# Windows: C:\Users\<username>\.pm2\logs\

# View specific log files
cat ~/.pm2/logs/talawa-admin-out.log
cat ~/.pm2/logs/talawa-admin-error.log
```

#### systemd Service Logs (Linux)

If running as a systemd service:

```bash
# View all logs for the service
sudo journalctl -u talawa-admin

# Follow logs in real-time
sudo journalctl -u talawa-admin -f

# View logs from the current boot
sudo journalctl -u talawa-admin -b

# View logs from a specific time
sudo journalctl -u talawa-admin --since "2025-12-10 10:00:00"
sudo journalctl -u talawa-admin --since "1 hour ago"
sudo journalctl -u talawa-admin --since today

# View last 50 lines
sudo journalctl -u talawa-admin -n 50

# View logs with priority (errors only)
sudo journalctl -u talawa-admin -p err
```

#### Windows Event Viewer

For Windows services:

```cmd
# Open Event Viewer
eventvwr.msc

# Navigate to: Windows Logs > Application
# Filter by source: Node.js or your application name
```

#### Application-Specific Log Files

Check your application's configuration for custom log locations:

```bash
# Common locations
./logs/
./log/
/var/log/talawa-admin/

# Check application config
cat .env | grep LOG
```

### Checking if the Application is Running

#### Windows Commands

```cmd
# Check if Node.js process is running
tasklist | findstr "node.exe"

# Check specific port (e.g., 4321)
netstat -ano | findstr :4321

# Check with PowerShell
Get-Process -Name node
Get-NetTCPConnection -LocalPort 4321
```

#### Linux/Mac Commands

```bash
# Check Node.js processes
ps aux | grep node

# Check if port is in use
netstat -tulpn | grep :4321
lsof -i :4321

# Check with PM2
pm2 list
pm2 status
pm2 info talawa-admin

# Check systemd service
sudo systemctl status talawa-admin
sudo systemctl is-active talawa-admin
```

### Common Issues and Solutions

#### Issue 1: Port Already in Use

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::4321
```

**Solution:**

**Windows:**
```cmd
# Find process using the port
netstat -ano | findstr :4321

# Kill the process (replace PID with actual Process ID)
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
# Find and kill process
lsof -i :4321
kill -9 <PID>

# Or use one command
lsof -ti :4321 | xargs kill -9
```

#### Issue 2: Permission Denied Errors

**Error Message:**
```
Error: EACCES: permission denied
```

**Solution:**

```bash
# Linux/Mac: Fix file permissions
sudo chown -R $USER:$USER /path/to/talawa-admin
chmod -R 755 /path/to/talawa-admin

# Don't run Node.js with sudo
# Instead, use ports above 1024 or configure proper permissions

# If you must use port 80/443, use this:
sudo setcap 'cap_net_bind_service=+ep' $(which node)
```

**Windows:**
```cmd
# Run Command Prompt as Administrator
# Or adjust folder permissions in Properties > Security
```

#### Issue 3: Module Not Found

**Error Message:**
```
Error: Cannot find module 'xyz'
```

**Solution:**

```bash
# Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# Or use clean install (faster, more reliable)
npm ci

# If issue persists, clear npm cache
npm cache clean --force
npm install
```

#### Issue 4: Environment Variables Not Loaded

**Error Message:**
```
Configuration error / undefined environment variables
```

**Solution:**

```bash
# Verify .env file exists
ls -la .env

# Check .env file content
cat .env

# Load environment variables before starting

# Linux/Mac:
export $(cat .env | xargs)
npm start

# Or use dotenv-cli
npm install -g dotenv-cli
dotenv npm start

# Windows Command Prompt:
# Set variables manually or use a script
set REACT_APP_API_URL=http://localhost:4000
npm start

# Windows PowerShell:
Get-Content .env | ForEach-Object {
  $name, $value = $_.split('=')
  Set-Item -Path "env:$name" -Value $value
}
npm start
```

#### Issue 5: Build Errors

**Error Message:**
```
Build failed / compilation errors
```

**Solution:**

```bash
# Clear build cache
rm -rf build/ .cache/ dist/

# Clean and rebuild
npm run clean
npm run build

# Check Node.js version compatibility
node --version
# Talawa Admin requires Node.js 16.x or higher

# Update Node.js if needed using nvm
nvm install 18
nvm use 18
```

#### Issue 6: Memory Issues

**Error Message:**
```
JavaScript heap out of memory
```

**Solution:**

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm start

# Or in package.json scripts:
"start": "NODE_OPTIONS='--max-old-space-size=4096' react-scripts start"

# Windows:
set NODE_OPTIONS=--max-old-space-size=4096
npm start
```

### Monitoring Application Health

#### Using PM2 Monitoring

```bash
# Real-time monitoring dashboard
pm2 monit

# Show detailed app information
pm2 show talawa-admin

# Check memory and CPU usage
pm2 list

# Enable web-based monitoring
pm2 web
# Then open: http://localhost:9615
```

#### Setting Up Health Checks

```bash
# Using curl to check if app responds
curl http://localhost:4321
curl http://localhost:4321/health

# Using wget
wget -qO- http://localhost:4321/health

# Windows PowerShell
Invoke-WebRequest -Uri http://localhost:4321/health

# Create a monitoring script
# health-check.sh
#!/bin/bash
if curl -f http://localhost:4321/health > /dev/null 2>&1; then
    echo "Application is healthy"
else
    echo "Application is down!"
    # Send alert or restart
fi
```

#### Auto-Restart on Crash (PM2)

```bash
# Start with auto-restart
pm2 start npm --name "talawa-admin" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
# Follow the command it suggests

# Configure max restarts
pm2 start npm --name "talawa-admin" -- start --max-restarts 10
```

### Performance Debugging

```bash
# Enable Node.js debugging
node --inspect server.js

# Profile CPU usage
node --prof server.js
# Generate report
node --prof-process isolate-0xnnnnnnnnnnnn-v8.log > processed.txt

# Check memory usage
node --trace-warnings --trace-deprecation server.js

# PM2 memory monitoring
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
```

### Getting Help

If you're still experiencing issues:

1. Check the logs using methods described above
2. Search existing [GitHub Issues](https://github.com/PalisadoesFoundation/talawa-admin/issues)
3. Join our [Slack community](http://slack.palisadoes.org)
4. Create a detailed bug report with:
   - Error messages
   - Log output
   - System information (OS, Node.js version)
   - Steps to reproduce

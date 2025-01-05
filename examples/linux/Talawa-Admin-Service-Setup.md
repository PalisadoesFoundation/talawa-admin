# Talawa-Admin Service Setup Guide

## Table of Contents

- [Prerequisites](#prerequisites-2)
- [Service Configuration](#service-configuration)
    - [1. **Copy the `talawa_admin.service` file**](#1-copy-the-talawa_adminservice-file)
    - [2. **Verify the CODEROOT Path**](#2-verify-the-coderoot-path)
    - [3. **Set the Correct Working Directory**](#3-set-the-correct-working-directory)
    - [4. **Ensure the `.env` File Exists**](#4-ensure-the-env-file-exists)
    - [5. **Adjust User and Group**](#5-adjust-user-and-group)
- [Steps to Enable and Manage the Service](#steps-to-enable-and-manage-the-service)
- [Troubleshooting](#troubleshooting)


This guide outlines the steps to set up and manage the Talawa-Admin service on a Linux server using `systemd`.

## Prerequisites

- Firstly, You should have locally setup the Talawa-Admin repo using [Setting up this repository](https://github.com/PalisadoesFoundation/talawa-admin/blob/main/INSTALLATION.md)
- Ensure **Node.js** and **npm** are correctly installed and available for the specified user and group.
- It’s recommended to use **nvm** (Node Version Manager) for better management of different Node.js versions.
- Ensure you have root or sudo access to configure systemd services.
- Create a dedicated service user:
   ```bash
   sudo useradd -r -s /bin/false talawa_admin
   sudo groupadd -r talawa_admin
   sudo usermod -a -G talawa_admin talawa_admin
   # Set proper directory permissions
   sudo chown -R talawa_admin:talawa_admin /path/to/talawa-admin
   sudo chmod 750 /path/to/talawa-admin
   sudo find /path/to/talawa-admin -type f -exec chmod 640 {} \
   sudo chmod 600 /path/to/talawa-admin/.env
   ```

---

### Service Configuration

#### 1. **Copy the `talawa_admin.service` file**
   - Place the `talawa_admin.service` file in the appropriate systemd directory based on your Linux distribution:
     - For most distributions: `/etc/systemd/system/`
     - For systems using `systemd`, this will be the default directory.

#### 2. **Verify the CODEROOT Path**
   - Ensure that the `CODEROOT` environment variable matches the absolute path to the Talawa-Admin code directory.

#### 3. **Set the Correct Working Directory**
   - Always use the absolute path for the `WorkingDirectory`. Do **not** use `$CODEROOT` in the `WorkingDirectory` field.

#### 4. **Ensure the `.env` File Exists**
   - Verify that the path in the `EnvironmentFile` line points to a valid `.env` file located in the root directory of the Talawa-Admin repository.
      
#### 5. **Adjust User and Group**
   - Modify the `User` and `Group` settings to match the user account intended to run the service.

---

### Steps to Enable and Manage the Service

1. **Reload the systemd daemon** to apply changes:
   ```bash
   sudo systemctl daemon-reload
   ```

2. **Start the Talawa-Admin Service**:
   ```bash
   sudo systemctl start talawa_admin.service
   ```

3. **Stop the Talawa-Admin Service**:
   ```bash
   sudo systemctl stop talawa_admin.service
   ```

4. **Enable the Service to Start on Boot**:
   ```bash
   sudo systemctl enable talawa_admin.service
   ```

---

### Troubleshooting

- If you encounter any issues, you can check the status and logs of the service:
  ```bash
  sudo systemctl status talawa_admin.service
  sudo journalctl -u talawa_admin.service
  ```

---

By following these steps, you can set up and manage the Talawa-Admin service efficiently on your Linux server.
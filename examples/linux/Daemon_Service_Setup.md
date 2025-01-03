
# Talawa-Admin Service Setup Guide

This guide outlines the steps to set up and manage the Talawa-Admin service on a Linux server using `systemd`.

### Prerequisites

- Ensure **Node.js** and **npm** are correctly installed and available for the specified user and group.
- It’s recommended to use **nvm** (Node Version Manager) for better management of different Node.js versions.

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
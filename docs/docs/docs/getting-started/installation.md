---
id: installation
title: Installation
slug: /installation
sidebar_position: 1
---

Talawa-Admin can be installed using either an [automated one-click installation script](#automated-installation) or [manually](#manual-installation). The automated installation is recommended for most users as it handles all prerequisites automatically.

## Automated Installation

:::tip
The automated installation is supported on **macOS, Linux, and Windows (via WSL)**. For native Windows without WSL, use the [Manual Installation](#manual-installation) method.
:::

The automated installation script provides a zero-prerequisite installation experience. It automatically installs Node.js (via fnm), pnpm, and all required dependencies.

### WSL (Windows Subsystem for Linux) Support

If you're using Windows with WSL:

1. **Use the bash script** (`./scripts/install.sh`) inside your WSL terminal - not the PowerShell script
2. **Docker**: Install Docker Desktop for Windows and enable the WSL 2 backend integration:
   - Settings → General → "Use the WSL 2 based engine"
   - Settings → Resources → WSL Integration → Enable for your distro
   - See: https://docs.docker.com/desktop/wsl/

### Prerequisites

The only prerequisite is having `git` installed on your system (usually pre-installed on macOS/Linux, or install via your package manager).

**Additional prerequisites for contributors:**

- **curl** or **wget**: Required by pre-commit hooks to download centralized scripts
  - **macOS**: `curl` is pre-installed
  - **Linux (Ubuntu/Debian)**: Install with `sudo apt install curl`
  - **Linux (Fedora/RHEL)**: Install with `sudo dnf install curl`
  - **Windows (WSL)**: Install with `sudo apt install curl` (inside WSL)
  - Alternatively, you can install `wget` instead

### Setting up the repository

First you need a local copy of `talawa-admin`. Run the following command in the directory of choice on your local system.

1. On your computer, navigate to the folder where you want to setup the repository.
2. Open a terminal session in this folder.
   1. An easy way to do this is to right-click and choose the appropriate option based on your OS.

The next steps will depend on whether you are:

1. an end user installing our software (Production Environments) or
2. one of our open source contributors (Development Environments).

Please follow them closely.

#### For Production Environments

Clone the repository to your local computer:

```bash
git clone https://github.com/PalisadoesFoundation/talawa-admin.git
```

Proceed to the next section.

#### For Development Environments

If you are one of our open source software developer contributors then
follow these steps carefully in forking and cloning the `talawa-admin` repository.

1.  Follow the steps in our [Git Guide for Developers](https://developer.palisadoes.org/docs/git-guide/introduction/quickstart)
2.  As a developer you will be working with our `develop` branch.
3.  You will now have a local copy of the code files.
4.  For more detailed instructions on contributing code, please review the following documents in the root directory of the code:
    1. CONTRIBUTING.md
    2. CODE_OF_CONDUCT.md
    3. CODE_STYLE.md
    4. DOCUMENTATION.md
    5. INSTALLATION.md
    6. ISSUE_GUIDELINES.md
    7. PR_GUIDELINES.md

#### Navigate to the repository directory

```bash
cd talawa-admin
```

### Running the automated installer

The installer automatically handles:

- Installing Node.js via fnm (Fast Node Manager) if not present
- Installing pnpm via Corepack
- Installing project dependencies
- Checking and installing typescript, and optionally docker

#### For macOS and Linux

Run the installation script:

```bash
./scripts/install.sh
```

Or if the script is not executable:

```bash
bash scripts/install.sh
```

The script will:

1. Check for pnpm, and if missing, automatically install Node.js (via fnm) and pnpm
2. Prompt you to install project dependencies (`pnpm install`)
3. Prompt you to run the environment installer (`pnpm run install-deps`) which checks for typescript and optionally docker

<!-- #### For Windows

Open PowerShell in the repository directory and run:

```powershell
.\scripts\install.ps1
```

If PowerShell blocks the script due to the execution policy, open PowerShell as Administrator and allow locally created scripts:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

Then run the installer again.

The PowerShell script follows the same flow as the bash script, automatically installing Node.js and pnpm if needed. -->

### What gets installed

The automated installer handles:

- **Node.js**: Installed automatically via fnm (Fast Node Manager) if not present
- **pnpm**: Installed via Corepack, respecting the version specified in `package.json`
- **Project dependencies**: Installed via `pnpm install`
- **TypeScript**: Checked and can be installed if missing
- **Docker**: Optional, can be installed if you choose to use Docker

Note: **Git** must be installed before cloning the repository (see Prerequisites section above). It is not checked or installed by the automated installer.

### Next steps

After the automated installation completes, proceed to the [Configuration](./configuration.md) page to set up the application.

## Manual Installation

Installation is not difficult, but there are many steps. This is a brief explanation of what needs to be done:

1. Install `git`
2. Download the code from GitHub using `git`
3. Install `node.js` (Node), the runtime environment the application will need to work.
4. Configure the Node Package Manager (`pnpm`) to automatically use the correct version of Node for our application.
5. Use `pnpm` to install TypeScript, the language the application is written in.
6. Install other supporting software such as the database.
7. Configure the application
8. Start the application

These steps are explained in more detail in the sections that follow.

### Prerequisites

In this section we'll explain how to set up all the prerequisite software packages to get you up and running.

### Install git

The easiest way to get the latest copies of our code is to install the `git` package on your computer.

Follow the setup guide for `git` on official [git docs](https://git-scm.com/downloads). Basic `git` knowledge is required for open source contribution so make sure you're comfortable with it. [Here's](https://youtu.be/apGV9Kg7ics) a good tutorial to get started with `git` and `github`.

### Setting up this repository

First you need a local copy of `talawa-admin`. Run the following command in the directory of choice on your local system.

1. On your computer, navigate to the folder where you want to setup the repository.
2. Open a `cmd` (Windows) or `terminal` (Linux or MacOS) session in this folder.
   1. An easy way to do this is to right-click and choose appropriate option based on your OS.

The next steps will depend on whether you are:

1. an end user installing our software (Production Environments) or
2. one of our open source contributors (Development Environments).

Please follow them closely.

#### For Production Environments

Follow the steps in this section if you are using Talawa-Admin as an end user.

1. Clone the repository to your local computer using this command:

   ```bash
   $ git clone https://github.com/PalisadoesFoundation/talawa-admin.git
   ```

   1. Proceed to the next section.

#### For Development Environments

If you are one of our open source software developer contributors then
follow these steps carefully in forking and cloning the `talawa-admin` repository.

1.  Follow the steps in our [Git Guide for Developers](https://developer.palisadoes.org/docs/git-guide/introduction/quickstart)
2.  As a developer you will be working with our `develop` branch.
3.  You will now have a local copy of the code files.
4.  For more detailed instructions on contributing code, please review the following documents in the root directory of the code:
    1. CONTRIBUTING.md
    2. CODE_OF_CONDUCT.md
    3. CODE_STYLE.md
    4. DOCUMENTATION.md
    5. INSTALLATION.md
    6. ISSUE_GUIDELINES.md
    7. PR_GUIDELINES.md

Proceed to the next section.

### Install node.js

The best way to install and manage `node.js` is making use of node version managers. We recommend using `fnm`, which will be described in more detail later.

Follow these steps to install the `node.js` packages in Windows, Linux and MacOS.

#### For Windows Users

Follow these steps:

1. Install `node.js` from their website at https://nodejs.org
   1. When installing, don't click the option to install the `necessary tools`. These are not needed in our case.
2. Install [fnm](https://github.com/Schniz/fnm). Please read all the steps in this section first.
   1. All the commands listed on this page will need to be run in a Windows terminal session in the `talawa-admin` directory.
   2. Install `fnm` using the `winget` option listed on the page.
   3. Setup `fnm` to automatically set the version of `node.js` to the version required for the repository using these steps:
      1. Refer to the `Shell Setup` section of the `fnm` site's installation page for recommendations.
      2. Open a `Windows PowerShell` terminal window
      3. Run the recommended `Windows PowerShell` command to open `notepad`.
      4. Paste the recommended string into `notepad`
      5. Save the document.
      6. Exit `notepad`
      7. Exit PowerShell
      8. This will ensure that you are always using the correct version of `node.js`
3. Install `python` from https://www.python.org
   1. Ensure Python 3.10 or later is installed.
   2. Verify installation by running `python --version` in your terminal.
   3. Create a Python virtual environment and install dependencies:
      ```bash
      python -m venv venv
      ```

Proceed to the next section.

#### For Linux and MacOS Users

Follow these steps:

1. Install `node.js` from their website at https://nodejs.org
2. Install [fnm](https://github.com/Schniz/fnm).
   1. Refer to the `Shell Setup` section of the `fnm` site's installation page for recommendations.
   2. Run the respective recommended commands to setup your node environment
   3. This will ensure that you are always using the correct version of `node.js`

Proceed to the next section.

### Install pnpm

The application uses `pnpm` to manage the various `node.js` packages that need to be installed.

- Install `pnpm` from the [pnpm website](https://pnpm.io/installation)

Proceed to the next section.

### Install TypeScript

TypeScript is a typed superset of JavaScript that compiles to plain JavaScript. It adds optional types, classes, and modules to JavaScript, and supports tools for large-scale JavaScript applications.

To install TypeScript, you can use the `pnpm` command:

```bash
pnpm install -g typescript
```

This command installs TypeScript globally on your system so that it can be accessed from any project.

Proceed to the next section.

### Install Python (Required for Contributors)

Talawa Admin uses several Python scripts for code quality checks that run:

- In GitHub Actions (CI)
- Locally via Husky pre-commit hooks

To avoid pre-commit failures and CI errors, contributors **must install Python and
the required dependencies before committing code**.

```note
This step is required only for contributors. End users running Talawa Admin do not need Python.
```

#### Prerequisites

- Python **3.10 or later**
- `pip` available in PATH

You can verify your Python installation by running:

```bash
python --version
pip --version
```

#### Create a Python virtual environment and install dependencies

From the repository root, run:

```bash
python -m venv venv
```

Then activate the virtual environment:

**On macOS/Linux:**

```bash
source venv/bin/activate
```

**On Windows (PowerShell):**

```powershell
venv\Scripts\Activate.ps1
```

**On Windows (Git Bash/MSYS2):**

```bash
source venv/Scripts/activate
```

Now install the required Python packages:

```bash
pip install -r .github/workflows/requirements.txt
```

### Install The Required Packages

This section covers how to install additional required packages.

1. All users will need to run the `pnpm install` command
2. If you are a developer, you will additionally need to install packages in the `docs/` directory.

Both steps are outlined below.

#### All Users

Run the following command to install the packages and dependencies required by the app:

```bash
pnpm install
```

#### Additional Step for Developers

:::note
Developers will also need to install packages in the `docs/` directory.
:::

```bash
cd docs/
pnpm install
```

## Running Talawa Admin

The prerequisites are now installed. The next step will be to get the app up and running.

- Please go to the [Operation Page](./operation.md) to get Talawa-Admin started

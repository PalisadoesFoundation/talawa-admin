---
id: installation
title: Installation
slug: /developer-resources/installation
sidebar_position: 5
---

## OS Detection Library for Install Scripts

The Talawa Admin repository includes a robust OS detection library (`scripts/install/lib/os-detect.sh`) that provides reliable cross-platform OS identification for bash installation scripts. This library is used internally by the automated installer and can be leveraged by developers creating custom installation or setup scripts.

### Overview

The OS detection library provides:

- Cross-platform OS detection for macOS, Debian/Ubuntu, RHEL/Fedora, and WSL variants
- Cached results for performance (subsequent calls are instant)
- Safe handling of missing system files
- Alignment with the TypeScript OS detector (`src/install/os/detector.ts`)

### Usage

To use the OS detection library in your bash scripts:

```bash
# Source the library
source ./scripts/install/lib/os-detect.sh

# Detect the operating system
detect_os

# Access the results
echo "$OS_TYPE"           # e.g., "macos", "debian", "wsl-debian"
echo "$OS_DISPLAY_NAME"   # e.g., "macOS", "WSL (Debian/Ubuntu)"
echo "$IS_WSL"            # "true" or "false"
```

### Exported Variables

After calling `detect_os`, the following variables are available:

| Variable          | Type    | Description            | Example Values                                                                    |
| ----------------- | ------- | ---------------------- | --------------------------------------------------------------------------------- |
| `OS_TYPE`         | String  | OS type identifier     | `macos`, `debian`, `redhat`, `wsl-debian`, `wsl-redhat`, `wsl-unknown`, `unknown` |
| `OS_DISPLAY_NAME` | String  | Human-readable OS name | `macOS`, `Debian/Ubuntu`, `WSL (Debian/Ubuntu)`                                   |
| `IS_WSL`          | Boolean | Whether running in WSL | `true`, `false`                                                                   |

### Exported Functions

| Function              | Description                                                                   | Returns                    |
| --------------------- | ----------------------------------------------------------------------------- | -------------------------- |
| `detect_os`           | Detects OS and sets exported variables. Idempotent (cached after first call). | Always returns `0`         |
| `get_os_display_name` | Calls `detect_os` and returns the human-readable OS name                      | OS display name via stdout |

### Supported Operating Systems

The library detects the following operating system types:

- **macOS** (`OS_TYPE="macos"`) - Native macOS systems
- **Debian/Ubuntu** (`OS_TYPE="debian"`) - Native Debian-based Linux systems
- **RHEL/Fedora** (`OS_TYPE="redhat"`) - Native RHEL-based Linux systems
- **WSL Debian** (`OS_TYPE="wsl-debian"`) - Windows Subsystem for Linux running Debian/Ubuntu
- **WSL RHEL** (`OS_TYPE="wsl-redhat"`) - Windows Subsystem for Linux running RHEL/Fedora
- **WSL Unknown** (`OS_TYPE="wsl-unknown"`) - Windows Subsystem for Linux with unrecognized distro
- **Unknown** (`OS_TYPE="unknown"`) - Fallback for unsupported systems

### Example Script

```bash
#!/bin/bash
set -euo pipefail

# Source the OS detection library
source "$(dirname "$0")/scripts/install/lib/os-detect.sh"

# Detect the operating system
detect_os

# Use OS information to customize installation
case "$OS_TYPE" in
    macos)
        echo "Installing for macOS..."
        brew install package-name
        ;;
    debian)
        echo "Installing for Debian/Ubuntu..."
        sudo apt-get install -y package-name
        ;;
    redhat)
        echo "Installing for RHEL/Fedora..."
        sudo dnf install -y package-name
        ;;
    wsl-*)
        echo "Detected WSL environment: $OS_DISPLAY_NAME"
        # Special handling for WSL
        ;;
    *)
        echo "Unsupported OS: $OS_DISPLAY_NAME"
        exit 1
        ;;
esac
```

### Important Notes

- **Multiple Sourcing**: The library is safe to source multiple times - it will only execute once per shell session
- **Caching**: The `detect_os` function caches results after the first call for performance
- **Bash Compatibility**: Compatible with Bash 3.2+ (macOS default) and later versions
- **No System Modifications**: The library only reads system files and never modifies them

### Testing

The library includes a comprehensive test suite at `scripts/install/lib/os-detect.spec.sh`:

```bash
# Run all tests
bash scripts/install/lib/os-detect.spec.sh

# Or make it executable and run
chmod +x scripts/install/lib/os-detect.spec.sh
./scripts/install/lib/os-detect.spec.sh
```

The test suite covers:

- Detection for all supported OS types
- WSL detection (via environment variable and `/proc/version`)
- Caching and idempotency behavior
- Variable exports and function behavior
- Edge cases and unknown OS handling

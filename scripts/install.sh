#!/bin/bash
set -euo pipefail

echo "🚀 Starting Talawa installation..."
echo ""

# Function to detect if running in WSL
# NOTE: Keep in sync with src/install/os/detector.ts (isRunningInWsl function)
is_wsl() {
    # Check WSL_DISTRO_NAME environment variable
    if [ -n "${WSL_DISTRO_NAME:-}" ]; then
        return 0
    fi
    
    # Check /proc/version for Microsoft or WSL indicators
    if [ -f /proc/version ]; then
        if grep -qi "microsoft\|wsl" /proc/version 2>/dev/null; then
            return 0
        fi
    fi
    
    return 1
}

# Display WSL-specific information if detected
if is_wsl; then
    echo "🔷 WSL Environment Detected"
    echo ""
    echo "ℹ️  Note: For Docker support in WSL, you should use Docker Desktop for Windows"
    echo "   with the WSL 2 backend enabled, not docker-ce installed inside WSL."
    echo "   See: https://docs.docker.com/desktop/wsl/"
    echo ""
fi

# Function to install fnm (Fast Node Manager)
install_fnm() {
    echo "📦 Installing fnm (Fast Node Manager)..."
    
    # Check if fnm already exists
    if command -v fnm &> /dev/null; then
        echo "✅ fnm is already installed"
        return 0
    fi
    
    # Try curl installer
    if curl -fsSL https://fnm.vercel.app/install | bash -s -- --install-dir "$HOME/.fnm" --skip-shell; then
        echo "✅ fnm installed successfully"
        
        # Set up fnm in current session
        export FNM_DIR="$HOME/.fnm"
        export PATH="$FNM_DIR:$PATH"
        eval "$(fnm env --use-on-cd)"
        
        return 0
    else
        echo "❌ Failed to install fnm"
        return 1
    fi
}

# Function to install Node.js via fnm
install_node() {
    echo "📦 Installing Node.js via fnm..."
    
    # Ensure fnm is installed
    if ! install_fnm; then
        echo "❌ Cannot install Node.js without fnm"
        exit 1
    fi
    
    # Install and activate Node.js v22.x (repository standard)
    if fnm install 22 && fnm use --install-if-missing 22; then
        NODE_VERSION=$(node --version 2>/dev/null || echo "unknown")
        echo "✅ Node.js installed successfully (version: $NODE_VERSION)"
        echo "⚠️  Add to your shell config (~/.bashrc, ~/.zshrc, etc.):"
        # shellcheck disable=SC2016
        # Intentional: single quotes preserve literal string for user to copy-paste
        echo '    eval "$(fnm env --use-on-cd)"'
        return 0
    else
        echo "❌ Failed to install Node.js"
        exit 1
    fi
}

# Check if pnpm is installed
echo "🔍 Checking for pnpm..."
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm --version 2>/dev/null || echo "unknown")
    echo "✅ pnpm is already installed (version: $PNPM_VERSION)"
    echo ""
else
    echo "❌ pnpm is not installed"
    
    # Check if Node.js is installed
    echo "🔍 Checking for Node.js..."
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed"
        echo "📦 Installing Node.js automatically via fnm..."
        echo ""
        install_node
    else
        NODE_VERSION=$(node --version 2>/dev/null || echo "unknown")
        echo "✅ Node.js is installed (version: $NODE_VERSION)"
    fi
    
    # Enable corepack and install pnpm
    echo "📦 Installing pnpm via corepack..."
    
    # Enable corepack (may require sudo on some systems)
    if corepack enable 2>/dev/null; then
        echo "✅ Corepack enabled"
    else
        echo "⚠️  Trying with sudo (you may be prompted for your password)..."
        sudo corepack enable
    fi
    
    # Prepare and activate the pnpm version declared in package.json's packageManager
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    PKG_JSON="$SCRIPT_DIR/../package.json"
    PNPM_SPEC=$(node -e "const fs=require('fs');const p=process.argv[1];try{const o=JSON.parse(fs.readFileSync(p,'utf8'));process.stdout.write(o.packageManager||'');}catch(e){process.stdout.write('');}" "$PKG_JSON")
    if [ -z "$PNPM_SPEC" ]; then
        PNPM_SPEC="pnpm@latest"
        echo "⚠️  packageManager not found in package.json; falling back to $PNPM_SPEC"
    else
        echo "📦 Using package manager from package.json: $PNPM_SPEC"
    fi
    corepack prepare "$PNPM_SPEC" --activate
    
    # Verify installation
    echo ""
    echo "🔍 Verifying pnpm installation..."
    if command -v pnpm &> /dev/null; then
        PNPM_VERSION=$(pnpm --version 2>/dev/null || echo "unknown")
        echo "✅ pnpm installed successfully (version: $PNPM_VERSION)"
    else
        echo "❌ Failed to verify pnpm installation"
        exit 1
    fi
    echo ""
fi

# Ask for confirmation before installing project dependencies
echo "📦 Step 1: Install project dependencies"
echo "   This will run: pnpm install"
echo ""
read -p "Do you want to continue? (y/n) " -r

if [[ ! $REPLY =~ ^[Yy]([Ee][Ss])?$ ]]; then
    echo "❌ Installation cancelled by user"
    exit 0
fi

# Install project dependencies
echo ""
echo "📦 Installing project dependencies..."
echo "   Running: pnpm install"
pnpm install

# Ask for confirmation before running installation script
echo ""
echo "🔧 Step 2: Run installation script"
echo "   This will run: pnpm run install-deps"
echo "   This will check for: typescript, and optionally docker"
echo ""
read -p "Do you want to continue? (y/n) " -r

if [[ ! $REPLY =~ ^[Yy]([Ee][Ss])?$ ]]; then
    echo "❌ Installation cancelled by user"
    exit 0
fi

# Run your existing installation script
echo ""
echo "🔧 Running installation script..."
echo "   Running: pnpm run install-deps"
pnpm run install-deps

echo ""
echo "✅ Installation complete!"
echo " ℹ️ Next: Run 'pnpm run setup' to configure your application"

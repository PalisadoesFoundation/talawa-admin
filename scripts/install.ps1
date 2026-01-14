Write-Host "🚀 Starting Talawa installation..."
Write-Host ""

$ErrorActionPreference = 'Stop'

# Function to install fnm (Fast Node Manager)
function Install-Fnm {
    Write-Host "📦 Installing fnm (Fast Node Manager)..." -ForegroundColor Yellow
    
    # Check if fnm already exists
    $fnmCommand = Get-Command fnm -ErrorAction SilentlyContinue
    if ($fnmCommand) {
        Write-Host "✅ fnm is already installed" -ForegroundColor Green
        return $true
    }
    
    # Try winget first
    try {
        $wingetCommand = Get-Command winget -ErrorAction SilentlyContinue
        if ($wingetCommand) {
            winget install Schniz.fnm --silent | Out-Null
            Write-Host "✅ fnm installed successfully via winget" -ForegroundColor Green
            
            # Activate fnm in current session
            fnm env --use-on-cd | Out-String | Invoke-Expression
            return $true
        }
    } catch {
        Write-Host "⚠️  winget installation failed, trying chocolatey..." -ForegroundColor Yellow
    }
    
    # Try chocolatey
    try {
        $chocoCommand = Get-Command choco -ErrorAction SilentlyContinue
        if ($chocoCommand) {
            choco install fnm -y | Out-Null
            Write-Host "✅ fnm installed successfully via chocolatey" -ForegroundColor Green
            
            # Activate fnm in current session
            fnm env --use-on-cd | Out-String | Invoke-Expression
            return $true
        }
    } catch {
        Write-Host "❌ Failed to install fnm" -ForegroundColor Red
        Write-Host "⚠️  Please install fnm manually from: https://github.com/Schniz/fnm" -ForegroundColor Yellow
        return $false
    }
    
    Write-Host "❌ No package manager available (winget/choco)" -ForegroundColor Red
    return $false
}

# Function to install Node.js via fnm
function Install-Node {
    Write-Host "📦 Installing Node.js via fnm..." -ForegroundColor Yellow
    
    # Ensure fnm is installed
    if (-not (Install-Fnm)) {
        Write-Host "❌ Cannot install Node.js without fnm" -ForegroundColor Red
        exit 1
    }
    
    # Install and activate Node.js v22.x (repository standard)
    try {
        fnm install 22 | Out-Null
        fnm use --install-if-missing 22 | Out-Null
        
        $nodeVersion = node --version 2>$null
        Write-Host "✅ Node.js installed successfully (version: $nodeVersion)" -ForegroundColor Green
        Write-Host "⚠️  Add to your PowerShell profile:" -ForegroundColor Yellow
        Write-Host '    fnm env --use-on-cd | Out-String | Invoke-Expression' -ForegroundColor Yellow
        return $true
    } catch {
        Write-Host "❌ Failed to install Node.js" -ForegroundColor Red
        exit 1
    }
}

Write-Host "🔍 Checking for pnpm..." -ForegroundColor Cyan
$pnpmCommand = Get-Command pnpm -ErrorAction SilentlyContinue

if ($pnpmCommand) {
    try {
        $pnpmVersion = pnpm --version 2>$null
        if ($pnpmVersion) {
            Write-Host "✅ pnpm is already installed (version: $pnpmVersion)" -ForegroundColor Green
        } else {
            Write-Host "✅ pnpm is already installed" -ForegroundColor Green
        }
    } catch {
        Write-Host "✅ pnpm is already installed" -ForegroundColor Green
    }
    Write-Host ""
} else {
    Write-Host "❌ pnpm is not installed" -ForegroundColor Red
    Write-Host "📦 Installing pnpm via Corepack..." -ForegroundColor Yellow
    
    # 1) Ensure Node.js is installed
    $nodeCommand = Get-Command node -ErrorAction SilentlyContinue
    if (-not $nodeCommand) {
        Write-Host "❌ Node.js is not installed" -ForegroundColor Red
        Write-Host "📦 Installing Node.js automatically via fnm..." -ForegroundColor Yellow
        Write-Host ""
        Install-Node
    } else {
        try {
            $nodeVersion = node --version 2>$null
            if ($nodeVersion) {
                Write-Host "✅ Node.js is installed (version: $nodeVersion)" -ForegroundColor Green
            } else {
                Write-Host "✅ Node.js is installed" -ForegroundColor Green
            }
        } catch {
            Write-Host "✅ Node.js is installed" -ForegroundColor Green
        }
    }
    
    # 2) Ensure Corepack is available and enable it
    $corepackCommand = Get-Command corepack -ErrorAction SilentlyContinue
    if (-not $corepackCommand) {
        Write-Host "❌ Corepack is not available" -ForegroundColor Red
        Write-Host "⚠️  Corepack comes with Node.js >= 16.9. Please upgrade Node.js." -ForegroundColor Yellow
        exit 1
    }
    try {
        corepack enable | Out-Null
        Write-Host "✅ Corepack enabled" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to enable Corepack" -ForegroundColor Red
        Write-Host "⚠️  Try running 'corepack enable' in an elevated PowerShell session" -ForegroundColor Yellow
        exit 1
    }
    
    # 3) Prepare and activate pnpm version as defined in package.json (respects `packageManager`)
    try {
        $pkgJsonPath = Join-Path $PSScriptRoot "..\package.json"
        $pnpmSpec = $null
        if (Test-Path $pkgJsonPath) {
            $pkg = Get-Content -Raw -Path $pkgJsonPath | ConvertFrom-Json
            if ($pkg.packageManager) {
                $pnpmSpec = $pkg.packageManager
            }
        }
        if (-not $pnpmSpec) {
            $pnpmSpec = "pnpm@latest"
            Write-Host "⚠️  packageManager not found in package.json; falling back to $pnpmSpec" -ForegroundColor Yellow
        } else {
            Write-Host "📦 Using package manager from package.json: $pnpmSpec" -ForegroundColor Cyan
        }
        corepack prepare $pnpmSpec --activate | Out-Null
    } catch {
        Write-Host "❌ Corepack failed to prepare $pnpmSpec" -ForegroundColor Red
        Write-Host "⚠️  You can try: corepack prepare $pnpmSpec --activate" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host ""
    Write-Host "🔍 Verifying pnpm installation..." -ForegroundColor Cyan
    
    $pnpmCommand = Get-Command pnpm -ErrorAction SilentlyContinue
    if ($pnpmCommand) {
        try {
            $pnpmVersion = pnpm --version 2>$null
            if ($pnpmVersion) {
                Write-Host "✅ pnpm installed successfully (version: $pnpmVersion)" -ForegroundColor Green
            } else {
                Write-Host "✅ pnpm installed successfully" -ForegroundColor Green
            }
        } catch {
            Write-Host "✅ pnpm installed successfully" -ForegroundColor Green
        }
    } else {
        Write-Host "❌ Failed to verify pnpm installation" -ForegroundColor Red
        
        # Try to suggest the exact Corepack prepare command when possible
        try {
            $pkgJsonPath = Join-Path $PSScriptRoot "..\package.json"
            if (Test-Path $pkgJsonPath) {
                $pkg = Get-Content -Raw -Path $pkgJsonPath | ConvertFrom-Json
                if ($pkg.packageManager) {
                    Write-Host "⚠️  Try: corepack prepare $($pkg.packageManager) --activate" -ForegroundColor Yellow
                } else {
                    Write-Host "⚠️  Try: corepack prepare pnpm@latest --activate" -ForegroundColor Yellow
                }
            } else {
                Write-Host "⚠️  Try: corepack prepare pnpm@latest --activate" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "⚠️  Try: corepack prepare pnpm@latest --activate" -ForegroundColor Yellow
        }
        Write-Host "ℹ️  Then re-run this script." -ForegroundColor Cyan
        exit 1
    }
    Write-Host ""
}

Write-Host "📦 Step 1: Install project dependencies" -ForegroundColor Cyan
Write-Host "   This will run: pnpm install"
Write-Host ""
$response = Read-Host "Do you want to continue? (y/n)"

if ($response -notmatch '^[Yy]([Ee][Ss])?$') {
    Write-Host "❌ Installation cancelled by user" -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "📦 Installing project dependencies..." -ForegroundColor Yellow
Write-Host "   Running: pnpm install"
pnpm install

Write-Host ""
Write-Host "🔧 Step 2: Run installation script" -ForegroundColor Cyan
Write-Host "   This will run: pnpm run install-deps"
Write-Host "   This will check for: typescript, and optionally docker"
Write-Host ""
$response = Read-Host "Do you want to continue? (y/n)"

if ($response -notmatch '^[Yy]([Ee][Ss])?$') {
    Write-Host "❌ Installation cancelled by user" -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "🔧 Running installation script..." -ForegroundColor Yellow
Write-Host "   Running: pnpm run install-deps"
pnpm run install-deps

Write-Host ""
Write-Host "✅ Installation complete!" -ForegroundColor Green
Write-Host "ℹ️ Next: Run 'pnpm run setup' to configure your application" -ForegroundColor Cyan


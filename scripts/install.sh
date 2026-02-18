#!/bin/bash
# Backwards-compatible wrapper for the modular install script.
# Delegates all arguments to scripts/install/install.sh
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec "$HERE/install/install.sh" "$@"

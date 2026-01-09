#!/usr/bin/env bash

# Define forbidden patterns
patterns=(-e '@mui/x-data-grid' -e '<DataGrid\b')

# If arguments are provided (lint-staged mode), check those files
if [ "$#" -gt 0 ]; then
  # filter for files in src/screens
  mapfile -t files < <(printf "%s\n" "$@" | grep "^src/screens/" || true)
  
  if [ "${#files[@]}" -eq 0 ]; then
    exit 0
  fi
  
  # Check for forbidden patterns in the provided files
  if rg -n "${patterns[@]}" "${files[@]}"; then
    echo "Error: Forbidden DataGrid usage detected in the above Stage files."
    echo "Please use the 'DataGridWrapper' component instead of '@mui/x-data-grid' or '<DataGrid>' directly in 'src/screens'."
    exit 1
  fi

else
  # If no arguments, recursively check src/screens (full scan/CI mode)
  # Check if any declarations exist first to avoid rg error on empty search if directory is empty (unlikely but good practice)
  if [ -d "src/screens" ]; then
    if rg -n "${patterns[@]}" src/screens/; then
      echo "Error: Forbidden DataGrid usage detected in src/screens."
      echo "Please use the 'DataGridWrapper' component instead of '@mui/x-data-grid' or '<DataGrid>' directly in 'src/screens'."
      exit 1
    fi
  fi
fi

echo "DataGrid usage check passed."
exit 0

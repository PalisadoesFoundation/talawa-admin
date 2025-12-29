#!/usr/bin/env tsx

/**
 * Linter to prevent old pagination patterns
 *
 * This script checks for deprecated pagination patterns in src/screens/**
 * and prevents commits/PRs that use them.
 *
 * Blocked patterns:
 * - paginationModel
 * - onPaginationModelChange
 * - "Rows per page" (literal string in old components)
 * - <Pagination (old MUI Pagination component)
 *
 * Use the new PaginationControl component instead:
 * import { PaginationControl } from 'shared-components/PaginationControl';
 */

import { spawnSync } from 'child_process';
import { existsSync } from 'fs';

const targetPaths = process.argv.slice(2);

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

/**
 * Deprecated pagination patterns to detect
 */
const DEPRECATED_PATTERNS = [
  {
    pattern: 'paginationModel',
    description: 'MUI DataGrid paginationModel prop',
    example: 'Use PaginationControl with currentPage prop instead',
  },
  {
    pattern: 'onPaginationModelChange',
    description: 'MUI DataGrid pagination callback',
    example: 'Use PaginationControl with onPageChange callback instead',
  },
  {
    pattern: 'Rows per page',
    description: 'Old MUI TablePagination label',
    example: 'PaginationControl has built-in "Rows per page" label',
  },
  {
    pattern: '<Pagination[\\s/>]',
    description: 'Old MUI Pagination component',
    example: 'Use PaginationControl component instead',
  },
];

/**
 * Check if ripgrep (rg) is available
 */
function isRipgrepAvailable(): boolean {
  try {
    const result = spawnSync('rg', ['--version'], { stdio: 'ignore' });
    return result.status === 0;
  } catch {
    return false;
  }
}

/**
 * Check for deprecated pagination patterns in src/screens
 */
function checkPaginationPatterns(): {
  violations: Map<string, string[]>;
  totalViolations: number;
} {
  const violations = new Map<string, string[]>();
  let totalViolations = 0;

  // Check if src/screens directory exists
  if (!existsSync('src/screens')) {
    console.log(
      `${colors.yellow}Warning: src/screens directory not found${colors.reset}`,
    );
    return { violations, totalViolations };
  }

  // Check if ripgrep is available
  if (!isRipgrepAvailable()) {
    console.error(
      `${colors.red}Error: ripgrep (rg) is not installed${colors.reset}`,
    );
    console.error(
      'Install ripgrep: https://github.com/BurntSushi/ripgrep#installation',
    );
    process.exit(1);
  }

  for (const { pattern, description } of DEPRECATED_PATTERNS) {
    try {
      // Build arguments array for ripgrep
      const args = ['-n', '-e', pattern];

      if (targetPaths.length > 0) {
        // If specific files provided, search only those files
        args.push(...targetPaths);
      } else {
        // Otherwise, search all files in src/screens
        args.push('--glob', 'src/screens/**');
      }

      const result = spawnSync('rg', args, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      // Status 0 means matches found
      if (result.status === 0 && result.stdout) {
        const lines = result.stdout.trim().split('\n');

        for (const line of lines) {
          // Parse ripgrep output: filename:lineNumber:content
          const match = line.match(/^([^:]+):(\d+):(.*)$/);
          if (match) {
            const [, filepath, lineNumber, content] = match;
            const key = `${filepath}:${lineNumber}`;

            if (!violations.has(key)) {
              violations.set(key, []);
            }

            const violationList = violations.get(key);
            if (violationList) {
              violationList.push(
                `Pattern: "${pattern}" - ${description}\n    Content: ${content.trim()}`,
              );
            }
            totalViolations++;
          }
        }
      } else if (result.status !== 1) {
        // Status 1 = no matches found, which is OK
        // Any other non-zero status is an error
        if (result.status !== undefined && result.status !== 1) {
          console.error(
            `${colors.red}Error running ripgrep:${colors.reset}`,
            result.stderr || 'Unknown error',
          );
        }
      }
    } catch (error) {
      console.error(
        `${colors.red}Error running ripgrep:${colors.reset}`,
        error,
      );
    }
  }

  return { violations, totalViolations };
}

/**
 * Print violations in a readable format
 */
function printViolations(violations: Map<string, string[]>): void {
  console.log(
    `\n${colors.red}${colors.bold}Deprecated Pagination Patterns Found${colors.reset}\n`,
  );

  const sortedFiles = Array.from(violations.keys()).sort();

  for (const fileLocation of sortedFiles) {
    const [filepath, lineNumber] = fileLocation.split(':');
    const issues = violations.get(fileLocation);

    console.log(
      `${colors.blue}${filepath}${colors.reset}:${colors.yellow}${lineNumber}${colors.reset}`,
    );

    if (issues) {
      for (const issue of issues) {
        console.log(`  ${issue}`);
      }
    }
    console.log('');
  }
}

/**
 * Print usage instructions
 */
function printInstructions(): void {
  console.log(`${colors.bold}How to fix:${colors.reset}\n`);
  console.log(
    'Replace old pagination patterns with the new PaginationControl component:\n',
  );
  console.log(
    `${colors.green}import { PaginationControl } from 'shared-components/PaginationControl';${colors.reset}\n`,
  );
  console.log('Example usage:');
  console.log(`${colors.green}
<PaginationControl
  currentPage={currentPage}
  totalPages={Math.ceil(totalItems / pageSize)}
  pageSize={pageSize}
  totalItems={totalItems}
  onPageChange={(page) => setCurrentPage(page)}
  onPageSizeChange={(size) => setPageSize(size)}
/>
${colors.reset}`);
  console.log('For more details, see:');
  console.log('  - src/shared-components/PaginationControl/README.md');
  console.log('  - GitHub Issue #5293\n');
}

/**
 * Main execution
 */
function main(): void {
  console.log(
    `${colors.bold}Checking for deprecated pagination patterns...${colors.reset}\n`,
  );

  const { violations, totalViolations } = checkPaginationPatterns();

  if (totalViolations === 0) {
    console.log(
      `${colors.green}No deprecated pagination patterns found!${colors.reset}\n`,
    );
    process.exit(0);
  }

  printViolations(violations);

  console.log(
    `${colors.red}Found ${totalViolations} violation(s) in ${violations.size} location(s)${colors.reset}\n`,
  );

  printInstructions();

  // Exit with error code to fail the check
  process.exit(1);
}

// Run the linter
main();

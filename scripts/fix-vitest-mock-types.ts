/**
 * Codemod script to fix Vitest 4.0 mock type compatibility issues
 *
 * This script finds all instances of `vi.fn()` used directly as prop values
 * and adds type assertions to make them compatible with Vitest 4.0.
 *
 * Run with: node --loader tsx scripts/fix-vitest-mock-types.ts
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const SRC_DIR = 'src';
const DRY_RUN = process.argv.includes('--dry-run');

// Patterns to fix:
// 1. prop={vi.fn()} -> prop={vi.fn() as () => void}
// 2. ReturnType<typeof vi.fn> -> () => void (in variable declarations)

const propPatterns = [
    // Common callback props that need () => void
    {
        pattern: /(\w+)={vi\.fn\(\)}(?!\s*as\s)/g,
        propNames: [
            'setAfterActive',
            'setAfterCompleted',
            'hideCreateModal',
            'hideEditModal',
            'hideDeleteModal',
            'onClose',
            'onClick',
            'onCancel',
            'onHide',
            'handleClose',
            'handleCancel',
            'toggleModal',
            'closeModal',
            'refetch',
            'onRefetch',
            'resetToast',
            'hideModal',
            'onToggle',
            'onDelete',
            'onUpdate',
            'onSave',
            'onSubmit',
            'onReset',
            'onConfirm',
            'onSuccess',
            'onError',
            'onSelect',
            'onRemove',
            'onAdd',
            'onEdit',
            'onOpen',
            'onLoad',
            'onComplete',
            'onFinish',
            'onSearch',
            'onFilter',
            'onSort',
            'onRefresh',
            'onInvitesSent',
            'showViewModal',
            'hideViewModal',
            'openModal',
            'toggle',
            'setModalState',
            'handleHide',
            'handleDelete',
            'handleUpdate',
            'handleEdit',
            'resetActionItem',
            'createActionItemHandler',
            'editCategoryHandler',
            'deleteCategoryHandler',
            'createCategoryHandler',
            'updateActionItemHandler',
            'deleteActionItemHandler',
            'setFormState',
            'createAgendaCategoryHandler',
        ],
        replacement: '$1={vi.fn() as () => void}',
    },
];

function walkDir(dir: string, callback: (file: string) => void): void {
    const files = readdirSync(dir);
    for (const file of files) {
        const filePath = join(dir, file);
        const stat = statSync(filePath);
        if (stat.isDirectory() && !file.includes('node_modules')) {
            walkDir(filePath, callback);
        } else if (file.endsWith('.spec.tsx') || file.endsWith('.spec.ts')) {
            callback(filePath);
        }
    }
}

function fixFile(filePath: string): number {
    let content = readFileSync(filePath, 'utf-8');
    let changes = 0;
    const originalContent = content;

    // Fix: prop={vi.fn()} for known void callback props
    for (const pattern of propPatterns) {
        for (const propName of pattern.propNames) {
            const regex = new RegExp(`${propName}={vi\\.fn\\(\\)}(?!\\s*as\\s)`, 'g');
            const matches = content.match(regex);
            if (matches) {
                content = content.replace(regex, `${propName}={vi.fn() as () => void}`);
                changes += matches.length;
            }
        }
    }

    // Fix: ReturnType<typeof vi.fn> in variable declarations
    const retTypeRegex = /let\s+(\w+):\s*ReturnType<typeof\s+vi\.fn>/g;
    const retTypeMatches = content.match(retTypeRegex);
    if (retTypeMatches) {
        content = content.replace(
            retTypeRegex,
            'let $1: ReturnType<typeof vi.fn> & (() => void)',
        );
        changes += retTypeMatches.length;
    }

    if (changes > 0 && content !== originalContent) {
        if (!DRY_RUN) {
            writeFileSync(filePath, content, 'utf-8');
        }
        console.log(`${DRY_RUN ? '[DRY RUN] ' : ''}Fixed ${changes} issues in ${relative(process.cwd(), filePath)}`);
    }

    return changes;
}

function main(): void {
    console.log(`${DRY_RUN ? '[DRY RUN] ' : ''}Fixing Vitest 4.0 mock type issues...\\n`);

    let totalChanges = 0;
    let filesChanged = 0;

    walkDir(SRC_DIR, (filePath) => {
        const changes = fixFile(filePath);
        if (changes > 0) {
            totalChanges += changes;
            filesChanged++;
        }
    });

    console.log(`\\n${DRY_RUN ? '[DRY RUN] Would fix' : 'Fixed'} ${totalChanges} issues in ${filesChanged} files.`);
}

main();

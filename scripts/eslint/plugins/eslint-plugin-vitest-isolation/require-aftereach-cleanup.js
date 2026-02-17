/**
 * ESLint rule to enforce afterEach cleanup in test files that use mocks
 * 
 * This rule ensures proper mock isolation by requiring afterEach blocks
 * with appropriate cleanup methods (vi.clearAllMocks, vi.restoreAllMocks, etc.)
 * in test files that use vi.fn(), vi.mock(), or vi.spyOn().
 */

module.exports = {
    meta: {
        type: 'problem',
        docs: {
            description: 'Require afterEach cleanup in test files that use mocks',
            category: 'Best Practices',
            recommended: true,
        },
        fixable: 'code',
        schema: [],
        messages: {
            missingAfterEach:
                'Test file uses mocks ({{mockTypes}}) but is missing afterEach cleanup. Add afterEach(() => { vi.clearAllMocks(); }) to prevent mock leakage.',
            missingCleanup:
                'afterEach block exists but is missing mock cleanup. Add vi.clearAllMocks() or vi.restoreAllMocks().',
            discouragedMethod:
                'Using vi.resetAllMocks() is discouraged. Consider using vi.clearAllMocks() or vi.restoreAllMocks() instead.',
        },
    },

    create(context) {
        const sourceCode = context.sourceCode;

        // Track mock usage types
        const mockUsage = {
            hasFn: false,
            hasMock: false,
            hasSpyOn: false,
        };

        // Track afterEach blocks and their cleanup methods
        let hasAfterEach = false;
        let hasCleanup = false;
        let hasResetAllMocks = false;

        /**
         * Check if a CallExpression node is a vi cleanup method
         */
        function isViCleanupCall(node) {
            if (node.type !== 'CallExpression') return null;

            const callee = node.callee;
            if (callee.type === 'MemberExpression' &&
                callee.object && callee.object.name === 'vi' &&
                callee.property) {
                const methodName = callee.property.name;
                if (methodName === 'clearAllMocks' ||
                    methodName === 'restoreAllMocks' ||
                    methodName === 'resetModules' ||
                    methodName === 'resetAllMocks') {
                    return methodName;
                }
            }
            return null;
        }

        /**
         * Walk AST to find cleanup calls in a function body
         */
        function findCleanupInBody(bodyNode) {
            const cleanupMethods = {
                clearAllMocks: false,
                restoreAllMocks: false,
                resetModules: false,
                resetAllMocks: false,
            };

            function walk(node) {
                if (!node || typeof node !== 'object') return;

                const cleanupMethod = isViCleanupCall(node);
                if (cleanupMethod) {
                    cleanupMethods[cleanupMethod] = true;
                }

                // Recursively walk children
                const keys = Object.keys(node).filter(key =>
                    key !== 'parent' && key !== 'tokens' && key !== 'loc' &&
                    key !== 'range' && key !== 'start' && key !== 'end' &&
                    key !== 'comments'
                );

                for (const key of keys) {
                    const child = node[key];
                    if (Array.isArray(child)) {
                        child.forEach(walk);
                    } else if (child && typeof child === 'object') {
                        walk(child);
                    }
                }
            }

            walk(bodyNode);
            return cleanupMethods;
        }

        return {
            // Check for vi.fn() usage
            'CallExpression[callee.object.name="vi"][callee.property.name="fn"]'() {
                mockUsage.hasFn = true;
            },

            // Check for vi.mock() usage
            'CallExpression[callee.object.name="vi"][callee.property.name="mock"]'() {
                mockUsage.hasMock = true;
            },

            // Check for vi.spyOn() or jest.spyOn() usage
            'CallExpression[callee.property.name="spyOn"]'(node) {
                if (node.callee.object &&
                    (node.callee.object.name === 'vi' || node.callee.object.name === 'jest')) {
                    mockUsage.hasSpyOn = true;
                }
            },

            // Check for afterEach blocks
            'CallExpression[callee.name="afterEach"]'(node) {
                hasAfterEach = true;

                // Get the callback function (first argument to afterEach)
                const callback = node.arguments[0];
                if (!callback) return;

                // Check callback body for cleanup using AST traversal
                if (callback.type === 'ArrowFunctionExpression' || callback.type === 'FunctionExpression') {
                    const bodyNode = callback.body;

                    if (bodyNode.type === 'BlockStatement') {
                        const cleanupMethods = findCleanupInBody(bodyNode);

                        if (cleanupMethods.clearAllMocks || cleanupMethods.restoreAllMocks || cleanupMethods.resetModules) {
                            hasCleanup = true;
                        }

                        if (cleanupMethods.resetAllMocks) {
                            hasCleanup = true;
                            hasResetAllMocks = true;
                        }
                    } else {
                        // Single expression arrow function
                        const cleanupMethod = isViCleanupCall(bodyNode);
                        if (cleanupMethod) {
                            hasCleanup = true;
                            if (cleanupMethod === 'resetAllMocks') {
                                hasResetAllMocks = true;
                            }
                        }
                    }
                }
            },


            // At the end of the program, check if mocks were used and cleanup exists
            'Program:exit'(node) {
                const hasMocks = mockUsage.hasFn || mockUsage.hasMock || mockUsage.hasSpyOn;

                if (!hasMocks) {
                    // No mocks used, no cleanup needed
                    return;
                }

                // Build mock types string for error message
                const mockTypes = [];
                if (mockUsage.hasFn) mockTypes.push('vi.fn()');
                if (mockUsage.hasMock) mockTypes.push('vi.mock()');
                if (mockUsage.hasSpyOn) mockTypes.push('vi.spyOn()');

                if (!hasAfterEach && !hasCleanup) {
                    // No afterEach block at all
                    context.report({
                        node,
                        messageId: 'missingAfterEach',
                        data: {
                            mockTypes: mockTypes.join(', '),
                        },
                        fix(fixer) {
                            // Find the first describe block to insert afterEach
                            const firstDescribe = findFirstDescribeBlock(node);

                            if (firstDescribe && firstDescribe.arguments[1]) {
                                const callback = firstDescribe.arguments[1];
                                if (callback.body && callback.body.type === 'BlockStatement') {
                                    // Insert afterEach at the beginning of describe block
                                    const describeBody = callback.body.body;

                                    let insertPosition;
                                    let insertionNewline = '';

                                    if (describeBody.length > 0) {
                                        // Insert before the first statement (after any leading comments)
                                        const node = describeBody[0];
                                        // Check for comments before the node to ensure we insert after them
                                        const comments = sourceCode.getCommentsBefore(node);
                                        if (comments.length > 0) {
                                            insertPosition = comments[comments.length - 1].range[1];
                                            insertionNewline = '\n\n';
                                        } else {
                                            const firstToken = sourceCode.getFirstToken(node);
                                            insertPosition = firstToken.range[0];
                                        }
                                    } else {
                                        insertPosition = callback.body.range[0] + 1;
                                    }

                                    // Detect indentation from the first statement or describe block
                                    let baseIndent = '  '; // Default to 2 spaces
                                    let nextItemIndent = '';
                                    let leadingText = '';

                                    if (describeBody.length > 0) {
                                        // Get indentation from first statement in describe
                                        const firstStmt = describeBody[0];

                                        const lineStart = sourceCode.getIndexFromLoc({ line: firstStmt.loc.start.line, column: 0 });
                                        const stmtStart = firstStmt.range[0];
                                        leadingText = sourceCode.text.substring(lineStart, stmtStart);
                                        const match = leadingText.match(/^(\s+)/);
                                        if (match) {
                                            baseIndent = match[1];
                                            nextItemIndent = match[1];
                                        }
                                    } else {
                                        // Get indentation from describe callback opening brace
                                        const descLineStart = sourceCode.getIndexFromLoc({ line: callback.body.loc.start.line + 1, column: 0 });
                                        const nextLineStart = sourceCode.text.indexOf('\n', callback.body.range[0]) + 1;
                                        if (nextLineStart > 0 && nextLineStart < sourceCode.text.length) {
                                            const leadingMatch = sourceCode.text.substring(nextLineStart).match(/^(\s+)/);
                                            if (leadingMatch) {
                                                baseIndent = leadingMatch[1];

                                                // If the next line is the closing brace/parenthesis, we've captured the outer indentation.
                                                // We need to add one level of indentation for the inner content.
                                                const nextLineEnd = sourceCode.text.indexOf('\n', nextLineStart);
                                                const lineContent = sourceCode.text.substring(nextLineStart, nextLineEnd !== -1 ? nextLineEnd : undefined).trim();

                                                if (lineContent.startsWith('}') || lineContent.startsWith('})')) {
                                                    baseIndent += '  ';
                                                }
                                            }
                                        }
                                    }

                                    // Build properly indented afterEach block
                                    // i18n-ignore-next-line: code template, not user-facing text
                                    let afterEachCode;

                                    if (describeBody.length > 0) {
                                        // When inserting before content, don't start with newline (as we follow indentation),
                                        // but end with double newline and restore indentation for the next item.

                                        let prefix = '';
                                        if (insertionNewline) {
                                            prefix = insertionNewline + baseIndent;
                                        } else if (leadingText.length === 0) {
                                            prefix = baseIndent;
                                        }

                                        // If we are inserting after a comment (insertionNewline is set), we are at the end of a line,
                                        // so the existing newline will follow our insertion. We only need one newline at the end of our block
                                        // to combine with the existing one to create an empty line.
                                        // If we are inserting at the start of a statement (no comment), we consume the indentation but not a newline,
                                        // so we need two newlines to create an empty line.
                                        const suffix = insertionNewline ? '\n' : '\n\n';

                                        // If using insertionNewline, we rely on existing indentation of the next line, so no trailing indent needed.
                                        const trailingIndent = insertionNewline ? '' : nextItemIndent;

                                        afterEachCode = `${prefix}afterEach(() => {\n${baseIndent}  vi.clearAllMocks();\n${baseIndent}});${suffix}${trailingIndent}`;
                                    } else {
                                        // When inserting into empty block, start with newline and end with single newline (as existing closing brace logic adds one).
                                        afterEachCode = `\n${baseIndent}afterEach(() => {\n${baseIndent}  vi.clearAllMocks();\n${baseIndent}});\n`;
                                    }

                                    return fixer.insertTextBeforeRange([insertPosition, insertPosition], afterEachCode);
                                }
                            }

                            // Fallback: Insert at end of program (less ideal)
                            return null;
                        },
                    });
                } else if (hasAfterEach && !hasCleanup) {
                    // afterEach exists but doesn't have cleanup - find it and add cleanup
                    const afterEachNode = findAfterEachNode(node);

                    context.report({
                        node,
                        messageId: 'missingCleanup',
                        fix(fixer) {
                            if (!afterEachNode) return null;

                            const callback = afterEachNode.arguments[0];
                            if (!callback) return null;

                            // Handle different callback body types
                            if (callback.type === 'ArrowFunctionExpression' || callback.type === 'FunctionExpression') {
                                const bodyNode = callback.body;

                                if (bodyNode.type === 'BlockStatement') {
                                    // Insert cleanup at the end of the existing block
                                    const closingBrace = bodyNode.range[1] - 1;
                                    const bodyStatements = bodyNode.body;

                                    // Detect indentation from existing statements or callback
                                    let stmtIndent = '    '; // Default fallback

                                    if (bodyStatements.length > 0) {
                                        const firstStmt = bodyStatements[0];
                                        const lineStart = sourceCode.getIndexFromLoc({ line: firstStmt.loc.start.line, column: 0 });
                                        const stmtStart = firstStmt.range[0];
                                        const leadingText = sourceCode.text.substring(lineStart, stmtStart);
                                        const match = leadingText.match(/^(\s+)/);
                                        if (match) {
                                            stmtIndent = match[1];
                                        }
                                    } else {
                                        // Empty block: derive indentation from callback
                                        const lineStart = sourceCode.getIndexFromLoc({ line: callback.loc.start.line, column: 0 });
                                        const callbackStart = callback.range[0];
                                        const leadingText = sourceCode.text.substring(lineStart, callbackStart);
                                        const match = leadingText.match(/^(\s+)/);
                                        const parentIndent = match ? match[1] : '';
                                        stmtIndent = parentIndent + '  ';
                                    }

                                    // i18n-ignore-next-line: code template, not user-facing text
                                    // Capture indentation before closing brace to restore it
                                    let braceIndent = '\n';
                                    const textBeforeBrace = sourceCode.text.slice(Math.max(0, closingBrace - 20), closingBrace);
                                    const match = textBeforeBrace.match(/(\n\s*)$/);
                                    if (match) {
                                        braceIndent = match[1];
                                    } else {
                                        // Inline block: brace should be on new line with parent indentation
                                        const lineStart = sourceCode.getIndexFromLoc({ line: callback.loc.start.line, column: 0 });
                                        const callbackStart = callback.range[0];
                                        const leadingText = sourceCode.text.substring(lineStart, callbackStart);
                                        const matchIndent = leadingText.match(/^(\s+)/);
                                        const parentIndent = matchIndent ? matchIndent[1] : '';
                                        braceIndent = '\n' + parentIndent;
                                    }

                                    let rangeStart;
                                    let textBetween;

                                    if (bodyStatements.length > 0) {
                                        const lastStmt = bodyStatements[bodyStatements.length - 1];
                                        rangeStart = lastStmt.range[1];
                                        textBetween = sourceCode.text.substring(rangeStart, closingBrace);
                                    } else {
                                        // If no statements, rangeStart is after the opening brace
                                        rangeStart = bodyNode.range[0] + 1;
                                        textBetween = sourceCode.text.substring(rangeStart, closingBrace);
                                    }

                                    const rangeEnd = closingBrace;

                                    // If there are comments or non-whitespace between last statement and closing brace,
                                    // we should append instead of replace to avoid deleting comments.
                                    if (textBetween.trim().length > 0) {
                                        // Check for trailing whitespace (indentation before closing brace)
                                        const matchTrailing = textBetween.match(/(\s+)$/);
                                        if (matchTrailing) {
                                            // Replace the trailing whitespace with our new code
                                            const whitespaceStart = closingBrace - matchTrailing[1].length;
                                            return fixer.replaceTextRange([whitespaceStart, closingBrace], `\n\n${stmtIndent}vi.clearAllMocks();${braceIndent}`);
                                        } else {
                                            return fixer.insertTextBeforeRange([closingBrace, closingBrace], `\n\n${stmtIndent}vi.clearAllMocks();${braceIndent}`);
                                        }
                                    } else {
                                        // Replace the whitespace to ensure clean formatting (avoid double newlines)
                                        // Preserve any trailing spaces on the same line as the statement
                                        const matchPrefix = textBetween.match(/^([^\n\r]*)/);
                                        const prefix = matchPrefix ? matchPrefix[1] : '';

                                        // Preserve vertical limits (blank lines)
                                        const newlineCount = (textBetween.match(/\n/g) || []).length;
                                        const separator = newlineCount >= 1 ? '\n\n' : '\n';

                                        return fixer.replaceTextRange([rangeStart, rangeEnd], `${prefix}${separator}${stmtIndent}vi.clearAllMocks();${braceIndent}`);
                                    }
                                } else {
                                    // Single expression arrow function - would need to convert to block
                                    // For now, skip autofix for this case as it's more complex
                                    return null;
                                }
                            }

                            return null;
                        },
                    });
                } else if (hasResetAllMocks) {
                    // Using discouraged method
                    context.report({
                        node,
                        messageId: 'discouragedMethod',
                    });
                }
            },
        };

        /**
         * Find the first afterEach block in the AST
         */
        function findAfterEachNode(node) {
            let afterEachNode = null;
            const visited = new WeakSet();

            function traverse(n) {
                if (!n || typeof n !== 'object' || visited.has(n)) {
                    return;
                }
                visited.add(n);

                if (n.type === 'CallExpression' &&
                    n.callee && n.callee.name === 'afterEach' &&
                    !afterEachNode) {
                    afterEachNode = n;
                    return;
                }

                const keys = Object.keys(n).filter(key =>
                    key !== 'parent' && key !== 'tokens' && key !== 'loc' &&
                    key !== 'range' && key !== 'start' && key !== 'end' &&
                    key !== 'comments'
                );

                for (const key of keys) {
                    const child = n[key];
                    if (Array.isArray(child)) {
                        child.forEach(traverse);
                    } else if (child && typeof child === 'object') {
                        traverse(child);
                    }
                }
            }

            traverse(node);
            return afterEachNode;
        }

        /**
         * Find the first describe block in the AST
         */
        function findFirstDescribeBlock(node) {
            let firstDescribe = null;
            const visited = new WeakSet();

            function traverse(n) {
                // Prevent infinite recursion from circular references
                if (!n || typeof n !== 'object' || visited.has(n)) {
                    return;
                }
                visited.add(n);

                if (n.type === 'CallExpression' &&
                    n.callee && n.callee.name === 'describe' &&
                    !firstDescribe) {
                    firstDescribe = n;
                    return;
                }

                // Use filtered keys to avoid non-AST properties
                const keys = Object.keys(n).filter(key =>
                    key !== 'parent' && key !== 'tokens' && key !== 'loc' &&
                    key !== 'range' && key !== 'start' && key !== 'end' &&
                    key !== 'comments'
                );

                for (const key of keys) {
                    const child = n[key];
                    if (Array.isArray(child)) {
                        child.forEach(traverse);
                    } else if (child && typeof child === 'object') {
                        traverse(child);
                    }
                }
            }

            traverse(node);
            return firstDescribe;
        }
    },
};

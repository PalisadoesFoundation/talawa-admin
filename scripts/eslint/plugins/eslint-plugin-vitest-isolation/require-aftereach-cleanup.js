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
                                    const insertPosition = describeBody.length > 0
                                        ? describeBody[0].range[0]
                                        : callback.body.range[0] + 1;

                                    // Detect indentation from the first statement or describe block
                                    let baseIndent = '  '; // Default to 2 spaces

                                    if (describeBody.length > 0) {
                                        // Get indentation from first statement in describe
                                        const firstStmt = describeBody[0];
                                        const lineStart = sourceCode.getIndexFromLoc({ line: firstStmt.loc.start.line, column: 0 });
                                        const stmtStart = firstStmt.range[0];
                                        const leadingText = sourceCode.text.substring(lineStart, stmtStart);
                                        const match = leadingText.match(/^(\s+)/);
                                        if (match) {
                                            baseIndent = match[1];
                                        }
                                    } else {
                                        // Get indentation from describe callback opening brace
                                        const descLineStart = sourceCode.getIndexFromLoc({ line: callback.body.loc.start.line + 1, column: 0 });
                                        const nextLineStart = sourceCode.text.indexOf('\n', callback.body.range[0]) + 1;
                                        if (nextLineStart > 0 && nextLineStart < sourceCode.text.length) {
                                            const leadingMatch = sourceCode.text.substring(nextLineStart).match(/^(\s+)/);
                                            if (leadingMatch) {
                                                baseIndent = leadingMatch[1];
                                            }
                                        }
                                    }

                                    // Build properly indented afterEach block
                                    // i18n-ignore-next-line: code template, not user-facing text
                                    const afterEachCode = `\n${baseIndent}afterEach(() => {\n${baseIndent}  vi.clearAllMocks();\n${baseIndent}});\n\n`;

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
                                    let stmtIndent = '    '; // Default to 4 spaces

                                    if (bodyStatements.length > 0) {
                                        const firstStmt = bodyStatements[0];
                                        const lineStart = sourceCode.getIndexFromLoc({ line: firstStmt.loc.start.line, column: 0 });
                                        const stmtStart = firstStmt.range[0];
                                        const leadingText = sourceCode.text.substring(lineStart, stmtStart);
                                        const match = leadingText.match(/^(\s+)/);
                                        if (match) {
                                            stmtIndent = match[1];
                                        }
                                    }

                                    // i18n-ignore-next-line: code template, not user-facing text
                                    const cleanupCode = `\n${stmtIndent}vi.clearAllMocks();`;
                                    return fixer.insertTextBeforeRange([closingBrace, closingBrace], cleanupCode);
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

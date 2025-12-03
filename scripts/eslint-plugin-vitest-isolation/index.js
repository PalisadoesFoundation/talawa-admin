/**
 * ESLint plugin for Vitest test isolation enforcement
 * Ensures proper mock cleanup in test files
 */

const requireAfterEachCleanup = require('./require-aftereach-cleanup');

module.exports = {
    rules: {
        'require-aftereach-cleanup': requireAfterEachCleanup,
    },
};

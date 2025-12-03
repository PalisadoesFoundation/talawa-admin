/**
 * Custom ESLint plugin for enforcing Vitest mock isolation
 * 
 * This plugin provides rules to ensure proper test isolation by enforcing
 * cleanup of mocks, spies, and other test utilities.
 */

const requireAfterachCleanup = require('./require-aftereach-cleanup');

module.exports = {
    rules: {
        'require-aftereach-cleanup': requireAfterachCleanup,
    },
};

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/locales/en/common.json');

// Helper to check camelCase
const isCamelCase = (str) => {
    // Regex: starts with lowercase, contains no spaces, can contain dots for nesting
    // but strictly speaking, the key segments should be camelCase.
    // The bash script checked: '[A-Z][a-z]+\s[A-Z]' which implies spaces or TitleCase words.
    // We'll enforce: strictly no spaces, and must not start with Uppercase.
    return /^[a-z][a-zA-Z0-9]*$/.test(str);
};

// Recursive function to traverse keys
const findInvalidKeys = (obj, prefix = '') => {
    let invalid = [];

    for (const key in obj) {
        // Only check leaf nodes (strings) or keys themselves?
        // The bash script did `paths(type == "string")`.
        // We strictly check the key itself.

        if (!isCamelCase(key)) {
            invalid.push(prefix + key);
        }

        if (typeof obj[key] === 'object' && obj[key] !== null) {
            invalid = invalid.concat(findInvalidKeys(obj[key], prefix + key + '.'));
        }
    }
    return invalid;
};

console.log('Checking i18n key naming conventions...');

try {
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        process.exit(1);
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);

    const invalidKeys = findInvalidKeys(json);

    if (invalidKeys.length > 0) {
        console.error('❌ Found non-camelCase keys:');
        invalidKeys.forEach(k => console.error(` - ${k}`));
        process.exit(1);
    } else {
        console.log('✅ All keys follow camelCase convention');
    }
} catch (error) {
    console.error('❌ Error processing file:', error.message);
    process.exit(1);
}

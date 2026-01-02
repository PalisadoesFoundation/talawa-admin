import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read translation keys from locale files
const readTranslationKeys = (lang = 'en') => {
  const localesPath = path.join(__dirname, '..', 'public', 'locales', lang);
  const translationPath = path.join(localesPath, 'translation.json');

  if (!fs.existsSync(translationPath)) {
    console.error(`Translation file not found: ${translationPath}`);
    return {};
  }

  const content = fs.readFileSync(translationPath, 'utf8');
  return JSON.parse(content);
};

// Get all keys from nested object
const getAllKeys = (obj, prefix = '') => {
  let keys = [];

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(fullKey);
      keys = keys.concat(getAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }

  return keys;
};

// Find translation usage in files
const findTranslationUsage = (directory, filePattern = /\.(tsx?|jsx?)$/) => {
  const usedKeys = new Set();

  const scanDirectory = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        // Skip node_modules and other non-source directories
        if (!['node_modules', 'build', 'dist', '.git'].includes(entry.name)) {
          scanDirectory(fullPath);
        }
      } else if (filePattern.test(entry.name)) {
        const content = fs.readFileSync(fullPath, 'utf8');

        // Match t('key') or t("key") or t(`key`)
        const matches = content.matchAll(/\bt\s*\(\s*['"`]([^'"`]+)['"`]/g);

        for (const match of matches) {
          usedKeys.add(match[1]);
        }
      }
    }
  };

  scanDirectory(directory);
  return usedKeys;
};

const main = () => {
  const translations = readTranslationKeys();
  const allKeys = getAllKeys(translations);

  console.log(`Total translation keys: ${allKeys.length}`);

  // Check usage in specific directories
  const srcPath = path.join(__dirname, '..', 'src');
  const usedKeys = findTranslationUsage(srcPath);

  console.log(`Used translation keys: ${usedKeys.size}`);

  // Find unused keys
  const unusedKeys = allKeys.filter((key) => !usedKeys.has(key));

  console.log(`\nUnused keys (${unusedKeys.length}):`);
  unusedKeys.forEach((key) => console.log(`  - ${key}`));

  // Organize keys by namespace
  const namespaces = {};
  for (const key of usedKeys) {
    const [namespace] = key.split('.');
    if (!namespaces[namespace]) {
      namespaces[namespace] = [];
    }
    namespaces[namespace].push(key);
  }

  console.log('\n\nKeys by namespace:');
  for (const [namespace, keys] of Object.entries(namespaces)) {
    console.log(`\n${namespace}: ${keys.length} keys`);
  }
};

main();

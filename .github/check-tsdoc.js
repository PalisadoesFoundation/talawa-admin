import fs from 'fs';
import path from 'path';

// List of files to skip
const filesToSkip = [
    'index.tsx', 
    'EventActionItems.tsx',
    'OrgPostCard.tsx',
    'UsersTableItem.tsx',
    'FundCampaignPledge.tsx'
];

// Recursively find all .tsx files, excluding files listed in filesToSkip
function findTsxFiles(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat && stat.isDirectory()) {
        results = results.concat(findTsxFiles(filePath));
      } else if (
        filePath.endsWith('.tsx') &&
        !filePath.endsWith('.test.tsx') &&
        !filesToSkip.includes(path.relative(dir, filePath))
      ) {
        results.push(filePath);
      }
    });
  } catch (err) {
    console.error(`Error reading directory ${dir}: ${err.message}`);
  }
  return results;
}

// Check if a file contains at least one TSDoc comment
function containsTsDocComment(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return /\/\*\*[\s\S]*?\*\//.test(content);
  } catch (err) {
    console.error(`Error reading file ${filePath}: ${err.message}`);
    return false;
  }
}

// Main function to run the validation
function run() {
  const dir = process.argv[2] || './src'; // Allow directory path as a command-line argument
  const files = findTsxFiles(dir);
  let allValid = true;

  files.forEach((file) => {
    if (!containsTsDocComment(file)) {
      console.error(`No TSDoc comment found in file: ${file}`);
      allValid = false;
    }
  });

  if (!allValid) {
    process.exit(1);
  }
}

run();
import fs from 'fs';
import path from 'path';

const docsDir = path.resolve('./docs/docs/auto-docs');

function replaceLinks(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      replaceLinks(filePath);
    } else if (file.endsWith('.md')) {
      let content = fs.readFileSync(filePath, 'utf8');
      content = content
    // Normalize all path separators
    .replace(/\\(?! )/g, '/')
    // Handle nested interface references
    .replace(/\(([\w\/-]+)\/README.md(#.*?)?\)/g, '/auto-docs/$1$2')
    // Fix cross-module type references
    .replace(/\(types\/([\w\/-]+)\/(interface|type)\/([\w\/-]+).md\)/g, '/auto-docs/types/$1/$2/$3')
    // Resolve utility references
    .replace(/\(utils\/([\w\/-]+)\/([\w\/-]+).md\)/g, '/auto-docs/utils/$1/$2');

      // Replace any README.md links with root directory ("/")
      content = content.replace(/\[.*?\]\((.*?)README\.md\)/g, (match) => {
        return '[Admin Docs](/)'; // Redirect broken links to the root
      });

      fs.writeFileSync(filePath, content, 'utf8');
    }
  });
}

replaceLinks(docsDir);

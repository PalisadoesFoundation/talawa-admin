import fs from 'fs';
import path from 'path';

const docsDir = path.resolve('./docs/docs/auto-docs');
const mainRepoUrl =
  'https://github.com/PalisadoesFoundation/talawa-admin/blob/main/';

function replaceRepoUrl(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      replaceRepoUrl(filePath);
    } else if (file.endsWith('.md')) {
      let content = fs.readFileSync(filePath, 'utf8');

      // Robustly replace the "Defined in" link by constructing it from the label
      // Label format: [src/path/to/file.ts:43]
      content = content.replace(
        /Defined in: \[(.*?)\]\((.*?)\)/g,
        (match, label, oldUrl) => {
          const parts = label.split(':');
          if (parts.length === 2) {
            const [filePath, line] = parts;
            // Construct the canonical URL: base + path + #L + line
            const newUrl = `${mainRepoUrl}${filePath}#L${line}`;
            return `Defined in: [${label}](${newUrl})`;
          }
          return match;
        }
      );

      fs.writeFileSync(filePath, content, 'utf8');
    }
  });
}

replaceRepoUrl(docsDir);

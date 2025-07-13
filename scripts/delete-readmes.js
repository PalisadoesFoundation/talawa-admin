
import fs from 'fs';
import path from 'path';

const directory = 'docs/docs/auto-docs';

function deleteReadmeFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory not found: ${dir}`);
    return;
  }

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.lstatSync(filePath);

    if (stat.isDirectory()) {
      deleteReadmeFiles(filePath);
    } else if (path.basename(filePath) === 'README.md') {
      fs.unlinkSync(filePath);
      console.log(`Deleted: ${filePath}`);
    }
  });
}

deleteReadmeFiles(directory);

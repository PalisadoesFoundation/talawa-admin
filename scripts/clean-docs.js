const fs = require('fs');
const path = require('path');

const autodocsPath = path.join(__dirname, '..', 'docs', 'docs', 'auto-docs');

// Function to recursively find and delete README.md files
function deleteReadmeFiles(directory) {
  const files = fs.readdirSync(directory);

  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Recursively search subdirectories
      deleteReadmeFiles(filePath);
    } else if (file.toLowerCase() === 'readme.md') {
      // Delete README.md files
      fs.unlinkSync(filePath);
      console.log(`Deleted: ${filePath}`);
    }
  });
}

try {
  if (fs.existsSync(autodocsPath)) {
    deleteReadmeFiles(autodocsPath);
    console.log(
      'Successfully cleaned up README.md files from auto-docs directory',
    );
  } else {
    console.log('auto-docs directory not found');
  }
} catch (error) {
  console.error('Error cleaning up README.md files:', error);
  process.exit(1);
}

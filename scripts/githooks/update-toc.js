import fs from 'fs';
import { execSync } from 'child_process';

const markdownFiles = fs
  .readdirSync('./')
  .filter((file) => file.endsWith('.md'));

markdownFiles.forEach((file) => {
  const command = `doctoc "${file}" --title "## Table of Contents" --github`;
  execSync(command, { stdio: 'inherit' });
});

console.log('Table of contents updated using doctoc successfully.');

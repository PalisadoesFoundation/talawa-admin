/**
 * @brief Code to install the dependencies
 * @description This code will install the dependencies
 * listed in the `package.json` file.
 */
import { readFileSync } from 'fs';
import path from 'path';
import cmgpkg from 'node-cmd';
import display_heading from './utils/heading.js';
import display_markdown from './utils/markdown.js';
import pkg from 'chalk';

const install_dependencies = async () => {
  try {
    //Display a message
    display_heading('INSTALLING PROJECT DEPENDENCIES');
    const __dirname = path.resolve();
    const data = readFileSync(
      path.join(__dirname, 'setup/markdown/Install.md'),
      'utf-8'
    );
    display_markdown(data);

    //Install the dependencies
    cmgpkg.runSync('yarn install');
    console.log(pkg.green('Project dependencies installed successfully 🎉'));
  } catch (err) {
    console.log(pkg.red('ERROR: Failed to install project dependencies ❌'));
    console.log('REASON: ', err.message);

    process.exit(1);
  }
};

export default install_dependencies;

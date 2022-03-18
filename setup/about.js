/**
 * @brief Code to display information about Talawa
 * @description This code reads the content from the
 * `About.md` file and displays it on the console. The text
 * contains basic information about the Talawa
 */

import { readFileSync } from 'fs';
import path from 'path';
import display_heading from './utils/heading.js';
import display_markdown from './utils/markdown.js';

const display_about = () => {
  //Read text from markdown file
  const __dirname = path.resolve();
  const data = readFileSync(
    path.join(__dirname, 'setup/markdown/about.md'),
    'utf-8'
  );

  //Display the text on console
  display_heading('TALAWA ADMIN');
  display_markdown(data);
};

export default display_about;

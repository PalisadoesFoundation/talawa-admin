/**
 * @function to display the content of a markdown file
 */
import { marked } from 'marked';
import TerminalRenderer from 'marked-terminal';

marked.setOptions({
  renderer: new TerminalRenderer(),
});

const display_markdown = (text) => {
  console.log(marked(text));
};

export default display_markdown;

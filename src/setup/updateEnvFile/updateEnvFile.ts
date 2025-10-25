import fs from 'fs';

const VALID_KEY_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;

function escapeRegExp(str: string): string {
  // Escape regex metacharacters
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeEnvValue(value: string): string {
  // If value is empty, return empty string (KEY=)
  if (!value) return '';

  // Check if value needs quoting
  const needsQuoting = /[\s#="\\]|^[\s"]|[\s"]$/.test(value);

  if (!needsQuoting) return value;

  // Escape backslashes and quotes, then wrap in quotes
  return `"${value.replace(/["\\]/g, '\\$&')}"`;
}

const updateEnvFile = (key: string, value: string): void => {
  if (!VALID_KEY_RE.test(key)) {
    throw new Error(`Invalid env key: ${key}`);
  }

  try {
    const content = fs.existsSync('.env')
      ? fs.readFileSync('.env', 'utf8')
      : '';

    const eKey = escapeRegExp(key);

    // Remove any existing lines for this key (commented or not), CRLF-safe
    const removePattern = new RegExp(`^\\s*#? *${eKey}=.*(?:\r?\n|$)`, 'mg');
    let newContent = content.replace(removePattern, '');

    // Collapse multiple blank lines to at most two
    newContent = newContent.replace(/(\r?\n){3,}/g, '\n\n');

    // Ensure file ends with a single newline
    if (newContent.length > 0 && !/\r?\n$/.test(newContent)) {
      newContent += '\n';
    }

    // Append the new key=value line, properly escaped
    newContent += `${key}=${escapeEnvValue(value)}\n`;

    fs.writeFileSync('.env', newContent, 'utf8');
  } catch (err) {
    console.error('Error updating the .env file:', err);
    // propagate so callers can handle/abort
    throw err;
  }
};

export default updateEnvFile;

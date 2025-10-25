import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

export function checkEnvFile(): boolean {
  if (!fs.existsSync('.env')) {
    if (fs.existsSync('.env.example')) {
      fs.writeFileSync('.env', '', 'utf8');
    } else {
      console.error('Setup requires .env.example to proceed.\n');
      return false;
    }
  }
  return true;
}

export function modifyEnvFile(): void {
  try {
    // Read current .env (if exists) and example
    const currentEnv = fs.existsSync('.env')
      ? dotenv.parse(fs.readFileSync('.env', 'utf8'))
      : {};
    const exampleText = fs.readFileSync('.env.example', 'utf8');

    // Helper: parse .env.example to capture the order and comments for keys
    type ExampleEntry = { key: string; commentLines: string[] };
    const exampleEntries: ExampleEntry[] = [];
    const lines = exampleText.split(/\r?\n/);
    let commentBuffer: string[] = [];
    for (const line of lines) {
      if (line.trim().startsWith('#')) {
        // store comment without leading '#'
        commentBuffer.push(line.replace(/^\s*#\s?/, '').trim());
      } else if (/^[A-Z0-9_]+=/.test(line)) {
        const key = line.split('=')[0].trim();
        exampleEntries.push({ key, commentLines: commentBuffer });
        commentBuffer = [];
      } else if (line.trim() === '') {
        // blank line resets comment buffer
        commentBuffer = [];
      }
    }

    // Define preferred ordering and concise descriptions for known keys
    const preferredOrder: string[] = [
      'REACT_APP_TALAWA_URL',
      'REACT_APP_USE_RECAPTCHA',
      'REACT_APP_RECAPTCHA_SITE_KEY',
      'REACT_APP_BACKEND_WEBSOCKET_URL',
      'ALLOW_LOGS',
      'PORT',
      'USE_DOCKER',
      'DOCKER_PORT',
      'REACT_APP_DOCKER_TALAWA_URL',
    ];

    const conciseDescriptions: Record<string, string> = {
      REACT_APP_TALAWA_URL: 'Talawa API GraphQL endpoint',
      REACT_APP_USE_RECAPTCHA: 'Whether to enable Google reCAPTCHA (yes/no)',
      REACT_APP_RECAPTCHA_SITE_KEY: 'Google reCAPTCHA site key',
      REACT_APP_BACKEND_WEBSOCKET_URL:
        'Backend websocket URL for real-time features',
      ALLOW_LOGS: 'Allow logging of compile-time and runtime errors (yes/no)',
      PORT: 'Port for the talawa-admin development server',
      USE_DOCKER: 'Run the app in Docker (yes/no)',
      DOCKER_PORT: 'Port to expose when running in Docker',
      REACT_APP_DOCKER_TALAWA_URL: 'Talawa API URL to use from inside Docker',
    };

    // Build final ordered list of keys to include
    const exampleKeys = exampleEntries.map((e) => e.key);
    const remainingFromExample = exampleKeys.filter(
      (k) => !preferredOrder.includes(k),
    );

    const finalOrder = [...preferredOrder, ...remainingFromExample];

    const sanitizeComment = (c: string) =>
      c
        .replace(/[\r\n]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/^#+\s*/, '');

    // Build .env content: a blank line before each comment, then a single-line comment,
    // then the key with the current value (or empty if not set). No variables are left commented out.
    let newEnvContent = '';
    for (const key of finalOrder) {
      // Find comment from concise map or example comments
      let comment = conciseDescriptions[key];
      if (!comment) {
        const entry = exampleEntries.find((e) => e.key === key);
        if (entry && entry.commentLines.length > 0) {
          // use the first non-empty comment line as concise description
          comment = entry.commentLines.find((l) => l.trim() !== '') || '';
        } else {
          comment = '';
        }
      }

      // Always include a blank line above each comment as per guideline
      newEnvContent += '\n';
      if (comment) {
        newEnvContent += `# ${sanitizeComment(comment)}\n`;
      } else {
        newEnvContent += `# ${key}\n`;
      }

      const value = Object.prototype.hasOwnProperty.call(currentEnv, key)
        ? String((currentEnv as Record<string, unknown>)[key])
        : '';
      newEnvContent += `${key}=${value}\n`;
    }

    // Write the rebuilt .env file (trim leading newline)
    fs.writeFileSync('.env', newEnvContent.replace(/^\n/, ''), 'utf8');
  } catch (error) {
    console.error('Error modifying the .env file:', error);
  }
}

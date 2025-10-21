import fs from 'fs';

// Standard function to write parameters with comments
const writeEnvParameter = (key: string, value: string, comment: string): void => {
  try {
    const envPath = '.env';
    let content = fs.readFileSync(envPath, 'utf8');
    
    // Remove any existing entries for this key (including commented versions)
    const keyPattern = new RegExp(`(^|\\n)#[^\\n]*\\n${key}=.*?(?=\\n|$)`, 'gm');
    content = content.replace(keyPattern, '');
    
    const standaloneKeyPattern = new RegExp(`(^|\\n)${key}=.*?(?=\\n|$)`, 'gm');
    content = content.replace(standaloneKeyPattern, '');
    
    // Ensure content ends with newline for proper spacing
    if (content.length > 0 && !content.endsWith('\n')) {
      content += '\n';
    }
    
    // Add spacing if file has content
    if (content.trim().length > 0) {
      content += '\n';
    }
    
    // Add comment and parameter
    content += `# ${comment}\n${key}=${value}\n`;
    
    fs.writeFileSync(envPath, content, 'utf8');
  } catch (error) {
    console.error(`Error writing ${key} to .env file:`, error);
    throw error;
  }
};

const updateEnvFile = (key: string, value: string | number, comment?: string): void => {
  try {
    const stringValue = String(value);
    
    if (comment) {
      writeEnvParameter(key, stringValue, comment);
      return;
    }
    
    // Fallback for backward compatibility (no comment provided)
    const currentEnvContent = fs.readFileSync('.env', 'utf8');
    const keyRegex = new RegExp(`^${key}=.*$`, 'm');
    
    if (keyRegex.test(currentEnvContent)) {
      const updatedEnvContent = currentEnvContent.replace(
        keyRegex,
        `${key}=${stringValue}`,
      );
      fs.writeFileSync('.env', updatedEnvContent, 'utf8');
    } else {
      fs.appendFileSync('.env', `\n${key}=${stringValue}`, 'utf8');
    }
  } catch (error) {
    console.error('Error updating the .env file:', error);
  }
};

export default updateEnvFile;
export { writeEnvParameter };
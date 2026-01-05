import { exec as execCallback } from 'child_process';
import { promisify } from 'util';

const promisifiedExec = promisify(execCallback);

// Type for the exec function
type ExecFunction = typeof promisifiedExec;

export interface IExecOptions {
  sudo?: boolean;
  cwd?: string;
  silent?: boolean;
}

export interface IExecResult {
  stdout: string;
  stderr: string;
}

// Internal dependency - can be overridden for testing
export const deps = {
  exec: promisifiedExec as ExecFunction,
};

export async function execCommand(
  command: string,
  args: string[] = [],
  options: IExecOptions = {},
): Promise<IExecResult> {
  const { sudo = false, cwd = process.cwd(), silent = false } = options;

  let fullCommand = command;
  if (args.length > 0) {
    fullCommand = `${command} ${args.join(' ')}`;
  }

  if (sudo && process.platform !== 'win32') {
    fullCommand = `sudo ${fullCommand}`; // i18n-ignore-line
  } else if (sudo && process.platform === 'win32') {
    console.warn(
      'Warning: sudo is not supported on Windows. Command will run without elevation.',
    );
  }

  try {
    if (!silent) {
      console.log(`Running: ${fullCommand}`);
    }

    const { stdout, stderr } = await deps.exec(fullCommand, {
      cwd,
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    });

    return { stdout: stdout.trim(), stderr: stderr.trim() };
  } catch (error) {
    const execError = error as { stdout?: string; stderr?: string };
    throw new Error(
      `Command failed: ${fullCommand}\n${execError.stderr || execError.stdout || error}`,
    );
  }
}

export async function commandExists(command: string): Promise<boolean> {
  try {
    if (process.platform === 'win32') {
      await execCommand('where', [command], { silent: true });
    } else {
      await execCommand('which', [command], { silent: true });
    }
    return true;
  } catch {
    return false;
  }
}

export async function checkVersion(
  command: string,
  versionFlag = '--version',
): Promise<string | null> {
  try {
    const { stdout } = await execCommand(command, [versionFlag], {
      silent: true,
    });
    return stdout.trim();
  } catch {
    return null;
  }
}

import { execCommand, commandExists, checkVersion } from '../utils/exec';
import { createSpinner, logError, logInfo, logWarning } from '../utils/logger';
import type { IOSInfo } from '../types';

export async function installGit(os: IOSInfo): Promise<void> {
  const spinner = createSpinner('Installing Git...');
  spinner.start();

  try {
    if (os.distro === 'ubuntu' || os.distro === 'debian') {
      await execCommand('apt', ['update'], { sudo: true, silent: true });
      await execCommand('apt', ['install', '-y', 'git'], {
        sudo: true,
        silent: true,
      });
    } else {
      // Try common package managers
      try {
        await execCommand('yum', ['install', '-y', 'git'], {
          sudo: true,
          silent: true,
        });
      } catch {
        await execCommand('dnf', ['install', '-y', 'git'], {
          sudo: true,
          silent: true,
        });
      }
    }
    spinner.succeed('Git installed successfully');
  } catch (error) {
    spinner.fail('Failed to install Git');
    logError(`Git installation failed: ${error}`);
    logInfo('Please install Git manually from https://git-scm.com/install/');
    throw error;
  }
}

export async function installNode(): Promise<void> {
  // NOTE: Node/fnm installation is now handled by shell installers (install.sh/install.ps1)
  // This function is kept for backward compatibility but should not be called in normal flow
  const spinner = createSpinner('Installing Node.js...');
  spinner.start();

  try {
    // Install fnm first, then use it to install Node.js
    await installFnm();

    spinner.succeed('Node.js installation initiated');
    logWarning(
      'Please run: fnm install --lts && fnm use --install-if-missing lts-latest',
    );
    logWarning(
      'Then restart your terminal or run: eval "$(fnm env --use-on-cd)"',
    );
  } catch (error) {
    spinner.fail('Failed to install Node.js');
    logError(`Node.js installation failed: ${error}`);
    throw error;
  }
}

export async function installFnm(): Promise<void> {
  // NOTE: Node/fnm installation is now handled by shell installers (install.sh/install.ps1)
  // This function is kept for backward compatibility but should not be called in normal flow
  // Check if fnm is already installed, because this function is also called from installNode() above.
  const fnmExists = await commandExists('fnm');
  if (fnmExists) {
    logInfo('fnm is already installed');
    const version = await checkVersion('fnm');
    if (version) {
      logInfo(`fnm version: ${version}`);
    }
    return; // Skip installation if already installed
  }

  const spinner = createSpinner('Installing fnm...');
  spinner.start();

  try {
    // Try curl installer first (standard method)
    await execCommand(
      'bash',
      [
        '-c',
        'curl -fsSL https://fnm.vercel.app/install | bash -s -- --install-dir "$HOME/.fnm" --skip-shell',
      ],
      {
        silent: true,
      },
    );
    spinner.succeed('fnm installed successfully');
    logWarning(
      'Please restart your terminal or run: eval "$(fnm env --use-on-cd)"',
    );
  } catch (error) {
    spinner.fail('Failed to install fnm');
    logError(`fnm installation failed: ${error}`);
    logInfo('Please install fnm manually from https://github.com/Schniz/fnm');
    throw error;
  }
}

export async function installTypeScript(): Promise<void> {
  const spinner = createSpinner('Installing TypeScript...');
  spinner.start();

  try {
    await execCommand('pnpm', ['install', '-g', 'typescript'], {
      silent: true,
    });
    spinner.succeed('TypeScript installed successfully');
  } catch (error) {
    spinner.fail('Failed to install TypeScript');
    logError(`TypeScript installation failed: ${error}`);
    throw error;
  }
}

export async function installDocker(os: IOSInfo): Promise<void> {
  const spinner = createSpinner('Installing Docker...');
  spinner.start();

  try {
    if (os.distro === 'ubuntu' || os.distro === 'debian') {
      await execCommand(
        'apt-get',
        [
          'remove',
          '-y',
          'docker',
          'docker-engine',
          'docker.io',
          'docker-compose',
          'docker-compose-v2',
          'docker-doc',
          'podman-docker',
          'containerd',
          'runc',
        ],
        { sudo: true, silent: true },
      ).catch(() => {});

      await execCommand('apt-get', ['update'], { sudo: true, silent: true });
      await execCommand(
        'apt-get',
        ['install', '-y', 'ca-certificates', 'curl'],
        { sudo: true, silent: true },
      );

      // 3. Add Docker’s official GPG key
      await execCommand('install', ['-m', '0755', '-d', '/etc/apt/keyrings'], {
        sudo: true,
        silent: true,
      });

      const gpgUrl =
        os.distro === 'debian'
          ? 'https://download.docker.com/linux/debian/gpg'
          : 'https://download.docker.com/linux/ubuntu/gpg';

      await execCommand(
        'curl',
        ['-fsSL', gpgUrl, '-o', '/etc/apt/keyrings/docker.asc'],
        { sudo: true, silent: true },
      );

      await execCommand('chmod', ['a+r', '/etc/apt/keyrings/docker.asc'], {
        sudo: true,
        silent: true,
      });

      const repoScript =
        os.distro === 'ubuntu'
          ? `cat << 'EOF' | sudo tee /etc/apt/sources.list.d/docker.sources > /dev/null
            Types: deb
            URIs: https://download.docker.com/linux/ubuntu
            Suites: $(. /etc/os-release && echo "\${UBUNTU_CODENAME:-$VERSION_CODENAME}")
            Components: stable
            Signed-By: /etc/apt/keyrings/docker.asc
            EOF`
          : `cat << 'EOF' | sudo tee /etc/apt/sources.list.d/docker.sources > /dev/null
            Types: deb
            URIs: https://download.docker.com/linux/debian
            Suites: $(. /etc/os-release && echo "$VERSION_CODENAME")
            Components: stable
            Signed-By: /etc/apt/keyrings/docker.asc
            EOF`;

      await execCommand('bash', ['-c', repoScript], { silent: true });

      await execCommand('apt-get', ['update'], { sudo: true, silent: true });

      await execCommand(
        'apt-get',
        [
          'install',
          '-y',
          'docker-ce',
          'docker-ce-cli',
          'containerd.io',
          'docker-buildx-plugin',
          'docker-compose-plugin',
        ],
        { sudo: true, silent: true },
      );

      spinner.succeed('Docker installed successfully');
      logWarning(
        'Add your user to the docker group: sudo usermod -aG docker $USER',
      );
      logWarning('Then log out and log back in for changes to take effect.');
    } else {
      throw new Error(
        'Automatic Docker installation in this script is currently implemented only for Ubuntu and Debian. For other Linux distributions, please install Docker manually: https://docs.docker.com/engine/install/',
      );
    }
  } catch (error) {
    spinner.fail('Failed to install Docker');
    logError(`Docker installation failed: ${error}`);
    logInfo(
      'Automatic Docker installation in this script is currently implemented only for Ubuntu and Debian. For other Linux distributions, please install Docker manually: https://docs.docker.com/engine/install/',
    );
    throw error;
  }
}

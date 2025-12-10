import type { IOSInfo } from '../types';
import { execCommand } from '../utils/exec';
import { createSpinner, logError, logInfo } from '../utils/logger';

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
      logInfo(
        'Add your user to the docker group: sudo usermod -aG docker $USER',
      );
      logInfo('Then log out and log back in for changes to take effect.');
    } else {
      throw new Error(
        'Automatic Docker installation in this script is currently implemented only for Ubuntu and Debian. For other Linux distributions, please install Docker manually: https://docs.docker.com/engine/install/',
      );
    }
  } catch (error) {
    spinner.fail('Failed to install Docker');
    logError(`Docker installation failed: ${error}`);
    if (os.distro !== 'ubuntu' && os.distro !== 'debian') {
      logInfo(
        'Automatic Docker installation in this script is currently implemented only for Ubuntu and Debian. For other Linux distributions, please install Docker manually: https://docs.docker.com/engine/install/',
      );
    }
    throw error;
  }
}

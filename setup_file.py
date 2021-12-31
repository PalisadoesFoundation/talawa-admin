"""Driver code for automated installation.

This program will install Talawa Admin on the system.
It executes the pre-defined commands on the shell and
then logs the output of each step.The application runs
on a virtual environment created using Python. Every
installation process shows a message - whether the
installation was successful or not.

"""

import os
import asyncio
import pathlib
import platform
from setup import utils, installation

# 1. Shift to talawa-admin Directory
path = pathlib.Path(__file__).parent.resolve()
os.chdir(path)

# 2. Display initial data
utils.display_markdown("# TALAWA-ADMIN")
with open("./setup/markdown/About.md", encoding="utf-8") as about:
    utils.display_markdown(about.read(), "white")

# 3. Installing a virtual enviroment
utils.display_markdown("# SETTING UP ENVIROMENT")
VIRTUAL_ENV_INSTALLATION_COMMAND = 'pip install virtualenv && python -m pip install -U pip'
if platform.system() == "Debian":
    VIRTUAL_ENV_INSTALLATION_COMMAND = 'sudo apt install virtualenv'
elif platform.system() == "Linux":
    VIRTUAL_ENV_INSTALLATION_COMMAND = 'sudo apt install python3-virtualenv'
asyncio.run(
    installation.run(
        VIRTUAL_ENV_INSTALLATION_COMMAND,
        "Successfully installed [bold]virtualenv[/bold] :party_popper:",
        "Failed to create a virtual environment :cross_mark:"
    )
)

# 4. Creating a virtual enviroment
VIRTUAL_ENV_CREATION_COMMAND = 'virtualenv venv'
if platform.system() != "Windows":
    VIRTUAL_ENV_CREATION_COMMAND = 'virtualenv venv -p python3'

asyncio.run(
    installation.run(
        VIRTUAL_ENV_CREATION_COMMAND,
        "Successfully created a [bold]virtual environment[/bold] :party_popper:",
        "Failed to create a virtual environment :cross_mark:"
    )
)

# 5. Activating virtual environment
VIRTUAL_ENV_PATH = '.\\venv\\Scripts\\activate'
if platform.system() != "Windows":
    VIRTUAL_ENV_PATH = '. venv/bin/activate'

asyncio.run(
    installation.run(
        VIRTUAL_ENV_PATH,
        "Successfully activated [bold]virtual environment[/bold] :party_popper:",
        "Failed to activate virtual environment :cross_mark:"
    )
)

# 6. Installation of Python packages
utils.display_markdown("# INSTALLATION OF PYTHON PACKAGES")

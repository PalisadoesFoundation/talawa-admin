"""Extended code for Automated installation

This code is a part of the Automated installation
process of the Talawa Admin. This script is executed
exclusively inside the virtual environment.

"""

import asyncio
from setup import installation, utils

#  Display message on installing python packages
utils.display_success("Successfully installed Python packages :party_popper:")

# 1. Take input of details from user
takeUserInput = input("\nDo you want to configure variables for the application\n" +
                      "This will override any existing variable.\n"+"(Enter Y for Yes, any other " +
                      "key to ignore)\n"+"-> ")

if(takeUserInput in ["y", "Y"]):
    with open("./setup/markdown/Input.md", encoding="utf-8") as user_input:
        utils.display_markdown(user_input.read(), "white")

    installation.user_input()
else:
    utils.exit_process("Installation is interrupted.")

# 2. Install Project dependencies
utils.display_markdown("# INSTALLING PROJECT DEPENDENCIES")
utils.console.print(
    "If your are installing the packages for the first time, \n" +
    "it may take a while..."
)
asyncio.run(
    installation.run(
        "yarn install",
        "Successfully installed dependencies :party_popper:",
        "Failed to install dependencies :cross_mark:"
    )
)

# 3. Start the application
utils.display_markdown("# STARTING APPLICATION")
with open("./setup/markdown/Start.md", encoding="utf-8") as user_input:
    utils.display_markdown(user_input.read(), "white")

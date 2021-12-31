"""
Functions that run during or before the installation.

These are the functions that run before the Talawa Admin is installed.
Every function has a final message associated with it - whether the execution
was successful or not.

"""

import asyncio
import validators
from setup.utils import display_success, exit_process


def user_input():
    """Takes input of credentails

        This method takes the input of credentails,
        and saves the necessary details by creating a ".env.local" file,
        if not already exists. It also checks whether all the fields
        were provided or not, else raises an error and exists the
        installation process.

        Args:
            None

        Returns:
            None
    """

    access_token = input("Access Token: ")
    refresh_token = input("Refresh Token: ")
    talawa_api_url = input("Talawa-Api URL:")

    # check if all information is provided or not
    if (not access_token) or (not refresh_token) or (not talawa_api_url):
        exit_process("Token or API URL is missing")

    # Check the Talawa-Api url
    if not validators.url(talawa_api_url):
        exit_process("Invalid Talawa-Api URL.")

    # Create a file for environment variables and save it
    with open(".env.local", "w+", encoding="utf=8") as config:
        access_token = f"ACCESS_TOKEN_SECRET={access_token}\n"
        refresh_token = f"REFRESH_TOKEN_SECRET={refresh_token}\n"
        talawa_api_url = f"TALAWA_API_URL={talawa_api_url}\n"
        data = access_token+refresh_token+talawa_api_url
        config.write(data)

    display_success(
        "Credentails configured successfully :party_popper:")


async def run(cmd, success="Success", error="Error"):
    """To run any command on the shell

    This function runs any gievn command in the shell,
    and on completion, displays a given message for success,
    or another message on encountering an error. The logs are
    also displayed on the console simultaneously.
    The function is made asynchronous using "asyncio" package,
    to ensure that for a series of commands, any latter command starts
    to be exected only after the former command has been executed.

    Args:
        cmd: String
            Command to be executed in the shell
        success: String
            Message if command executed successfully
        error: String
            Message if command failed to execute
    Returns:
        None

    """

    try:
        proc = await asyncio.create_subprocess_shell(
            cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )

        stdout, stderr = await proc.communicate()
        if stdout:
            print(f"\n{stdout.decode()}")
        if stderr:
            print(f"[stderr]\n{stderr.decode()}")

        if proc.returncode is not None:
            display_success(success)
            return
    except RuntimeError as err:
        print(err)
        exit_process(err or error)

    else:
        pass

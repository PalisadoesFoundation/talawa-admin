/*
  Utility functions.

  These are the utility functions that are necessary for
  the installation of the script that is to be executed 
  successfully and display corresponding messages.

*/

const fs = require('fs');
const prompt = require('prompt-sync')();
const validUrl = require('valid-url');
const chalk = require('chalk');

const log = console.log;

module.exports = {
  inputData: function () {
    /* 
      Takes input of credentails

      This method takes the input of credentails,
      and saves the necessary details by creating a ".env.local" file,
      if not already exists. It also checks whether all the fields
      were provided or not, else raises an error and exists the
      installation process.
      
      Args:
          None

      Returns:
          None
    */

    const talawa_api_url = prompt('Talawa-Api URL:');

    // check if all information is provided or not
    if (talawa_api_url === '') {
      log(chalk.bold.underline.red('\nAll fields were not provided.\n'));
      process.exit();
    }

    // Check the Talawa-Api url
    if (validUrl.isUri(talawa_api_url) == undefined) {
      log(chalk.bold.underline.red('\nInvalid Talawa-Api URL.\n'));
      process.exit();
    }

    // Create a file for environment variables and save it
    const data = `REACT_APP_BACKEND_ENDPOINT=${talawa_api_url}\n`;
    fs.writeFileSync('.env', data, (err) => {
      if (err) throw err;
      log(chalk.bold.underline.green('\nUser configured successfully.'));
    });
  },

  print_console: function (text, color = '#CCF381') {
    /*
      Display a message on console
      
      Displays a message on the console,
      with a given color,and green by deafult.
      
      Args:
          text: String
              Message to be displayed on the console.
          color [optional]: String
              Color of the text to be displayed on the console.
      Returns:
          None
    */

    log(chalk.bold.underline.hex(color)(text));
  },

  exit_process: function (reason) {
    /*
      Exit the process

      This runs whenever an error is encountered. It displays the
      reason of error and exits the installation process.
      
      Args:
          reason: String
              Reason or message produced by the error.
      Returns:
          None
    */

    log(chalk.bold.underline.red('\nERROR:Exiting current process.'));
    log(chalk.bold.underline.red(`\nREASON: ${reason}`));
    process.exit();
  },
};

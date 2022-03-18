/**
 * @brief Code to set the suer configuration
 * @description This code takes the user input of the required
 * environment variables and saves them inside a .env file. It also
 * checks if the MongoDB URL is valid or not
 */
import { writeFileSync } from 'fs';
import pkg from 'chalk';
import display_heading from './utils/heading.js';
import input from './utils/input.js';

/**
 * @function to convert the key-value pairs of
 * a JavaScript object into a string and each pair
 * is displayed in newline. It is used to convert the
 * user input into a string to be written in .env file
 * @parameters JavaScript object
 * @returns string
 */
const convertObjectToString = (object) => {
  let string = '';
  for (let key of Object.keys(object)) {
    string += `${key}=${object[key]}\n`;
  }

  return string;
};

/**
 * @function to take the user input and save it
 * inside a .env file, after verifying the URL
 */
const set_user_configuration = async (path) => {
  try {
    //Display message
    display_heading('USER INPUT');
    console.log(
      pkg.cyan(
        'Please select the below options to configure backend with talawa-admin. Press 1 or 2'
      )
    );
    console.log(
      '\n1. Use you own deployed Talawa backend (https://github.com/PalisadoesFoundation/talawa-api)'
    );
    console.log('2. Use backend deployed by Palisadoes Foundation\n');

    //Variables to store the user configuration details
    const questions = [
      {
        type: 'input',
        name: 'URL_CHOICE',
        message: 'Press 1 or 2 -> ',
      },
    ];

    //Take user input
    const response = await input(questions);

    //Check if all fields have been filled
    if (!response['URL_CHOICE']) {
      console.log(pkg.red('ERROR: All fields are compulsory ❌'));
      process.exit(1);
    }

    if (response.URL_CHOICE === '1') {
      console.log(
        pkg.cyan(
          'Please provide your hosted backend url (Example: http://localhost:4000/graphql)'
        )
      );
      const urlQuestions = [
        {
          type: 'input',
          name: 'REACT_APP_BACKEND_ENDPOINT',
          message: 'Enter the URL: ',
        },
      ];
      const responseUrl = await input(urlQuestions);

      //Check if all fields have been filled
      if (!responseUrl['REACT_APP_BACKEND_ENDPOINT']) {
        console.log(pkg.red('ERROR: All fields are compulsory ❌'));
        process.exit(1);
      }

      //save it in .env file
      const data = convertObjectToString(responseUrl);
      writeFileSync(path, data, { encoding: 'utf8' });
    } else {
      //save it in .env file
      const data = convertObjectToString({
        REACT_APP_BACKEND_ENDPOINT:
          'https://talawa-graphql-api.herokuapp.com/graphql',
      });
      writeFileSync(path, data, { encoding: 'utf8' });
    }

    console.log(pkg.green('User configured successfully 🎉'));
  } catch (error) {
    console.log(pkg.red('ERROR: Failed to set user configuration ❌'));
    console.log('REASON: ', error.message);
    process.exit(1);
  }
};

export default set_user_configuration;

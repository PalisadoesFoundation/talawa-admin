/**
 * @function to take user input from the console
 * @parameters questions: Array of JavaScript objects containing variables and questions
 * @returns An object of the responses of the user
 */
import pkg from 'inquirer';

const input = async (questions) => {
  const answer = await pkg.prompt(questions);
  return answer;
};

export default input;

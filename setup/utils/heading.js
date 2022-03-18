/**
 * @function to take a string and display it
 * inside a box. It is used to denote the individual
 * installation steps.
 */
import boxen from 'boxen';
import pkg from 'chalk';

const display_heading = (heading) => {
  //configuration of the box to be displayed
  const display_options = {
    float: 'center',
    padding: { left: 20, right: 20 },
    margin: 'auto',
    borderStyle: 'double',
  };

  //Display the box enveloping the given heading
  console.log(boxen(pkg.yellow(heading), display_options));
};

export default display_heading;

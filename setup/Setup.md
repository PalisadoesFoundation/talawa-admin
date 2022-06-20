# Setup

This directory contains all the scripts required to execute the **automated installation** process of Talawa-admin. Each file contains a function to complete a particular step. All the functions are asynchronous and display whether the operation has been completed successfully or not.

## Structure
```
setup
├── about.js
├── input.js
├── package_installation.js
├── start_app.js
├── user_configuration.js
├── utils.js
├── utils
│   ├── heading.js
│   ├── input.js
│   ├── markdown.js   
└── markdown
    ├── About.md
    └── Install.md
```
Let's go through each file and understand the processes running behind the hood.


## about.js
This file displays the core features of Talawa that are present in  _about_ file in the _markdown_ folder. The _display_about_ function is for reading and displaying the content.
![https://res.cloudinary.com/dtqeozivt/image/upload/v1650971714/about_2_ueefcm.png](https://res.cloudinary.com/dtqeozivt/image/upload/v1650971714/about_2_ueefcm.png)



## input.js
The following functions are performed with the help of this file:

 - **Asking for user preference if he/she wants to set up the environment variables:**
 The function used for this operation is shown here:
 
![https://res.cloudinary.com/dtqeozivt/image/upload/v1650720877/user1_jq3e7n.png](https://res.cloudinary.com/dtqeozivt/image/upload/v1650720877/user1_jq3e7n.png)


 - **Taking user response and setting the variables:**
 After taking input from the user, it is passed to the  _Set_User_Configuration.js_ file to proceed further. The _if_ block confirms whether the user wants to set up the environment variables or not.
 
 ![https://res.cloudinary.com/dtqeozivt/image/upload/v1650720877/user_2_quas0w.png](https://res.cloudinary.com/dtqeozivt/image/upload/v1650720877/user_2_quas0w.png)


--------------------------------------------------------------------------------------------------------

## package_installation.js

This file handles the installation of the dependencies. There are two main functions in it:

 -  **For displaying the message:** 

It reads data from the _Install_ file in the _markdown_ folder.

![https://res.cloudinary.com/dtqeozivt/image/upload/v1650971715/install_d6sma1.png](https://res.cloudinary.com/dtqeozivt/image/upload/v1650971715/install_d6sma1.png)

 - **For installing the dependencies:**
 The command `'yarn install` does all the work for us as shown here:
 
![https://res.cloudinary.com/dtqeozivt/image/upload/v1650971818/install_2_ixe0sy.png](https://res.cloudinary.com/dtqeozivt/image/upload/v1650971818/install_2_ixe0sy.png)

The success/ error message gets logged in a styled manner with the help of the [chalk](https://www.npmjs.com/package/chalk) package.

## start_app.js

Well, if you have finished all the installation steps, the instructions in this file will take you from here!

![https://res.cloudinary.com/dtqeozivt/image/upload/v1650972174/user3_paiupu.png](https://res.cloudinary.com/dtqeozivt/image/upload/v1650972174/user3_paiupu.png)

To start the application, run the command: `yarn serve`

If any error occurs, the try-catch block will log it.

## user_configuration.js
This file takes user input for the required variables and saves them in a .env file after the following steps:

 - Converting the user input to strings for storing in the .env file
 
 ![Image](https://res.cloudinary.com/dtqeozivt/image/upload/v1650720869/install3_e3okid.png)

- Take user input for environment variables:

A prompt will ask if you want to set up the configuration:
![https://res.cloudinary.com/dtqeozivt/image/upload/v1650972083/user_1_pkec5k.png](https://res.cloudinary.com/dtqeozivt/image/upload/v1650972083/user_1_pkec5k.png)

**Press Y** for yes. Otherwise, press any key to ignore.

There are two options by which you can configure the backend with talawa-admin:
1. Use your own deployed Talawa backend (**Press 1** in the terminal to choose this option). If you choose this option, you will be asked to enter your hosted backend URL :

![https://res.cloudinary.com/dtqeozivt/image/upload/v1650972084/user_2_tivfhs.png](https://res.cloudinary.com/dtqeozivt/image/upload/v1650972084/user_2_tivfhs.png)

2. Use backend deployed by Palisadoes Foundation (**Press 2** to choose this option.)

After verifying the URL, it is saved in a .env file, and the user is configured successfully. If an error occurs, the try-catch block logs it into the console.


## utils.js
This file contains the following utility functions that are required for successful installation:

 - Checks if all the information is provided or not. 
 - Verifies the Talawa-api URL.
 
If any of the above conditions fail, an error generates in red, and the process exits.
 
 - Creates a .env file for environment variables and saves them.
 
After the .env file gets created, a success message generates in green in the console.


## Utils
This sub-directory contains some utility functions needed throughout the installation process.

Let us walk through each file once:


### **heading.js**
The functions of this file display the headings for the installation process with _style_. The [boxen](https://www.npmjs.com/package/boxen) and [chalk](https://www.npmjs.com/package/chalk) packages add flavors to the CSS written by the developers.

![https://res.cloudinary.com/dtqeozivt/image/upload/v1650972419/heading_zflnpr.png](https://res.cloudinary.com/dtqeozivt/image/upload/v1650972419/heading_zflnpr.png)

### **markdown.js**
The contents of a markdown file get displayed with the help of the [marked](https://www.npmjs.com/package/marked) package.

![https://res.cloudinary.com/dtqeozivt/image/upload/v1650725600/display_markdown_wxsaxg.png](https://res.cloudinary.com/dtqeozivt/image/upload/v1650725600/display_markdown_wxsaxg.png)

### **input.js**
The function takes user input in the console and returns an object containing the user response with the help of the [inquirer](https://www.npmjs.com/package/inquirer) package.

![https://res.cloudinary.com/dtqeozivt/image/upload/v1650972420/input_z24a1r.png](https://res.cloudinary.com/dtqeozivt/image/upload/v1650972420/input_z24a1r.png)

## markdown
This directory contains the markdown texts displayed during the installation process.

#### About
The information about the Talawa project core features is in this file imported by the _Display_About_ file.

#### Install
This file contains the message to be displayed during the installation of project dependencies read by the _Install_Dependencies_ file.


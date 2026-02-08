#!/usr/bin/env node
import inquirer from 'inquirer';

const answers = await inquirer.prompt([
  {
    type: 'input',
    name: 'username',
    message: 'What is your name?',
  },
]);

console.log(`Hello, ${answers.username}!`);
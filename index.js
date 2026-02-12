#!/usr/bin/env node
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';

import { getModelChatSession } from './helpers/getModelChatSession.js';
import { getMessages } from './helpers/getMessages.js';

const chatSession = getModelChatSession();

// Main chat loop
async function chatLoop() {    
    console.log(getMessages("greeting"));

    while (true) {
        const { prompt } = await inquirer.prompt([
            {
                type: 'input',
                name: 'prompt',
                message: chalk.green('You:'),
            },
        ]);

        if (prompt.toLowerCase().trim() === 'exit') {
            console.log(getMessages("farewell"));
            break;
        }

        const spinner = ora(getMessages("loading")).start();

        try {
            const result = await chatSession.sendMessage(prompt);
            const response = result.response.text();
            
            spinner.stop();
            console.log(chalk.cyan('Agent:'), response + '\n');
        } catch (error) {
            spinner.fail(getMessages("failure"));
            console.error(chalk.red(error.message));
        }
    }
}

chatLoop();
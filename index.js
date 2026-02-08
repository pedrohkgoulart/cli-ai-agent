#!/usr/bin/env node
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';

import { getModel } from './helpers/getModel.js';
import { getMessages } from './helpers/getMessages.js';

const model = getModel();

// Main chat loop
async function chatLoop() {
    const history = [];
    
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
            // Create a chat session to maintain history
            const chat = model.startChat({
                history: history,
            });

            const result = await chat.sendMessage(prompt);
            const response = result.response.text();
            
            spinner.stop();
            console.log(chalk.cyan('Agent:'), response + '\n');

            // Update history manually if not using the chat object continuously for the loop
            // (Though startChat maintains its own internal state if reused, here we reconstruct for simplicity or if we wanted stateless)
            // Since we create a new chat object every loop, we need to push to our history array
            history.push({ role: 'user', parts: [{ text: prompt }] });
            history.push({ role: 'model', parts: [{ text: response }] });

        } catch (error) {
            spinner.fail(getMessages("failure"));
            console.error(chalk.red(error.message));
        }
    }
}

chatLoop();
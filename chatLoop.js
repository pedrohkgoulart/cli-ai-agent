import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';

import { getAgentResponses } from './helpers/getAgentResponses.js';
import { getMessages } from './helpers/getMessages.js';
import { getModelChatSession } from './helpers/getModelChatSession.js';

export async function chatLoop() {
    const chatSession = getModelChatSession();
    const skippedConfirmationForTools = new Set();

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
        let promptToSend = prompt;

        try {
            while (promptToSend !== null) {
                const result = await chatSession.sendMessage(promptToSend);
                const functionResponses = await getAgentResponses(result, skippedConfirmationForTools, spinner);
                promptToSend = functionResponses;
            }
        } catch (error) {
            spinner.fail(getMessages("failure"));
            console.error(chalk.red(error.message));
        }
    }
}

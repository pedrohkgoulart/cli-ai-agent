import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';

import { getMessages } from './helpers/getMessages.js';
import { executeTools, toolDescriptions } from './data/tools.js';

export async function chatLoop(chatSession) {
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

        try {
            const result = await chatSession.sendMessage(prompt);

            const call = result.response.functionCalls()?.[0];
            let response;

            if (call) {
                const { name, args } = call;
                const tool = executeTools[name];
                const toolDescription = toolDescriptions[name];

                if (!tool) {
                    throw new Error(`Tool not found: ${name}`);
                } else if (!toolDescription) {
                    throw new Error(`Tool description not found for: ${name}`);
                }

                // Ensures that the user would like to run the tool before executing it
                let confirm = skippedConfirmationForTools.has(name);

                if (!confirm) {
                    spinner.stop();
                    
                    console.log(chalk.yellow(`\nThe agent wants to ${toolDescription(args)}`));
                    
                    const answers = await inquirer.prompt([
                        {
                            type: 'confirm',
                            name: 'confirm',
                            message: chalk.white(`Do you want to proceed?`),
                            default: false,
                        },
                        {
                            type: 'confirm',
                            name: 'skipFuture',
                            message: chalk.white('Skip this confirmation for this tool in this session?'),
                            default: false,
                            when: (answers) => answers.confirm,
                        },
                    ]);

                    confirm = answers.confirm;
                    
                    if (answers.skipFuture) {
                        skippedConfirmationForTools.add(name);
                    }
                    spinner.start();
                }

                if (confirm) {
                    const toolResult = await tool(args);
                    
                    const toolResponse = await chatSession.sendMessage([{
                        functionResponse: { name, response: { result: "success" }}
                    }]);
                    response = toolResponse.response.text();
                } else {
                    response = chalk.red('Action cancelled by user.');
                }
            } else {
                response = result.response.text();
            }
            
            spinner.stop();
            console.log(chalk.cyan('Agent:'), response + '\n');
        } catch (error) {
            spinner.fail(getMessages("failure"));
            console.error(chalk.red(error.message));
        }
    }
}
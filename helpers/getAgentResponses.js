import chalk from 'chalk';
import inquirer from 'inquirer';

import { executeTools, toolDescriptions } from '../data/tools.js';

const toolConfirmation = [
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
];

export async function getAgentResponses(result, skippedConfirmationForTools, spinner) {
    // Retrieve function calls from the agent's response
    const callsToProcess = result.response.functionCalls() || [];

    // Checks if there are no function calls to process
    // If there aren't, we just stop the spinner and print the agent's message
    if (callsToProcess.length === 0) {
        spinner.stop();
        console.log(chalk.cyan('Agent:'), result.response.text() + '\n');
        return null;
    };

    const functionResponses = [];

    // Execute each tool call sequentially, asking for user confirmation before each one (unless skipped)
    for (const c of callsToProcess) {
        const { name, args } = c;
        const tool = executeTools[name];
        const toolDescription = toolDescriptions[name];

        spinner.stop();

        if (!tool || !toolDescription) {
            throw new Error(`Tool not found: ${name}`);
        }

        console.log(chalk.yellow(`\nAgent action: ${toolDescription(args)}`));

        let skippedConfirmation = skippedConfirmationForTools.has(name);
        
        if (!skippedConfirmation) {
            const answers = await inquirer.prompt(toolConfirmation);

            if (!answers.confirm) {
                console.log(chalk.red('\nAction cancelled by user.'));
                break;
            }

            if (answers.skipFuture) {
                skippedConfirmationForTools.add(name);
            }
        }
        
        const toolResult = await tool(args);

        functionResponses.push({ functionResponse: { name, response: { result: toolResult } } });
        spinner.start();
    }

    return functionResponses;
}
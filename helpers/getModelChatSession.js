import { GoogleGenerativeAI } from '@google/generative-ai';
import chalk from 'chalk';

import { tools } from '../data/tools.js';

export const getModelChatSession = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    const modelName = process.env.GEMINI_MODEL;

    if (!apiKey) {
        console.error(chalk.bgRed('Error: GEMINI_API_KEY is not defined in your environment variables.'))
        console.log(chalk.red('View https://ai.google.dev/gemini-api/docs/api-key to setup a key and add it to config/.env'));
        process.exit(1);
    } else if (!modelName) {
        console.error(chalk.bgRed('Error: GEMINI_MODEL is not defined in your environment variables.'))
        console.log(chalk.red('View https://ai.google.dev/gemini-api/docs/models for more information on available models and add it to config/.env')) ;
        process.exit(1);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName, tools: [tools] });
    const chatSession = model.startChat({ history: [] });

    return chatSession;
}
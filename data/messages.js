import chalk from 'chalk';

const greetings = [
    "Welcome to your Gemini CLI Coding Agent! Let's get coding 🚀",
    "Hello, I'm your Gemini CLI Coding Agent! Let's get started! 💻",
    "Hi there, welcome to your Gemini CLI Coding Agent! Ready to assist 👋",
    "Welcome to your Gemini CLI Coding Agent! How can I assist you today? 🤖"
]

const loadings = [
    "Thinking...",
    "Processing...",
    "Conceptualizing...",
    "Discombobulating...",
]

const failures = [
    "Error fetching response",
    "Something went wrong while fetching the response",
    "Unable to get a response at the moment",
    "The agent ran into an issue while fetching the response"
]

const farewells = [
    "Goodbye! Happy coding! 👋",
    "See you later! Keep up the great work! 🚀",
    "Farewell! Keep pushing your coding limits! 💪",
    "Good luck with your projects! Until next time! 🌟"
]

export const messages = {
  'greeting': greetings,
  'loading': loadings,
  'failure': failures,
  'farewell': farewells
}

export const getFormattedMessage = {
    'greeting': (message) => chalk.blue.bold(`\n${message}\n`) + chalk.gray('Type "exit" to quit.\n'),
    'loading': (message) => chalk.yellow(message),
    'failure': (message) => chalk.bgRed(message),
    'farewell': (message) => chalk.yellow(message)
}

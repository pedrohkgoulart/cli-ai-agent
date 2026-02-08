# cli-ai-agent

A commannd line interface (CLI) operated AI agent using Gemini as the primary LLM. This tool allows users to interact with Gemini and, among other things, ask it to generate code, search local files, and run commands on your behalf.

# Getting started

To get started and install required packages run the following command:

```
npm install
```

After packages are installed, you will need to setup the evironment variables. Run the following command to copy the example env file and then update the `GEMINI_API_KEY` variable.

```
cp config/.env.example config/.env
# then open config/.env and update the values
```

Lastly, you will need to grant execute permission to the main executable in this repo `index.js`:

```
chmod +x index.js
```

You should now be able to initialize the CLI AI Agent with the following command:

```
cli-ai-agent
```

# TODO

TODO: Add how to setup Gemini, and how to run commands. Add a sample 
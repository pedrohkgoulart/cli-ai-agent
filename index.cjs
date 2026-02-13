#!/usr/bin/env node

const { chatLoop } = require('./chatLoop.js');

process.loadEnvFile(`${__dirname}/config/.env`);

chatLoop();

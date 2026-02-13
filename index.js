#!/usr/bin/env node
import dotenv from 'dotenv';

import { chatLoop } from './chatLoop.js';
import { getModelChatSession } from './helpers/getModelChatSession.js';

dotenv.config({ path: 'config/.env' });

const chatSession = getModelChatSession();

chatLoop(chatSession);
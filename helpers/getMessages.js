import { messages, getFormattedMessage } from '../data/messages.js';

function getRandomMessage(data) {
    if (data.length === 0) {
        return "No messages available.";
    }

    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
}

export function getMessages(messageId) {
    const data = messages[messageId] || [];
    const message = getRandomMessage(data);
    const formatter = getFormattedMessage[messageId] || ((msg) => msg);

    return formatter(message);
}

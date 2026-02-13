import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const ALLOWED_COMMANDS = ['ls', 'cat', 'grep', 'find', 'pwd', 'echo', 'node', 'npm'];
const PROTECTED_DIRECTORIES = ['/etc', '/sys', '/proc', '/var', '/bin', '/sbin', '/usr'];

const execPromise = promisify(exec);

// Validates that the target path is within the current working directory and not in protected system directories
function validatePath(targetPath) {
  const currentDir = process.cwd();

  if (!targetPath.startsWith(currentDir)) {
    throw new Error(`Access denied: path must be within ${currentDir}`);
  }
    
  if (PROTECTED_DIRECTORIES.some(dir => targetPath.startsWith(dir))) {
    throw new Error('Access denied: cannot write to system directories');
  }
}

/**
 * writeFile creates or updates a file with the specified content. It ensures that the file is created
 * within the current working directory and prevents writing to system directories.
 * 
 * @param {string} args.path - The file path within the current working directory.
 * @param {string} args.content - The content to write to the file.
 * 
 * @returns {void}
 */
const writeFile = (args) => {
    const targetPath = path.resolve(args.path);
    validatePath(targetPath);
    
    return fs.writeFileSync(targetPath, args.content);
}

/**
 * readFile reads the content of a file within the current working directory. It ensures that the file is accessed
 * within the current working directory and prevents reading from system directories.
 * 
 * @param {string} args.path - The file path within the current working directory.
 * 
 * @returns {string} The content of the file.
 */
const readFile = (args) => {
    const targetPath = path.resolve(args.path);
    validatePath(targetPath);
    
    return fs.readFileSync(targetPath, 'utf-8');
}

/**
 * removeFile deletes a file at the specified path. It ensures that the file is deleted within the current working
 * directory and prevents deleting from system directories.
 * 
 * @param {string} args.path - The file path within the current working directory.
 * 
 * @returns {void}
 */
const removeFile = (args) => {
    const targetPath = path.resolve(args.path);
    validatePath(targetPath);

    return fs.unlinkSync(targetPath);
}

/**
 * searchFiles searches for files with a specific name within the current working directory and its subdirectories.
 * 
 * @param {string} args.fileName - The name of the file to search for.
 * 
 * @returns {string[]} An array of file paths that match the file name.
 */
const searchFiles = (args) => {
  const results = [];
  const startDir = process.cwd();
  
  const search = (dir) => {
    const list = fs.readdirSync(dir);
    
    // Goes through each file/directory in the current directory
    for (const file of list) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat && stat.isDirectory()) {
        search(filePath);
      } else if (file === args.fileName) {
        results.push(filePath);
      }
    }
  };
  
  search(startDir);

  return results;
}

/**
 * runScript executes a shell command and returns its output.
 * 
 * @param {string} command - The shell command to execute.
 * 
 * @returns {Promise<string>} The output of the command.
 */
const runScript = async (args) => {
  const command = args.command.trim();
  const firstWord = command.split(/\s+/)[0];

  if (!ALLOWED_COMMANDS.includes(firstWord)) {
    throw new Error(`Command not allowed: ${firstWord}`);
  }

  try {
    const { stdout, stderr } = await execPromise(command);
    return stdout || stderr || `Command executed successfully: ${command}`;
  } catch (error) {
    return `Error executing command: ${error.message}`;
  }
}

export const tools = {
  functionDeclarations: [
    {
      name: 'writeFile',
      description: 'Creates or updates a file within the current working directory with specific content',
      parameters: {
        type: 'OBJECT',
        properties: {
          path: { type: 'STRING', description: 'The file path within the current working directory' },
          content: { type: 'STRING', description: 'The code or text to write' }
        },
        required: ['path', 'content']
      }
    },
    {
      name: 'readFile',
      description: 'Reads the content of a file within the current working directory',
      parameters: {
        type: 'OBJECT',
        properties: {
          path: { type: 'STRING', description: 'The file path within the current working directory' }
        },
        required: ['path']
      }
    },
    {
      name: 'removeFile',
      description: 'Deletes a file at a specified path within the current working directory',
      parameters: {
        type: 'OBJECT',
        properties: {
          path: { type: 'STRING', description: 'The file path within the current working directory' }
        },
        required: ['path']
      }
    },
    {
      name: 'searchFiles',
      description: 'Searches for files with a specific name within the current working directory and its subdirectories',
      parameters: {
        type: 'OBJECT',
        properties: {
          fileName: { type: 'STRING', description: 'The name of the file to search for' }
        },
        required: ['fileName']
      }
    },
    {
      name: 'runScript',
      description: 'Executes a shell command and returns its output',
      parameters: {
        type: 'OBJECT',
        properties: {
          command: { type: 'STRING', description: 'The shell command to execute' }
        },
        required: ['command']
      }
    }
  ]
};

export const toolDescriptions = {
    'writeFile': (args) => `create or update a file at path ${args.path}`,
    'readFile': (args) => `read the content of a file at path ${args.path}`,
    'removeFile': (args) => `delete the file at path ${args.path}`,
    'searchFiles': (args) => `search for files with the name ${args.fileName} within this directory`,
    'runScript': (args) => `execute the shell command "${args.command}"`
}

export const executeTools = {
    'writeFile': writeFile,
    'readFile': readFile,
    'removeFile': removeFile,
    'searchFiles': searchFiles,
    'runScript': runScript
}
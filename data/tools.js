import fs from 'fs';
import path from 'path';

const writeFile = (args) => {
    const targetPath = path.resolve(args.path);
    const currentDir = process.cwd();
    
    // Ensure the target is within the current working directory
    if (!targetPath.startsWith(currentDir)) {
        throw new Error(`Access denied: path must be within ${currentDir}`);
    }
    
    // Prevent writing to system directories
    const systemDirs = ['/etc', '/sys', '/proc', '/var', '/bin', '/sbin', '/usr'];
    if (systemDirs.some(dir => targetPath.startsWith(dir))) {
        throw new Error('Access denied: cannot write to system directories');
    }
    
    fs.writeFileSync(targetPath, args.content);
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
    }
  ]
};

export const executeTools = {
    'writeFile': writeFile,
}
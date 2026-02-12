import fs from 'fs';

export const tools = {
  functionDeclarations: [
    {
      name: "writeFile",
      description: "Creates or updates a file with specific content",
      parameters: {
        type: "OBJECT",
        properties: {
          path: { type: "STRING", description: "The file path" },
          content: { type: "STRING", description: "The code or text to write" }
        },
        required: ["path", "content"]
      }
    }
  ]
};

export const executeTools = {
    'writeFile': (args) => fs.writeFileSync(args.path, args.content),
}
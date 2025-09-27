const fs = require('fs');
const path = require('path');

function extractFunctions(directoryPath) {
  const result = [];

  function traverseDir(dir) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        traverseDir(fullPath); // recursively scan subdirectory
      } else if (file.endsWith('.js')) {
        const content = fs.readFileSync(fullPath, 'utf8');

        // Regex to match function declarations
        const functionRegex = /function\s+([a-zA-Z0-9_]+)\s*\([\s\S]*?\)\s*\{[\s\S]*?\}/g;
        let match;

        while ((match = functionRegex.exec(content)) !== null) {
          result.push({
            file: file,
            name: match[1],
            definition: match[0]
          });
        }

        // Regex to match arrow functions assigned to variables
        const arrowRegex = /const\s+([a-zA-Z0-9_]+)\s*=\s*\([\s\S]*?\)\s*=>\s*\{[\s\S]*?\}/g;
        while ((match = arrowRegex.exec(content)) !== null) {
          result.push({
            file: file,
            name: match[1],
            definition: match[0]
          });
        }
      }
    });
  }

  traverseDir(directoryPath);
  return result;
}

module.exports = extractFunctions;
const fs = require('fs');
const path = require('path');

function validateJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    JSON.parse(content);
    console.log(`${filePath} is valid JSON.`);
  } catch (error) {
    console.error(`Error in ${filePath}:`);
    console.error(error.message);
    process.exit(1);
  }
}

validateJSON(path.join(__dirname, '..', 'package.json'));
console.log('JSON validation completed.');
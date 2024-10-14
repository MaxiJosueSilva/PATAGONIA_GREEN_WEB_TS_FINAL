const fs = require('fs');
const path = require('path');

function checkCSSImports(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      checkCSSImports(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const cssImports = content.match(/import\s+['"](.+\.css)['"]/g);
      
      if (cssImports) {
        cssImports.forEach(importStatement => {
          const cssFile = importStatement.match(/['"](.+\.css)['"]/)[1];
          const cssPath = path.join(path.dirname(filePath), cssFile);
          
          if (!fs.existsSync(cssPath)) {
            console.error(`Error: CSS file not found: ${cssPath}`);
            console.error(`Referenced in: ${filePath}`);
          }
        });
      }
    }
  });
}

checkCSSImports('./src');
console.log('CSS import check completed.');
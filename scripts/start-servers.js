import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const frontendDir = join(__dirname, '..');
const backendDir = join(__dirname, '..', 'src', 'backend');

console.log('Starting frontend server...');
exec('npx serve -s dist -l 80', { cwd: frontendDir }, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error starting frontend server: ${error}`);
    return;
  }
  console.log(`Frontend server output: ${stdout}`);
  console.error(`Frontend server errors: ${stderr}`);
});

console.log('Starting backend server...');
exec('python app.py', { cwd: backendDir }, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error starting backend server: ${error}`);
    return;
  }
  console.log(`Backend server output: ${stdout}`);
  console.error(`Backend server errors: ${stderr}`);
});
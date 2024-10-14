import { execSync } from 'child_process';

function runCommand(command) {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Failed to execute command: ${command}`);
    console.error(error);
    process.exit(1);
  }
}

console.log('Installing Python dependencies...');
try {
  runCommand('python3 -m ensurepip --upgrade');
  runCommand('python3 -m pip install --user --upgrade pip');
  runCommand('python3 -m pip install --user flask flask-sqlalchemy flask-bcrypt flask-jwt-extended');
  console.log('Python dependencies installed successfully.');
} catch (error) {
  console.error('Failed to install Python dependencies.');
  console.error('Please make sure Python 3 is available in your environment.');
  process.exit(1);
}
// This script requires ts-node to run TypeScript files
// You might need to install it: npm install -g ts-node
const { spawn } = require('child_process');

console.log('Testing league logic calculatePoints function...');

// Create a ts-node process to run the test
const process = spawn('npx', ['ts-node', '-e', `
import { calculatePoints } from './src/lib/leagueLogic';

async function testCalculatePoints() {
  try {
    console.log('Calling calculatePoints...');
    const points = await calculatePoints();
    console.log('Results:', JSON.stringify(points, null, 2));
  } catch (error) {
    console.error('Error testing calculatePoints:', error);
  }
}

testCalculatePoints();
`]);

// Log output
process.stdout.on('data', (data) => {
  console.log(data.toString());
});

process.stderr.on('data', (data) => {
  console.error(data.toString());
});

process.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
}); 
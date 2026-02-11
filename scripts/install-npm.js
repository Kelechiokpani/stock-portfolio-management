import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('[npm-install] Starting npm installation...');

try {
  // Run npm install
  console.log('[npm-install] Executing npm install...');
  execSync('npm install', { 
    cwd: '/vercel/share/v0-project',
    stdio: 'inherit' 
  });
  
  console.log('[npm-install] npm install completed successfully!');
  console.log('[npm-install] package-lock.json has been generated');
  
  // Verify package-lock.json exists
  const lockfilePath = '/vercel/share/v0-project/package-lock.json';
  if (fs.existsSync(lockfilePath)) {
    console.log('[npm-install] ✓ package-lock.json verified');
    console.log('[npm-install] Project successfully converted to npm!');
  }
} catch (error) {
  console.error('[npm-install] Error during npm install:', error.message);
  process.exit(1);
}

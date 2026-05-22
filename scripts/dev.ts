#!/usr/bin/env tsx
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dirname, '..');

async function main() {
  // Initial generate
  console.log('⚙️  Generating initial manifest...');
  await run('pnpm', ['generate']);

  // Start watcher (background)
  const watcher = spawn('pnpm', ['generate', '--', '--watch'], {
    cwd: root,
    stdio: 'inherit',
    shell: true,
  });

  // Start react-router dev (foreground)
  const dev = spawn('pnpm', ['react-router', 'dev'], {
    cwd: root,
    stdio: 'inherit',
    shell: true,
  });

  // Cleanup everything on exit
  const cleanup = () => {
    watcher.kill();
    dev.kill();
    process.exit();
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  dev.on('exit', cleanup);
}

function run(command: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      stdio: 'inherit',
      shell: true,
    });
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Exit code ${code}`));
    });
    child.on('error', reject);
  });
}

main().catch(console.error);

#!/usr/bin/env node
// PreToolUse hook (Write|Edit): protege lo que es fácil de romper por accidente.
//   1. .env: los secretos los escribe el usuario, nunca Claude.
import { readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();

function decide(decision, reason) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: decision,
        permissionDecisionReason: reason,
      },
    }),
  );
  process.exit(0);
}

let payload;
try {
  payload = JSON.parse(readFileSync(0, 'utf8'));
} catch {
  process.exit(0); // un hook propio nunca debe bloquear por fallar
}

const filePath = payload?.tool_input?.file_path;
if (typeof filePath !== 'string' || filePath.length === 0) process.exit(0);

const rel = path.relative(root, filePath).split(path.sep).join('/');

if (/(^|\/)\.env(\.|$)/.test(rel) && !rel.endsWith('.env.example')) {
  decide('deny', 'Los secretos viven solo en .env, escrito por el usuario. Claude no lo edita (usa .env.example).');
}


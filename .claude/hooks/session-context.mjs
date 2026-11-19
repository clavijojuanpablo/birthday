#!/usr/bin/env node
// SessionStart hook: inyecta docs/STATUS.md y el estado de git al abrir sesión,
// para no tener que re-explicar dónde quedamos.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const PROJECT = 'larvabirthday';
const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();

function git(args) {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

let status = '';
try {
  status = readFileSync(path.join(root, 'docs', 'STATUS.md'), 'utf8');
} catch {
  status = '(Falta docs/STATUS.md: es el punto de entrada de cada sesión, hay que recrearlo.)';
}

const dirty = git(['status', '--porcelain']);
const context = [
  `# ${PROJECT} — estado al iniciar la sesión (hook SessionStart)`,
  status,
  '## Git ahora mismo',
  `Rama: ${git(['rev-parse', '--abbrev-ref', 'HEAD']) || 'desconocida'}`,
  `Últimos commits:\n${git(['log', '-5', '--pretty=format:%h %ci %s']) || '(ninguno)'}`,
  dirty ? `Cambios sin commitear:\n${dirty}` : 'Working tree limpio.',
  'Si el usuario dice "continúa" sin más contexto, propón el primer punto de "Próximos pasos".',
].join('\n\n');

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: context },
    suppressOutput: true,
  }),
);

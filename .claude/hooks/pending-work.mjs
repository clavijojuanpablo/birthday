#!/usr/bin/env node
// Stop hook: si el turno termina con código cambiado y docs/STATUS.md sin tocar,
// avisa una vez. Se calla en cuanto STATUS.md forma parte del cambio.
import { execFileSync } from 'node:child_process';

const WATCHED = ['src', 'public', 'astro.config.mjs'];
const root = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();

function porcelain(paths) {
  try {
    return execFileSync('git', ['status', '--porcelain', '--', ...paths], { cwd: root, encoding: 'utf8' })
      .split('\n')
      .filter(Boolean);
  } catch {
    return null;
  }
}

const changed = porcelain(WATCHED);
if (!changed || changed.length === 0) process.exit(0);

const statusTouched = porcelain(['docs/STATUS.md']);
if (statusTouched && statusTouched.length > 0) process.exit(0);

process.stdout.write(
  JSON.stringify({
    systemMessage: `${changed.length} archivo(s) del sitio sin commitear y docs/STATUS.md sin tocar. Antes de cerrar: /verificar y /cerrar-sesion.`,
    suppressOutput: true,
  }),
);

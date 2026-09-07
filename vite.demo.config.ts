import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, readdirSync } from 'fs';
import { resolve } from 'path';

const root = __dirname;
const read = (p: string) => readFileSync(resolve(root, p), 'utf8');

/** Counts the hero quotes are built from. They used to be hand-copied into the
 *  markup and drifted (30 plugins vs 53, 9 slots vs 11, v1.5.1 vs v1.27.2), so
 *  they're derived from the source of truth at build time instead. Each one
 *  throws on a zero count, so a refactor that breaks a pattern fails the build
 *  rather than quietly publishing "0 Plugins". */
function count(label: string, n: number): number {
  if (n <= 0) throw new Error(`vite.demo.config: ${label} resolved to ${n} — the source layout changed, update the pattern.`);
  return n;
}

// Plugin factories re-exported from the public barrel: `export { xPlugin } ...`
const pluginCount = count(
  'pluginCount',
  (read('src/plugins/index.ts').match(/^export \{ [a-z][A-Za-z0-9]*Plugin \}/gm) ?? []).length,
);

// Keys of ChatCustomizeSlotMap — one per overridable UI slot.
const slotBlock = /export interface ChatCustomizeSlotMap \{([^}]*)\}/.exec(read('src/types/config.ts'));
const slotCount = count(
  'slotCount',
  (slotBlock?.[1].match(/^\s+[a-zA-Z]+:/gm) ?? []).length,
);

// Members of the FormFieldType union.
const fieldTypeCount = count(
  'fieldTypeCount',
  (/export type FormFieldType =([\s\S]*?);/.exec(read('src/types/form.ts'))?.[1].match(/\|\s*'/g) ?? []).length,
);

// Written guides in docs/ — the index, the changelog and the scratch
// observations file aren't guides.
const NON_GUIDES = new Set(['README.md', 'changelog.md', 'intercom-messenger-observations.md']);
const docCount = count(
  'docCount',
  readdirSync(resolve(root, 'docs')).filter((f) => f.endsWith('.md') && !NON_GUIDES.has(f)).length,
);

const version = JSON.parse(read('package.json')).version as string;

// Exposed to demo/index.html as %VITE_PKG_VERSION% (structured data).
process.env.VITE_PKG_VERSION = version;

export default defineConfig({
  plugins: [react()],
  root: 'demo',
  define: {
    __PKG_VERSION__: JSON.stringify(version),
    __PLUGIN_COUNT__: JSON.stringify(pluginCount),
    __SLOT_COUNT__: JSON.stringify(slotCount),
    __FIELD_TYPE_COUNT__: JSON.stringify(fieldTypeCount),
    __DOC_COUNT__: JSON.stringify(docCount),
  },
  resolve: {
    alias: {
      '@enjoys/react-chatbot-plugin': resolve(__dirname, 'src/index.ts'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});

import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';

const dev = process.env.ROLLUP_WATCH;

export default {
  input: 'src/collapsible-card.ts',
  output: {
    file: 'dist/collapsible-card.js',
    format: 'es',
  },
  plugins: [
    resolve(),
    typescript(),
    json(),
    !dev && terser(),
  ],
};

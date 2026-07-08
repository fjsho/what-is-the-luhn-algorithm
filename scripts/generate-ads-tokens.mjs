// src/ads-tokens.css を @atlaskit/tokens のテーマアーティファクトから再生成するスクリプト
// 実行: node scripts/generate-ads-tokens.mjs
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { version } = require('@atlaskit/tokens/package.json');

const themes = [
  'atlassian-light',
  'atlassian-typography',
  'atlassian-spacing',
  'atlassian-shape',
];

const css = await Promise.all(
  themes.map(async (name) => {
    const mod = await import(
      `@atlaskit/tokens/dist/es2019/artifacts/themes/${name}.js`
    );
    return mod.default;
  })
);

const header = `/* Generated from @atlaskit/tokens v${version} (Atlassian Design System design tokens). Do not edit by hand.
 * Regenerate: node scripts/generate-ads-tokens.mjs
 */
`;

fs.writeFileSync(new URL('../src/ads-tokens.css', import.meta.url), header + css.join('\n'));
console.log(`src/ads-tokens.css generated from @atlaskit/tokens v${version}`);

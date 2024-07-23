import { defineConfig } from 'rollup';
import esbuild from 'rollup-plugin-esbuild';
import { dts } from 'rollup-plugin-dts';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { readFileSync } from 'node:fs';
import { rimrafSync } from 'rimraf';
import css from 'rollup-plugin-import-css';

"use strict";
const { dependencies, peerDependencies } = JSON.parse(
  readFileSync("./package.json", "utf8")
);
const external = [
  ...Object.keys(dependencies || {}),
  ...Object.keys(peerDependencies || {})
];
rimrafSync("dist");
var rollup_config = defineConfig([
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      format: "esm"
    },
    plugins: [vueJsx(), esbuild({ minify: true })],
    external
  },
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      format: "esm"
    },
    plugins: [
      dts({
        // https://github.com/Swatinem/rollup-plugin-dts/issues/143
        compilerOptions: { preserveSymlinks: false }
      })
    ],
    external
  },
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      format: "esm"
    },
    plugins: [
      dts({
        // https://github.com/Swatinem/rollup-plugin-dts/issues/143
        compilerOptions: { preserveSymlinks: false }
      }),
      css({
        output: "style.css"
      })
    ],
    external
  }
]);

export { rollup_config as default };

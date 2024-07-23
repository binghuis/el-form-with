import { builtinModules } from "node:module";
import { readFileSync } from "node:fs";
import { defineConfig } from "rollup";
import nodeResolve from "@rollup/plugin-node-resolve";
import esbuild from "rollup-plugin-esbuild";
import commonjs from "@rollup/plugin-commonjs";
import dts from "rollup-plugin-dts";
import vueJsx from "@vitejs/plugin-vue-jsx";

const { dependencies = {}, peerDependencies = {} } = JSON.parse(
  readFileSync("./package.json", "utf8")
);

const external = [
  ...builtinModules,
  ...builtinModules.map((m) => `node:${m}`),
  ...Object.keys(dependencies),
  ...Object.keys(peerDependencies),
  // 如果需要除外某个包目录下文件
  // ...Object.keys(dependencies).map((item) => new RegExp(`^${item}`)),
  // ...Object.keys(peerDependencies).map((item) => new RegExp(`^${item}`)),
];

export default defineConfig([
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      entryFileNames: "[name].mjs",
      format: "esm",
    },

    plugins: [
      vueJsx(),
      nodeResolve({ preferBuiltins: true }),
      esbuild({ minify: true, target: "es2017" }),
      commonjs(),
    ],
    external,
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.d.ts",
      format: "esm",
    },
    plugins: [
      dts({
        // https://github.com/Swatinem/rollup-plugin-dts/issues/143
        compilerOptions: { preserveSymlinks: false },
        respectExternal: true,
      }),
    ],
    external,
  },
]);

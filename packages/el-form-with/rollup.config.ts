import { defineConfig } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import { dts } from "rollup-plugin-dts";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { PackageJson } from "type-fest";
import { readFileSync } from "node:fs";
import { rimraf } from "rimraf";

const { dependencies, peerDependencies } = JSON.parse(
  readFileSync("./package.json", "utf8")
) as PackageJson;

const external = [
  ...Object.keys(dependencies || {}),
  ...Object.keys(peerDependencies || {}),
];

rimraf.rimrafSync("dist");

export default defineConfig([
  {
    input: "src/index.ts",
    output: {
      dir: "dist",
      format: "esm",
    },
    plugins: [vueJsx(), esbuild({ minify: true })],
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
      }),
    ],
    external,
  },
]);

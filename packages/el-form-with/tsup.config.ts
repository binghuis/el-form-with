import { defineConfig } from "tsup";
import VueJsx from "unplugin-vue-jsx/esbuild";

export default defineConfig({
  entry: ["./src/index.ts"],
  outDir: "dist",
  sourcemap: false,
  clean: true,
  dts: true,
  format: ["esm"],
  treeshake: true,
  splitting: true,
  target: "es2020",
  minify: true,
  esbuildPlugins: [VueJsx()],
});

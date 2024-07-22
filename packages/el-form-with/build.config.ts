import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["./src/index"],
  outDir: "dist",
  sourcemap: false,
  clean: true,
  declaration: true,
  externals: ["vue", "element-plus"],
  failOnWarn: false,
  rollup: {
    esbuild: {
      format: "esm",
      treeShaking: true,
      target: "es2017",
      minify: true,
    },
  },
});

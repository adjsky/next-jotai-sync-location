import { defineConfig } from "rollup"
import typescript from "@rollup/plugin-typescript"
import resolve from "@rollup/plugin-node-resolve"
import external from "rollup-plugin-peer-deps-external"
import dts from "rollup-plugin-dts"

const packageJson = require("./package.json")

export default defineConfig([
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        exports: "auto"
      },
      {
        file: packageJson.module,
        format: "esm"
      }
    ],
    plugins: [
      external(),
      resolve(),
      typescript({ tsconfig: "./tsconfig.json" })
    ]
  },
  {
    input: "dist/esm/types/index.d.ts",
    output: [{ file: packageJson.types, format: "esm" }],
    plugins: [dts()]
  }
])

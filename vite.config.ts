import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const runtimeEnv = (
  globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  }
).process?.env;
const repositoryName = runtimeEnv?.GITHUB_REPOSITORY?.split("/")[1];
const pagesBase =
  runtimeEnv?.GITHUB_ACTIONS === "true" && repositoryName
    ? `/${repositoryName}/`
    : "/";

export default defineConfig({
  base: pagesBase,
  plugins: [react()],
  server: {
    host: "0.0.0.0",
  },
  preview: {
    host: "0.0.0.0",
  },
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.test.ts"],
 
  },
});

import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "http://localhost:8000/openapi.json",
  output: "src/api",
  plugins: ["@hey-api/client-next", "@tanstack/react-query"],
});

import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "https://hyperion.myecl.fr/openapi.json",
  output: "src/api",
  plugins: ["@hey-api/client-next", "@tanstack/react-query"],
});

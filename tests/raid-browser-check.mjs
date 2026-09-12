import assert from "node:assert/strict";
import test from "node:test";

const frontendUrl = "http://inscription-raid.localhost:3000/fr/info";
const backendUrl = "http://127.0.0.1:8000/information";

test("Raid frontend is served through the inscription-raid host", async () => {
  const response = await fetch(frontendUrl);

  assert.equal(response.status, 200);
  assert.match(await response.text(), /Inscription Raid/);
});

test("Hyperion responds to the information endpoint", async () => {
  const response = await fetch(backendUrl);

  assert.equal(response.status, 200);
});

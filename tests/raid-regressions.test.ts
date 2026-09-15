import { getRaidDocumentUrl } from "../src/lib/raid/document.ts";
import { getDocumentValidationMessage } from "../src/lib/raid/documentValidation.ts";
import { getSituationLabel } from "../src/lib/raid/teamUtils.ts";

import assert from "node:assert/strict";
import test from "node:test";

test("keeps Hyperion's external-school situation editable after a reload", () => {
  assert.equal(getSituationLabel("otherSchool"), "otherschool");
  assert.equal(
    getSituationLabel("otherSchool : École Polytechnique"),
    "otherschool",
  );
});

test("does not create a double slash when downloading a Raid document", () => {
  assert.equal(
    getRaidDocumentUrl("https://hyperion.example/", "rules-id"),
    "https://hyperion.example/raid/document/rules-id",
  );
});

test("uses the requested document id for the download endpoint", () => {
  assert.equal(
    getRaidDocumentUrl("https://hyperion.example", "information-id"),
    "https://hyperion.example/raid/document/information-id",
  );
});

test("reports a refused supporting document as refused", () => {
  assert.equal(
    getDocumentValidationMessage("refused"),
    "Document refusé avec succès",
  );
});

test("keeps accepted and temporary validation feedback distinct", () => {
  assert.equal(
    getDocumentValidationMessage("accepted"),
    "Document validé avec succès",
  );
  assert.equal(
    getDocumentValidationMessage("temporary"),
    "Document mis à jour avec succès",
  );
});

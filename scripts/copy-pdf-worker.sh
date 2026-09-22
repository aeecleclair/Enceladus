#!/bin/sh
# Copy the pdf.js worker shipped with react-pdf into public/ so the browser can
# load /pdf.worker.min.mjs at runtime.
#
# Why a copy in public/: react-pdf does NOT bundle a worker — it re-exports
# pdfjs and requires you to set `pdfjs.GlobalWorkerOptions.workerSrc` yourself.
# The worker MUST come from the same pdfjs-dist version react-pdf bundles,
# otherwise pdf.js rejects it ("The API version does not match the Worker
# version") and every PDF fails to render. Preferring react-pdf's *nested*
# pdfjs-dist copy over the hoisted one keeps that guarantee even when another
# dependency hoists a different pdfjs-dist version (the bug we hit in Sept 2026).
#
# Sources of this file:
#   - the `postinstall` npm hook (local dev checkouts: the app serves the
#     worker from public/, and public/pdf.worker.min.mjs is gitignored)
#   - the Dockerfile builder stage, run explicitly after `npm install`
#     (guards against builds made with --ignore-scripts)
#
# Idempotent and dependency-free (POSIX sh): safe to run any number of times.
set -eu

SRC="node_modules/react-pdf/node_modules/pdfjs-dist/build/pdf.worker.min.mjs"
if [ ! -f "$SRC" ]; then
  SRC="node_modules/pdfjs-dist/build/pdf.worker.min.mjs"
fi

mkdir -p public
cp "$SRC" public/pdf.worker.min.mjs
echo "copied $(basename "$SRC") -> public/pdf.worker.min.mjs"

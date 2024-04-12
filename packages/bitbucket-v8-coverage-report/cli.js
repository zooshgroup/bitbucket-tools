#!/usr/bin/env node

"use strict";

const path = require("path");
const importLocal = require("import-local");

// Path to the index.js file in the dist directory
const distIndexPath = path.resolve(__dirname, "dist", "index.js");

if (importLocal(distIndexPath)) {
  require("npmlog").info("cli", "using local version of bitbucket-v8-coverage-report");
} else {
  require(distIndexPath)(process.argv.slice(2));
}

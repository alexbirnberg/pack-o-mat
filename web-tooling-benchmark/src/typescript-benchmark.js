// Copyright 2017 the V8 project authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

const fs = require("fs");
const { exit } = require("process");
const ts = require("typescript");

const payloads = [
  {
    // Compile typescript-angular.ts to ES3 (default)
    name: "todomvc/typescript-angular.ts",
    transpileOptions: {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES3
      }
    }
  },
  {
    // Compile typescript-angular.ts to ESNext (latest)
    name: "todomvc/typescript-angular.ts",
    transpileOptions: {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ESNext
      }
    }
  }
].map(({ name, transpileOptions }) => ({
  input: fs.readFileSync(`third_party/${name}`, "utf8"),
  transpileOptions
}));

module.exports = {
  name: "typescript",
  fn() {
    payloads.map(({ input, transpileOptions }) =>
      ts.transpileModule(input, transpileOptions)
    );
    throw Error("XXX");
  }
};

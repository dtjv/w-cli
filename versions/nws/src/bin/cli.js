#!/usr/bin/env node

// required to use Reflect API
import "babel/polyfill";

import path from "path";
import meow from "meow";
import vfs from "vinyl-fs";
import arrify from "arrify";
import findUp from "find-up";
import readPkg from "read-pkg";
import source from "vinyl-source-stream";
import writeJson from "write-json-file";
import nws from "../";
import help from "../lib/help";
import { err, log, isEmpty } from "../lib/utils";

// did i really need to read package.json? it looks like meow reads it for me!
const fp = findUp.sync("package.json");
const cfg = readPkg.sync(fp);
const cli = meow({ help, pkg: cfg });

// easier to read
let pkg = cli.pkg;
let files = cli.input;
const opts = cli.flags;

// no flags: print help & exit.
if (isEmpty(opts)) {
  cli.showHelp();
}

// --cwd w/ no arg: print value of `nws.cwd` from package.json & exit.
if (opts.cwd === true) {
  log(`cwd: ${pkg.nws && pkg.nws.cwd ? pkg.nws.cwd : ""}`, true);
}

// --cwd w/ arg: set `nws.cwd` in package.json & exit.
if (opts.cwd && opts.cwd !== true) {
  pkg = Object.assign({}, pkg, { nws: { cwd: opts.cwd } });
  writeJson.sync(fp, pkg, { indent: 2, mode: 420 });
  log("updated package.json", true);
}

// we need `nws.cwd` set to find files.
if (!pkg.nws || !pkg.nws.cwd) {
  err(new Error('no "nws.cwd" set in package.json'));
}

// TODO:
// if any config values don't exist, set to defaults.
// if "pkg.nws.templates" do exist, dynamically import templates

// -f = [files]. -d = [directories]. files = [files]
opts.f = arrify(opts.f);
opts.d = arrify(opts.d);
files = arrify(files);

const globs = [];

// build glob: '**/<file>'
for (const file of opts.f) {
  globs.push(path.join("**", file));
}

// build glob: 'dir/<file>' or 'dir/**/*'
for (const dir of opts.d) {
  if (files.length) {
    for (const file of files) {
      globs.push(path.join(dir, file));
    }
  } else {
    globs.push(path.join(dir, "**/*"));
  }
}

// set output file and dir
const [destDir, destFile] = opts.o
  ? [path.dirname(opts.o), path.basename(opts.o)]
  : ["./", "nws.html"];

vfs
  .src(globs, { cwd: pkg.nws.cwd })
  .pipe(nws(pkg.nws.cwd))
  .pipe(source(destFile))
  .pipe(vfs.dest(destDir));

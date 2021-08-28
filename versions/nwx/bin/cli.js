#!/usr/bin/env node

const { green } = require("chalk");
const meow = require("meow");
const vfs = require("vinyl-fs");
const source = require("vinyl-source-stream");
const help = require("../lib/help");
const nwx = require("../");
const optsManager = require("../lib/opts-manager");
const dataManager = require("../lib/data-manager");

const cli = optsManager.setCli({ cli: meow({ help }) });
const cfg = optsManager.setCfg({ flags: cli.flags });
const globs = dataManager.makeGlobs({
  f: cli.flags.f,
  d: cli.flags.d,
  x: cli.input,
});

if (globs.length) {
  vfs
    .src(globs, { cwd: cfg.src.dir })
    .pipe(nwx.streamFileProcess())
    .pipe(source(cfg.out.file))
    .pipe(vfs.dest(cfg.out.dir));
} else {
  console.log(`\n${green("  No files to process")}\n`);
}

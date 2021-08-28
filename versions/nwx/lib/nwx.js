const pdc = require("pdc");
const { basename, parse, join } = require("path");
const through = require("through2");
const globby = require("globby");
const showdown = require("showdown");
const fs = require("mz/fs");
const { green, red } = require("chalk");
const fileT = require("./templates/file-template");
const fullT = require("./templates/full-template");

exports.processFiles = (patterns, opts = {}) => {
  const converter = new showdown.Converter();

  const globs = opts.cwd
    ? patterns.map((pattern) => join(opts.cwd, pattern))
    : patterns.slice(0);

  return globby(globs)
    .then((paths) =>
      Promise.all(paths.map((path) => fs.readFile(path, "utf8")))
    )
    .then((files) => files.map((file) => converter.makeHtml(file)))
    .then((files) => files.map((file) => fileT.replace("$body$", file)))
    .then((files) => files.join("\n"))
    .then((file) => fullT.replace("$body$", file));
};

exports.streamFileProcess = ({
  format = { src: "markdown", dest: "html" },
} = {}) => {
  const files = [];

  function write(file, _, cb) {
    if (file.isNull()) {
      cb(null, file);
    }

    const { dir, base } = parse(file.path);
    const fn = `${basename(dir)}/${base}`;

    if (file.stat.size) {
      console.log(`${green(`  +: ${fn}`)}`);
      pdc(file.contents.toString(), format.src, format.dest, (err, result) => {
        if (err) {
          throw err;
        }

        files.push(fileT.replace("$body$", result));
        cb();
      });
    } else {
      console.log(`${red(`  -: ${fn}`)} (empty)`);
      cb();
    }
  }

  function flush() {
    this.push(fullT.replace("$body$", files.join("\n")));
  }

  return through.obj(write, flush);
};

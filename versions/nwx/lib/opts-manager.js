const { dirname, basename } = require("path");
const arrify = require("arrify");
const readPkgUp = require("read-pkg-up");
const isEmpty = require("is-object-empty");

const DEFAULT_CFG = {
  src: {
    dir: "",
  },
  out: {
    dir: "./",
    file: "wod.html",
  },
};

const getProgramConfig = (opts) => {
  const result = readPkgUp.sync(opts);
  return (result && result.pkg && result.pkg.nwx) || {};
};

const getCommandConfig = (opts) => {
  const flags = opts.flags || {};
  const result = {};

  if (flags.srcDir) {
    result.src = {};
    result.src.dir = flags.srcDir;
  }

  if (flags.o) {
    result.out = {};
    result.out.dir = dirname(flags.o);
    result.out.file = basename(flags.o);
  }

  return result;
};

const validateConfig = (c) => {
  if (!c.src || isEmpty(c.src) || c.src.dir === "") {
    throw new Error("Missing source directory configuration");
  }
};

exports.setCfg = (opts = {}) => {
  const result = Object.assign(
    {},
    DEFAULT_CFG,
    getProgramConfig(opts),
    getCommandConfig(opts)
  );

  validateConfig(result);

  return Object.assign({}, result);
};

exports.setCli = (opts = {}) => {
  const cli = opts.cli || {};
  const flags = cli.flags || {};

  flags.f = !flags.f || typeof flags.f === "boolean" ? [] : arrify(flags.f);

  flags.d = !flags.d || typeof flags.d === "boolean" ? [] : arrify(flags.d);

  if (!flags.o || typeof flags.o === "boolean" || typeof flags.o === "number") {
    flags.o = "./wod.html";
  }

  if (
    !flags.srcDir ||
    typeof flags.srcDir === "boolean" ||
    typeof flags.srcDir === "number"
  ) {
    flags.srcDir = "";
  }

  return Object.assign({}, Object.assign({}, cli, { flags }));
};

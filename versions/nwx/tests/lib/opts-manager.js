const test = require("tape");
const { setCli, setCfg } = require("../../lib/opts-manager");

const fixtures = "tests/lib/fixtures";

test("setCli: defaults", (t) => {
  const expected = {
    flags: {
      f: [],
      d: [],
      o: "./wod.html",
      srcDir: "",
    },
  };

  t.deepEqual(setCli(), expected);
  t.end();
});

test("setCli: set by cli flags", (t) => {
  const cli = {
    flags: {
      f: "a.md",
      d: ["hansgruber", "joesmith"],
      o: "/path/to/output/output.html",
      srcDir: "/path/to/clients",
    },
  };
  const expected = {
    flags: {
      f: ["a.md"],
      d: ["hansgruber", "joesmith"],
      o: "/path/to/output/output.html",
      srcDir: "/path/to/clients",
    },
  };

  t.deepEqual(setCli({ cli }), expected);
  t.end();
});

test("setCfg: throws when missing required fields", (t) => {
  t.throws(() => setCfg(), /Missing source directory configuration/);
  t.end();
});

test("setCfg: set by package.json", (t) => {
  const expected = {
    src: {
      dir: "/path/to/folders",
    },
    out: {
      dir: "./path/to/results",
      file: "out.html",
    },
  };

  t.deepEqual(setCfg({ cwd: fixtures }), expected);
  t.end();
});

test("setCfg: set by cli flags", (t) => {
  const cli = {
    srcDir: "/path/to/folders",
    o: "path/to/out.html",
  };
  const expected = {
    src: {
      dir: "/path/to/folders",
    },
    out: {
      dir: "path/to",
      file: "out.html",
    },
  };

  t.deepEqual(setCfg({ flags: cli }), expected);
  t.end();
});

test("setCfg: set by package.json and cli flags", (t) => {
  const cli = {
    o: "path/to/out.html",
  };
  const expected = {
    src: {
      dir: "/path/to/folders",
    },
    out: {
      dir: "path/to",
      file: "out.html",
    },
  };

  t.deepEqual(setCfg({ flags: cli, cwd: fixtures }), expected);
  t.end();
});

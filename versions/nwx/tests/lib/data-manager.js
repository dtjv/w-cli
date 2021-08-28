const test = require("tape");
const { makeGlobs } = require("../../lib/data-manager");

test("makeGlobs: empty data", (t) => {
  t.deepEqual(makeGlobs(), []);
  t.deepEqual(makeGlobs({}), []);
  t.end();
});

test("makeGlobs: -f <file>", (t) => {
  const data = {
    f: ["a.md", "b.md"],
    d: [],
    x: [],
  };
  const expected = ["**/a.md", "**/b.md"];

  t.deepEqual(makeGlobs(data), expected);
  t.end();
});

test("makeGlobs: -d <dir>", (t) => {
  const data = {
    f: [],
    d: ["joeuser", "timuser"],
    x: [],
  };
  const expected = ["joeuser/**/*.md", "timuser/**/*.md"];

  t.deepEqual(makeGlobs(data), expected);
  t.end();
});

test("makeGlobs: -d <dir> <file> <file>", (t) => {
  const data = {
    f: [],
    d: ["joeuser", "timuser"],
    x: ["a.md", "b.md"],
  };
  const expected = [
    "joeuser/a.md",
    "joeuser/b.md",
    "timuser/a.md",
    "timuser/b.md",
  ];

  t.deepEqual(makeGlobs(data), expected);
  t.end();
});

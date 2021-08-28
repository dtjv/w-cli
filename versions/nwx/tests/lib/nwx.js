const test = require("tape");
const vfs = require("vinyl-fs");
const proxyquire = require("proxyquire");
const { resolve } = require("path");
const Writable = require("stream").Writable;

const fileT = '<div id="file">$body$</div>';
const fullT = '<div id="full">$body$</div>';

const nwx = proxyquire("../../lib/nwx", {
  "./templates/file-template": fileT,
  "./templates/full-template": fullT,
});

const fixtures = ["tests/lib/fixtures/a.md", "tests/lib/fixtures/b.md"];

test("streamFileProcess", (t) => {
  const expected = `
    <div id="full">
      <div id="file">
        <h1 id="a">A</h1>
      </div>
      <div id="file">
        <h1 id="b">B</h1>
      </div>
    </div>`;

  const ws = new Writable({
    objectMode: true,
    write(file, _, cb) {
      t.equal(file.replace(/\s/g, ""), expected.replace(/\s/g, ""));
      cb();
    },
  });

  vfs
    .src(fixtures, { cwd: resolve("./") })
    .pipe(nwx.streamFileProcess())
    .pipe(ws);

  t.end();
});

test("processFiles: w/ cwd", (t) => {
  const expected = `
    <div id="full">
      <div id="file">
        <h1 id="a">A</h1>
      </div>
      <div id="file">
        <h1 id="b">B</h1>
      </div>
    </div>`;

  nwx
    .processFiles(["*.md"], { cwd: resolve(__dirname, "fixtures") })
    .then((file) => {
      t.equal(file.replace(/\s/g, ""), expected.replace(/\s/g, ""));
      t.end();
    });
});

test("processFiles: w/o cwd", (t) => {
  const expected = `
    <div id="full">
      <div id="file">
        <h1 id="a">A</h1>
      </div>
      <div id="file">
        <h1 id="b">B</h1>
      </div>
    </div>`;

  nwx.processFiles(["tests/lib/fixtures/*.md"]).then((file) => {
    t.equal(file.replace(/\s/g, ""), expected.replace(/\s/g, ""));
    t.end();
  });
});

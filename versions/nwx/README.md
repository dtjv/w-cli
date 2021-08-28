# nwx

A utility to aggregate markdown files into one HTML file.

> **Note**
> This utility requires [Pandoc](http://pandoc.org/) to be installed.

## Usage

```javascript
const vfs = require("vinyl-fs");
const source = require("vinyl-source-stream");
const { streamFileProcess } = require("nwx");

vfs
  .src(globs, { cwd: "/base/path/to/data/" })
  .pipe(streamFileProcess())
  .pipe(source("output.html"))
  .pipe(vfs.dest("/path/to/reports/"));
```

## API

### .streamFileProcess()

This method is a Node Transform Stream, configured for _objectMode_. The data
streamed in is the contents of each markdown file specified in the globs. Each
file is converted to HTML and wrapped with simple HTML for styling hooks. Once
all files are processed, they are concatenated and wrapped once more with HTML
(including CSS) and then written to disc.

Here are some samples globs. Of course, it's up to you how you use the transform
stream - [vinyl-fs](https://www.npmjs.com/package/vinyl-fs) and globbing are not
requirements.

```javascript
// Example: "-f a.md -f b.md -d dir-x" (See CLI)
globs = ["**/a.md", "**/b.md", "dir-x/**/*"];

// Example: "-d dir-x -d dir-y a.md b.md" (See CLI)
globs = ["dir-x/a.md", "dir-x/b.md", "dir-y/a.md", "dir-y/b.md"];
```

### .processFiles(patterns, [options])

#### patterns

_Type:_ `Array`

See supported `minimatch` [patterns](https://github.com/isaacs/minimatch#usage).

#### options.cwd

_Type:_ `String`

This is the fully qualified base path to begin searching for files and directories.

## CLI

```
$ nwx --help

Aggregates files into one html file.

Usage:
  nwx [<options> <args>]

Options:
  --help                Print this help
  --src-dir[=<path>]    Print or set <path> to source directory
  -f <file>             Include all <file>s under 'src-dir'
  -d <dir> [<file>...]  Include files in <dir>. No <file> = all files
  -o [<path>]<file>     Write output to <file>. Default is "wod.html"

Notes:
  The output <path> is relative to 'src-dir'

Examples:
  $ nwx -f a.md -o results/a.html
  $ nwx -d joesmith
  $ nwx -d joesmith -f a.md -f b.md -d maryjones
```

### Options

#### `--src-dir=<path>`

_REQUIRED_ - set via flag or package.json

Specifies the base directory to search for files and directories.

#### `-f <file>`

_REQUIRED_ - if no `-d` option used. Can be used multiple times.

Includes all occurances of `<file>` under `--src-dir`.

#### `-d <dir> [<file>..]`

_REQUIRED_ - if no `-f` option used. Can be used multiple times.

Includes all files under listed directory, each `<dir>` (when no `<file>s`
specified). If `<file>s` are listed, includes _only_ those files under each
`<dir>`. Can be used multiple times.

> The directories listed are relative to the `--src-dir` setting.

#### `-o [<path>]<file>`

_DEFAULT_: `./wod.html`

Specifies the output path and file name. Writes to `<file>` in the current
working directory if no path is given.

## Configuration

If your project has a package.json, you may add configuration there.

```json
{
  "nwx": {
    "src": {
      "dir": "/path/to/work/clients"
    },
    "out": {
      "dir:": "/path/to/reports",
      "file": "report.html"
    }
  }
}
```

**`package.json` settings overrides defaults, so don't set `package.json`
configuration values to `""`, as this will wipe out defaults and throw errors.
The cli flags override `package.json` settings.**

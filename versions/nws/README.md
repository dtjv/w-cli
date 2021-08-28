# nws

A utility to aggregate markdown files into one HTML file.

> **Note**
> This utility requires [Pandoc](http://pandoc.org/) to be installed.

## CLI

```bash
$ nws --help

Usage:
  nws [<options> <args>]

Options:
  --help               Print this help
  --cwd [<path>]       Set or print 'cwd'.
  -f <file>            Include all occurances of <file> under 'cwd'.
  -d <dir> [<file>..]  Include files in <dir>. No <file> = all files.
  -o <file>            Write output to <file>. Default is "nws.html".

Example:
  $ nws -f a.md -o results/a.html
  $ nws -d joesmith
  $ nws -d joesmith -f a.md -f b.md -d maryjones
```

## Options

### `--cwd [<path>]`

This is the base path to begin searching for files and directories. You can set
the value in `package.json`(see [api options](#options_1)) or via the command
line:

```bash
$ nws --cwd
cwd:

$ nws --cwd /Users/joesmith/Dropbox/work/clients/
updated package.json

$ nws --cwd
cwd: /Users/joesmith/Dropbox/work/clients/
```

### `-f <file>`

Convert all occurances of `<file>` in `--cwd` _(including subdirectories)_. Okay
to use multiple times.

```
$ nws -f myFile -f yourFile
```

### `-d <dir> [<file>..]`

To convert all files in `<dir>`:

```
$ nws -d myDir
```

This will convert listed files under each `<dir>`:

```
$ nws -d dirB fileY fileX -d dirA
```

> `<dir>` is relative to `--cwd` configuration setting.

### `-o <file>`

Specify the output file. _Relative paths will be relative to `process.cwd()`_
The default output file is `./nws.html`.

## Programmatic

A Node module is available.

### Usage

```javascript
import nws from "nws";
import vfs from "vinyl-fs";

vfs
  .src(globs)
  .pipe(nws(options))
  .pipe(source("all.html"))
  .pipe(vfs.dest("output"));
```

### API

`nws(options)`

Returns a [transform](https://nodejs.org/api/stream.html#stream_class_stream_transform) stream.

#### Options

Options can be configured in `package.json`:

```json
"nws": {
  "cwd": "/Users/joesmith/Dropbox/work/clients/",
  "format": {
    "src": "markdown",
    "dest": "html"
  },
  "templates": {
    "file": "templates/file.html",
    "final": "templates/final.html"
  }
}
```

#### `nws.cwd`

Required.

This is the base path to begin searching for files and directories.

#### `nws.format`

Optional.

**`nws.format.src`**
_Type:_ `string`

Specifies the format of the source files.

**`nws.format.dest`**
_Type:_ `string`

Specifies the format of the destination files.

The default setting is:

```json
"format": {
  "src": "markdown",
  "dest": "html"
}
```

You can specify any format supported by [Pandoc](http://pandoc.org/).

#### `nws.templates`

**Optional**

No values for these options means the contents will not be wrapped.

##### `nws.templates.file`

_Type:_ `string`

The template file to wrap the contents of each converted file.

**`nws.templates.final`**
_Type:_ `string`

The template file to wrap the converted, concatenated file.

The default setting is:

```json
"templates": {
  "file": "",
  "final": ""
}
```

## Development

NWS is written in ES2015. I used [Gulp](http://gulpjs.com/), which uses
[gulp-babel](https://www.npmjs.com/search?q=gulp-babel) to transpile to ES5.

## Build

```bash
$ gulp
```

The output is in `./dist`.

## Notes

The NPM registry holds v1.0.0 for
[Vinyl-fs](https://www.npmjs.com/package/vinyl-fs). I need v.2.0.0, because it
uses v5.0.0 of [glob-stream](https://github.com/gulpjs/glob-stream).

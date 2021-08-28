const { join } = require("path");

// input:
//   files: ['<file>', '<file>']
//
// return ['**/<file>', '**/<file>']
const makeFileGlobs = (files = []) => files.map((file) => join("**", file));

// input
//   dirs: ['<dir>', '<dir>']
//   files: ['<file>', '<file>'] or []
//
// return ['dir/<file>'] or ['dir/**/*']
const makeDirectoryGlobs = (dirs = [], files = []) => {
  let globs = [];

  dirs.forEach((dir) => {
    globs = files.length
      ? [...globs, ...files.map((file) => join(dir, file))]
      : [...globs, join(dir, "**/*.md")];
  });

  return globs;
};

// f - an array of file names
// d - an array of directory names
// x - an array of extra file names
exports.makeGlobs = ({ f, d, x } = {}) => [
  ...makeFileGlobs(f),
  ...makeDirectoryGlobs(d, x),
];

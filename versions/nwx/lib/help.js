const chalk = require("chalk");

const hdr = chalk.bold;
const opt = chalk.yellow;
const dmo = chalk.green;
const cmd = chalk.magenta.bold.underline;

module.exports = `

  ${hdr("Usage:")}
    ${cmd("nwx")} [<options> <args>]

  ${hdr("Options:")}
    ${opt("--help")}               Print this help
    ${opt("--src-dir[=<path>]")}   Print or set <path> to source directory
    ${opt("-f <file>")}            Include all <file>s under 'src-dir'
    ${opt("-d <dir> [<file>...]")} Include files in <dir>. No <file> = all files
    ${opt("-o [<path>]<file>")}    Write output to <file>. Default: './out.html'

  ${hdr("Examples:")}
    ${dmo("$ nwx -f a.md -o results/a.html")}
    ${dmo("$ nwx -d joesmith")}
    ${dmo("$ nwx -d joesmith -f a.md -f b.md -d maryjones")}
  \n
`;

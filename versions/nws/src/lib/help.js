import { styles } from "./utils";

const { hdr, cmd, opt, ex } = styles;

export default `
${hdr("Usage:")}
  ${cmd("nws")} [<options> <args>]

${hdr("Options:")}
  ${opt("--help")}               Print this help
  ${opt("--cwd [<path>]")}       Set or print 'cwd'.
  ${opt("-f <file>")}            Include all occurances of <file> under 'cwd'.
  ${opt("-d <dir> [<file>..]")}  Include files in <dir>. No <file> = all files.
  ${opt("-o <file>")}            Write output to <file>. Default is "nws.html".

${hdr("Example:")}
  ${ex("$ nws -f a.md -o results/a.html")}
  ${ex("$ nws -d joesmith")}
  ${ex("$ nws -d joesmith -f a.md -f b.md -d maryjones")}
`;

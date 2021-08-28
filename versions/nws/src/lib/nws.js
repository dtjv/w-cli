import pdc from "pdc";
import chalk from "chalk";
import through from "through2";

// TODO: remove. put in cli. pass in.
import fileT from "./templates/file";
import finalT from "./templates/final";

/*
  The config for this module is:

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

  It's `cli.js` responsibility to pass this object in correctly
 */

// TODO: pass in `pkg.nws`. deconstruct entire object
const nws = (cwd, { format = { src: "markdown", dest: "html" } } = {}) => {
  const files = [];

  const write = (file, _, cb) => {
    if (file.isNull()) {
      return cb(null, file);
    }

    const fn = file.path.replace(cwd, "");
    console.log(
      `${chalk.green("added:")} ${fn} ${
        !file.stat.size ? chalk.bold.red(" (empty)") : ""
      }`
    );

    if (file.stat.size) {
      pdc(file.contents.toString(), format.src, format.dest, (err, result) => {
        if (err) {
          throw err;
        }

        files.push(fileT.replace("$body$", result));
        cb();
      });
    } else {
      cb();
    }
  };

  const flush = function () {
    this.push(finalT.replace("$body$", files.join("\n")));
  };

  return through.obj(write, flush);
};

export default nws;

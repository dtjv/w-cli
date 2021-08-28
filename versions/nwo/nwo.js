#!/usr/bin/env node

"use strict";

var fs = require("fs");
var util = require("util");
var chalk = require("chalk");
var _ = require("lodash");
var path = require("path");
var exec = require("child_process").execSync;
var parseArgs = require("minimist");
var jsonMinify = require("jsonminify");

var help = [
  "<section>Usage:</section>",
  "",
  "  <cmd>nwo</cmd> -h",
  "  <cmd>nwo</cmd> [-c FILE]",
  "  <cmd>nwo</cmd> [-c FILE] --t=day -i FILE -o FILE",
  "  <cmd>nwo</cmd> [-c FILE] --t=client -d DIR -o FILE (-a | FILE [FILE...])",
  "",
  "<section>Description:</section>",
  "",
  "  Builds an html file with workouts for a day or workouts for a client.",
  "",
  "<section>Options:</section>",
  "  Command line options override settings in configuration file.",
  "",
  "  <flag>-h | --help</flag>",
  "    Prints usage instructions.",
  "",
  "  <flag>-c FILE</flag>",
  "    Sets FILE as configuration. Include full path. Default is `./nwo.json`",
  "",
  "  <flag>--t=[day|client]</flag>",
  "    Sets type of build.",
  "",
  "  <flag>-i FILE</flag>",
  "    The markdown file to convert. Relative to `client_folder` setting in",
  "    configuration file. Valid only when `--t=day` is used.",
  "",
  "  <flag>-o FILE</flag>",
  "    Writes output to FILE. Include full path.",
  "",
  "  <flag>-d DIR</flag>",
  "    Specify the client directory. Relative to `client_folder` setting in",
  "    configuration file. Valid only when `--t=client` is used.",
  "",
  "  <flag>-a | FILE [FILE...]</flag>",
  "    Use `-a` to process all files in client DIR. Otherwise, list files by",
  "    name(space separated). Valid only when `--t=client` is used.",
  "",
];

/*
 * Returns a string of help text, with coloring!
 */
var getUsage = function () {
  return help
    .join("\n")
    .replace(/<section>(\w+:)<\/section>/g, chalk.white.bold("$1"))
    .replace(/<cmd>(\w+)<\/cmd>/g, chalk.magenta.bold.underline("$1"))
    .replace(/<flag>(.*)<\/flag>/g, chalk.yellow.bold("$1"))
    .replace(/<example>(\w+:)<\/example>/g, chalk.green("$1"));
};

/*
 * An IIFE returns an instance of Config, with composable methods that:
 * 1. retrieve config data from a configuration file
 * 2. override config data with command line arguments
 * 3. validate config data to ensure all dependencies exist
 */
var config = (function () {
  function Config() {
    this.cfg = {};
  }

  Config.prototype = {
    init: function (options) {
      this.argv = options.argv;
      this.file = this.argv.c || "nwo.json";
      return this;
    },

    // reads settings from config file, stripping comments
    get: function () {
      var data = fs.readFileSync(this.file, "utf8");
      this.cfg = JSON.parse(jsonMinify(data));
      return this;
    },

    // command line arguments override config file settings
    override: function () {
      var cfg = this.cfg;
      var argv = this.argv;

      var interpolate = function (match, p1) {
        var file = "";

        switch (p1.toUpperCase()) {
          case "DAY":
            file = cfg.input_file;
            break;
          case "CLIENT":
            file = cfg.client_directory;
            break;
        }
        return file ? path.parse(file).name + ".html" : match;
      };

      cfg.build_type = argv.t || cfg.build_type;
      cfg.input_file = argv.i || cfg.input_file;
      cfg.client_directory = argv.d || cfg.client_directory;
      cfg.process_all_files = argv.a || cfg.process_all_files;

      if (argv.o) {
        cfg.output_path = path.dirname(argv.o);
        cfg.output_file = path.basename(argv.o);
      }

      cfg.output_file = cfg.output_file.replace(
        /{{(day|DAY|client|CLIENT)}}/g,
        interpolate
      );

      if (!_.isEmpty(argv._)) {
        cfg.client_files = argv._;
      }

      return this;
    },

    // ensure we have what we need. throws an error if settings are missing.
    validate: function () {
      var cfg = this.cfg;
      var msg = [];
      var type = cfg.build_type.toUpperCase();

      if (["DAY", "CLIENT"].indexOf(type) === -1) {
        msg.push("Invalid `build_type`.");
      }

      switch (type) {
        case "DAY":
          if (cfg.input_file === "") {
            msg.push("No `input_file`.");
          }
          break;
        case "CLIENT":
          if (cfg.client_directory === "") {
            msg.push("No `client_directory`.");
          }

          if (
            cfg.process_all_files !== "" &&
            !_.isBoolean(cfg.process_all_files)
          ) {
            msg.push("Invalid `process_all_files`.");
          }

          if (!cfg.process_all_files && _.isEmpty(cfg.client_files)) {
            msg.push("No files provided");
          }
          break;
      }

      if (cfg.output_file === "") {
        msg.push("No `output_file`.");
      }

      if (msg.join("").length) {
        throw new Error(chalk.red(msg.join("\n")));
      }

      return this;
    },
  };

  return new Config();
})();

/*
 * main IIFE.
 */
(function () {
  var argv = parseArgs(process.argv.slice(2));

  if (argv.h || argv.help) {
    return console.log(getUsage());
  }

  try {
    var cfg = config.init({ argv: argv }).get().override().validate().cfg;
  } catch (error) {
    return console.log(error.message);
  }

  /*
   * A helper function to run `pandoc`.
   */
  var convert = function (input, part, pandoc) {
    try {
      exec(pandoc.replace("{{input}}", input), {
        stdio: ["ignore", "ignore", "ignore"],
      });
      console.log(
        chalk.green("added:") + " %s %s",
        part,
        !fs.statSync(input).size ? chalk.bold.red(" (empty)") : ""
      );
    } catch (e) {}
  };

  var temp = "tmp";
  var head = path.join(cfg.templates_folder, cfg.templates.head);
  var body = path.join(cfg.templates_folder, cfg.templates.body);
  var tail = path.join(cfg.templates_folder, cfg.templates.tail);
  var pandoc = [
    "pandoc",
    "{{input}}",
    "-f markdown",
    "-t html5",
    "--template " + body,
    ">> " + temp,
  ].join(" ");

  switch (cfg.build_type.toUpperCase()) {
    case "DAY":
      var clients = fs.readdirSync(cfg.clients_folder);

      clients.forEach(function (client) {
        var input = path.join(cfg.clients_folder, client, cfg.input_file);
        convert(input, client, pandoc);
      });

      break;
    case "CLIENT":
      var client = path.join(cfg.clients_folder, cfg.client_directory);

      if (cfg.process_all_files) {
        cfg.client_files = fs.readdirSync(client);
      }

      cfg.client_files.forEach(function (file) {
        var input = path.join(client, file);
        convert(input, file, pandoc);
      });

      break;
  }

  exec(
    [
      "cat",
      head,
      temp,
      tail,
      ">",
      path.join(cfg.output_path, cfg.output_file),
    ].join(" ")
  );
  exec(["rm -f", temp].join(" "));
})();

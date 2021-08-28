import chalk from "chalk";

const styles = {
  hdr: chalk.bold,
  cmd: chalk.magenta.bold.underline,
  opt: chalk.yellow,
  ex: chalk.green,
};

const err = (error) => {
  console.error(chalk.red(`ERROR: ${error.message}`));
  process.exit(1);
};

const log = (msg, exit) => {
  console.log(chalk.cyan(msg));
  if (exit) {
    process.exit(1);
  }
};

const isEmpty = (obj) => {
  return Reflect.ownKeys(obj).length === 0;
};

export { styles, err, log, isEmpty };

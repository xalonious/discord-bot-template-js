const chalk = require("chalk").default;
const boxen = require("boxen").default;

const brand = chalk.bold.cyan;
const ok = chalk.green;
const warn = chalk.yellow;
const err = chalk.red;
const dim = chalk.gray;

function banner(lines) {
  const text = lines.join("\n");
  console.log(
    boxen(text, {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: "cyan",
    })
  );
}

module.exports = {
  brand, ok, warn, err, dim, banner,
};

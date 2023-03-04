const execSync = require("child_process").execSync;
const command = process.argv.slice(2).join(" ");
const result = execSync("git rev-parse --abbrev-ref HEAD");
const branchName = result.toString().trim();
execSync(`STORYBOOK_BRANCH_NAME=${branchName} ${command}`, {
  stdio: "inherit",
});

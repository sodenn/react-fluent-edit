const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function getTag() {
  const args = process.argv.slice(2);
  let branchName = args.length > 0 ? args[0] : undefined;

  const { stdout: currentBranch } = await exec("git branch --show-current");
  branchName = branchName || currentBranch;

  if (!branchName) {
    throw new Error("branchName is undefined");
  }

  const tag = branchName.trim() === "main" ? "next" : "beta";
  console.log(tag);

  return tag;
}

getTag();

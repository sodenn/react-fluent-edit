const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function getVersion() {
  const args = process.argv.slice(2);
  let branchName = args.length > 0 ? args[0] : undefined;

  const { stdout: currentBranch } = await exec("git branch --show-current");
  branchName = branchName || currentBranch;

  if (!branchName) {
    throw new Error("branchName is undefined");
  }

  const tag =
    branchName.trim() === "main"
      ? "next"
      : branchName.trim().replaceAll(/[^a-zA-Z0-9]/g, "-");

  const { stdout: latestVersion } = await exec(
    "npm show @react-fluent-edit/core version"
  );

  const version = `${latestVersion.trim()}-${tag}`;

  let count = -1;
  let exists = true;
  while (exists || count > 100) {
    count++;
    const { stdout: prevVersionsStr } = await exec(
      `npm show @react-fluent-edit/core@${version}.${count} version`
    );
    exists = !!prevVersionsStr;
  }

  const nextVersion = `${version}.${count}`;

  console.log(nextVersion);
  return nextVersion;
}

getVersion();

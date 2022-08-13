const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function getVersion() {
  const args = process.argv.slice(2);
  let branchName = args.length > 0 ? args[0] : undefined;

  const { stdout: latestVersion } = await exec(
    "npm show @react-fluent-edit/core version"
  );

  const { stdout: currentBranch } = await exec("git branch --show-current");
  branchName = branchName || currentBranch;

  if (!branchName) {
    throw new Error("branchName is undefined");
  }

  const tag =
    branchName.trim() === "main"
      ? "next"
      : branchName.trim().replaceAll(/[^a-zA-Z0-9]/g, "-");

  const version = `${latestVersion.trim()}-${tag}`;

  let count = 0;
  const { stdout: prevVersionsStr } = await exec(
    `npm show @react-fluent-edit/core@${version} version --json`
  );
  try {
    let prevVersions = JSON.parse(prevVersionsStr);
    prevVersions = prevVersions.sort((a, b) => b.localeCompare(a));
    const prevVersion = prevVersions[0];
    const prevCount = prevVersion.substring(prevVersion.lastIndexOf(".") + 1);
    count = parseInt(prevCount) + 1;
  } catch (e) {
    //
  }

  const betaVersion = `${version}.${count}`;

  console.log(betaVersion);
  return betaVersion;
}

getVersion();

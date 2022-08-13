const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function getVersion() {
  const { stdout: latestVersion } = await exec(
    "npm show @react-fluent-edit/core version"
  );

  const { stdout: currentBranch } = await exec("git branch --show-current");
  const tag =
    currentBranch.trim() === "main"
      ? "next"
      : currentBranch.trim().replaceAll(/[^a-zA-Z0-9]/g, "-");

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

const util = require("util");
const exec = util.promisify(require("child_process").exec);

const corePkg = "@react-fluent-edit/core";

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

  const { stdout: latestVersion } = await exec(`npm show ${corePkg} version`);

  const version = `${latestVersion.trim()}-${tag}`;

  let count = 0;
  const { stdout: allVersions } = await exec(
    `npm show ${corePkg} versions --json`
  );
  try {
    const prevVersions = JSON.parse(allVersions)
      .sort((a, b) => b.localeCompare(a))
      .filter((v) => v.startsWith(version));
    if (prevVersions.length > 0) {
      const prevVersion = prevVersions[0];
      const prevCount = prevVersion.substring(prevVersion.lastIndexOf(".") + 1);
      count = parseInt(prevCount) + 1;
    }
  } catch (e) {
    //
  }

  const nextVersion = `${version}.${count}`;

  console.log(nextVersion);
  return nextVersion;
}

getVersion();

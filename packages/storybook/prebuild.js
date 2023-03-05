const { writeFileSync } = require("fs");
const { execSync } = require("child_process");

const isVercel = process.env.VERCEL === "1" || false;

if (isVercel) {
  writeFileSync(
    ".env.local",
    `STORYBOOK_BRANCH_NAME=${process.env.VERCEL_GIT_COMMIT_REF}`
  );
} else {
  const result = execSync("git rev-parse --abbrev-ref HEAD");
  const branchName = result.toString().trim();
  writeFileSync(".env.local", `STORYBOOK_BRANCH_NAME=${branchName}`);
}

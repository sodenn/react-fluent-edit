const path = require("path");
const { exec } = require("child_process");

const packagePath = process.cwd();
const libPath = path.join(packagePath, "./lib");

function publish() {
  const tagName = process.env.TAG_NAME;
  const cmd = tagName
    ? `npm publish --access public --tag ${tagName}`
    : "npm publish --access public";
  exec(cmd, { cwd: libPath }, (error, stdout, stderr) => {
    console.log(`stdout: ${stdout}`);
    console.error(`error: ${error}`);
    console.error(`stderr: ${stderr}`);
  });
}

publish();

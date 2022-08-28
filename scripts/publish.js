const path = require("path");
const { exec } = require("child_process");

const packagePath = process.cwd();
const libPath = path.join(packagePath, "./lib");

function publish() {
  const tagName = process.env.TAG_NAME;
  const cmd = tagName
    ? `yarn npm publish --tolerate-republish --access public --tag ${tagName}`
    : "yarn npm publish --tolerate-republish --access public";
  exec(cmd, { cwd: libPath }, (error, stdout) => {
    if (error) {
      console.error(`exec error: ${error}`);
    } else {
      console.log(`stdout: ${stdout}`);
    }
  });
}

publish();

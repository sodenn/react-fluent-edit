/* eslint-disable no-console */
const path = require("path");
const fse = require("fs-extra");
const glob = require("fast-glob");

const packagePath = process.cwd();
const rootPath = path.join(packagePath, "../..");
const libPath = path.join(packagePath, "./lib");
const srcPath = path.join(packagePath, "./src");

/**
 * Puts a package.json into every immediate child directory of rootDir.
 * That package.json contains information about esm for bundlers.
 *
 * It also tests that this import can be used in TypeScript by checking
 * if an index.d.ts is present at that path.
 *
 * @param {object} param0
 * @param {string} param0.from
 * @param {string} param0.to
 */
async function createModulePackages({ from, to }) {
  const directoryPackages = glob
    .sync("*/index.{js,ts,tsx}", { cwd: from })
    .map(path.dirname);

  await Promise.all(
    directoryPackages.map(async (directoryPackage) => {
      const packageJsonPath = path.join(to, directoryPackage, "package.json");
      const topLevelPathImportsAreEcmaScriptModules = await fse.pathExists(
        path.resolve(path.dirname(packageJsonPath), "../cjs")
      );

      const packageJson = {
        module: "./index.js",
        main: topLevelPathImportsAreEcmaScriptModules
          ? path.posix.join("../cjs", directoryPackage, "index.js")
          : "./index.js",
        types: "./index.d.ts",
      };

      const [typingsEntryExist, moduleEntryExists, mainEntryExists] =
        await Promise.all([
          fse.pathExists(
            path.resolve(path.dirname(packageJsonPath), packageJson.types)
          ),
          fse.pathExists(
            path.resolve(path.dirname(packageJsonPath), packageJson.module)
          ),
          fse.pathExists(
            path.resolve(path.dirname(packageJsonPath), packageJson.main)
          ),
          fse.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2)),
        ]);

      const manifestErrorMessages = [];
      if (!typingsEntryExist) {
        manifestErrorMessages.push(
          `'types' entry '${packageJson.types}' does not exist`
        );
      }
      if (!moduleEntryExists) {
        manifestErrorMessages.push(
          `'module' entry '${packageJson.module}' does not exist`
        );
      }
      if (!mainEntryExists) {
        manifestErrorMessages.push(
          `'main' entry '${packageJson.main}' does not exist`
        );
      }
      if (manifestErrorMessages.length > 0) {
        // TODO: AggregateError
        throw new Error(
          `${packageJsonPath}:\n${manifestErrorMessages.join("\n")}`
        );
      }

      return packageJsonPath;
    })
  );
}

async function createPackageFile() {
  const packageData = await fse.readFile(
    path.resolve(packagePath, "./package.json"),
    "utf8"
  );
  const { scripts, devDependencies, ...packageDataOther } =
    JSON.parse(packageData);

  const dependencies = packageDataOther.dependencies || {};
  Object.keys(dependencies).forEach((pkgName) => {
    const pkgVersion = dependencies[pkgName];
    if (pkgVersion === "workspace:*") {
      dependencies[pkgName] = packageDataOther.version;
    }
  });

  const newPackageData = {
    ...packageDataOther,
    main: "./cjs/index.js",
    module: "./index.js",
    types: "./index.d.ts",
  };

  const targetPath = path.resolve(libPath, "./package.json");

  await fse.writeFile(
    targetPath,
    JSON.stringify(newPackageData, null, 2),
    "utf8"
  );
}

async function addLicense() {
  const data = await fse.readFile(path.resolve(rootPath, "./LICENSE"), "utf8");
  await fse.writeFile(path.resolve(libPath, "./LICENSE"), data, "utf8");
}

async function run() {
  try {
    await createPackageFile();
    await addLicense();
    await createModulePackages({ from: srcPath, to: libPath });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();

const path = require("path");
const { findWorkspaceDir } = require("@pnpm/find-workspace-dir");
const { readPackageJsonFromDir } = require("@pnpm/read-package-json");
const {
  findWorkspacePackagesNoCheck,
} = require("@pnpm/find-workspace-packages");

const isEnvManagerEnabled = (pkg) => {
  if (pkg.envan) {
    return true;
  } else {
    return false;
  }
};

const getManagerConfig = (pkg) => ({
  packageName: pkg.name,
  envPath: path.join(pkg.dir, ".env"),
  envExamplePath: path.join(pkg.dir, ".env.example"),
  envLocalPath: path.join(pkg.dir, ".env.local"),
  ssmPaths: pkg.envan.ssmPaths,
});

const getWorkspace = async () => {
  const workspace = await findWorkspaceDir(process.cwd());
  return workspace;
};
// get all workspace packages
const getWorkspacePackages = async () => {
  const workspace = await getWorkspace();
  console.log("workspace root: ", workspace);
  const packages = await findWorkspacePackagesNoCheck(workspace);
  console.log(`found ${packages.length} packages in workspace`);
  const envPackages = packages
    .map((pkg) => ({
      ...pkg.manifest,
      dir: pkg.dir,
    }))
    .filter(isEnvManagerEnabled)
    .map(getManagerConfig);
  console.log(`found ${envPackages.length} packages with envman enabled`);
  return envPackages;
};

// get package
const getPackage = async () => {
  const pkg = await readPackageJsonFromDir(process.cwd());
  pkg.dir = process.cwd();

  if (isEnvManagerEnabled(pkg)) {
    return getManagerConfig(pkg);
  }
  return false;
};

module.exports = {
  getWorkspace,
  getWorkspacePackages,
  getPackage,
};

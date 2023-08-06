const fs = require("fs");

const { getWorkspacePackages, getPackage } = require("./pm/pnpm/getConfig");
const { writeEnvExample } = require("./writeExampleEnv");

const genExample = async ({ env, profile, workspace }) => {
  try {
    if (workspace) {
      const pkgs = await getWorkspacePackages();
      for (const pkg of pkgs) {
        await writeEnvExample(profile, pkg.ssmPaths[env], pkg);
      }
    } else {
      const pkg = await getPackage();
      if (pkg) {
        await writeEnvExample(profile, pkg.ssmPaths[env], pkg);
      }
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const cleanEnvExample = async ({ workspace }) => {
  if (workspace) {
    const pkgs = await getWorkspacePackages();
    pkgs.forEach(async (pkg) => {
      console.log(`cleaning ${pkg.packageName} .env.example`);
      if (fs.existsSync(pkg.envExamplePath)) {
        fs.unlinkSync(pkg.envExamplePath);
      }
    });
    console.log("removed all .env.example files from workspace");
    return true;
  }
  const pkg = await getPackage();
  if (pkg) {
    console.log(`cleaning ${pkg.packageName} .env.example`);
    if (fs.existsSync(pkg.envExamplePath)) {
      fs.unlinkSync(pkg.envExamplePath);
      return true;
    }
  }
  return false;
};

module.exports = {
  genExample,
  cleanEnvExample,
};

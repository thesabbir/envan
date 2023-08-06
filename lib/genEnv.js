const fs = require("fs");
const { getPackage, getWorkspacePackages } = require("./pm/pnpm/getConfig");
const { writeEnv } = require("./writeEnv");

const genEnvFile = async ({ profile, workspace, env }) => {
  try {
    if (workspace) {
      const packages = await getWorkspacePackages();
      for (const pkg of packages) {
        await writeEnv(profile, pkg.ssmPaths[env], pkg);
      }
    } else {
      const pkg = await getPackage();
      await writeEnv(profile, pkg.ssmPaths[env], pkg);
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const cleanEnv = async ({ workspace }) => {
  if (workspace) {
    const packages = await getWorkspacePackages();
    for (const pkg of packages) {
      if (fs.existsSync(pkg.envPath)) {
        fs.unlinkSync(pkg.envPath);
      }
    }
    console.log("removed all .env files from workspace");
    return true;
  }
  const package = await getPackage();
  if (package) {
    if (fs.existsSync(package.envPath)) {
      fs.unlinkSync(package.envPath);
      console.log(`removed ${package.packageName} .env`);
      return true;
    }
  }
  return false;
};

module.exports = {
  genEnvFile,
  cleanEnv,
};

const fs = require("fs");
const { getAllParameters } = require("./providers/aws/getSSM");

/**
 *
 * @param {String} profile
 * @param {String} ssmPath
 * @param {Object} pkg
 */
const writeEnv = async (profile, ssmPath, pkg) => {
  if (fs.existsSync(pkg.envPath)) {
    console.log(`skipping ${pkg.packageName} because .env file exists`);
    return false;
  }
  const envs = await getAllParameters(profile, ssmPath);
  const getKey = (p) => p.Name.replace(`${ssmPath}/`, "");
  const envContent = envs.map((p) => `${getKey(p)}=${p.Value}`).join("\n");
  fs.writeFileSync(pkg.envPath, envContent);
  console.info(`created ${pkg.envPath}`);
};

exports.writeEnv = writeEnv;

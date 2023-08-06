const fs = require("fs");
const { getAllParameters } = require("./providers/aws/getSSM");

/**
 *
 * @param {String} profile
 * @param {String} ssmPath
 * @param {Object} pkg
 */
const writeEnvExample = async (profile, ssmPath, pkg) => {
  if (fs.existsSync(pkg.envExamplePath)) {
    console.log(
      `skipping ${pkg.envExamplePath} because .env.example file exists`
    );
    return false;
  }
  const envs = await getAllParameters(profile, ssmPath);
  const getKey = (p) => p.Name.replace(`${ssmPath}/`, "");
  const getValue = (p) => {
    const key = getKey(p);
    return `\${SSM_PATH}/${key}`;
  };
  const envContent = envs.map((p) => `${getKey(p)}=${getValue(p)}`).join("\n");
  fs.writeFileSync(pkg.envExamplePath, envContent);
  console.info(`created ${pkg.envExamplePath}`);
};

exports.writeEnvExample = writeEnvExample;

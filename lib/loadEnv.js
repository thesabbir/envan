const dotEnvConfig = require("dotenv").config;
const dotEnvExpand = require("dotenv-expand").expand;

function loadEnv() {
  try {
    const local = dotEnvConfig({ path: ".env.local", override: true });
    if (local.parsed) dotEnvExpand(local);
  } catch (e) {
    // ignore
  }

  try {
    const env = dotEnvConfig({ override: false });
    dotEnvExpand(env.parsed);
    if (env.error) {
      throw env.error;
    }
  } catch (e) {
    console.warn("Failed to load .env"); // eslint-disable-line no-console
  }
}

module.exports = {
  loadEnv,
};

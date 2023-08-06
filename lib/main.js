const { cleanEnvExample, genExample } = require("./genExample");
const { cleanEnv, genEnvFile } = require("./genEnv");
const { getWorkspace } = require("./pm/pnpm/getConfig");

async function main({
  env = "dev",
  profile = "default",
  force = false,
  workspace = false,
  example = false,
}) {
  if (workspace) {
    const workspaceRoot = await getWorkspace();
    if (!workspaceRoot) {
      console.error("PNPM workspace not found!");
      process.exit(1);
    }
  }
  if (force) await cleanEnv({ workspace });
  await genEnvFile({ env, profile, workspace });
  if (example) {
    if (force) await cleanEnvExample({ workspace });
    await genExample({ env, profile, workspace });
  }
}

async function clean({ workspace = false, example = false }) {
  const workspaceRoot = await getWorkspace();
  if (!workspaceRoot) {
    console.error("PNPM workspace not found!");
    process.exit(1);
  }
  await cleanEnv({ workspace });
  if (example) {
    await cleanEnvExample({ workspace });
  }
}

exports.main = main;
exports.clean = clean;

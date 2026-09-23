const path = require("path");
const { spawnSync } = require("child_process");

function runScript(scriptName) {
  const scriptPath = path.join(__dirname, scriptName);
  const result = spawnSync(process.execPath, [scriptPath], {
    stdio: "inherit",
    env: {
      ...process.env,
    },
  });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

async function main() {
  runScript("structureData.js");
  runScript("plpSliderGenerator.js");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

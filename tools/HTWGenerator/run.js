const path = require("path");
const { spawnSync } = require("child_process");

function runScript(scriptName) {
  const scriptPath = path.join(__dirname, scriptName);

  const result = spawnSync(process.execPath, [scriptPath], {
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

runScript("structureData.js");
runScript("htwGenerator.js");

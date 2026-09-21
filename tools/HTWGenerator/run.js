const path = require("path");
const { spawnSync } = require("child_process");
const readline = require("readline/promises");

const STORE_OPTIONS = {
  1: "bps",
  2: "cab",
  3: "mpw",
  4: "bps ca",
  bps: "bps",
  cab: "cab",
  mpw: "mpw",
  "bps ca": "bps ca",
  bpsca: "bps ca",
  canada: "bps ca",
};

function normalizeStore(input) {
  return (
    STORE_OPTIONS[
      String(input || "")
        .trim()
        .toLowerCase()
    ] || null
  );
}

function runScript(scriptName, extraEnv = {}) {
  const scriptPath = path.join(__dirname, scriptName);

  const result = spawnSync(process.execPath, [scriptPath], {
    stdio: "inherit",
    env: {
      ...process.env,
      ...extraEnv,
    },
  });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

async function promptForStore() {
  const cliStore = normalizeStore(process.argv[2]);

  if (cliStore) {
    return cliStore;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    while (true) {
      const answer = await rl.question(
        "Which store is this for? (1=bps, 2=cab, 3=mpw, 4=bps ca): ",
      );

      const selectedStore = normalizeStore(answer);

      if (selectedStore) {
        return selectedStore;
      }

      console.log(
        "Invalid store. Enter 1, 2, 3, 4 or one of: bps, cab, mpw, bps ca.",
      );
    }
  } finally {
    rl.close();
  }
}

async function main() {
  const store = await promptForStore();

  runScript("structureData.js");
  runScript("htwGenerator.js", {
    HTW_STORE: store,
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

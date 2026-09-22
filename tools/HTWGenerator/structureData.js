const fs = require("fs");
const path = require("path");

const rawData = `Ravin Crossbows R29X Sniper Crossbow Package	3995571	Compare to 	$2,849.99	Now 	$1,799.97						https://www.cabelas.com/p/ravin-crossbows-r29x-sniper-crossbow-package-101558121	FALSE
Browning AB3 Pro Composite Bolt-Action Rifle with Vortex Scope	4782478	Was 	$899.99	Now 	$799.98				Compare to $1049.99 if purchased separately!	New!	https://www.basspro.com/p/browning-ab3-pro-composite-bolt-action-rifle-with-vortex-crossfire-hd-scope	TRUE
Cabela's 1500R Rangefinder	4791217	Was 	$129.99	Now 	$99.98				Save $30		https://www.basspro.com/p/cabelas-1500r-laser-rangefinder	FALSE
Cabela's Big Outdoorsman Muskoka Chair	3491150	Was 	$89.99			$59.98	Save $30	9/30/26			https://www.basspro.com/p/cabelas-big-outdoorsman-muskoka-chair	FALSE
Natural Reflections Harbor Sweatshirt	4710632	Was 	$34.99	Now 	$25.98				Save 25%	Relaxed Fit	https://www.basspro.com/p/natural-reflections-harbor-sweatshirt	FALSE
Garmin LiveScope 2 HD LVS42HD Live-Sonar Transducer	5057196		$2,199.99							NEW for 2026!	https://www.basspro.com/p/garmin-livescope-2-hd-lvs42hd-live-sonar-transducer	FALSE
Men's Cabela's Iron Ridge GORE-TEX Insulated Hunting Boots	4170654	Was 	$169.99	Now 	$119.98				Save $50	400-gram 3M™ Thinsulate™ Insulation	https://www.basspro.com/p/cabelas-iron-ridge-gore-tex-insulated-hunting-boots-for-men-101649154	FALSE
Moultrie Edge Solar Cellular Camera	4383549	Was 	$149.99	Now 	$79.98				Save $70	Lowest price of the year!	https://www.basspro.com/p/moultrie-edge-solar-panel-camera-combo	FALSE
Men's Ascend Elevate Softshell Jacket	4329316	Was 	$80	Now 	$59.98				Save 25%	Moisture-wicking!	https://www.basspro.com/p/ascend-elevate-softshell-jacket	FALSE`;

const cloudinaryBaseULR = `https://assets.basspro.com/image/upload/v1789401418/DigitalCreative/2026/BPS_CAB/Campaigns/Wk38_FallSavings_17-Sep/Homepage/HTW/BPS-HTW-0`;

class HotThisWeekItem {
  constructor(
    id,
    position,
    productTitle,
    featureSKU,
    image,
    wasCompareCallout,
    regPrice,
    nowCallout,
    nowPrice,
    CLUBPrice,
    CLUBSavings,
    CLUBExp,
    textCallout,
    imgCallout,
    URL,
    googleSafe,
  ) {
    this.id = id;
    this.position = position;
    this.productTitle = productTitle;
    this.featureSKU = featureSKU;
    this.image = image;
    this.wasCompareCallout = wasCompareCallout;
    this.regPrice = regPrice;
    this.nowCallout = nowCallout;
    this.nowPrice = nowPrice;
    this.CLUBPrice = CLUBPrice;
    this.CLUBSavings = CLUBSavings;
    this.CLUBExp = CLUBExp;
    this.textCallout = textCallout;
    this.imgCallout = imgCallout;
    this.URL = URL;
    this.googleSafe = googleSafe;
  }
}

const htwItems = [];
const gSafe = [];

function structureData(cdnBaseUrl) {
  function splitTsvRow(row) {
    const fields = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < row.length; i += 1) {
      const char = row[i];

      if (char === '"') {
        const nextChar = row[i + 1];

        if (inQuotes && nextChar === '"') {
          current += '"';
          i += 1;
          continue;
        }

        inQuotes = !inQuotes;
        continue;
      }

      if (char === "\t" && !inQuotes) {
        fields.push(current.trim());
        current = "";
        continue;
      }

      current += char;
    }

    fields.push(current.trim());
    return fields;
  }

  function buildRows(str) {
    return str
      .split(/\r?\n/)
      .map((row) => splitTsvRow(row))
      .filter((fields) => fields.some((field) => field !== ""));
  }

  function toFixedWidthRow(fields, width) {
    const row = [...fields];

    if (row.length < width) {
      row.push(...new Array(width - row.length).fill(""));
    }

    if (row.length > width) {
      return row.slice(0, width);
    }

    return row;
  }

  const rows = buildRows(rawData);
  let count = 0;
  let id = 0;

  while (rows.length > 0) {
    count += 1;
    id += 1;

    const data = toFixedWidthRow(rows.shift(), 13);

    const item = new HotThisWeekItem(
      id,
      count,
      data[0],
      data[1],
      cdnBaseUrl + count + ".png?$bpssite_default$",
      data[2],
      data[3],
      data[4],
      data[5],
      data[6],
      data[7],
      data[8],
      data[9],
      data[10],
      data[11],
      data[12],
    );

    htwItems.push(item);

    if (data[12] === "TRUE") {
      if (rows.length === 0) {
        break;
      }

      id += 1;
      const gSafeData = toFixedWidthRow(rows.shift(), 13);

      const gSafeItem = new HotThisWeekItem(
        id,
        count,
        gSafeData[0],
        gSafeData[1],
        cdnBaseUrl + count + "-GS" + ".png?$bpssite_default$",
        gSafeData[2],
        gSafeData[3],
        gSafeData[4],
        gSafeData[5],
        gSafeData[6],
        gSafeData[7],
        gSafeData[8],
        gSafeData[9],
        gSafeData[10],
        gSafeData[11],
        gSafeData[12],
      );

      gSafe.push(gSafeItem);
      console.log(gSafeItem);
    }
  }

  const structuredData = {
    htw: {
      items: htwItems,
      gSafe: gSafe,
    },
  };
  return structuredData;
}

const htwJson = structureData(cloudinaryBaseULR);

module.exports = htwJson;

if (require.main === module) {
  const outputPath = path.join(__dirname, "htw.json");
  fs.writeFileSync(
    outputPath,
    JSON.stringify(htwJson, null, 2) + "\n",
    "utf-8",
  );
  console.log(`Wrote HTW data to ${outputPath}`);
}

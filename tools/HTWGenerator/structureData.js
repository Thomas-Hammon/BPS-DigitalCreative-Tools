const fs = require("fs");
const path = require("path");

const rawData = `Men's RedHead Thermal Henley Long-Sleeve Shirt	3926910	Was starting at 	$24.99	Now 	$19.98				Save up to 33%		https://www.basspro.com/p/redhead-thermal-henley-long-sleeve-shirt-for-men	FALSE
Humminbird XPLORE 9 CMSI+ CHIRP MEGA SI Fish Finder and MEGA Live 2 Imaging Transducer Bundle	4820284	Was 	$3,099.98	Now 	$2,799.96				Save $300	Minn Kota Compatibility! 	https://www.basspro.com/p/humminbird-xplore-9-cmsi-chirp-mega-si-fish-finder-chartplotter-and-mega-live-2-imaging-transducer-bundle	FALSE
Ravin Crossbows R29X Sniper Crossbow Package	3995571	Compare to 	$2,849.99	Now 	$1,799.97				Save $1,050	Bass Pro Shops & Cabela's Exclusive	https://www.basspro.com/p/ravin-crossbows-r29x-sniper-crossbow-package-101558121	FALSE
Men's Ascend Apex LT Mid Waterproof Hiking Boots	4547602	Was 	$200.00	Now 	$149.98				Save 25%	New for 2026!	https://www.basspro.com/p/ascend-apex-lt-mid-waterproof-hiking-boots-for-men	FALSE
Browning AB3 Pro Composite Bolt-Action Rifle with Vortex Scope	4782454	Was 	$899.99	Now 	$799.98				Save $100	New! Bass Pro Shops and Cabela's Exclusive	https://www.basspro.com/p/browning-ab3-pro-composite-bolt-action-rifle-with-vortex-crossfire-hd-scope	TRUE
Cabela's Big Outdoorsman Muskoka Chair	3491150	Was 	$89.99			$59.98	Save $30	9/30/26			https://www.basspro.com/p/cabelas-big-outdoorsman-muskoka-chair	FALSE
Natural Reflections Cane Creek Flannel Shirt	4706749	Was starting at 	$24.99	Now starting at 	$19.98	Starting at $16.98	Save 32%	9/30/26	Now with an even softer feel		https://www.basspro.com/p/natural-reflections-cane-creek-long-sleeve-flannel-shirt	FALSE
Ascend Path 10 Sit-On-Top Kayak 	4485646		$649.99			$549.98	Save $100	9/30/26	FREE shipping with in-store pickup!		https://www.basspro.com/p/ascend-path-10-sit-on-top-kayak	FALSE
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

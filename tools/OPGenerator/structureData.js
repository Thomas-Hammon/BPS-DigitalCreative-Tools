const fs = require("fs");
const path = require("path");

const rawData = `Wicked Ridge by TenPoint Invader M1 Crossbow Package	3915457	Compare to 	$2,599.99	Now 					Save $200	0	https://www.basspro.com/p/wicked-ridge-by-tenpoint-invader-m1-crossbow-package-with-acudraw	FALSE
Moultrie Edge Solar Cellular Camera	4383549	Was 	$179.99	Now 					Save $70	0	https://www.basspro.com/p/moultrie-edge-solar-panel-camera-combo	FALSE
Minn Kota Ultrex Quest-Series Freshwater Trolling Motor w/ Dual Spectrum CHIRP Sonar 	3796050	Was starting at 	$3,899.99	Now starting at 					Save $300	Micro Remote Included! 	https://www.basspro.com/p/minn-kota-ultrex-quest-series-freshwater-trolling-motor-with-dual-spectrum-chirp-sonar-and-micro-remote	FALSE
"NEW! Winchester M70 Safari Cape Buffalo 													"	4756680		$2,499.99						Bass Pro Shops and Cabela's Exclusive	Only 250 Available	https://www.basspro.com/p/winchester-model-70-safari-express-bolt-action-rifle-cape-buffalo-edition	TRUE
Cabela's Pro 2400C Compact Laser Rangefinder	4791213	Was 	$199.99				Save $30	10/21/26			https://www.basspro.com/p/cabelas-pro-2400c-laser-rangefinder	FALSE
Men's RedHead Stronghaul Insulated Waterproof Hunting Boots	3013944	Was 	$119.99	Now 					Save $40	400-gram 3M™ Thinsulate™ Insulation	https://www.basspro.com/p/redhead-stronghaul-insulated-waterproof-hunting-boots-for-men	FALSE
Men's RedHead Grid Lite Quarter-Zip Long-Sleeve Pullover	3043727		$49.99				Save 30%	10/21/26				FALSE
Natural Reflections Cane Creek Flannel Long-Sleeve Shirt 	4706743	Was starting at 	$24.99	Now starting at 			Save 32%	9/30/26	Save 20%	Now with an even softer feel	https://www.basspro.com/p/natural-reflections-cane-creek-long-sleeve-flannel-shirt	FALSE
Bass Pro Shops WeatherSafe Trailer Tite Standard-Duty Trailerable Boat Cover	1669099	Starting at 	$99.99				Save $20	9/30/26		Winterize Your Boat!	https://www.basspro.com/p/bass-pro-shops-weathersafe-trailer-tite-standard-duty-trailerable-boat-covers	FALSE`;

const cloudinaryBaseULR = `https://assets.basspro.com/image/upload/v1789401418/DigitalCreative/2026/BPS_CAB/Campaigns/Wk38_FallSavings_17-Sep/Homepage/HTW/BPS-HTW-0`;

class OutfitterPicksItem {
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
    textCallout,
    imgCallout,
    CLUBPrice,
    CLUBSavings,
    CLUBExp,
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
    this.textCallout = textCallout;
    this.imgCallout = imgCallout;
    this.CLUBPrice = CLUBPrice;
    this.CLUBSavings = CLUBSavings;
    this.CLUBExp = CLUBExp;
    this.URL = URL;
    this.googleSafe = googleSafe;
  }
}

const opItems = [];
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

    const item = new OutfitterPicksItem(
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

    opItems.push(item);

    if (data[12] === "TRUE") {
      if (rows.length === 0) {
        break;
      }

      id += 1;
      const gSafeData = toFixedWidthRow(rows.shift(), 13);

      const gSafeItem = new OutfitterPicksItem(
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
    }
  }

  const structuredData = {
    op: {
      items: opItems,
      gSafe: gSafe,
    },
  };
  return structuredData;
}

const opJson = structureData(cloudinaryBaseULR);

module.exports = opJson;

if (require.main === module) {
  const outputPath = path.join(__dirname, "op.json");
  fs.writeFileSync(outputPath, JSON.stringify(opJson, null, 2) + "\n", "utf-8");
  console.log(`Wrote OP data to ${outputPath}`);
}

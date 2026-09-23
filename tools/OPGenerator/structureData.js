const fs = require("fs");
const path = require("path");

const rawData = `RedHead® Frontier Essential Jacket	4746351	Was 	$129.99	Now 	$89.98				Save 20%		https://www.basspro.ca/p/redhead-frontier-essential-jacket	FALSE
RedHead® Creekside Flannel-Lined Overshirt	4779714	Was 	$59.99 - $64.99	Now 	$44.98 - $47.98				Save 25%		https://www.basspro.ca/p/redhead-creekside-flannel-lined-overshirt	FALSE
Muck® Men's or Women's Fieldblazer Classic Rubber Boots	2850332	Was 	$185.99	Now 	$124.98				Save $60		https://www.basspro.ca/l/outdoor-traditions-sale-muck-fieldblazers	FALSE
Cabela's Stainless Steel Tabletop Propane Grill	4705575	Was 	$139.99	Now 	$99.98				Save $40		https://www.basspro.ca/p/cabelas-stainless-steel-tabletop-propane-grill-101939865	FALSE
Cabela's 7.5'' Heavy-Duty Food Slicer	2834853	Was 	$129.99	Now 	$89.98				Save $40		https://www.basspro.ca/p/cabelas-75-heavy-duty-food-slicer	FALSE
Cabela's® Heavy-Duty 6LB Sausage Stuffer	2834849	Was 	$249.99	Now 	$174.98				Save $75		https://www.basspro.ca/p/cabelas-heavy-duty-6lb-sausage-stuffer	FALSE
Bass Pro Shops® Camp Cot	4043876	Was 	$99.99	Now 	$69.98				Save 30%		https://www.basspro.ca/p/bass-pro-shops-camp-cot	FALSE
Offshore Angler™ Power Plus Trophy Rod and Reel Spinning Combo	2642087	Was 	$59.99 - $74.99	Now 	$44.98 - $55.98				Save 25%		https://www.basspro.ca/p/offshore-angler-power-plus-trophy-rod-and-reel-spinning-combo	FALSE`;

const cloudinaryBaseULR = `https://assets.basspro.com/image/upload/v1790175281/DigitalCreative/2026/CA/Campaigns/wk-39-09-24-Outdoor-Traditions/Homepage/OP-`;

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

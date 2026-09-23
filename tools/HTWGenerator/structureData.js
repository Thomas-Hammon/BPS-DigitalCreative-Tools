const fs = require("fs");
const path = require("path");

const rawData = `Cabela's® Specialist Ground Blind Combo	3870154	Was 	$349.99	Now 	$219.98				Save $130		https://www.basspro.ca/p/cabelas-specialist-ground-blind-combo	FALSE
SPYPOINT® FLEX-M Cellular Trail Camera 2-Pack	4041719	Was 	$289.99	Now 	$169.99				Save 40%		https://www.basspro.ca/p/spypoint-flex-m-cellular-trail-camera-2-pack-101848397	FALSE
RedHead® Silent Stalker Elite Parka or Bibs	3929199	Was 	$179.99 - $239.99	Now 	$149.98 - $209.98				Save $30		https://www.basspro.ca/l/outdoor-traditions-sale-rh-silent-stalker	FALSE
Vortex® Diamondback HD 10x42 Binocular in TrueTimber VSX	4269639	Was 	$449.99	Now 	$249.98				Save $200		https://www.basspro.ca/p/vortex-diamondback-hd-binoculars-in-truetimber-strata	FALSE
RedHead® Men's or Youth Expedition Ultra Bone-Dry Hunting Boots	2676172	Was 	$119.99 - $179.99	Now 	$79.98 - $139.98				Save $40		https://www.basspro.ca/l/outdoor-traditions-sale-rh expeditions	FALSE
Summit® Viper® SD Ultra Climbing Treestand	1905918	Was 	$529.99	Now 	$459.98				Save $70		https://www.basspro.ca/p/summit-viper-sd-ultra-climbing-treestand-12031305005521	FALSE
Cabela's® Multi-Day Hunting Backpack	4105734	Was 	$299.99	Now 	$239.98				Save $60		https://www.basspro.ca/p/cabelas-multi-day-hunting-backpack	FALSE
Wicked Ridge Invader M1 Crossbow Package with ACUdraw & Pro-View 400 Scope	3915457	Was 	$1,099.99	Now 	$699.98				Save $400	A BASS PRO SHOPS & CABELA'S EXCLUSIVE!	https://www.basspro.ca/p/wicked-ridge-invader-m1-crossbow-package-with-acudraw-pro-view-400-scope	TRUE
Cabela's GunDog Kennel Cot	4490953	Was 	$58.99 - $73.99	Now 	$43.98 - $54.98				Save 25%		https://www.basspro.ca/p/cabelas-gundog-kennel-cot	FALSE`;

const cloudinaryBaseULR = `https://assets.basspro.com/image/upload/v1790175270/DigitalCreative/2026/CA/Campaigns/wk-39-09-24-Outdoor-Traditions/Homepage/HTW-`;

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

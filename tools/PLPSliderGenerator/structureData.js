const fs = require("fs");
const path = require("path");

const rawData = `Big Game		/l/outdoor-traditions-sale-big-game				Outdoor Traditions - Big Game_Bpca			3345494			FALSE
Treestands		/l/outdoor-traditions-sale-treestands				Outdoor Traditions - Treestands_Bpca			1905918			FALSE
Blinds		/l/outdoor-traditions-sale-blinds				Outdoor Traditions - Blinds_Bpca			3870154			FALSE
Waterfowl 		/l/outdoor-traditions-sale-waterfowl				Outdoor Traditions - Waterfowl_Bpca			2517330			FALSE
Firearms		/l/outdoor-traditions-sale-firearms				Outdoor Traditions - Firearms_Bpca			4782454			TRUE
Optics		/l/outdoor-traditions-sale-optics				Outdoor Traditions - Optics_Bpca			4290529			FALSE
Archery		/l/outdoor-traditions-sale-archery				Outdoor Traditions - Archery_Bpca			4287048			TRUE
Trail Cameras		/l/outdoor-traditions-sale-trail-cameras				Outdoor Traditions - Trail Cameras_Bpca			4347321			FALSE
Ammunition		/l/outdoor-traditions-sale-ammunition				Outdoor Traditions - Ammunition_Bpca			3193780			TRUE
Hunt Apparel		/l/outdoor-traditions-sale-hunt-apparel				Outdoor Traditions - Hunt Apparel_Bpca			3929043			FALSE
Hunting Boots		/l/outdoor-traditions-sale-hunting-boots				Outdoor Traditions - Hunting Boots_Bpca			2676172			FALSE
Food Processing		/l/outdoor-traditions-sale-food-processing				Outdoor Traditions - Food Processing_Bpca			2516153			FALSE
Men's Apparel		/l/outdoor-traditions-sale-mens-apparel				Outdoor Traditions - Mens Apparel_Bpca			3919097			FALSE
Women's Apparel		/l/outdoor-traditions-sale-womens-apparel				Outdoor Traditions - Womens Apparel_Bpca			4273007			FALSE`;

class plpSliderTile {
  constructor(id, position, tileTitle, URL, pageID, featureSKU, googleSafe) {
    this.id = id;
    this.position = position;
    this.tileTitle = tileTitle;
    this.URL = URL;
    this.pageID = pageID;
    this.featureSKU = featureSKU;
    this.googleSafe = googleSafe;
  }
}

const plpTiles = [];

function structureData() {
  function splitStr(str) {
    const newStr = str.replaceAll(/\t/g, "\n");
    const split = newStr.split("\n");
    return split;
  }

  const bigArray = splitStr(rawData);
  let count = 0;
  let id = 0;

  while (bigArray.length > 0) {
    count += 1;
    id += 1;

    const data = bigArray.splice(0, 13);
    const item = new plpSliderTile(
      id,
      count,
      data[0],
      data[2],
      data[6],
      data[9],
      data[12],
    );
    plpTiles.push(item);
  }

  const structuredData = {
    plpTiles: {
      items: plpTiles,
    },
  };

  return structuredData;
}

const plpJson = structureData();

module.exports = plpJson;

if (require.main === module) {
  const outputPath = path.join(__dirname, "plpSlider.json");
  fs.writeFileSync(
    outputPath,
    JSON.stringify(plpJson, null, 2) + "\n",
    "utf-8",
  );
  console.log(`Wrote PLPSlider data to ${outputPath}`);
}

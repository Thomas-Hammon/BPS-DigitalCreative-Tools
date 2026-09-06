const rawData = `Garmin fenix 9 AMOLED Multisport GPS Smartwatch	5303346		$1,149.99							Just launched!	/l/garmin-fenix-9-amoled-multisport-gps-smartwatch	FALSE
Minn Kota Terrova Freshwater Trolling Motor with Dual Spectrum CHIRP Sonar	3796093	Was starting at 	$1999.99	Now starting at 	$1899.98				Save up to $200 on Select Models 	Wireless Remote Included!	https://www.basspro.com/p/minn-kota-terrova-freshwater-trolling-motor-with-dual-spectrum-chirp-sonar-and-wireless-remote	FALSE
Urchin Baits	4946610								Trending Technique!		https://www.basspro.com/l/urchin-fuzzy-baits-shop-all	FALSE
Winchester SXP Waterfowl Hunter Pump-Action Shotgun	3642629	Was starting at 	$419.99	Now starting at 	$219.98				Save $200 on Select Finishes		https://www.basspro.com/p/winchester-sxp-waterfowl-hunter-pump-action-shotgun	TRUE
Vortex Razor HD 16-48x65 Spotting Scope	2006116	Compare to 	RA-65A model at $1,299.99	Now 	$699.97						https://www.basspro.com/p/vortex-razor-hd-16-48x65-angled-spotting-scope	FALSE
YETI Venom Series	4665356, 4665073								Save 20%		https://www.basspro.com/l/yeti-venom-collection	FALSE
Men's HOKA Stinson ATR 7 Running Shoes 	4312332	Was starting at 	$169.99 	Now starting at 	$ 139.98				Save $30	Available in 4 colors!	https://www.basspro.com/p/hoka-stinson-atr-7-running-shoes-for-men	FALSE
Bass Pro Shops Bass Regulation Cornhole Bean Bag Game Set	4267555		$169.99 						Buy One, Get One 50% on Select Yard Games	Built to official tournament specifications!	https://www.basspro.com/p/bass-pro-shops-bass-regulation-cornhole-bean-bag-game-set	FALSE
BOTE LowRider Aero 10′6″ Inflatable Hybrid Paddleboard Package	4533868	Was starting at 	999	Now starting at 	$798.98				Save $ 200	Air Pump and Repair Kit Included! 	https://www.basspro.com/p/bote-lowrider-aero-106-inflatable-hybrid-paddleboard-package	FALSE`;

const cloudinaryBaseULR = `https://assets.basspro.com/image/upload/v1785782921/DigitalCreative/2026/CA/Campaigns/wk-32-06-08-Fall-Hunting-Classic/Homepage/HTW-`;

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

const htwItems = [];
const gSafe = [];

function structureData(cdnBaseUrl) {
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
    //console.log(data);
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
      id += 1;
      const gSafeData = bigArray.splice(0, 13);
      const gSafeItem = new HotThisWeekItem(
        id,
        count,
        gSafeData[0],
        gSafeData[1],
        cdnBaseUrl + "GS-" + count + ".png?$bpssite_default$",
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
    htw: {
      items: htwItems,
      gSafe: gSafe,
    },
  };
  console.log(structuredData);
  console.log(structuredData.htw.gSafe[0]);
}

structureData(cloudinaryBaseULR);

const fs = require("fs/promises");
const path = require("path");

async function loadJson() {
  const filePath = path.join(__dirname, "plpSlider.json");

  const file = await fs.readFile(filePath, "utf-8");

  return JSON.parse(file);
}

function createTile(plpTile) {
  const gSafe = plpTile.googleSafe;

  return `
  
        <li class="splide__slide ${gSafe === "TRUE" ? "notGoogleSafe" : ""}">
          <a
            href="
            ${plpTile.URL}
"
            ><img
              class="splide__slide-image"
              src="https://assets.basspro.com/image/list/fn_select:jq:first(.[]|select(.public_id%20|%20endswith(%22main%22)))/${plpTile.featureSKU}.json?$bpssite_plpslider$"
              alt=""
            />
            <p class="splide__slide-text">${plpTile.tileTitle}</p></a
          >
        </li>
        `;
}

function generateTiles(data) {
  const items = data.plpTiles.items;
  return items.map((item) => createTile(item)).join("\n");
}

function generateHtml(data) {
  const tileArr = generateTiles(data);

  return `<link
  href="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css"
  rel="stylesheet"
/>

<link
  rel="stylesheet"
  href="https://assets.basspro.com/raw/upload/DigitalCreative/Global-Site-Resources/PLP-Hero/PLP-Slider.css"
/>

<div class="full-width plpSliderCont">
  <section
    class="splide"
    aria-roledescription="slider"
    aria-label="
0 Carousel
"
  >
    <div class="splide__track">
      <ul class="splide__list">
        ${tileArr}
      </ul>
    </div>
    <div class="splide__arrows">
      <button class="splide__arrow splide__arrow--prev">
        <img
          class="rotate"
          src="https://assets.basspro.com/image/upload/v1682096238/UX/Experience/Ammo%20Key%20Category/icon_24px_arrow-right.png"
          alt="Left Arrow"
        />
      </button>
      <button class="splide__arrow splide__arrow--next">
        <img
          src="https://assets.basspro.com/image/upload/v1682096238/UX/Experience/Ammo%20Key%20Category/icon_24px_arrow-right.png"
          alt="Right Arrow"
        />
      </button>
    </div>
  </section>
</div>

<!-- prettier-ignore -->
<script reactSafe src="https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/js/splide.min.js"></script>

<!-- prettier-ignore -->
<script reactSafe src="https://assets.basspro.com/raw/upload/DigitalCreative/Global-Site-Resources/PLP-Hero/PLP-Slider.js"></script>`;
}

async function main() {
  try {
    const data = await loadJson();

    if (!data?.plpTiles) {
      throw new Error("ddata.plpTiles. was not found.");
    }

    if (!Array.isArray(data.plpTiles.items)) {
      throw new Error("data.plpTiles.items must be an array.");
    }

    if (data.plpTiles.items.length === 0) {
      throw new Error("data.plpTiles.items cannot be empty.");
    }

    const html = generateHtml(data);

    const outputDirectory = path.join(__dirname, "output");

    const outputFile = path.join(outputDirectory, `plpSlider.html`);

    await fs.mkdir(outputDirectory, {
      recursive: true,
    });

    await fs.writeFile(outputFile, html, "utf-8");

    console.log("");
    console.log("PLP Generator Complete");
    console.log("----------------------");

    console.log(`Items: ${data.plpTiles.items.length}`);

    console.log(`Created: ${outputFile}`);

    console.log("");
  } catch (error) {
    console.error("");
    console.error("PLP Generator Failed");
    console.error("--------------------");
    console.error(error);
    console.error("");
  }
}

main();

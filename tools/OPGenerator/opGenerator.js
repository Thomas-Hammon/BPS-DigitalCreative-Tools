const fs = require("fs/promises");
const path = require("path");

const STORE_SELECTORS = {
  bps: ".EMarketingSpotReact.outfitter-picks-bps",
  cab: ".EMarketingSpotReact.outfitter-picks-cab",
  mpw: ".EMarketingSpotReact.outfitter-picks-mpw",
  "bps ca": ".EMarketingSpotReact.outfitter-picks-ca",
};

function getEspotSelector() {
  const store = String(process.env.OP_STORE || "bps")
    .trim()
    .toLowerCase();

  return STORE_SELECTORS[store] || STORE_SELECTORS.bps;
}

// ============================================================
// Fiscal Week
// ============================================================

function getFiscalWeek() {
  // TODO: Replace with the actual start date of Fiscal Week 1.
  const fiscalYearStart = new Date("2026-01-01");
  const today = new Date();

  const difference = today - fiscalYearStart;

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));

  return Math.floor(days / 7) + 1;
}

// ============================================================
// Load JSON
// ============================================================

async function loadJson() {
  const filePath = path.join(__dirname, "op.json");

  const file = await fs.readFile(filePath, "utf-8");

  return JSON.parse(file);
}

function isRestrictedItem(item) {
  return (
    item.googleSafe === true ||
    String(item.googleSafe).trim().toUpperCase() === "TRUE"
  );
}

// ============================================================
// Generate Individual Slide
// ============================================================

function generateSlide(item, extraClass = "") {
  const slideClass = extraClass
    ? `splide__slide op-item ${extraClass}`
    : "splide__slide op-item";

  const itemHref = item.URL || item.url || "#";

  const altText = [
    item.imgCallout,
    item.CLUBPrice,
    item.CLUBSavings,
    item.CLUBExp,
  ]
    .map((value) => (value || "").trim())
    .filter(Boolean)
    .join(" | ");

  const nowPriceHtml = item.nowPrice
    ? `
              <p class="p p-black salePrice">${item.nowCallout || ""} ${item.nowPrice}</p>`
    : "";

  const regPriceHtml = item.regPrice
    ? `
              <p class="p p-black regPrice">${item.wasCompareCallout || ""} ${item.regPrice}</p>`
    : "";

  const pricingHtml =
    item.nowPrice || item.regPrice
      ? `
            <div class="pricingDiv">
${nowPriceHtml}
${regPriceHtml}
            </div>`
      : "";

  const savingsHtml = item.textCallout
    ? `
            <p class="color-savings-message">${item.textCallout}</p>`
    : "";

  return `
        <div
          class="${slideClass}"
          role="group"
          aria-roledescription="slide"
        >
          <a href="${itemHref}">
            <img
              loading="lazy"
              src="${item.image}"
              alt="${altText}"
            />

            <div class="opItemCopy">
              <p class="p p-black opTitle">${item.productTitle}</p>
${pricingHtml}
${savingsHtml}
            </div>
          </a>
        </div>`;
}

// ============================================================
// Generate All Slides
// ============================================================

function generateSlides(data) {
  const items = data.op.items;
  const googleSafeItems = data.op.gSafe || [];

  return items
    .map((item) => {
      const isRestricted = isRestrictedItem(item);

      // Normal item. No replacement needed.
      if (!isRestricted) {
        return generateSlide(item);
      }

      // Find Google Safe replacement by matching ID.
      const replacement = googleSafeItems.find(
        (safeItem) => safeItem.position === item.position,
      );

      // Restricted item with no replacement.
      if (!replacement) {
        console.warn(
          `Warning: Item ${item.position} is marked googleSafe but has no matching gSafe replacement.`,
        );

        return generateSlide(item, "notGoogleSafePick");
      }

      // Generate the normal version.
      const normalSlide = generateSlide(item, "notGoogleSafePick");

      // Generate the Google Safe replacement.
      const googleSafeSlide = generateSlide(replacement, "googleSafePick");

      return `${normalSlide}

${googleSafeSlide}`;
    })
    .join("\n");
}

// ============================================================
// Generate CSS
// ============================================================

function generateCss() {
  return `
  <style type="text/css">
    :root {
      --bps--gray: #7f7f7f;
    }

    /* ==== opCont ==== */

    .opCont {
      padding-block: 4rem;
      margin-top: 0;
    }

    .opCont > h2 {
      margin-bottom: 2rem;
      text-transform: uppercase;
    }

    .opCarouselSplide {
      max-width: 1440px;
      width: 90%;
      padding: 0 0 1rem;
    }

    .op-item a {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      height: 100%;
      gap: 1rem;
      font-family: "Open Sans" !important;
    }

    .op-item .p:hover {
      text-decoration: none;
    }

    .op-item a img {
      width: 100%;
      max-height: 400px;
      -webkit-transition: 0.3s ease-in-out;
      transition: 0.3s ease-in-out;
    }

    .color-savings-message {
      color: #840000;
      font-weight: 700;
      font-size: 16px;
      line-height: 16px;
    }

    .op-item > a > img:hover {
      transform: scale(1.02);
    }

    .opItemCopy {
      display: flex;
      flex-direction: column;
      align-items: start;
      text-align: start;
      gap: 0.5rem;
    }

    .opItemCopy > * {
      text-align: start !important;
    }

    .opTitle {
      font-weight: 700;
      font-size: 16px;
      line-height: 18px;
    }

    .pricingDiv {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
    }

    .pricingDiv > * {
      font-size: 12px;
      text-align: start;
    }

    .opCont .splide__track {
      padding-top: 10px;
      padding-bottom: 0.5rem;
    }

    /* ========================================================
       Media Queries
       ======================================================== */

    @media (max-width: 768px) {
      .opCont {
        margin: 2rem 0 0;
        padding: 2rem 0 3rem;
      }
    }

    @media (max-width: 480px) {
      .opCont {
        padding: 0;
      }

      .op-item a img {
        width: 80%;
        max-height: 400px;
      }

      .op-item a {
        align-items: center;
      }

      .opItemCopy {
        width: 80%;
      }

      .op-item .p {
        font-size: 14px;
        line-height: 16px;
      }

      .opCont .opcarousel-progress {
        background: #ccc;
        height: 10px;
        width: 25%;
        margin: 1rem 0;
        border-radius: 8px;
        position: relative;
        left: 10%;
      }

      .EMarketingSpotReact.hot_this_week
        .opCont
        .opcarousel-progress {
        bottom: 1rem;
        margin: 0;
      }

      .opCont .opcarousel-progress-bar {
        background: #000;
        height: 100%;
        transition: width 400ms ease;
        width: 0;
        border-radius: 8px;
      }
    }

    .opCont .splide__slide > a > img {
      aspect-ratio: 326 / 400;
    }

    /* ========================================================
       Arrows
       ======================================================== */

    .opCont .splide__arrows--ltr {
      position: absolute;
      bottom: -2rem;
      right: 1rem;
    }

    .opCont .splide__arrow--prev {
      left: -3.5rem !important;
    }

    .opCont .splide__arrow svg {
      height: 1.2em !important;
      width: 1.2em !important;
    }

    .opCont .splide__arrow--next {
      right: -1.5rem !important;
    }

    .opCont .splide__arrow {
      border: solid 2px var(--bps--gray) !important;
    }

    .opCont
      .splide
      .splide__arrows
      .splide__arrow {
      background: #ccc;
      height: 2em;
      width: 2em;
      border-radius: 50%;
    }

    .EMarketingSpotReact.hot_this_week
      .opCont
      .splide {
      max-width: 1269px;
    }

    .EMarketingSpotReact.hot_this_week
      .opCont
      .splide
      .splide__arrows
      .splide__arrow {
      height: 32px !important;
      width: 32px !important;
    }

    @media (max-width: 480px) {
      .opCont .splide__arrows--ltr {
        position: absolute;
        bottom: 1.5rem;
        right: 2rem;
      }
    }
  </style>`;
}

// ============================================================
// Google Safe Script
// ============================================================

function generateGoogleSafeScript() {
  const espotSelector = getEspotSelector();

  return `
  <script reactSafe>
    (function () {
      if (
        typeof window === "undefined" ||
        typeof document === "undefined"
      ) {
        return;
      }

      const espot = document.querySelector(
        "${espotSelector}"
      );

      if (!espot) {
        return;
      }

      const isGoogleSafe =
        window.location.search.includes(
          "rid=20"
        );

      if (isGoogleSafe) {
        const notGoogleSafeSlides =
          espot.querySelectorAll(
            ".notGoogleSafePick"
          );

        if (notGoogleSafeSlides.length) {
          notGoogleSafeSlides.forEach(
            function (slide) {
              slide.remove();
            }
          );
        }
      } else {
        const googleSafeSlides =
          espot.querySelectorAll(
            ".googleSafePick"
          );

        if (googleSafeSlides.length) {
          googleSafeSlides.forEach(
            function (slide) {
              slide.remove();
            }
          );
        }
      }
    })();
  </script>`;
}

// ============================================================
// Splide Script
// ============================================================

function generateSplideScript() {
  const espotSelector = getEspotSelector();

  return `
  <script reactSafe>
    (function () {
      if (
        typeof window === "undefined" ||
        typeof document === "undefined"
      ) {
        return;
      }

      const espot = document.querySelector(
        "${espotSelector}"
      );

      if (!espot) {
        return;
      }

      const sliderElement =
        espot.querySelector(
          ".opCarouselSplide"
        );

      if (!sliderElement) {
        return;
      }

      if (typeof Splide === "undefined") {
        console.error(
          "OP: Splide is not loaded."
        );

        return;
      }

      const OPSplideReact = new Splide(
        sliderElement,
        {
          type: "slide",
          perPage: 4,
          gap: "2rem",
          perMove: 1,
          pagination: false,

          breakpoints: {
            1024: {
              perPage: 3,
            },

            768: {
              perPage: 2,
            },

            480: {
              perPage: 1,
              focus: "center",
            },
          },
        },
      );

      OPSplideReact.mount();

      const progressBar =
        espot.querySelector(
          ".opcarousel-progress"
        );

      const progressBarFill =
        espot.querySelector(
          ".opcarousel-progress-bar"
        );

      if (
        progressBar &&
        progressBarFill
      ) {
        OPSplideReact.on(
          "move",
          function (newIndex) {
            const maxIndex =
              OPSplideReact.length - 1;

            if (maxIndex <= 0) {
              progressBarFill.style.width =
                "100%";

              return;
            }

            const progress =
              (newIndex / maxIndex) * 100;

            progressBarFill.style.width =
              progress + "%";
          },
        );
      }
    })();
  </script>`;
}

// ============================================================
// Generate Complete HTML
// ============================================================

function generateHtml(data) {
  const slides = generateSlides(data);

  return `

${generateCss()}

  <section
    class="sContainer opCont"
    aria-roledescription="carousel"
  >
    <h2 class="h2 h-black title">
      Outfitter Picks
    </h2>

    <div
      class="splide opCarouselSplide"
      aria-label="Outfitter Picks Carousel"
    >
      <div class="splide__track">
        <div
          class="splide__list"
          role="presentation"
        >
${slides}
        </div>
      </div>

      <div class="opcarousel-progress">
        <div
          class="opcarousel-progress-bar"
        ></div>
      </div>
    </div>
  </section>

${generateGoogleSafeScript()}

${generateSplideScript()}
`;
}

// ============================================================
// Main
// ============================================================

async function main() {
  try {
    const data = await loadJson();

    // Validate OP
    if (!data?.op) {
      throw new Error("data.op was not found.");
    }

    // Validate Items
    if (!Array.isArray(data.op.items)) {
      throw new Error("data.op.items must be an array.");
    }

    if (data.op.items.length === 0) {
      throw new Error("data.op.items cannot be empty.");
    }

    // Validate Google Safe items
    if (data.op.gSafe && !Array.isArray(data.op.gSafe)) {
      throw new Error("data.op.gSafe must be an array.");
    }

    // Generate HTML
    const html = generateHtml(data);

    // Get fiscal week
    const fiscalWeek = getFiscalWeek();

    // Output directory
    const outputDirectory = path.join(__dirname, "output");

    // Output filename
    const outputFile = path.join(outputDirectory, `op-week-${fiscalWeek}.html`);

    // Create output directory if needed
    await fs.mkdir(outputDirectory, {
      recursive: true,
    });

    // Write generated HTML
    await fs.writeFile(outputFile, html, "utf-8");

    // Generator stats
    const restrictedItems = data.op.items.filter(isRestrictedItem);

    const googleSafeItems = data.op.gSafe || [];

    console.log("");
    console.log("OP Generator Complete");
    console.log("----------------------");

    console.log(`Fiscal Week: ${fiscalWeek}`);

    console.log(`Normal Items: ${data.op.items.length}`);

    console.log(`Restricted Items: ${restrictedItems.length}`);

    console.log(`Google Safe Replacements: ${googleSafeItems.length}`);

    console.log(`Created: ${outputFile}`);

    console.log("");
  } catch (error) {
    console.error("");
    console.error("OP Generator Failed");
    console.error("--------------------");
    console.error(error);
    console.error("");
  }
}

main();

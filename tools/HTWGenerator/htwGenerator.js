const fs = require("fs/promises");
const path = require("path");

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
  const filePath = path.join(__dirname, "jsonTest.json");

  const file = await fs.readFile(filePath, "utf-8");

  return JSON.parse(file);
}

// ============================================================
// Generate Individual Slide
// ============================================================

function generateSlide(item, extraClass = "") {
  const slideClass = extraClass
    ? `splide__slide htw-item ${extraClass}`
    : "splide__slide htw-item";

  const nowPriceHtml = item.nowPrice
    ? `
              <p class="p p-black salePrice">${item.nowCallout || ""}${item.nowPrice}</p>`
    : "";

  const regPriceHtml = item.regPrice
    ? `
              <p class="p p-black regPrice">${item.wasCompareCallout || ""}${item.regPrice}</p>`
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
          <a href="${item.url}">
            <img
              loading="lazy"
              src="${item.image}"
              alt="${item.imgCallout || ""}"
            />

            <div class="htwItemCopy">
              <p class="p p-black htwTitle">${item.productTitle}</p>
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
  const items = data.htw.items;
  const googleSafeItems = data.htw.gSafe || [];

  return items
    .map((item) => {
      // Normal item. No replacement needed.
      if (!item.googleSafe) {
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

        return generateSlide(item, "notGoogleSafeSlide");
      }

      // Generate the normal version.
      const normalSlide = generateSlide(item, "notGoogleSafeSlide");

      // Generate the Google Safe replacement.
      const googleSafeSlide = generateSlide(replacement, "googleSafeSlide");

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

    /* ==== htwCont ==== */

    .htwCont {
      padding-block: 4rem;
      margin-top: 0;
    }

    .htwCont > h2 {
      margin-bottom: 2rem;
    }

    .htwCarouselSplide {
      max-width: 1440px;
      width: 90%;
      padding: 0 0 1rem;
    }

    .htw-item a {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      height: 100%;
      gap: 1rem;
      font-family: "Open Sans" !important;
    }

    .htw-item .p:hover {
      text-decoration: none;
    }

    .htw-item a img {
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

    .htw-item > a > img:hover {
      transform: scale(1.02);
    }

    .htwItemCopy {
      display: flex;
      flex-direction: column;
      align-items: start;
      text-align: start;
      gap: 0.5rem;
    }

    .htwItemCopy > * {
      text-align: start !important;
    }

    .htwTitle {
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

    .htwCont .splide__track {
      padding-top: 10px;
      padding-bottom: 0.5rem;
    }

    /* ========================================================
       Media Queries
       ======================================================== */

    @media (max-width: 768px) {
      .htwCont {
        margin: 2rem 0 0;
        padding: 2rem 0 3rem;
      }
    }

    @media (max-width: 480px) {
      .htwCont {
        padding: 0;
      }

      .htw-item a img {
        width: 80%;
        max-height: 400px;
      }

      .htw-item a {
        align-items: center;
      }

      .htwItemCopy {
        width: 80%;
      }

      .htw-item .p {
        font-size: 14px;
        line-height: 16px;
      }

      .htwCont .htwcarousel-progress {
        background: #ccc;
        height: 10px;
        width: 25%;
        margin: 1rem 0;
        border-radius: 8px;
        position: relative;
        left: 10%;
      }

      .EMarketingSpotReact.hot_this_week
        .htwCont
        .htwcarousel-progress {
        bottom: 1rem;
        margin: 0;
      }

      .htwCont .htwcarousel-progress-bar {
        background: #000;
        height: 100%;
        transition: width 400ms ease;
        width: 0;
        border-radius: 8px;
      }
    }

    .htwCont .splide__slide > a > img {
      aspect-ratio: 326 / 400;
    }

    /* ========================================================
       Arrows
       ======================================================== */

    .htwCont .splide__arrows--ltr {
      position: absolute;
      bottom: -2rem;
      right: 1rem;
    }

    .htwCont .splide__arrow--prev {
      left: -3.5rem !important;
    }

    .htwCont .splide__arrow svg {
      height: 1.2em !important;
      width: 1.2em !important;
    }

    .htwCont .splide__arrow--next {
      right: -1.5rem !important;
    }

    .htwCont .splide__arrow {
      border: solid 2px var(--bps--gray) !important;
    }

    .htwCont
      .splide
      .splide__arrows
      .splide__arrow {
      background: #ccc;
      height: 2em;
      width: 2em;
      border-radius: 50%;
    }

    .EMarketingSpotReact.hot_this_week
      .htwCont
      .splide {
      max-width: 1269px;
    }

    .EMarketingSpotReact.hot_this_week
      .htwCont
      .splide
      .splide__arrows
      .splide__arrow {
      height: 32px !important;
      width: 32px !important;
    }

    @media (max-width: 480px) {
      .htwCont .splide__arrows--ltr {
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
        ".EMarketingSpotReact.hot-this-week-bps"
      );

      if (!espot) {
        return;
      }

      const isGoogleSafe =
        new URLSearchParams(
          window.location.search
        ).get("rid") === "20";

      if (isGoogleSafe) {
        const notGoogleSafeSlides =
          espot.querySelectorAll(
            ".notGoogleSafeSlide"
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
            ".googleSafeSlide"
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
        ".EMarketingSpotReact.hot-this-week-bps"
      );

      if (!espot) {
        return;
      }

      const sliderElement =
        espot.querySelector(
          ".htwCarouselSplide"
        );

      if (!sliderElement) {
        return;
      }

      if (typeof Splide === "undefined") {
        console.error(
          "HTW: Splide is not loaded."
        );

        return;
      }

      const HTWSplideReact = new Splide(
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

      HTWSplideReact.mount();

      const progressBar =
        espot.querySelector(
          ".htwcarousel-progress"
        );

      const progressBarFill =
        espot.querySelector(
          ".htwcarousel-progress-bar"
        );

      if (
        progressBar &&
        progressBarFill
      ) {
        HTWSplideReact.on(
          "move",
          function (newIndex) {
            const maxIndex =
              HTWSplideReact.length - 1;

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
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/@splidejs/splide@latest/dist/css/splide.min.css"
  />

${generateCss()}

  <section
    class="sContainer htwCont"
    aria-roledescription="carousel"
  >
    <h2 class="h2 h-black title">
      HOT THIS WEEK
    </h2>

    <div
      class="splide htwCarouselSplide"
      aria-label="Hot This Week Carousel"
    >
      <div class="splide__track">
        <div
          class="splide__list"
          role="presentation"
        >
${slides}
        </div>
      </div>

      <div class="htwcarousel-progress">
        <div
          class="htwcarousel-progress-bar"
        ></div>
      </div>
    </div>
  </section>

  <script src="https://cdn.jsdelivr.net/npm/@splidejs/splide@latest/dist/js/splide.min.js"></script>

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

    // Validate HTW
    if (!data?.htw) {
      throw new Error("data.htw was not found.");
    }

    // Validate Items
    if (!Array.isArray(data.htw.items)) {
      throw new Error("data.htw.items must be an array.");
    }

    if (data.htw.items.length === 0) {
      throw new Error("data.htw.items cannot be empty.");
    }

    // Validate Google Safe items
    if (data.htw.gSafe && !Array.isArray(data.htw.gSafe)) {
      throw new Error("data.htw.gSafe must be an array.");
    }

    // Generate HTML
    const html = generateHtml(data);

    // Get fiscal week
    const fiscalWeek = getFiscalWeek();

    // Output directory
    const outputDirectory = path.join(__dirname, "output");

    // Output filename
    const outputFile = path.join(
      outputDirectory,
      `htw-week-${fiscalWeek}.html`,
    );

    // Create output directory if needed
    await fs.mkdir(outputDirectory, {
      recursive: true,
    });

    // Write generated HTML
    await fs.writeFile(outputFile, html, "utf-8");

    // Generator stats
    const restrictedItems = data.htw.items.filter((item) => item.googleSafe);

    const googleSafeItems = data.htw.gSafe || [];

    console.log("");
    console.log("HTW Generator Complete");
    console.log("----------------------");

    console.log(`Fiscal Week: ${fiscalWeek}`);

    console.log(`Normal Positions: ${data.htw.items.length}`);

    console.log(`Restricted Items: ${restrictedItems.length}`);

    console.log(`Google Safe Replacements: ${googleSafeItems.length}`);

    console.log(`Created: ${outputFile}`);

    console.log("");
  } catch (error) {
    console.error("");
    console.error("HTW Generator Failed");
    console.error("--------------------");
    console.error(error);
    console.error("");
  }
}

main();

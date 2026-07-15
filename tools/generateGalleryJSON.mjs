import fs from "fs";
import path from "path";
import xlsx from "xlsx";
import readline from "readline";
import { fileURLToPath } from "url";
import chalk from "chalk";

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const excelPath = path.resolve(
  __dirname,
  "../assets/Gallery_File_Names_and_Categories.xlsx"
);
const jsonPath = path.resolve(__dirname, "../assets/gallery_data.json");

// Check if Excel file exists
if (!fs.existsSync(excelPath)) {
  console.log(
    chalk.red(`
    ❌ Excel file not found at:
       ${excelPath}
    
    Please check the following:
      • Make sure the file exists at the specified path.
      • Ensure the file name is exactly: "Gallery_File_Names_and_Categories.xlsx"
      • If the file exists, verify that the path in the script matches its location.
    
    💡 Tip: Check for typos, extra spaces, or incorrect capitalization in the file name.
    `)
  );

  process.exit(1); // Exit the script
}

// Load the Excel file
const workbook = xlsx.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Convert to JSON
const data = xlsx.utils.sheet_to_json(sheet, { defval: "" });

// Clean and transform data
const galleryData = data.map((row) => {
  const normalizedPath = row["File Path"].replace(/\\/g, "/");
  const fileName = path.basename(normalizedPath); // Includes extension

  return {
    title: (row["Title"] || "").trim(),
    src: `${fileName}`,
    category: (row["Category"] || "").trim(),
    mediaType: (row["Type"] || "").trim(),
  };
});

// Write to JSON file
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

if (fs.existsSync(jsonPath)) {
  const timeout = setTimeout(() => {
    console.log(
      chalk.red("\n❌ No response received. Operation cancelled by default.")
    );
    rl.close();
  }, 20000);

  rl.question(
    "File already exists. Do you want to overwrite it? (yes/no): ",
    (answer) => {
      clearTimeout(timeout);
      if (answer.toLowerCase() === "yes" || answer.toLowerCase() === "y") {
        fs.writeFileSync(jsonPath, JSON.stringify(galleryData, null, 4));
        console.log(
          chalk.green("✅ gallery_data.json overwritten successfully.")
        );
      } else {
        console.log(
          chalk.red("❌ Operation cancelled. File was not overwritten.")
        );
      }
      rl.close();
    }
  );
} else {
  fs.writeFileSync(jsonPath, JSON.stringify(galleryData, null, 4));
  console.log(chalk.green("✅ gallery_data.json created successfully."));
  rl.close();
}

// Run the script in the terminal to generate the file
// node generateGalleryJSON.mjs

// Update the Excel file name if needed
// Answer the question in the terminal to overwrite the file if file already exists

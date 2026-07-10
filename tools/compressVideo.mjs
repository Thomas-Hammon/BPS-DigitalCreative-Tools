import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import chalk from "chalk";

// Setup
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// === CONFIG ===
const videoPath = path.resolve(
  __dirname,
  "../assets/videos/temp/Winchester-Turkey-Loads.mp4",
); // Change this to your actual video file
const maxSizeMB = 100;

// === Compression Logic ===
function shouldCompress(filePath, maxSizeMB) {
  const stats = fs.statSync(filePath);
  const fileSizeMB = stats.size / (1024 * 1024);
  return fileSizeMB > maxSizeMB;
}

async function compressVideo(videoPath, maxSizeMB) {
  let crf = 23;
  const maxCrf = 35;
  const step = 2;

  while (crf <= maxCrf) {
    const tempPath = videoPath.replace(
      /(\.\w+)$/,
      `_compressed_${Date.now()}$1`,
    );

    await new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .outputOptions([
          "-vf scale=-2:720",
          "-c:v libx264",
          `-crf ${crf}`,
          "-preset slow",
          "-c:a aac",
          "-b:a 128k",
        ])
        .on("end", resolve)
        .on("error", reject)
        .save(tempPath);
    });

    const stats = fs.statSync(tempPath);
    const fileSizeMB = stats.size / (1024 * 1024);

    if (fileSizeMB <= maxSizeMB) {
      console.log(
        chalk.green(
          `✅ Compressed to ${fileSizeMB.toFixed(2)} MB at CRF ${crf}`,
        ),
      );
      return tempPath;
    } else {
      console.log(
        chalk.yellow(
          `⚠️ Still too large (${fileSizeMB.toFixed(2)} MB). Increasing CRF...`,
        ),
      );
      fs.unlinkSync(tempPath);
      crf += step;
    }
  }

  console.warn(chalk.red(`❌ Could not compress below ${maxSizeMB} MB.`));
  return null;
}

// === Main Execution ===
(async function () {
  if (!fs.existsSync(videoPath)) {
    console.error(chalk.red(`❌ Video file not found: ${videoPath}`));
    return;
  }

  if (shouldCompress(videoPath, maxSizeMB)) {
    console.log(
      chalk.blue(`🔧 Compressing video: ${path.basename(videoPath)}`),
    );
    const compressedPath = await compressVideo(videoPath, maxSizeMB);
    if (compressedPath) {
      console.log(
        chalk.green(`✅ Final compressed video saved at: ${compressedPath}`),
      );
    }
  } else {
    console.log(
      chalk.green(
        `✅ Video is already under ${maxSizeMB} MB. No compression needed.`,
      ),
    );
  }
})();

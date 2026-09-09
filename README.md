Hello! Welcome to the BPS Digital Creative tools repository.

## Requirements

1. Node.JS
2. NVM
   (If you don't have it yet, you can download it here: https://nodejs.org/en/download)

## Getting started

1. Run "npm install" in the terminal.

## List of tools in the repository:

1. Video Compression Script - Used to reduce file size for videos
2. Generate Gallery JSON - Used for ????
3. Components Library
4. HTWGenerator
   a. structureData.js

## Contains Components Library (StoryBook)

1. Run "cd ComponentsLibrary" in the terminal.
2. Run "npm install" in the terminal.
3. Run "npm run storybook" in the terminal.

# HTW Generator

1. Run:
   cd tools/HTWGenerator

2. Paste the Excel/tab-delimited HTW source data into `rawData` in `structureData.js`.

3. Run:
   node run.js

4. `run.js` will automatically:
   - run `structureData.js`
   - update `htw.json`
   - run `htwGenerator.js`

5. The generated HTW HTML file will be written to `tools/HTWGenerator/output/`.

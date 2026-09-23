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
5. OPGenerator
6. PLPSliderGenerator

## Contains Components Library (StoryBook)

1. Run "cd ComponentsLibrary" in the terminal.
2. Run "npm install" in the terminal.
3. Run "npm run storybook" in the terminal.

# HTML Generators

There are three HTML generators so far, and they all follow the same file structure.

1. Run:
   cd tools/_desired generator here_

2. Paste the Excel/tab-delimited source data into `rawData` in `structureData.js`.
   a. for OP and HTW generators, paste the base URL into 'cloudinaryBaseURL' in the same file.

3. Run:
   node run.js

4. `run.js` will automatically:
   - run `structureData.js`
   - update the .json file
   - run `~Generator.js`

5. The generated HTW HTML file will be written to the output folder.

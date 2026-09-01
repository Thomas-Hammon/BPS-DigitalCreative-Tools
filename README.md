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

## Contains Components Library (StoryBook)

1. Run "cd ComponentsLibrary" in the terminal.
2. Run "npm install" in the terminal.
3. Run "npm run storybook" in the terminal.

# HTW Generator

1. Run:
   cd tools/HTWGenerator

2. Update `htw.json` with the HTW slider details.
   - `items` contains the default slider items.
   - Set `googleSafe` to `true` if an item needs a Google-safe replacement and make a corresponding gSafe item.
   - `gSafe` contains the Google-safe replacement items.
   - A `gSafe` item's `id` must match the `id` of the item it replaces.

3. Run the generator:
   node htwGenerator.js

4. The generated HTW HTML will be output by the generator.

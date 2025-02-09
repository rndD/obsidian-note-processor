# Obsidian plugin

A simple plugin for [Obsidian](https://obsidian.md) that helps you process your notes systematically by providing quick access to random unprocessed notes and managing global processing status.

## Features

- 🎲 Open a random unprocessed note with a single command
- ✅ Mark notes as processed/unprocessed with commands
- 📊 Status bar showing processed/unprocessed note counts

## How It Works

- Notes without any processing tags are considered unprocessed
- Notes with `#not_processed` are considered unprocessed
- Notes with `#processed` are considered processed

## Usage

### Commands

This plugin adds three commands to Obsidian:

1. **Open Random Unprocessed Note**
   - Opens a random note that hasn't been processed yet
   - Use this to systematically work through your unprocessed notes
   - Hotkey: You can assign a hotkey in Obsidian settings

2. **Mark Note as Processed**
   - Marks the current note as processed
   - Adds the `#processed` tag to the note
   - Hotkey: Configurable in settings

3. **Unprocess Note**
   - Marks a processed note as unprocessed
   - Changes `#processed` tag to `#not_processed`
   - Useful if you need to revisit a note later

### Manual Installation

1. Download the latest release
2. Extract the files into your `.obsidian/plugins/random-unprocessed-note/` folder
3. Reload Obsidian
4. Enable the plugin in your Community Plugins list

## Development

This plugin is built using TypeScript and the Obsidian API.

### Building

1. Clone this repository
2. Run `npm install` or `yarn install`
3. Run `npm run build` or `yarn build`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

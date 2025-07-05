# Chrome Extension TypeScript

A Chrome extension built with TypeScript, featuring a modern development setup with Vite bundling and pnpm package management.

## Features

- 🔧 Built with TypeScript for type safety
- ⚡ Vite for fast bundling and development
- 📦 pnpm for efficient package management

## Setup

1. Install pnpm (if not already installed):
   ```bash
   npm install -g pnpm
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Build the extension:
   ```bash
   pnpm run build
   ```

4. For development (watch mode):
   ```bash
   pnpm run dev
   ```

## Loading the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the `dist` folder
4. The extension should now appear in your extensions list

## Development

- The extension uses Manifest V3
- TypeScript files are automatically compiled and bundled with Vite
- Hot reload in development mode for faster iteration

## Scripts

- `pnpm run build` - Build for production
- `pnpm run dev` - Build and watch for changes
- `pnpm run clean` - Clean the dist folder

## Permissions

The extension requests the following permissions:
- `activeTab` - Access to the currently active tab
- `storage` - Chrome storage API access

## License

MIT

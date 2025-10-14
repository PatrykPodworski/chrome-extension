# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

The project uses pnpm as the package manager. Key commands:

- `pnpm run build` - Build the extension for production
- `pnpm run dev` - Build and watch for changes (development mode)
- `pnpm run clean` - Clean the dist folder
- `pnpm run test` - Run tests in watch mode
- `pnpm run test:run` - Run tests once and exit

## Architecture Overview

This is a Chrome Extension (Manifest V3) built with TypeScript, React, and Vite. It implements a time tracking system that monitors browsing sessions across different domains.

### Core Components

**Background Service Worker** (`src/background/`)
- Entry point: `src/background/index.ts`
- Handles Chrome extension lifecycle events (installation, tab changes, messages)
- Manages time tracking logic through modular handlers:
  - `handlers/installation.ts` - Extension installation setup
  - `handlers/messages.ts` - Inter-component communication
  - `handlers/tabs.ts` - Tab lifecycle management (creation, updates, removal, activation)
  - `services/timeTracking.ts` - Core time tracking business logic
  - `services/stateManager.ts` - Chrome storage state management
  - `services/activeSession.ts` - Active session data models

**User Interfaces**
- **New Tab Page** (`src/newtab/`) - Replaces Chrome's default new tab with time tracking dashboard
  - Shows current time, recent sessions, stats, and top sites
  - Components: Clock, Sessions (with RecentSessions, Stats, TopSites subcomponents)
- **Popup** (`src/popup/`) - Extension popup showing current tab tracking status
  - Displays time spent on current page and tracking status

**Content Scripts**
- `src/content.ts` - Runs on all pages for potential future functionality

### Data Models

Key TypeScript interfaces in `src/types/timeTracking.ts`:
- `TimeSession` - Completed browsing session with duration
- `ActiveSession` - Currently active browsing session
- `TimeTrackingState` - Overall state including active sessions and current tab

### Utilities

- `src/utils/domainUtils.ts` - Domain extraction and URL parsing (has comprehensive unit tests)
- `src/utils/timeFormatters.ts` - Time formatting utilities
- `src/utils/isTrackableUrl.ts` - Determines if URLs should be tracked (excludes chrome:// pages)
- `src/utils/getCurrentTime.ts` - Consistent timestamp generation
- `src/utils/isToday.ts` - Date comparison utilities

### Time Tracking Logic

The extension tracks time spent on trackable URLs by:
1. Starting sessions when tabs are created/activated with trackable URLs
2. Stopping sessions when tabs are closed/deactivated
3. Switching tracking between tabs based on user focus
4. Updating sessions when URLs change within the same tab
5. Storing completed sessions in Chrome storage for dashboard display

### Build System

- **Vite** with TypeScript and React support
- **@crxjs/vite-plugin** for Chrome extension packaging
- **Tailwind CSS** with the new v4 Vite plugin for styling
- **Vitest** for unit testing

### Storage

Uses Chrome's storage API to persist:
- Active sessions across browser restarts
- Completed time tracking sessions
- Current active tab state

### Testing

- Unit tests are configured with Vitest
- Existing tests for domain utilities demonstrate testing patterns
- Tests run in Node.js environment with global test APIs enabled
- Never attribute Claude Code in commit messages
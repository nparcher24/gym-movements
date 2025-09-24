# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `yarn start` - Runs the app at http://localhost:3000
- **Build for production**: `yarn build` - Creates optimized production build in `build/` folder
- **Run tests**: `yarn test` - Launches test runner in interactive watch mode
- **Eject (one-way)**: `yarn eject` - Exposes all configuration files (use with caution)

## Project Architecture

This is a React-based fitness/workout application built with Create React App and Firebase. The app helps users manage and perform gym workouts with video demonstrations.

### Core Technologies
- **React 18** with functional components and hooks
- **Firebase v10** for authentication, Firestore database, and storage (modular API)
- **Dexie v4** for local IndexedDB video caching
- **React Router v6** for client-side routing
- **Tailwind CSS v3** for styling with custom fonts and colors
- **Material-UI** components for some UI elements

### Authentication
- Uses **custom LoginForm component** (`src/components/LoginForm.jsx`) with Firebase Auth v10 modular API
- Supports email/password sign-in, account creation, and password reset
- **Note**: Previously used deprecated `react-firebaseui` - now replaced with custom implementation
- Login component includes proper error handling and validation

### Application Flow
1. **Authentication**: Users sign in via custom LoginForm (email/password, account creation, password reset)
2. **Workout Selection**: Users choose from available workouts stored in Firestore
3. **Video Download**: App downloads workout videos from Firebase Storage to local IndexedDB for offline access
4. **Workout Execution**: Users perform workouts with video demonstrations and timers

### Key Architecture Components

#### Database Layer
- **Firestore**: Stores workout data, user information (`workouts` collection)
- **Local IndexedDB** (via Dexie): Caches video blobs for offline playback
- **Firebase Storage**: Hosts workout demonstration videos in `movement-videos/` folder

#### State Management
- React hooks for local state
- Context passing through component props
- `useLiveQuery` from Dexie for reactive local database queries

#### Routing Structure
- `/` - Main workout execution page (BasePage)
- `/setup` - Workout selection and configuration (NewSetupPage)
- `/test` - Development/testing page

### File Structure
- `src/pages/` - Route components (BasePage, SetupPage, etc.)
- `src/components/` - Reusable components (Timer, VideoDisplay, etc.)
- `src/assets/` - Fonts, audio files, images, database config
- Firebase config embedded in App.js (consider extracting to separate config file)

### Custom Styling
The app uses a custom design system with:
- Custom fonts: American Captain, Kollektif, Montserrat, Alarm Clock, DK Crayon Crumble
- Brand colors: TARed (#AB0000), TADarkRed (#780000), TABlue (#669BBC), TADarkBlue (#304890)

### Firebase Deployment
- Configured for Firebase Hosting (target: "movements")
- Build folder deployed to Firebase
- SPA routing handled via rewrites to index.html
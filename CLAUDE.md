# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based career development application that guides users through a multi-step journey of self-discovery and career planning. The app uses a step-by-step workflow with local storage persistence and modern UI animations.

## Development Commands

### Essential Commands
- `npm start` - Start development server on http://localhost:3000
- `npm run build` - Build production bundle
- `npm test` - Run tests in interactive watch mode
- `./build-and-start.sh` - Quick setup script that installs dependencies and starts dev server

### Package Management
The project uses npm. All dependencies are tracked in package.json. The build-and-start.sh script handles dependency installation automatically.

## Architecture

### Core Structure
- **Entry Point**: `src/App.js` - Simple wrapper that renders CareerDevelopmentApp
- **Main Component**: `src/components/CareerDevelopmentApp.js` - Central application state and navigation
- **Step Components**: `src/components/steps/` - Individual career development steps
- **Auth**: `src/components/AuthPage.js` and `src/components/ProtectedRoute.js` - Authentication handling

### Key Libraries
- **React 19.1.0** - Core framework
- **Framer Motion** - Animations and transitions
- **Tailwind CSS** - Utility-first styling
- **Chart.js + react-chartjs-2** - Data visualization
- **@dnd-kit** - Drag and drop functionality
- **Lucide React** - Icons
- **React Player** - Video playback

### State Management
- Uses React hooks (useState, useEffect) for state management
- **Local Storage Persistence**: User data and progress automatically saved to localStorage
- **Form Data Structure**: Centralized in CareerDevelopmentApp component with specific shape:
  ```javascript
  {
    fiveWhyProblems: [],
    workTasks: [],
    workRequirements: [],
    values: { all: [], top10: [], top5: [] },
    wheelOfLife: { health: 0, career: 0, ... },
    strengths: { fromWork: [], fromTests: [], fromFriends: [] },
    dreamJob: { themes: [], categories: {}, vision: {} }
  }
  ```

### Step System
- **9 total steps** (0-8) with progressive unlocking
- Step 0: Overview/Dashboard
- Steps 1-6: Core assessment steps
- Step 7: Dream Job (locked until steps 1-6 complete)
- Step 8: Comprehensive Summary
- **Navigation**: Users can navigate between unlocked steps freely
- **Progress Tracking**: Completed steps tracked in `completedSteps` array

### UI/UX Patterns
- **Gradient Backgrounds**: Each step has unique gradient colors
- **Framer Motion**: Consistent animation patterns for transitions
- **Responsive Design**: Mobile-first with Tailwind responsive classes
- **Progress Visualization**: Visual progress bar with step icons
- **Modern Design**: Rounded corners, shadows, backdrop blur effects

## File Organization

### Components Structure
- `src/components/CareerDevelopmentApp.js` - Main app logic and routing
- `src/components/AuthPage.js` - User authentication
- `src/components/steps/` - Individual step components
  - Enhanced versions (EnhancedFiveWhyStep, etc.) are the active implementations
  - Original versions may exist for reference but are not used
- `src/components/common/` - Currently empty, intended for shared components

### Styling
- **Tailwind CSS**: Primary styling framework
- **PostCSS**: Processing with autoprefixer
- **CSS Files**: Minimal custom CSS in src/index.css
- **Responsive**: Mobile-first design approach

### Configuration Files
- `tailwind.config.js` - Tailwind configuration (standard setup)
- `postcss.config.js` - PostCSS with Tailwind and autoprefixer
- `build-and-start.sh` - Development startup script

## Development Guidelines

### Adding New Steps
1. Create component in `src/components/steps/`
2. Add to steps array in CareerDevelopmentApp.js
3. Include icon, title, subtitle, and color gradient
4. Implement formData integration for persistence
5. Handle step completion via `markStepComplete`

### State Updates
- Use `updateFormData(field, value)` to update form state
- All state changes automatically persist to localStorage
- Follow existing formData structure for consistency

### UI Consistency
- Use Framer Motion for animations
- Follow existing gradient color patterns
- Maintain consistent spacing and layout patterns
- Use Lucide React icons for consistency

### Authentication
- Simple localStorage-based authentication
- No backend authentication system
- User data persists across sessions
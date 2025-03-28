# Task Management Application

- A comprehensive task management application built with React, Redux, Material UI, and drag-and-drop functionality.
- You can access the deployed version of the application at [https://todoify-ten.vercel.app/](https://todoify-ten.vercel.app/).

## Features

- Create, edit, delete, and manage tasks
- Drag and drop tasks to reorder them
- Filter and sort tasks by status, priority, and date
- Responsive design for mobile and desktop
- Data persistence with localStorage

## Tech Stack

- React.js with TypeScript
- Redux Toolkit for state management
- Material UI for UI components
- @dnd-kit for drag and drop functionality
- date-fns for date formatting
- localStorage for data persistence

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd task-management-app
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:5173](http://localhost:5173) to view the application in your browser

### Build for Production

```bash
npm run build
# or
yarn build
```

The build files will be located in the `dist` directory

## Project Structure

- `src/components/` - React components
- `src/store/` - Redux store configuration and slices
- `src/types/` - TypeScript type definitions
- `src/App.tsx` - Main application component
- `src/main.tsx` - Application entry point

#!/bin/bash

echo "🚀 Starting Career Development App..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Install any missing packages
echo "📦 Checking for missing packages..."
npm install --save react-chartjs-2 chart.js framer-motion react-player @dnd-kit/sortable @dnd-kit/core @dnd-kit/utilities

# Start the development server
echo "🎯 Starting development server..."
npm start

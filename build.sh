#!/bin/bash

# Ensure we are in the project directory
cd "$(dirname "$0")"

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed."
    exit 1
fi

# Install dependencies if node_modules does not exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Run the build script
echo "Running build script..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build completed successfully."
else
    echo "Build failed."
    exit 1
fi

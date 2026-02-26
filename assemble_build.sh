#!/bin/bash

# Define deployment directory
DEPLOY_DIR="deploy"

# Clean up previous build
rm -rf $DEPLOY_DIR
mkdir -p $DEPLOY_DIR

# Copy standalone build
echo "Copying standalone build..."
cp -r .next/standalone/* $DEPLOY_DIR/

# Copy static assets
echo "Copying static assets..."
mkdir -p $DEPLOY_DIR/.next
cp -r .next/static $DEPLOY_DIR/.next/

# Copy public assets
echo "Copying public folder..."
cp -r public $DEPLOY_DIR/

# Create a simple server.js entry point if needed (Next.js standalone uses server.js by default)
# But cPanel Node.js selector often looks for app.js or index.js.
# We can create a symlink or just instruct the user.
# Let's create an ecosystem.config.js for PM2 just in case, or a simple entry wrapper.

echo "Build assembled in $DEPLOY_DIR"

# Zip the content
echo "Zipping deployment package..."
zip -r deploy.zip $DEPLOY_DIR

echo "Done! Upload 'deploy.zip' to your cPanel file manager."

#!/bin/bash

# Script to push this project to a new Git repository with main branch
# Usage: Replace <NEW_REPO_URL> with your actual repository URL and run this script

echo "Step 1: Renaming branch from master to main..."
git branch -m master main

echo "Step 2: Removing old origin..."
git remote remove origin

echo "Step 3: Adding new repository as origin..."
echo "Please enter your new repository URL:"
read NEW_REPO_URL
git remote add origin $NEW_REPO_URL

echo "Step 4: Pushing to new repository..."
git push -u origin main

echo "Done! Your project is now pushed to the new repository with 'main' as the default branch."

#!/bin/bash

# Install frontend dependencies (Next.js)
cd app
npm install
cd ..

# Install backend dependencies (Python)
./venvCreate.sh
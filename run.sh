#!/bin/bash

# Run the frontend server (Next.js)
cd app
npm run dev &
cd ..

# Activate the virtual environment
source ./venv/bin/activate

# Run the backend server (Python)
cd backend
python main.py &

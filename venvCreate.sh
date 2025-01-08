#!/bin/bash

# Create a virtual environment named venv
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install required libraries from requirements.txt
pip install fastapi
pip install uvicorn
pip install requests
pip install beautifulsoup4
pip install wikipedia-api
pip install wikipedia
pip install langchain
pip install langchain-core
pip install langchain-text-splitters
pip install langchain-nvidia-ai-endpoints
pip install langgraph
pip install python-dotenv

# Deactivate the virtual environment
deactivate

echo "Virtual environment setup complete. To activate it, run 'source venv/bin/activate'."
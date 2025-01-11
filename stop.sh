#!/bin/bash

# Kill the process running on port 8000 (backend)
fuser -k 8000/tcp

# Kill the processes running on ports 3000, 3001, 3002 (frontend)
fuser -k 3000/tcp

echo "Servers stopped."
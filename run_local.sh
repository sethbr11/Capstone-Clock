#!/bin/bash
# Load variables from .env
export $(sed 's/#.*//' .env | grep -v '^$' | xargs)

echo "🚀 Starting Capstone Clock on Local Network ($LOCAL_IP)..."

# Stop existing container if running
docker rm -f capstone-clock 2>/dev/null

# Run with Local IP binding
docker run -d \
  -p $LOCAL_IP:8501:3001 \
  --name capstone-clock \
  -v "$(pwd)/$CREDS_FILE":/app/$CREDS_FILE \
  -v "$(pwd)/.env":/app/.env \
  capstone-clock

echo "✅ Running! Access at http://$LOCAL_IP:8501"
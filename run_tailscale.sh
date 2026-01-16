#!/bin/bash
# Load variables from .env
export $(grep -v '^#' .env | xargs)

# Stop existing container if running
docker rm -f capstone-clock 2>/dev/null

echo "🔒 Starting Capstone Clock on Tailscale ($TAILSCALE_IP)..."

# Run with Tailscale IP binding
docker run -d \
  -p $TAILSCALE_IP:8501:3001 \
  --name capstone-clock \
  -v "$(pwd)/$CREDS_FILE":/app/$CREDS_FILE \
  -v "$(pwd)/.env":/app/.env \
  capstone-clock

echo "✅ Secure! Access at http://$TAILSCALE_IP:8501"
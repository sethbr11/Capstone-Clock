# Load .env variables, handling quotes and comments
Get-Content .env | ForEach-Object {
    $line = $_.Trim()
    if ($line -and !$line.StartsWith("#")) {
        $lineWithoutComment = $line.Split('#')[0].Trim() # Remove inline comments
        if ($lineWithoutComment) {
            $key, $value = $lineWithoutComment.Split('=', 2)
            $key = $key.Trim()
            $value = $value.Trim().Trim('"')
            Set-Item -Path "env:$key" -Value $value
        }
    }
}

Write-Host "🔒 Starting Capstone Clock on Tailscale ($env:TAILSCALE_IP)..." -ForegroundColor Cyan

# Stop existing container
docker rm -f capstone-clock 2>$null

# Run
$dockerResult = docker run -d `
  -p "${env:TAILSCALE_IP}:8501:3001" `
  --name capstone-clock `
  -v "${PWD}/${env:CREDS_FILE}:/app/${env:CREDS_FILE}" `
  -v "${PWD}/.env:/app/.env" `
  capstone-clock

if ($LASTEXITCODE -eq 0) {
  Write-Host "✅ Secure! Access at http://${env:TAILSCALE_IP}:8501" -ForegroundColor Green
} else {
  Write-Host "❌ Failed to start container. Make sure Tailscale is up and running!" -ForegroundColor Red
  exit 1
}

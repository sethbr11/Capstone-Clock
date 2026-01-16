# Load .env variables, handling quotes and comments
Get-Content .env | ForEach-Object {
    $line = $_.Trim()
    if ($line -and !$line.StartsWith("#")) {
        $key, $value = $line.Split('=', 2)
        $key = $key.Trim()
        $value = $value.Trim().Trim('"')
        Set-Item -Path "env:$key" -Value $value
    }
}

Write-Host "🚀 Starting Capstone Clock on Local Network ($env:LOCAL_IP)..." -ForegroundColor Cyan

# Stop existing container
docker rm -f capstone-clock 2>$null

# Run
docker run -d `
  -p "${env:LOCAL_IP}:8501:3001" `
  --name capstone-clock `
  -v "${PWD}/${env:CREDS_FILE}:/app/${env:CREDS_FILE}" `
  -v "${PWD}/.env:/app/.env" `
  capstone-clock

Write-Host "✅ Running! Access at http://${env:LOCAL_IP}:8501" -ForegroundColor Green

# PowerShell script to update JWT secrets in .env file
$envFile = ".env"

if (Test-Path $envFile) {
    $content = Get-Content $envFile -Raw
    
    # Update JWT_SECRET
    $content = $content -replace 'JWT_SECRET=.*', 'JWT_SECRET=438e8bba55f793e0a9aced3fbc1de2e250ed8da8976cf76f867ef3fb384e1e1c'
    
    # Update JWT_REFRESH_SECRET
    $content = $content -replace 'JWT_REFRESH_SECRET=.*', 'JWT_REFRESH_SECRET=438e8bba55f793e0a9aced3fbc1de2e250ed8da8976cf76f867ef3fb384e1e1c'
    
    Set-Content $envFile $content
    Write-Host "JWT secrets updated in .env file"
} else {
    Write-Host ".env file not found. Creating from .env.example..."
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host ".env file created"
    } else {
        Write-Host "Error: .env.example not found"
    }
}


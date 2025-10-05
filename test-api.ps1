# API Testing Script for HTV WebApp
# Tests all API endpoints with various scenarios

Write-Host "🧪 Testing HTV WebApp API Endpoints" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:3000"

# Test 1: POST /api/roast - Valid request
Write-Host "Test 1: POST /api/roast (Valid Request)" -ForegroundColor Yellow
$body = @{
    items = @{
        "Apple iPhone 15" = "`$999.99"
        "AirPods Pro" = "`$249.99"
    }
    amount = "`$1000"
    goals = @{
        savings = @("5000", "12312025")
    }
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/roast" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✓ Success: $($response.result)" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: POST /api/roast - Missing fields
Write-Host "Test 2: POST /api/roast (Missing Fields)" -ForegroundColor Yellow
$body = @{
    items = @{
        "Test Item" = "`$50"
    }
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/roast" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✗ Should have failed but didn't" -ForegroundColor Red
} catch {
    Write-Host "✓ Expected error: Missing required fields" -ForegroundColor Green
}
Write-Host ""

# Test 3: POST /api/categorize - Valid request
Write-Host "Test 3: POST /api/categorize (Valid Request)" -ForegroundColor Yellow
$body = @{
    items = @{
        "Nike Shoes" = "`$120.00"
        "Pizza" = "`$15.99"
        "Movie Ticket" = "`$12.50"
    }
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/categorize" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✓ Success: Categorized into $($response.categories.PSObject.Properties.Count) categories" -ForegroundColor Green
    $response.categories.PSObject.Properties | ForEach-Object {
        Write-Host "  - $($_.Name): $($_.Value.Count) items" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: POST /api/categorize - Empty items
Write-Host "Test 4: POST /api/categorize (Empty Items)" -ForegroundColor Yellow
$body = @{
    items = @{}
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/categorize" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✓ Success: Handled empty items" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: GET /api/storage/buckets
Write-Host "Test 5: GET /api/storage/buckets" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/storage/buckets" -Method Get
    Write-Host "✓ Success: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  Note: This may fail if Google Cloud credentials are not configured" -ForegroundColor Gray
}
Write-Host ""

# Test 6: POST /api/roast - Budget-friendly purchase
Write-Host "Test 6: POST /api/roast (Budget-Friendly Purchase)" -ForegroundColor Yellow
$body = @{
    items = @{
        "Budget Laptop" = "`$500"
    }
    amount = "`$2000"
    goals = @{
        savings = @("5000", "12312025")
    }
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/roast" -Method Post -Body $body -ContentType "application/json"
    Write-Host "✓ Success: $($response.result)" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "====================================`n" -ForegroundColor Cyan
Write-Host "✅ API Testing Complete!" -ForegroundColor Green
Write-Host "`nNote: Make sure the development server is running (npm run dev)" -ForegroundColor Gray

# Sweet Shop Setup Script

Write-Host "🍬 Sweet Shop Management System - Setup Script" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Check if PostgreSQL is installed
Write-Host "Checking PostgreSQL installation..." -ForegroundColor Yellow
try {
    $pgVersion = psql --version
    Write-Host "✓ PostgreSQL is installed: $pgVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ PostgreSQL is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install PostgreSQL from https://www.postgresql.org/download/" -ForegroundColor Yellow
    exit 1
}

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Step 1: Installing Backend Dependencies..." -ForegroundColor Cyan
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Backend installation failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Backend dependencies installed" -ForegroundColor Green

Write-Host ""
Write-Host "Step 2: Installing Frontend Dependencies..." -ForegroundColor Cyan
Set-Location ../frontend/sweet
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Frontend installation failed" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green

Write-Host ""
Write-Host "Step 3: Setting up Database..." -ForegroundColor Cyan
Write-Host "Please ensure PostgreSQL is running and create the database:" -ForegroundColor Yellow
Write-Host "  psql -U postgres" -ForegroundColor White
Write-Host "  CREATE DATABASE sweet_shop;" -ForegroundColor White
Write-Host "  \q" -ForegroundColor White
Write-Host ""
$createDb = Read-Host "Have you created the database? (y/n)"
if ($createDb -ne "y") {
    Write-Host "Please create the database and run this script again" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Step 4: Running Database Migrations..." -ForegroundColor Cyan
Set-Location ../../backend
npm run migrate
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Migration failed" -ForegroundColor Red
    Write-Host "Please check your database credentials in backend/.env" -ForegroundColor Yellow
    exit 1
}
Write-Host "✓ Database migrations completed" -ForegroundColor Green

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "✓ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Cyan
Write-Host "  Backend:  cd backend && npm run dev" -ForegroundColor White
Write-Host "  Frontend: cd frontend/sweet && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Backend will run on:  http://localhost:5000" -ForegroundColor Yellow
Write-Host "Frontend will run on: http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "Happy coding! 🚀" -ForegroundColor Cyan

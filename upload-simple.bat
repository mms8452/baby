@echo off
echo ========================================
echo   Baby Growth Tracker - GitHub Upload
echo ========================================
echo.

REM Check if Git is installed
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Git not found!
    echo.
    echo Please install Git first:
    echo   Visit: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo Git is installed.
echo.

REM Get repository URL
set /p repo_url="Enter your GitHub repository URL: "

if "%repo_url%"=="" (
    echo Error: Repository URL cannot be empty!
    pause
    exit /b 1
)

echo.
echo Initializing Git repository...
git init

echo.
echo Adding files...
git add .

echo.
echo Committing...
git commit -m "Initial commit"

echo.
echo Adding remote...
git remote add origin "%repo_url%" 2>nul
if errorlevel 1 (
    git remote set-url origin "%repo_url%"
)

echo.
echo Pushing to GitHub...
git branch -M main
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   Success!
    echo ========================================
    echo.
    echo Next steps:
    echo   git tag v1.0.0
    echo   git push origin v1.0.0
    echo.
    echo Then check GitHub Actions for build progress.
    echo.
) else (
    echo.
    echo Upload failed! Please check:
    echo   1. Network connection
    echo   2. Repository URL
    echo   3. GitHub credentials
    echo.
)

pause

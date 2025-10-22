@echo off
chcp 65001 > nul
cls
echo ====================================
echo DEPLOYING EDGE FUNCTIONS
echo ====================================
echo.

REM Check Supabase CLI installation
where supabase >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Supabase CLI not installed!
    echo.
    echo Please install Supabase CLI:
    echo    Option 1: scoop install supabase
    echo    Option 2: npm install -g supabase
    echo    Option 3: Download from https://github.com/supabase/cli/releases
    echo.
    pause
    exit /b 1
)

echo OK: Supabase CLI found
echo.

REM Check Supabase login
echo Checking authorization...
supabase projects list >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Authorization required
    echo.
    echo Browser will open to get access token.
    echo After authorization, return here and paste the token.
    echo.
    pause
    supabase login
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Authorization failed
        pause
        exit /b 1
    )
)

echo OK: Authorization successful
echo.

REM Link to project (if not already linked)
echo Linking to project...
supabase link --project-ref oqazxfewxttctehgftuy
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Project already linked or linking error
)
echo.

REM Deploy Edge Functions
echo Deploying Edge Function: make-server-322de762...
echo.
supabase functions deploy make-server-322de762 --project-ref oqazxfewxttctehgftuy

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo DEPLOYMENT COMPLETE!
    echo ====================================
    echo.
    echo Edge Function available at:
    echo    https://oqazxfewxttctehgftuy.supabase.co/functions/v1/make-server-322de762
    echo.
    echo Test it:
    echo    https://oqazxfewxttctehgftuy.supabase.co/functions/v1/make-server-322de762/health
    echo.
    echo Now you can run START.bat to launch the site
    echo.
) else (
    echo.
    echo ====================================
    echo DEPLOYMENT ERROR
    echo ====================================
    echo.
    echo Please check:
    echo 1. Project ID is correct: oqazxfewxttctehgftuy
    echo 2. Files exist in /supabase/functions/server/
    echo 3. You have access rights to the project in Supabase
    echo.
)

pause

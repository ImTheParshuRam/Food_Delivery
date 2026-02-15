@echo off
echo Fixing nested git repository issue...

echo 1. Removing nested .git folder in backend...
if exist "d:\SynProject\Food_Delivery_app\backend\.git" (
    rmdir /S /Q "d:\SynProject\Food_Delivery_app\backend\.git"
    if exist "d:\SynProject\Food_Delivery_app\backend\.git" (
        echo ERROR: Failed to remove backend\.git folder. Please close any open files/folders in backend and try again.
        
        exit /b 1
    )
) else (
    echo backend\.git folder not found, skipping removal.
)

echo 2. Removing backend from git cache (index)...
git rm --cached backend
if %ERRORLEVEL% NEQ 0 (
    echo Warning: git rm --cached backend returned error. It might not be in parts of index. Continuing...
)

echo 3. Adding backend files to main repository...
git add backend
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to add backend files.
    pause
    exit /b 1
)

echo 4. Verifying status...
git status

echo Success! You can now commit and push.
pause

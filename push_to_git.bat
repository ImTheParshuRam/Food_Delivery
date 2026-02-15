@echo off
echo Starting Git operations...
cd /d "d:\SynProject\Food_Delivery_app"

echo.
echo === Git Status ===
git status

echo.
echo === Adding all changes ===
git add .

echo.
echo === Committing changes ===
git commit -m "Migrate backend from Java 17/18 to Java 21 and MongoDB to MySQL"

echo.
echo === Pushing to remote ===
git push

echo.
echo === Done ===
pause

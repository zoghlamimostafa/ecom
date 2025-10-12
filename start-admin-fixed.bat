@echo off
echo 🔧 Starting Sanny Admin Interface with FIXES...
echo.

echo 📍 Current directory: %CD%
echo.

echo 🚀 Starting Backend...
cd /d "C:\xampp\htdocs\sanny\san\ecomerce_sanny\backend"
start "Backend Server" cmd /k "npm start"

timeout /t 3 /nobreak >nul

echo 🎨 Starting Admin Interface...
cd /d "C:\xampp\htdocs\sanny\san\ecomerce_sanny\admin-app"
start "Admin Interface" cmd /k "npm start"

echo.
echo ✅ Services started!
echo 📱 Backend: http://localhost:4000
echo 🎨 Admin:   http://localhost:3001
echo.
echo 💡 If "something went wrong" persists:
echo    1. Open browser console (F12)
echo    2. Check for error messages
echo    3. Verify all form fields are filled
echo.

pause
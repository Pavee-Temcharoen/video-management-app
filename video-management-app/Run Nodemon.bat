@echo off

:: Start the Node.js app
start nodemon --ignore dataVid.json app.js

:: Wait a few seconds to ensure Node.js server starts (optional)
timeout /t 3

:: Open Chrome in incognito mode pointing to localhost:3000
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --incognito http://localhost:3000/main

:: Optionally, keep the batch file window open
pause
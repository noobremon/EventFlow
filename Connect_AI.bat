@echo off
echo ===================================================
echo     EventFlow AI - Claude Desktop Setup
echo ===================================================
echo.
echo Configuring Claude Desktop to connect to EventFlow...

set "CLAUDE_DIR=%APPDATA%\Claude"
set "UWP_DIR=%LOCALAPPDATA%\Packages\Claude_pzs8sxrjxfjjc\LocalCache\Roaming\Claude"

if not exist "%CLAUDE_DIR%" mkdir "%CLAUDE_DIR%" 2>nul
if exist "%LOCALAPPDATA%\Packages\Claude_pzs8sxrjxfjjc" (
    if not exist "%UWP_DIR%" mkdir "%UWP_DIR%" 2>nul
)

(
echo {
echo   "mcpServers": {
echo     "eventflow": {
echo       "type": "sse",
echo       "url": "https://eventflow-jp3o.onrender.com/sse"
echo     }
echo   }
echo }
) > "%CLAUDE_DIR%\claude_desktop_config.json"

if exist "%LOCALAPPDATA%\Packages\Claude_pzs8sxrjxfjjc" (
    copy /y "%CLAUDE_DIR%\claude_desktop_config.json" "%UWP_DIR%\claude_desktop_config.json" >nul
)

echo.
echo Success! The configuration has been securely applied.
echo.
echo IMPORTANT: Please restart your Claude Desktop app completely.
echo ^(Right-click the Claude icon in the bottom right corner of your screen near the clock and select 'Quit Claude'^)
echo.
pause

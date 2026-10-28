@echo off
title Tarqdev Enterprise ServiceHub
echo ========================================================
echo  Tarqdev Solutions - Enterprise Service Request System
echo ========================================================
echo Starting Backend & Web Portal on http://localhost:5000 ...
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0backend"
node server.js
pause


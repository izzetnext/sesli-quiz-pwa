@echo off
echo ===================================================
echo   Sesli Quiz - GitHub Yukleme Scripti
echo ===================================================
echo.

echo 1. Degisiklikler master branch'e yukleniyor...
git add .
git commit -m "Otomatik guncelleme: %date% %time%"
git push origin master
echo.

echo 2. Canli site (GitHub Pages) guncelleniyor...
call npm run deploy
echo.

echo ===================================================
echo   Islem Tamamlandi!
echo   Kaynak Kod: https://github.com/izzetnext/sesli-quiz-pwa
echo   Canli Site: https://izzetnext.github.io/sesli-quiz-pwa/
echo ===================================================
echo.
pause

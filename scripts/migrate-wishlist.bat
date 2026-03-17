@echo off
echo Running wishlist migration...
node scripts/migrate-wishlist.js
if %errorlevel% equ 0 (
    echo.
    echo Migration completed successfully!
    echo Now generating Prisma client...
    npx prisma generate
    echo.
    echo Wishlist feature is ready to use!
) else (
    echo.
    echo Migration failed! Please check the error above.
)
pause
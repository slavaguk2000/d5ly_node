cls

@echo off

echo.
echo. 
echo.
echo. 
echo      \\\\\\\          \\\\\\       \\          \\     \\\\\\\\      \\\\\\    \\           \\\\\\\\ 
echo    \\       \\      \\      \\     \\\\      \\\\     \\      \\      \\      \\           \\ 
echo    \\              \\        \\    \\  \\  \\  \\     \\       \\     \\      \\           \\   
echo    \\              \\        \\    \\    \\    \\     \\      \\      \\      \\           \\\\\ 
echo    \\              \\        \\    \\          \\     \\\\\\\\        \\      \\           \\ 
echo    \\        \\     \\      \\     \\          \\     \\              \\      \\           \\ 
echo      \\\\\\\\         \\\\\\       \\          \\     \\            \\\\\\    \\\\\\\\\\   \\\\\\\\\
echo.
echo. 
echo.
echo.

@echo on

emcc -O3 -s ALLOW_MEMORY_GROWTH=1  ^
-o d5ly_node.js code/main.c ^
-s MODULARIZE=1 -s EXPORTED_FUNCTIONS="['_malloc','_free']" ^
code/core/lib/deflate_compress.c code/core/lib/deflate_decompress.c code/core/lib/aligned_malloc.c 
REM -msimd128 //--experimental-wasm-simd
 
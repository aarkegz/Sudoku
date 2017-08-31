@if "%1" == "" @echo off
call vcvarsall.bat amd64
csc pngp.cs /nologo /r:System.Drawing.dll /out:pngp.exe
pngp.exe
del pngp.exe /q
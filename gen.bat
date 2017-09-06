@if "%1" == "" @echo off
set PCACHE=%PATH%

chcp 65001

del /S /Q debug\
del /S /Q release\

del /Q ui_*.h

set DIRCACHE=%cd%
call vcvarsall.bat amd64
cd %DIRCACHE%

qmake Sudoku.pro -spec win32-msvc
jom qmake_all
jom Debug
jom Release

chcp 936

set PATH=%PCACHE%
del /Q ui_*.h

TITLE JJF.im - Builder
ECHO OFF
ECHO Starting...
ECHO Compiling JavaScript...
call npm run build
ECHO Compiling and executing golang build...
call go build
call jjf.im.exe
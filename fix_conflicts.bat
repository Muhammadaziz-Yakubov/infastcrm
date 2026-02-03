@echo off
setlocal enabledelayedexpansion

set files[0]=client\src\utils\api.js
set files[1]=server\models\Group.js
set files[2]=server\models\Lead.js
set files[3]=server\models\Student.js
set files[4]=server\models\Task.js
set files[5]=server\models\TaskSubmission.js
set files[6]=server\models\User.js
set files[7]=server\routes\attendance.js
set files[8]=server\routes\dashboard.js
set files[9]=server\routes\payments.js
set files[10]=server\routes\studentAuth.js
set files[11]=server\routes\tasks.js

for /l %%i in (0,1,11) do (
    set "file=!files[%%i]!"
    if exist "!file!" (
        echo Processing: !file!
        powershell -Command "(Get-Content '!file!' -Raw) -replace '(?s)<<<<<<< HEAD\r?\n(.*?)\r?\n=======\r?\n.*?\r?\n>>>>>>>.*?\r?\n', '$1' -replace '(?s)<<<<<<< HEAD\r?\n(.*?)\r?\n=======\r?\n.*?\r?\n>>>>>>>.*', '$1' | Set-Content '!file!' -NoNewline"
    )
)

echo Done processing all files

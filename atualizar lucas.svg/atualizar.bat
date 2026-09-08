@echo off
cd /d "%~dp0"
title Atualizador Universal do lucas.svg - Prof. Lucas
echo =========================================================================
echo       ATUALIZADOR UNIVERSAL DO PACIENTE LUCAS (lucas.svg)
echo =========================================================================
echo.
if not exist "lucas.svg" (
    echo [ERRO] O arquivo "lucas.svg" nao foi encontrado nesta pasta!
    echo.
    echo Por favor:
    echo 1. Cole o arquivo "lucas.svg" aqui nesta pasta "atualizar lucas.svg".
    echo 2. Execute este arquivo atualizar.bat novamente.
    echo.
    pause
    exit /b 1
)
echo [1/2] Iniciando processo de sincronizacao...
echo.
node "atualizar_script.js"
if %errorlevel% neq 0 (
    echo.
    echo [AVISO] Tentando sincronizacao direta com PowerShell...
    powershell -NoProfile -ExecutionPolicy Bypass -Command "$src = (Join-Path $PSScriptRoot 'lucas.svg'); $content = Get-Content -Path $src -Raw; Get-ChildItem -Path (Join-Path $PSScriptRoot '..') -Filter 'lucas.svg' -Recurse | Where-Object { $_.FullName -notmatch 'atualizar lucas.svg' -and $_.FullName -notmatch '\.git' } | ForEach-Object { Copy-Item -Path $src -Destination $_.FullName -Force; Write-Host (' Copiado: ' + $_.FullName) }"
)
echo.
echo =========================================================================
echo  Processo concluido com sucesso! Pressione qualquer tecla para fechar.
echo =========================================================================
pause > nul

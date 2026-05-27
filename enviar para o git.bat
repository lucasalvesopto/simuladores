@echo off
:: Garante que o script rode na pasta onde ele está salvo
cd /d "%~dp0"

echo ==========================================
echo    ENVIANDO ATUALIZACOES PARA O GITHUB
echo ==========================================
echo.

:: 1. Adiciona todas as alterações
echo [+] Agrupando modificacoes (git add)...
git add .

echo.
:: 2. Pede a mensagem do commit. Se der Enter direto, usa um padrão.
set /p msg="Digite a mensagem do commit (ou Enter para o padrao): "
if "%msg%"=="" set msg="Atualizacao automatica: %date% %time%"

echo.
:: 3. Faz o commit
echo [+] Criando commit...
git commit -m "%msg%"

echo.
:: 4. Envia para o GitHub (Ajuste 'main' se sua branch for 'master')
echo [+] Enviando para o repositorio remoto (git push)...
git push origin main

echo.
echo ==========================================
echo    PROCESSO CONCLUIDO COM SUCESSO!
echo ==========================================
echo.
pause
const fs = require('fs');
const path = require('path');

console.log('🔄 Iniciando atualização em todos os simuladores...\n');

const pastaAtual = __dirname;
const raizProjeto = path.resolve(pastaAtual, '..');
const arquivoOrigem = path.join(pastaAtual, 'lucas.svg');

if (!fs.existsSync(arquivoOrigem)) {
    console.error('❌ ERRO: O arquivo "lucas.svg" não foi encontrado na pasta "atualizar lucas.svg"!');
    process.exit(1);
}

// 1. Ler o arquivo e garantir que esteja em UTF-8 padrão web
const rawBuf = fs.readFileSync(arquivoOrigem);
let svgTexto = '';

if (rawBuf[0] === 0xff && rawBuf[1] === 0xfe) {
    console.log('ℹ️ Detectado arquivo exportado em UTF-16LE. Convertendo para UTF-8 padrão web...');
    svgTexto = rawBuf.toString('utf16le');
} else {
    svgTexto = rawBuf.toString('utf8');
}

// Garante cabeçalho UTF-8
svgTexto = svgTexto.replace(/encoding=["']UTF-16["']/i, 'encoding="UTF-8"');

// Salva de volta a versão UTF-8 limpa na pasta de atualização
fs.writeFileSync(arquivoOrigem, svgTexto, 'utf8');

// 2. Localizar todas as pastas e arquivos lucas.svg no projeto
function buscarArquivos(dir, nomeArquivo, lista = []) {
    const itens = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of itens) {
        const caminhoCompleto = path.join(dir, item.name);
        if (item.isDirectory()) {
            // Ignora pastas de controle de versão e a própria pasta de atualização
            if (item.name === '.git' || item.name === 'node_modules' || item.name === 'atualizar lucas.svg') {
                continue;
            }
            buscarArquivos(caminhoCompleto, nomeArquivo, lista);
        } else if (item.name.toLowerCase() === nomeArquivo.toLowerCase()) {
            lista.push(caminhoCompleto);
        }
    }
    return lista;
}

const arquivosEncontrados = buscarArquivos(raizProjeto, 'lucas.svg');
console.log(`📁 Encontrados ${arquivosEncontrados.length} locais com "lucas.svg":\n`);

let atualizados = 0;
for (const destino of arquivosEncontrados) {
    try {
        fs.writeFileSync(destino, svgTexto, 'utf8');
        const relativo = path.relative(raizProjeto, destino);
        console.log(` ✅ Atualizado: ${relativo}`);
        atualizados++;
    } catch (err) {
        console.error(` ❌ Falha ao atualizar ${destino}:`, err.message);
    }
}

// 3. Atualizar a constante embutida LUCAS_SVG_RAW no meo.js
const meoJsPath = path.join(raizProjeto, 'Simulador-MEO', 'meo.js');
if (fs.existsSync(meoJsPath)) {
    try {
        let meoJs = fs.readFileSync(meoJsPath, 'utf8');
        const svgRegex = /const LUCAS_SVG_RAW = [\s\S]*?;\r?\n\r?\n\/\/ =========================================================================\r?\n\/\/ INICIALIZAÇÃO/;
        if (svgRegex.test(meoJs)) {
            const novoBloco = `const LUCAS_SVG_RAW = ${JSON.stringify(svgTexto)};\n\n// =========================================================================\n// INICIALIZAÇÃO`;
            meoJs = meoJs.replace(svgRegex, novoBloco);
            fs.writeFileSync(meoJsPath, meoJs, 'utf8');
            console.log('\n 🎯 meo.js (Simulador-MEO): Constante LUCAS_SVG_RAW sincronizada com sucesso!');
        }
    } catch (e) {
        console.error(' ⚠️ Aviso ao sincronizar meo.js:', e.message);
    }
}

console.log(`\n🎉 SUCESSO: ${atualizados} arquivo(s) lucas.svg atualizados em todo o projeto!`);

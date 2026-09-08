// comandos.js

// Elementos do DOM
const ocularRange = document.getElementById('ocular-range');
const ocularValue = document.getElementById('ocular-value');
const horizontalRange = document.getElementById('horizontal-range');
const horizontalValue = document.getElementById('horizontal-value');
const verticalRange = document.getElementById('vertical-range');
const verticalValue = document.getElementById('vertical-value');
const crossVertical = document.querySelector('.crosshair-vertical');
const crossHorizontal = document.querySelector('.crosshair-horizontal');

// Selecionando as miras para animá-las
const mireVertical = document.querySelector('.mire-vertical');
const mireHorizontal = document.querySelector('.mire-horizontal');
const mireCentral = document.querySelector('.mire-central');
const miresGroup = document.querySelector('.mires-group'); // Grupo que move todas as miras juntas

const alturaRange = document.getElementById('altura-range');
const alturaValue = document.getElementById('altura-value');
const queixeiraRange = document.getElementById('queixeira-range');
const queixeiraValue = document.getElementById('queixeira-value');
const lateralRange = document.getElementById('lateral-range');
const lateralValue = document.getElementById('lateral-value');
const eixoRange = document.getElementById('eixo-range');
const eixoValue = document.getElementById('eixo-value');
const focoRange = document.getElementById('foco-range');
const focoValue = document.getElementById('foco-value');

// Configurações da simulação
// O status onde o mais fica exatamente com o foco vai ser definido pela variavel grauAvaliador
// Por enquanto é 0, mas será alterada depois.
let grauAvaliador = 0;

// Valor ideal em dioptrias (D) para a junção perfeita dos símbolos.
// 44.00 é o valor padrão. Isso representa a curvatura da córnea do paciente.
let valorHorizontal = 44.00;
let valorVertical = 44.00;

// A variável "altura" e "lateral" indicam a posição que os controles devem estar
// para que o centro do círculo (mira central) fique exatamente sobre o sinal de "mais" (cruz preta da ocular).
let altura = 5;
let lateral = 0;

// O eixo do astigmatismo do paciente
// De 0 a 180 graus
let eixo = 0;

// O foco de aproximação do equipamento com o olho do paciente.
// De 0 a 10. O valor 5 é o foco perfeito.
let foco = 5;

// Função para atualizar o foco
function atualizarFocoOcular() {
    const valorAtual = parseFloat(ocularRange.value);

    // Formata o texto para exibir sempre 2 casas decimais e o sinal positivo se for > 0
    if (ocularValue) {
        ocularValue.textContent = valorAtual > 0 ? `+${valorAtual.toFixed(2)}` : valorAtual.toFixed(2);
    }
    // Calcula o quão longe o valor atual está do foco ideal
    const erroFoco = Math.abs(valorAtual - grauAvaliador);

    // Multiplicador para converter o erro em pixels de desfoque (blur)
    const blurAmount = erroFoco * 0.8;

    // Aplica o filtro de blur nas linhas da cruz
    crossVertical.style.filter = `blur(${blurAmount}px)`;
    crossHorizontal.style.filter = `blur(${blurAmount}px)`;
}

// Função para atualizar o foco das miras (duplicação)
function atualizarFocoMiras() {
    const valFoco = parseFloat(focoRange.value);
    if (focoValue) focoValue.textContent = valFoco.toFixed(1);

    const erroFoco = valFoco - foco;

    // Deslocamento da imagem duplicada
    const deslocamento = erroFoco * 0.5; // vmin

    // Leve embaçamento quando fora de foco
    const blurAmount = Math.abs(erroFoco) * 0.15;

    // Usamos o drop-shadow para criar uma "cópia" fantasma exata das miras, 
    // simulando perfeitamente o efeito de foco do ceratômetro.
    if (erroFoco === 0) {
        miresGroup.style.filter = 'none';
    } else {
        miresGroup.style.filter = `drop-shadow(${deslocamento}vmin ${-deslocamento}vmin 0px rgba(168, 207, 168, 0.7)) blur(${blurAmount}px)`;
    }
}

// Escuta a mudança no input range
ocularRange.addEventListener('input', atualizarFocoOcular);

// Função para atualizar os valores dos tambores na tela
function atualizarTambores() {
    const valHoriz = parseFloat(horizontalRange.value);
    const valVert = parseFloat(verticalRange.value);
    const valEixo = parseFloat(eixoRange.value);

    if (horizontalValue) horizontalValue.textContent = valHoriz.toFixed(2);
    if (verticalValue) verticalValue.textContent = valVert.toFixed(2);
    if (eixoValue) eixoValue.textContent = valEixo.toString();

    // A posição ideal de alinhamento é exatamente o valor definido para o paciente nas variáveis
    const alvoHorizontal = valorHorizontal;
    const alvoVertical = valorVertical;

    // Diferença entre o que o usuário marcou e o alvo real
    const erroHorizontal = valHoriz - alvoHorizontal;
    const erroVertical = valVert - alvoVertical;

    // Cálculo do Erro de Eixo
    let erroEixo = valEixo - eixo;
    // Corrige para o menor caminho (ex: se paciente tem 10 e usuário botou 170, erro é -20)
    while (erroEixo > 90) erroEixo -= 180;
    while (erroEixo < -90) erroEixo += 180;

    // Desvio tangencial (quando o eixo está errado, as miras se desencontram lateralmente)
    const fatorTangencial = 0.1;
    const desvioTangencial = erroEixo * fatorTangencial;

    // --- CONTROLE DE SENSIBILIDADE DO MOVIMENTO ---
    const velocidadeMovimento = 0.25;

    // Calcula o deslocamento extra gerado pelo erro do tambor
    const deslocamentoY = erroVertical * velocidadeMovimento;
    // O sinal de "menos" (vertical) fica com seu centro a 7px da borda do círculo, então somam 14px.
    mireVertical.style.top = `calc(50% - (10vmin + 14px + ${deslocamentoY}vmin))`;
    // Aplica o desvio tangencial no eixo X
    mireVertical.style.left = `calc(50% + ${desvioTangencial}vmin)`;

    const deslocamentoX = erroHorizontal * velocidadeMovimento;
    // O sinal de "mais" (horizontal) fica com seu centro a 8px da borda do círculo, então somam 16px.
    mireHorizontal.style.left = `calc(50% - (10vmin + 16px + ${deslocamentoX}vmin))`;
    // Aplica o desvio tangencial no eixo Y
    mireHorizontal.style.top = `calc(50% + ${desvioTangencial}vmin)`;
}

horizontalRange.addEventListener('input', atualizarTambores);
verticalRange.addEventListener('input', atualizarTambores);

// ==========================================
// LÓGICA DE MOVIMENTO GLOBAL (ALTURA / LATERAL)
// ==========================================
function atualizarPosicaoGlobal() {
    const valAltura = parseFloat(alturaRange.value);
    const valQueixeira = parseFloat(queixeiraRange.value);
    const valLateral = parseFloat(lateralRange.value);

    if (alturaValue) alturaValue.textContent = valAltura.toFixed(1);
    if (queixeiraValue) queixeiraValue.textContent = valQueixeira.toFixed(1);
    if (lateralValue) lateralValue.textContent = valLateral.toFixed(1);

    // Calcula o erro Y somando o desvio do Joystick (Altura) e da Queixeira
    // Como a queixeira tem o centro padrão em 5, subtraímos 5 para achar o erro dela.
    const erroQueixeira = valQueixeira - 5;
    const erroY = (valAltura - altura) + erroQueixeira;

    // Calcula o erro X
    const erroX = valLateral - lateral;

    // Velocidades de movimento global (vmin por cada passo)
    // Aumentado a pedido do usuário: Lateral (1.5x) e Altura (4x)
    const velGlobalX = 4.5; // (Era 3 * 1.5x = 4.5)
    const velGlobalY = 12;  // (Era 3 * 4x = 12)

    const valEixo = parseFloat(eixoRange.value);

    // --- CONTROLE DE SENSIBILIDADE DA ROTAÇÃO ---
    // Multiplicador da rotação. Se achar muito rápido, diminua (ex: 0.5 gira pela metade).
    const fatorRotacao = 0.5;
    const anguloVisual = valEixo * fatorRotacao;

    // Move o grupo todo. Translate primeiro, rotate depois para girar em torno de si mesmo
    miresGroup.style.transform = `translate(${erroX * velGlobalX}vmin, ${-erroY * velGlobalY}vmin) rotate(${anguloVisual}deg)`;

    // Removemos a contra-rotação da mira central (círculo verde). 
    // Ela DEVE girar junto com as outras miras para que os sinais de + e - continuem apontando uns para os outros.
    // A cruz preta (que é a verdadeira retícula da ocular) já está fora do grupo e continua 100% independente!
    mireCentral.style.transform = `translate(-50%, -50%)`;
}

alturaRange.addEventListener('input', atualizarPosicaoGlobal);
queixeiraRange.addEventListener('input', atualizarPosicaoGlobal);
lateralRange.addEventListener('input', atualizarPosicaoGlobal);
eixoRange.addEventListener('input', atualizarTambores);
eixoRange.addEventListener('input', atualizarPosicaoGlobal);
focoRange.addEventListener('input', atualizarFocoMiras);

// Elementos de Seleção de Olho (OD / OE)
const btnEyeToggle = document.getElementById('btn-eye-toggle');
const labelOD = document.getElementById('label-od');
const labelOE = document.getElementById('label-oe');
let olhoAtual = 'OD'; // Padrão OD

// ==========================================
// INTEGRAÇÃO COM A FICHA CLÍNICA (LOCALSTORAGE)
// ==========================================
const STORAGE_KEY = 'pacienteData';

function carregarCeratometriaDoLocalStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    let data = null;
    if (raw) {
        try {
            data = JSON.parse(raw);
        } catch (e) {
            console.error("Erro ao analisar pacienteData:", e);
        }
    }

    if (!data) {
        data = {
            ceratometria: {
                od: { horizontal: 44.00, vertical: 44.00, eixo: 180 },
                oe: { horizontal: 44.00, vertical: 44.00, eixo: 180 }
            }
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } else if (!data.ceratometria) {
        data.ceratometria = {
            od: { horizontal: 44.00, vertical: 44.00, eixo: 180 },
            oe: { horizontal: 44.00, vertical: 44.00, eixo: 180 }
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    return data.ceratometria;
}

function aplicarDadosDoOlho(olho) {
    olhoAtual = olho;
    const cera = carregarCeratometriaDoLocalStorage();
    const dadosOlho = (olho === 'OE' ? cera.oe : cera.od) || { horizontal: 44.00, vertical: 44.00, eixo: 180 };

    valorHorizontal = dadosOlho.horizontal !== undefined ? parseFloat(dadosOlho.horizontal) : 44.00;
    valorVertical = dadosOlho.vertical !== undefined ? parseFloat(dadosOlho.vertical) : 44.00;
    eixo = 180; // Fixo em 180 conforme especificado

    // Atualiza indicadores visuais do Toggle
    if (labelOD && labelOE) {
        if (olho === 'OD') {
            labelOD.classList.add('active');
            labelOD.classList.remove('active-oe');
            labelOE.classList.remove('active', 'active-oe');
        } else {
            labelOE.classList.add('active-oe');
            labelOD.classList.remove('active', 'active-oe');
        }
    }

    console.log(`%c[Ceratômetro] Olho Selecionado: %c${olho}`, "font-weight: bold; color: #ea580c;", "color: #38bdf8; font-weight: bold;");
    console.log(`%cTambor Horizontal: %c${valorHorizontal.toFixed(2)} D | %cTambor Vertical: %c${valorVertical.toFixed(2)} D | %cEixo: %c${eixo}°`, 
        "font-weight: bold;", "color: #4ade80;", "font-weight: bold;", "color: #4ade80;", "font-weight: bold;", "color: #4ade80;");

    atualizarTambores();
}

// Escuta a alternância entre OD e OE
if (btnEyeToggle) {
    btnEyeToggle.checked = false; // Começa desmarcado = OD
    btnEyeToggle.addEventListener('change', (e) => {
        const novoOlho = e.target.checked ? 'OE' : 'OD';
        aplicarDadosDoOlho(novoOlho);
    });
}

// Continuamos escutando o teclado caso queira mapear teclas futuramente
document.addEventListener('keydown', function (event) {
    const tecla = event.key;
});

// ==========================================
// MODO PROFESSOR E LIGAR/DESLIGAR
// ==========================================
const btnGerarPaciente = document.getElementById('btn-gerar-paciente');
const btnPower = document.getElementById('btn-power'); // Agora é um checkbox

// Aparelho começa desligado
if (btnPower) btnPower.checked = false;
miresGroup.classList.add('power-off'); 

if (btnPower) {
    btnPower.addEventListener('change', (e) => {
        if (e.target.checked) {
            miresGroup.classList.remove('power-off');
        } else {
            miresGroup.classList.add('power-off');
        }
    });
}

function randomRange(min, max, step) {
    const steps = Math.floor((max - min) / step);
    const randStep = Math.floor(Math.random() * (steps + 1));
    return min + (randStep * step);
}

if (btnGerarPaciente) {
    btnGerarPaciente.addEventListener('click', () => {
        // Gerar valores aleatórios dentro de faixas realistas para OD e OE
        const k1_od = randomRange(41, 46, 0.25);
        const k2_od = randomRange(41, 46, 0.25);
        const k1_oe = randomRange(41, 46, 0.25);
        const k2_oe = randomRange(41, 46, 0.25);

        // Atualiza no localStorage preservando os outros dados do pacienteData
        const raw = localStorage.getItem(STORAGE_KEY);
        let data = {};
        if (raw) {
            try { data = JSON.parse(raw); } catch (e) {}
        }
        data.ceratometria = {
            od: { horizontal: k1_od, vertical: k2_od, eixo: 180 },
            oe: { horizontal: k1_oe, vertical: k2_oe, eixo: 180 }
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

        altura = randomRange(3, 7, 0.1);
        lateral = randomRange(-5, 5, 0.1);
        foco = randomRange(3, 7, 0.1);
        grauAvaliador = randomRange(-3, 3, 0.25);

        // Imprimir gabarito no console para o professor
        console.clear();
        console.log("%c=== GABARITO DO PACIENTE ===", "color: #ea580c; font-size: 16px; font-weight: bold;");
        console.log(`%cOcular (Cruz Preta): %c${grauAvaliador > 0 ? '+' : ''}${grauAvaliador.toFixed(2)} D`, "font-weight: bold;", "color: #4ade80;");
        console.log(`%c[OD] Horiz: ${k1_od.toFixed(2)} D | Vert: ${k2_od.toFixed(2)} D | Eixo: 180°`, "color: #38bdf8; font-weight: bold;");
        console.log(`%c[OE] Horiz: ${k1_oe.toFixed(2)} D | Vert: ${k2_oe.toFixed(2)} D | Eixo: 180°`, "color: #34d399; font-weight: bold;");
        console.log(`%cAltura: %c${altura.toFixed(1)}`, "font-weight: bold;", "color: #4ade80;");
        console.log(`%cLateral: %c${lateral.toFixed(1)}`, "font-weight: bold;", "color: #4ade80;");
        console.log(`%cFoco (Aprox): %c${foco.toFixed(1)}`, "font-weight: bold;", "color: #4ade80;");
        console.log("%c============================", "color: #ea580c; font-weight: bold;");

        // Atualizar a ótica com o novo paciente para o olho atualmente selecionado
        aplicarDadosDoOlho(olhoAtual);
        atualizarFocoOcular();
        atualizarFocoMiras();
        atualizarPosicaoGlobal();
    });
}

// Inicializa com os dados do OD
aplicarDadosDoOlho('OD');
atualizarFocoOcular();
atualizarFocoMiras();
atualizarTambores();
atualizarPosicaoGlobal();


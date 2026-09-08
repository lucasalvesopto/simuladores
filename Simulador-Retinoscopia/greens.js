// =========================================================================
// 🔦 CONSTANTES DE CALIBRAÇÃO DO RETINOSCÓPIO E FAIXA DE LUZ
// =========================================================================
// Altere estes valores para calibrar tamanho, posição e comportamento:
const RETINOSCOPIO_CONFIG = {
    // Dimensões da Faixa de Luz
    larguraFaixa: 1,        // Largura da faixa em porcentagem da tela (ex: 1 = 1vw)
    alturaFaixa: 10,        // Altura da faixa em porcentagem da tela (ex: 10 = 10vh)

    // Posição da Faixa de Luz em relação ao Cursor do Mouse (%)
    offsetXFaixa: -5,       // Deslocamento X da fenda (%: Positivo = Direita, Negativo = Esquerda)
    offsetYFaixa: -10,      // Deslocamento Y da fenda (%: Positivo = Abaixo, Negativo = Acima)

    // Posição do Aparelho Retinoscópio em relação ao Cursor do Mouse (%)
    offsetXAparelho: 0,     // Deslocamento X do aparelho (%: Positivo = Direita, Negativo = Esquerda)
    offsetYAparelho: -10,   // Deslocamento Y do aparelho (%: Negativo = Acima, Positivo = Abaixo)

    rotacaoGraus: 0,        // Rotação da fenda em graus (0° = vertical, 90° = horizontal)
    opacidade: 1.0          // Opacidade do feixe (0.0 a 1.0)
};

// Variáveis de estado global do simulador
let isChartVisible = false;
let isGlassesVisible = false; // Óculos começa na maleta
let currentLensZIndex = 11; // Controle dinâmico para a última lente colocada ficar na frente

// Estado e Óptica da Retinoscopia
let isRetinoscopioAtivo = false;
let isModoMEM = false; // Se o Card de MEM está acoplado ao retinoscópio
let acomodacao = 1.25; // Resposta acomodativa do paciente para o teste dinâmico (MEM)
let eixoRetinoscopio = 0; // Eixo da fenda (0° a 180°)
let distanciaTrabalhoD = 2.00; // Distância de trabalho em Dioptrias (padrão 50cm = +2.00 D)

// Refração Estática do Paciente (Referência Binocular / Longe)
let rxEstEsfOD = 0.00, rxEstCilOD = 0.00, rxEstEixoOD = 0;
let rxEstEsfOE = 0.00, rxEstCilOE = 0.00, rxEstEixoOE = 0;

// Refração Dinâmica do Paciente (MEM / Monocular)
let rxDinEsfOD = 0.00, rxDinCilOD = 0.00, rxDinEixoOD = 0;
let rxDinEsfOE = 0.00, rxDinCilOE = 0.00, rxDinEixoOE = 0;

// Variáveis de refração ativa
let rxEsfOD = 0.00;
let rxCilOD = 0.00;
let rxEixoOD = 0;
let rxEsfOE = 0.00;
let rxCilOE = 0.00;
let rxEixoOE = 0;

// Variáveis do Paciente
let idade = 40;
let linhaAV = 1; // 1 = J1, a linha que o paciente consegue ler no cartão

let lenteEsfOD = 0; // Grau da lente esférica atual no OD
let lenteEsfOE = 0; // Grau da lente esférica atual no OE
let rotAceOD = 0; // Rotação visual infinita do anel de lentes acessórias
let rotAceOE = 0; // Rotação visual infinita do anel de lentes acessórias (OE)
let posAcessorio = 1; // Posição atual da lente acessória (1 a 8) no OD
let posAcessorioOE = 1; // Posição atual da lente acessória (1 a 8) no OE
let aceTextoTimeout = null; // Para controlar o tempo que o texto do acessório fica visível no OD
let aceTextoTimeoutOE = null; // Para OE
let lenteCilOD = 0; // Grau da lente cilíndrica atual no OD
let rotCilOD = 0; // Rotação visual infinita do botão do Cilindro OD
let lenteCilOE = 0; // Grau da lente cilíndrica atual no OE
let rotCilOE = 0; // Rotação visual infinita do botão do Cilindro OE
let lenteEixoOD = 0; // Eixo atual no OD (0 a 180)
let rotEixoOD = 0; // Rotação infinita visual da imagem do Eixo OD
let lenteEixoOE = 0; // Eixo atual no OE (0 a 180)
let rotEixoOE = 0; // Rotação infinita visual da imagem do Eixo OE
let oclusorOD = false; // Se o OD está tapado
let oclusorOE = false; // Se o OE está tapado
let lenteAtiva = null; // 'ccj' ou 'risley' no OD
let lenteAtivaOE = null; // 'ccj' ou 'risley' no OE

// Gera os dados vitais do paciente atual ao carregar a página
function gerarPaciente() {
    // Sincroniza automaticamente com a Ficha Clínica (pacienteData)
    const storedData = localStorage.getItem('pacienteData');
    if (storedData) {
        try {
            const data = JSON.parse(storedData);
            if (data.rxOD && data.rxOE) {
                rxEstEsfOD = data.rxOD.esf ?? 0.00;
                rxEstCilOD = data.rxOD.cil ?? 0.00;
                rxEstEixoOD = data.rxOD.eixo ?? 0;
                rxEstEsfOE = data.rxOE.esf ?? 0.00;
                rxEstCilOE = data.rxOE.cil ?? 0.00;
                rxEstEixoOE = data.rxOE.eixo ?? 0;
            }
            if (data.rxDinamica?.od && data.rxDinamica?.oe) {
                rxDinEsfOD = data.rxDinamica.od.esf ?? (rxEstEsfOD + 0.75);
                rxDinCilOD = data.rxDinamica.od.cil ?? rxEstCilOD;
                rxDinEixoOD = data.rxDinamica.od.eixo ?? rxEstEixoOD;
                rxDinEsfOE = data.rxDinamica.oe.esf ?? (rxEstEsfOE + 0.75);
                rxDinCilOE = data.rxDinamica.oe.cil ?? rxEstCilOE;
                rxDinEixoOE = data.rxDinamica.oe.eixo ?? rxEstEixoOE;
            } else {
                rxDinEsfOD = rxEstEsfOD + 0.75;
                rxDinCilOD = rxEstCilOD;
                rxDinEixoOD = rxEstEixoOD;
                rxDinEsfOE = rxEstEsfOE + 0.75;
                rxDinCilOE = rxEstCilOE;
                rxDinEixoOE = rxEstEixoOE;
            }
            if (data.idade !== undefined) idade = data.idade;
        } catch (e) { console.error("Erro ao ler localStorage", e); }
    }
    console.log(`Paciente carregado: Estática OD (${rxEstEsfOD}/${rxEstCilOD}/${rxEstEixoOD}°) OE (${rxEstEsfOE}/${rxEstCilOE}/${rxEstEixoOE}°) | Dinâmica OD (${rxDinEsfOD}/${rxDinCilOD}/${rxDinEixoOD}°) OE (${rxDinEsfOE}/${rxDinCilOE}/${rxDinEixoOE}°)`);
}

gerarPaciente();

// Atualiza a óptica da Retinoscopia ao alterar lentes
function calcularVisao() {
    if (isRetinoscopioAtivo && window.__lastMouseX !== undefined) {
        atualizarOpticaRetinoscopia(window.__lastMouseX, window.__lastMouseY);
    }
}

// Gerador de Som de Catraca (Web Audio API) - 100% via código, não dá erro 404!
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playClickSound() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Som mecÃ¢nico (clique)
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);

    osc.start(audioCtx.currentTime);
    osc.stop(audioCtx.currentTime + 0.05);
}

// Atualiza o texto do visor Esférico formatado (sem sinais, cor dinÃ¢mica) e faz a animação
function atualizarVisorEsferico(direcao = null) {
    const visor = document.getElementById('visor-esf-texto');
    const lenteFx = document.getElementById('greens-lente');

    if (visor) {
        // Usa Math.abs para nunca ter sinal de - na frente, apenas o nÃºmero
        let texto = Math.abs(lenteEsfOD).toFixed(2);

        // Remove as classes de animação antes para forçar o reinício
        visor.classList.remove('anim-up', 'anim-down');
        if (lenteFx) lenteFx.classList.remove('anim-lens-up', 'anim-lens-down');

        // Reflow hack para reiniciar animação CSS instantaneamente
        void visor.offsetWidth;
        if (lenteFx) void lenteFx.offsetWidth;

        visor.innerText = texto;

        // Cor: Negativo = Vermelho, Positivo/Zero = Preto
        if (lenteEsfOD < 0) {
            visor.style.color = 'red';
        } else {
            visor.style.color = 'black';
        }

        // Adiciona as animaçÃµes de texto e de vidro
        if (direcao === 'up') {
            visor.classList.add('anim-up');
            if (lenteFx) lenteFx.classList.add('anim-lens-up');
        } else if (direcao === 'down') {
            visor.classList.add('anim-down');
            if (lenteFx) lenteFx.classList.add('anim-lens-down');
        }

        // Se o grau for 0.00, esconde a lente (pois está vazio)
        if (lenteFx) {
            if (lenteEsfOD === 0) {
                lenteFx.style.display = 'none';
            } else {
                lenteFx.style.display = 'block';
            }
        }
    }
}

// Atualiza o texto do visor Cilíndrico
function atualizarVisorCilindrico(direcao = null) {
    const visor = document.getElementById('visor-cil-texto');
    if (visor) {
        let texto = Math.abs(lenteCilOD).toFixed(2);

        visor.classList.remove('anim-up', 'anim-down');
        void visor.offsetWidth;

        visor.innerText = texto;

        if (lenteCilOD < 0) visor.style.color = 'red';
        else visor.style.color = 'black';

        if (direcao === 'up') visor.classList.add('anim-up');
        else if (direcao === 'down') visor.classList.add('anim-down');
    }
}

// Atualiza o texto do visor do Eixo
function atualizarVisorEixo(direcao = null) {
    const visor = document.getElementById('visor-eixo-texto');
    if (visor) {
        let texto = lenteEixoOD.toString();

        visor.classList.remove('anim-up', 'anim-down');
        void visor.offsetWidth;

        visor.innerText = texto;

        // Eixo é sempre preto
        visor.style.color = 'black';

        if (direcao === 'up') visor.classList.add('anim-up');
        else if (direcao === 'down') visor.classList.add('anim-down');
    }
}

// Comandos JS para o Simulador de Retinoscopia
document.addEventListener('DOMContentLoaded', () => {
    console.log("Simulador de Retinoscopia iniciado.");

    initRetinoscopio();

    // --- FUNÃÃO AUXILIAR: Pressionar e Segurar ---
    // Executa imediatamente no clique, e depois de 'initialDelay' começa a repetir a cada 'repeatDelay'
    function addHoldListener(element, callback, initialDelay = 300, repeatDelay = 80) {
        let timeoutId;
        let intervalId;

        const start = (e) => {
            if (e.type === 'mousedown' && e.button !== 0) return; // Apenas botão esquerdo
            e.preventDefault(); // Evita seleção de texto/drag

            // Toca uma vez
            callback();

            // Se segurar, entra em repetição rápida
            timeoutId = setTimeout(() => {
                intervalId = setInterval(() => {
                    callback();
                }, repeatDelay);
            }, initialDelay);
        };

        const stop = () => {
            clearTimeout(timeoutId);
            clearInterval(intervalId);
        };

        if (element) {
            element.addEventListener('mousedown', start);
            element.addEventListener('touchstart', start, { passive: false });
            element.addEventListener('mouseup', stop);
            element.addEventListener('mouseleave', stop);
            element.addEventListener('touchend', stop);
        }
    }

    // Controle dos Hitboxes do Esférico
    const btnEsfMais = document.getElementById('hitbox-esf-p1'); // Lente Positiva (+0.25)
    const btnEsfMenos = document.getElementById('hitbox-esf-p2'); // Lente Negativa (-0.25)

    addHoldListener(btnEsfMais, () => {
        playClickSound();
        lenteEsfOD += 0.25;
        atualizarVisorEsferico('down'); // Se o grau sobe, a roda "desce" trazendo o próximo nÃºmero
        calcularVisao();
    });

    addHoldListener(btnEsfMenos, () => {
        playClickSound();
        lenteEsfOD -= 0.25;
        atualizarVisorEsferico('up'); // Se o grau desce, a roda "sobe" trazendo o nÃºmero anterior
        calcularVisao();
    });

    // Controle dos Hitboxes do Cilindro
    const btnCilMais = document.getElementById('hitbox-cil-mais');
    const btnCilMenos = document.getElementById('hitbox-cil-menos');

    addHoldListener(btnCilMais, () => {
        playClickSound();
        lenteCilOD += 0.25;
        rotCilOD -= 45; // Gira o botão 45 graus visualmente

        if (lenteCilOD > 0) lenteCilOD = -6.00;

        atualizarVisorCilindrico('down');
        document.getElementById('d-cil').style.transform = `rotate(${rotCilOD}deg)`;
        calcularVisao();
    });

    addHoldListener(btnCilMenos, () => {
        playClickSound();
        lenteCilOD -= 0.25;
        rotCilOD += 45; // Gira o botão 45 graus visualmente

        if (lenteCilOD < -6.00) lenteCilOD = 0;

        atualizarVisorCilindrico('up');
        document.getElementById('d-cil').style.transform = `rotate(${rotCilOD}deg)`;
        calcularVisao();
    });

    // Controle dos Hitboxes do Eixo
    const btnEixoMais = document.getElementById('hitbox-eixo-mais');
    const btnEixoMenos = document.getElementById('hitbox-eixo-menos');

    addHoldListener(btnEixoMais, () => {
        playClickSound();
        lenteEixoOD += 5;
        rotEixoOD -= 5;

        if (lenteEixoOD > 180) lenteEixoOD = 5;

        atualizarVisorEixo('down');
        document.getElementById('d-eixo').style.transform = `rotate(${rotEixoOD}deg)`;
        calcularVisao();
    });

    addHoldListener(btnEixoMenos, () => {
        playClickSound();
        lenteEixoOD -= 5;
        rotEixoOD += 5;

        if (lenteEixoOD < 0) lenteEixoOD = 175;

        atualizarVisorEixo('up');
        document.getElementById('d-eixo').style.transform = `rotate(${rotEixoOD}deg)`;
        calcularVisao();
    });

    // Controle do Esférico Forte (+3.00 / -3.00)
    const btnEsfForteMais = document.getElementById('hitbox-esf-mais');
    const btnEsfForteMenos = document.getElementById('hitbox-esf-menos');

    addHoldListener(btnEsfForteMais, () => {
        playClickSound();
        lenteEsfOD += 3.00;

        // Limites (ajuste se o greens tiver limites diferentes)
        if (lenteEsfOD > 16.75) lenteEsfOD = 16.75;

        atualizarVisorEsferico('up');
        calcularVisao();
    });

    addHoldListener(btnEsfForteMenos, () => {
        playClickSound();
        lenteEsfOD -= 3.00;
        if (lenteEsfOD < -19.00) lenteEsfOD = -19.00;
        atualizarVisorEsferico('down');
        calcularVisao();
    });

    // Controle das Lentes Acessórias
    const btnAceMais = document.getElementById('hitbox-ace-mais');
    const btnAceMenos = document.getElementById('hitbox-ace-menos');
    const visorAceTexto = document.getElementById('visor-ace-texto');

    const nomesLentesAcessorias = [
        "", // Índice 0 não usado
        "1 - Lente Zero (O)",
        "2 - Oclusor (OC)",
        "3 - ±0.50 (Cil. Cruzado)",
        "4 - 6Δ Base Superior (6▲U)",
        "5 - PH (Pinhole)",
        "6 - ±0.12 (Auxiliar)",
        "7 - Mira (Centralizador DP)",
        "8 - RL (Filtro Vermelho)",
        "9 - WMH (Maddox Horiz.)",
        "10 - WMV (Maddox Vert.)",
        "11 - P (Polarizada)",
        "12 - R (+2.00 Retinoscopia)"
    ];

    function mostrarTextoAcessorio() {
        if (visorAceTexto) {
            visorAceTexto.innerText = nomesLentesAcessorias[posAcessorio];
            visorAceTexto.style.opacity = '1';

            if (aceTextoTimeout) clearTimeout(aceTextoTimeout);

            aceTextoTimeout = setTimeout(() => {
                visorAceTexto.style.opacity = '0';
            }, 1500); // Some após 1,5 segundos
        }

        // Atualizar o SVG dinâmico
        const svgDinamico = document.getElementById('svg-ace-dinamico');
        const path = document.getElementById('lente-ace-path');
        const grupoMiraOD = document.getElementById('grupo-mira-od');

        if (svgDinamico && path) {
            svgDinamico.style.display = 'block';
            path.style.mask = 'none';
            if (grupoMiraOD) grupoMiraOD.style.display = (posAcessorio === 7) ? 'block' : 'none';

            switch (posAcessorio) {
                case 1: // Lente Zero (O)
                    svgDinamico.style.display = 'none';
                    break;
                case 2: // Oclusor (OC)
                    path.style.fill = 'black';
                    path.style.fillOpacity = '1';
                    break;
                case 3: // ±0.50 (Cilindro Cruzado Fixo)
                    path.style.fill = '#ffffff';
                    path.style.fillOpacity = '0.3';
                    break;
                case 4: // 6Δ Base Superior (OD)
                    path.style.fill = '#ffffff';
                    path.style.fillOpacity = '0.35';
                    break;
                case 5: // PH (Pinhole)
                    path.style.fill = 'black';
                    path.style.fillOpacity = '1';
                    path.style.mask = 'url(#ph-mask)';
                    break;
                case 6: // ±0.12 (Auxiliar)
                    path.style.fill = '#ffffff';
                    path.style.fillOpacity = '0.2';
                    break;
                case 7: // Mira (Centralizador DP)
                    path.style.fill = '#ffffff';
                    path.style.fillOpacity = '0.15';
                    break;
                case 8: // RL (Filtro Vermelho OD)
                    path.style.fill = 'red';
                    path.style.fillOpacity = '0.5';
                    break;
                case 9: // WMH (White Maddox Horizontal)
                    path.style.fill = 'url(#maddox-horiz)';
                    path.style.fillOpacity = '0.6';
                    break;
                case 10: // WMV (White Maddox Vertical)
                    path.style.fill = 'url(#maddox-vert)';
                    path.style.fillOpacity = '0.6';
                    break;
                case 11: // P (Polarizada)
                    path.style.fill = '#64748B';
                    path.style.fillOpacity = '0.4';
                    break;
                case 12: // R (Retinoscopia +2.00 D)
                    path.style.fill = '#ffffff';
                    path.style.fillOpacity = '0.4';
                    break;
            }
        }
    }

    if (btnAceMais && btnAceMenos) {
        addHoldListener(btnAceMais, () => {
            playClickSound();
            rotAceOD += 30; // Giro no sentido horário
            document.getElementById('rot-ace').style.transform = `rotate(${rotAceOD}deg)`;
            posAcessorio += 1;
            if (posAcessorio > 12) posAcessorio = 1;
            mostrarTextoAcessorio();
            calcularVisao();
            atualizarOpticaRetinoscopia();
        });

        addHoldListener(btnAceMenos, () => {
            playClickSound();
            rotAceOD -= 30; // Giro no sentido anti-horário
            document.getElementById('rot-ace').style.transform = `rotate(${rotAceOD}deg)`;
            posAcessorio -= 1;
            if (posAcessorio < 1) posAcessorio = 12;
            mostrarTextoAcessorio();
            calcularVisao();
            atualizarOpticaRetinoscopia();
        });
    }

    // Controle do Cilindro Cruzado de Jackson (CCJ) e Prismas de Risley (Exclusão Mútua)
    const btnCCJ = document.getElementById('hitbox-ccj');
    const btnRisley = document.getElementById('hitbox-risley');
    const btnRetorno = document.getElementById('hitbox-retorno'); // Hitbox Ãºnico de voltar
    const ccjImg = document.getElementById('ccj');

    let lenteAtiva = null; // 'ccj' ou 'risley'

    if (btnCCJ && btnRisley && btnRetorno && ccjImg) {
        // Puxar CCJ para o olho
        btnCCJ.addEventListener('click', () => {
            if (lenteAtiva === 'risley') return; // Bloqueia se o Risley estiver no olho
            playClickSound();
            ccjImg.classList.add('ccj-ativo');
            lenteAtiva = 'ccj';

            // Esconde os de puxar, mostra o de voltar
            btnCCJ.style.display = 'none';
            btnRisley.style.display = 'none';
            btnRetorno.style.display = 'block';
        });

        // Puxar Risley para o olho
        btnRisley.addEventListener('click', () => {
            if (lenteAtiva === 'ccj') return; // Bloqueia se o CCJ estiver no olho
            playClickSound();
            ccjImg.classList.add('risley-ativo');
            lenteAtiva = 'risley';

            // Esconde os de puxar, mostra o de voltar
            btnCCJ.style.display = 'none';
            btnRisley.style.display = 'none';
            btnRetorno.style.display = 'block';
        });

        // Retornar a lente atual (seja qual for)
        btnRetorno.addEventListener('click', () => {
            playClickSound();
            if (lenteAtiva === 'ccj') {
                ccjImg.classList.remove('ccj-ativo');
            } else if (lenteAtiva === 'risley') {
                ccjImg.classList.remove('risley-ativo');
            }

            lenteAtiva = null;

            // Esconde o de voltar, mostra ambos de puxar
            btnRetorno.style.display = 'none';
            btnCCJ.style.display = 'block';
            btnRisley.style.display = 'block';
        });
    }

    // Controle dos Hitboxes do Esférico OE
    const btnEsfMaisOE = document.getElementById('hitbox-esf-p1-oe'); // Lente Positiva (+0.25)
    const btnEsfMenosOE = document.getElementById('hitbox-esf-p2-oe'); // Lente Negativa (-0.25)

    addHoldListener(btnEsfMaisOE, () => {
        playClickSound();
        lenteEsfOE += 0.25;
        atualizarVisorEsfericoOE('down');
        calcularVisao();
    });

    addHoldListener(btnEsfMenosOE, () => {
        playClickSound();
        lenteEsfOE -= 0.25;
        atualizarVisorEsfericoOE('up');
        calcularVisao();
    });

    // Controle do Esférico Forte (+3.00 / -3.00) OE
    const btnEsfForteMaisOE = document.getElementById('hitbox-esf-mais-oe');
    const btnEsfForteMenosOE = document.getElementById('hitbox-esf-menos-oe');

    addHoldListener(btnEsfForteMaisOE, () => {
        playClickSound();
        lenteEsfOE += 3.00;
        if (lenteEsfOE > 16.75) lenteEsfOE = 16.75;
        atualizarVisorEsfericoOE('up');
        calcularVisao();
    });

    addHoldListener(btnEsfForteMenosOE, () => {
        playClickSound();
        lenteEsfOE -= 3.00;
        if (lenteEsfOE < -19.00) lenteEsfOE = -19.00;
        atualizarVisorEsfericoOE('down');
        calcularVisao();
    });

    // Controle dos Hitboxes do Cilindro OE
    const btnCilMaisOE = document.getElementById('hitbox-cil-mais-oe');
    const btnCilMenosOE = document.getElementById('hitbox-cil-menos-oe');

    addHoldListener(btnCilMaisOE, () => {
        playClickSound();
        lenteCilOE += 0.25;
        rotCilOE += 45;
        if (lenteCilOE > 0) lenteCilOE = -6.00;
        atualizarVisorCilindricoOE('down');
        document.getElementById('d-cil-oe').style.transform = `rotate(${rotCilOE}deg)`;
        calcularVisao();
    });

    addHoldListener(btnCilMenosOE, () => {
        playClickSound();
        lenteCilOE -= 0.25;
        rotCilOE -= 45;
        if (lenteCilOE < -6.00) lenteCilOE = 0;
        atualizarVisorCilindricoOE('up');
        document.getElementById('d-cil-oe').style.transform = `rotate(${rotCilOE}deg)`;
        calcularVisao();
    });

    // Controle dos Hitboxes do Eixo OE
    const btnEixoMaisOE = document.getElementById('hitbox-eixo-mais-oe');
    const btnEixoMenosOE = document.getElementById('hitbox-eixo-menos-oe');

    addHoldListener(btnEixoMaisOE, () => {
        playClickSound();
        lenteEixoOE += 5;
        rotEixoOE += 5;
        if (lenteEixoOE > 180) lenteEixoOE = 5;
        atualizarVisorEixoOE('down');
        document.getElementById('d-eixo-oe').style.transform = `rotate(${rotEixoOE}deg)`;
        calcularVisao();
    });

    addHoldListener(btnEixoMenosOE, () => {
        playClickSound();
        lenteEixoOE -= 5;
        rotEixoOE -= 5;
        if (lenteEixoOE < 0) lenteEixoOE = 175;
        atualizarVisorEixoOE('up');
        document.getElementById('d-eixo-oe').style.transform = `rotate(${rotEixoOE}deg)`;
        calcularVisao();
    });

    // Lentes Acessórias OE
    const btnAceMaisOE = document.getElementById('hitbox-ace-mais-oe');
    const btnAceMenosOE = document.getElementById('hitbox-ace-menos-oe');

    if (btnAceMaisOE && btnAceMenosOE) {
        addHoldListener(btnAceMaisOE, () => {
            playClickSound();
            rotAceOE += 30; // Giro no sentido horário
            document.getElementById('rot-ace-oe').style.transform = `rotate(${-rotAceOE}deg)`;
            posAcessorioOE += 1;
            if (posAcessorioOE > 12) posAcessorioOE = 1;
            mostrarTextoAcessorioOE();
            calcularVisao();
            atualizarOpticaRetinoscopia();
        });

        addHoldListener(btnAceMenosOE, () => {
            playClickSound();
            rotAceOE -= 30; // Giro no sentido anti-horário
            document.getElementById('rot-ace-oe').style.transform = `rotate(${-rotAceOE}deg)`;
            posAcessorioOE -= 1;
            if (posAcessorioOE < 1) posAcessorioOE = 12;
            mostrarTextoAcessorioOE();
            calcularVisao();
            atualizarOpticaRetinoscopia();
        });
    }

    // CCJ / Risley OE
    const btnCCJOE = document.getElementById('hitbox-ccj-oe');
    const btnRisleyOE = document.getElementById('hitbox-risley-oe');
    const btnRetornoOE = document.getElementById('hitbox-retorno-oe');
    const ccjImgOE = document.getElementById('ccj-oe');

    if (btnCCJOE && btnRisleyOE && btnRetornoOE && ccjImgOE) {
        btnCCJOE.addEventListener('click', () => {
            if (lenteAtivaOE === 'risley') return;
            playClickSound();
            ccjImgOE.classList.add('ccj-ativo');
            lenteAtivaOE = 'ccj';
            btnCCJOE.style.display = 'none';
            btnRisleyOE.style.display = 'none';
            btnRetornoOE.style.display = 'block';
        });

        btnRisleyOE.addEventListener('click', () => {
            if (lenteAtivaOE === 'ccj') return;
            playClickSound();
            ccjImgOE.classList.add('risley-ativo');
            lenteAtivaOE = 'risley';
            btnCCJOE.style.display = 'none';
            btnRisleyOE.style.display = 'none';
            btnRetornoOE.style.display = 'block';
        });

        btnRetornoOE.addEventListener('click', () => {
            playClickSound();
            if (lenteAtivaOE === 'ccj') {
                ccjImgOE.classList.remove('ccj-ativo');
            } else if (lenteAtivaOE === 'risley') {
                ccjImgOE.classList.remove('risley-ativo');
            }
            lenteAtivaOE = null;
            btnRetornoOE.style.display = 'none';
            btnCCJOE.style.display = 'block';
            btnRisleyOE.style.display = 'block';
        });
    }

    // Inicializar textos da interface
    atualizarVisorEsferico();
    atualizarVisorCilindrico();
    atualizarVisorEixo();
    atualizarVisorEsfericoOE();
    atualizarVisorCilindricoOE();
    atualizarVisorEixoOE();
});

// Renderização dinâmica da Maleta de Provas

// ==================== FUNCÕES DO OLHO ESQUERDO (OE) ====================
function atualizarVisorEsfericoOE(direcao = null) {
    const visor = document.getElementById('visor-esf-texto-oe');
    const lenteFx = document.getElementById('greens-lente-oe');
    if (visor) {
        let texto = Math.abs(lenteEsfOE).toFixed(2);
        visor.classList.remove('anim-up', 'anim-down');
        if (lenteFx) lenteFx.classList.remove('anim-lens-up', 'anim-lens-down');
        void visor.offsetWidth;
        if (lenteFx) void lenteFx.offsetWidth;
        visor.innerText = texto;
        if (lenteEsfOE < 0) visor.style.color = 'red';
        else visor.style.color = 'black';

        if (direcao === 'up') {
            visor.classList.add('anim-up');
            if (lenteFx) lenteFx.classList.add('anim-lens-up');
        } else if (direcao === 'down') {
            visor.classList.add('anim-down');
            if (lenteFx) lenteFx.classList.add('anim-lens-down');
        }
        if (lenteFx) {
            if (lenteEsfOE === 0) lenteFx.style.display = 'none';
            else lenteFx.style.display = 'block';
        }
    }
}

function atualizarVisorCilindricoOE(direcao = null) {
    const visor = document.getElementById('visor-cil-texto-oe');
    if (visor) {
        let texto = Math.abs(lenteCilOE).toFixed(2);
        visor.classList.remove('anim-up', 'anim-down');
        void visor.offsetWidth;
        visor.innerText = texto;
        if (lenteCilOE < 0) visor.style.color = 'red';
        else visor.style.color = 'black';
        if (direcao === 'up') visor.classList.add('anim-up');
        else if (direcao === 'down') visor.classList.add('anim-down');
    }
}

function atualizarVisorEixoOE(direcao = null) {
    const visor = document.getElementById('visor-eixo-texto-oe');
    if (visor) {
        let texto = lenteEixoOE.toString();
        visor.classList.remove('anim-up', 'anim-down');
        void visor.offsetWidth;
        visor.innerText = texto;
        visor.style.color = 'black';
        if (direcao === 'up') visor.classList.add('anim-up');
        else if (direcao === 'down') visor.classList.add('anim-down');
    }
}

const nomesLentesAcessoriasOE = [
    "", // Índice 0 não usado
    "1 - Lente Zero (O)",
    "2 - Oclusor (OC)",
    "3 - ±0.50 (Cil. Cruzado)",
    "4 - 10Δ Base Inferior (10▼D)",
    "5 - PH (Pinhole)",
    "6 - ±0.12 (Auxiliar)",
    "7 - Mira (Centralizador DP)",
    "8 - GL (Filtro Verde)",
    "9 - WMH (Maddox Horiz.)",
    "10 - WMV (Maddox Vert.)",
    "11 - P (Polarizada)",
    "12 - R (+2.00 Retinoscopia)"
];

function mostrarTextoAcessorioOE() {
    const visorAceTextoOE = document.getElementById('visor-ace-texto-oe');
    if (visorAceTextoOE) {
        visorAceTextoOE.innerText = nomesLentesAcessoriasOE[posAcessorioOE];
        visorAceTextoOE.style.opacity = '1';
        if (aceTextoTimeoutOE) clearTimeout(aceTextoTimeoutOE);
        aceTextoTimeoutOE = setTimeout(() => { visorAceTextoOE.style.opacity = '0'; }, 1500);
    }
    const svgDinamicoOE = document.getElementById('svg-ace-dinamico-oe');
    const pathOE = document.getElementById('lente-ace-path-oe');
    const grupoMiraOE = document.getElementById('grupo-mira-oe');

    if (svgDinamicoOE && pathOE) {
        svgDinamicoOE.style.display = 'block';
        pathOE.style.mask = 'none';
        if (grupoMiraOE) grupoMiraOE.style.display = (posAcessorioOE === 7) ? 'block' : 'none';

        switch (posAcessorioOE) {
            case 1: // Lente Zero (O)
                svgDinamicoOE.style.display = 'none';
                break;
            case 2: // Oclusor (OC)
                pathOE.style.fill = 'black';
                pathOE.style.fillOpacity = '1';
                break;
            case 3: // ±0.50 (Cilindro Cruzado Fixo)
                pathOE.style.fill = '#ffffff';
                pathOE.style.fillOpacity = '0.3';
                break;
            case 4: // 10Δ Base Inferior (OE)
                pathOE.style.fill = '#ffffff';
                pathOE.style.fillOpacity = '0.35';
                break;
            case 5: // PH (Pinhole)
                pathOE.style.fill = 'black';
                pathOE.style.fillOpacity = '1';
                pathOE.style.mask = 'url(#ph-mask-oe)';
                break;
            case 6: // ±0.12 (Auxiliar)
                pathOE.style.fill = '#ffffff';
                pathOE.style.fillOpacity = '0.2';
                break;
            case 7: // Mira (Centralizador DP)
                pathOE.style.fill = '#ffffff';
                pathOE.style.fillOpacity = '0.15';
                break;
            case 8: // GL (Filtro Verde OE)
                pathOE.style.fill = 'green';
                pathOE.style.fillOpacity = '0.5';
                break;
            case 9: // WMH (White Maddox Horizontal)
                pathOE.style.fill = 'url(#maddox-horiz-oe)';
                pathOE.style.fillOpacity = '0.6';
                break;
            case 10: // WMV (White Maddox Vertical)
                pathOE.style.fill = 'url(#maddox-vert-oe)';
                pathOE.style.fillOpacity = '0.6';
                break;
            case 11: // P (Polarizada)
                pathOE.style.fill = '#64748B';
                pathOE.style.fillOpacity = '0.4';
                break;
            case 12: // R (Retinoscopia +2.00 D)
                pathOE.style.fill = '#ffffff';
                pathOE.style.fillOpacity = '0.4';
                break;
        }
    }
}

// Notificação Toast
let toastTimeout = null;
function showToast(mensagem) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = mensagem;
    toast.classList.add('show');
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

// ==========================================
// CONTROLE DO RETINOSCÓPIO E SIMULAÇÃO ÓPTICA
// ==========================================

function initRetinoscopio() {
    const btnRet = document.getElementById('btn-retinoscopio');
    const imgRet = document.getElementById('img-retinoscopio');
    const faixa = document.getElementById('faixa-retinoscopio');
    const selectDT = document.getElementById('select-dt');
    const displayEixo = document.getElementById('display-eixo-ret');
    if (!btnRet || !faixa) return;

    // Distância de trabalho
    if (selectDT) {
        distanciaTrabalhoD = parseFloat(selectDT.value) || 2.00;
        selectDT.addEventListener('change', (e) => {
            distanciaTrabalhoD = parseFloat(e.target.value) || 0.00;
            atualizarOpticaRetinoscopia();
        });
    }

    // Inicializa display de eixo
    eixoRetinoscopio = RETINOSCOPIO_CONFIG.rotacaoGraus || 0;
    if (displayEixo) displayEixo.textContent = `${eixoRetinoscopio}°`;

    // Aplica dimensões e estilos definidos nas constantes
    faixa.style.width = `${RETINOSCOPIO_CONFIG.larguraFaixa}vw`;
    faixa.style.height = `${RETINOSCOPIO_CONFIG.alturaFaixa}vh`;
    faixa.style.opacity = RETINOSCOPIO_CONFIG.opacidade;
    faixa.style.transform = `translate(-50%, -50%) rotate(${eixoRetinoscopio}deg)`;

    function atualizarPosicaoRetinoscopio(clientX, clientY) {
        // Posição da faixa de luz
        const offFaixaX = (window.innerWidth * (RETINOSCOPIO_CONFIG.offsetXFaixa || 0)) / 100;
        const offFaixaY = (window.innerHeight * (RETINOSCOPIO_CONFIG.offsetYFaixa || 0)) / 100;
        faixa.style.left = (clientX + offFaixaX) + 'px';
        faixa.style.top = (clientY + offFaixaY) + 'px';

        // Posição do aparelho retinoscópio (3% à direita, 2% acima)
        const offApX = (window.innerWidth * (RETINOSCOPIO_CONFIG.offsetXAparelho !== undefined ? RETINOSCOPIO_CONFIG.offsetXAparelho : 3)) / 100;
        const offApY = (window.innerHeight * (RETINOSCOPIO_CONFIG.offsetYAparelho !== undefined ? RETINOSCOPIO_CONFIG.offsetYAparelho : -2)) / 100;
        btnRet.style.left = (clientX + offApX) + 'px';
        btnRet.style.top = (clientY + offApY) + 'px';
    }

    btnRet.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isRetinoscopioAtivo) {
            // Ativa o retinoscópio
            isRetinoscopioAtivo = true;
            btnRet.classList.add('ativo');
            faixa.classList.add('visivel');
            const cardInst = document.getElementById('card-instrucoes-retinoscopio');
            if (cardInst) cardInst.classList.add('visivel');
            atualizarPosicaoRetinoscopio(e.clientX, e.clientY);
            atualizarOpticaRetinoscopia();
        } else {
            // Retinoscópio já ativo: Clicar sobre ele insere / remove o Card de MEM!
            isModoMEM = !isModoMEM;
            if (imgRet) {
                imgRet.src = isModoMEM ? 'Imagens/retinoscopioMEM.svg' : 'Imagens/retinoscopio.svg';
            }
            playClickSound();
            showToast(isModoMEM ? 'Card de MEM acoplado (Retinoscopia Dinâmica)' : 'Card de MEM removido (Retinoscopia Estática)');
            atualizarOpticaRetinoscopia();
        }
    });

    // Permite guardar o retinoscópio com o clique do botão direito
    window.addEventListener('contextmenu', (e) => {
        if (isRetinoscopioAtivo) {
            e.preventDefault();
            isRetinoscopioAtivo = false;
            isModoMEM = false;
            if (imgRet) imgRet.src = 'Imagens/retinoscopio.svg';
            const cardInst = document.getElementById('card-instrucoes-retinoscopio');
            if (cardInst) cardInst.classList.remove('visivel');
            btnRet.classList.remove('ativo');
            faixa.classList.remove('visivel');
            btnRet.style.left = '';
            btnRet.style.top = '';
            const grupoOD = document.getElementById('grupo-reflexo-od');
            const grupoOE = document.getElementById('grupo-reflexo-oe');
            if (grupoOD) grupoOD.style.opacity = '0';
            if (grupoOE) grupoOE.style.opacity = '0';
        }
    });

    // Movimento do Mouse
    window.addEventListener('mousemove', (e) => {
        if (!isRetinoscopioAtivo) return;
        atualizarPosicaoRetinoscopio(e.clientX, e.clientY);

        // Atualiza a projeção óptica com base na posição física real da faixa
        atualizarOpticaRetinoscopia();
    });

    // Rotação da faixa com o scroll do mouse
    window.addEventListener('wheel', (e) => {
        if (!isRetinoscopioAtivo) return;
        e.preventDefault();

        // Passo de rotação: 5 graus por clique do scroll (ou 1 grau com Shift)
        const step = e.shiftKey ? 1 : 5;
        if (e.deltaY < 0) {
            eixoRetinoscopio = (eixoRetinoscopio + step) % 180;
        } else {
            eixoRetinoscopio = (eixoRetinoscopio - step + 180) % 180;
        }

        RETINOSCOPIO_CONFIG.rotacaoGraus = eixoRetinoscopio;
        if (displayEixo) displayEixo.textContent = `${eixoRetinoscopio}°`;
        faixa.style.transform = `translate(-50%, -50%) rotate(${eixoRetinoscopio}deg)`;

        // Atualiza projeção óptica com o novo eixo
        atualizarOpticaRetinoscopia();
    }, { passive: false });
}

// Cálculo e renderização física do reflexo pupilar retiniano
function atualizarOpticaRetinoscopia() {
    if (!isRetinoscopioAtivo) {
        const grupoOD = document.getElementById('grupo-reflexo-od');
        const grupoOE = document.getElementById('grupo-reflexo-oe');
        if (grupoOD) grupoOD.style.opacity = '0';
        if (grupoOE) grupoOE.style.opacity = '0';
        return;
    }

    const svgEl = document.getElementById('svg-reflexos-retinoscopia');
    const faixaEl = document.getElementById('faixa-retinoscopio');
    if (!svgEl || !faixaEl) return;

    const ctm = svgEl.getScreenCTM();
    if (!ctm) return;
    const invCTM = ctm.inverse();

    const rectFaixa = faixaEl.getBoundingClientRect();

    // Posição física real do centro da faixa do retinoscópio na tela em pixels
    const feixeTelaX = rectFaixa.left + rectFaixa.width / 2;
    const feixeTelaY = rectFaixa.top + rectFaixa.height / 2;

    // Converter para coordenadas exatas do SVG (viewBox 0 0 21000 29700)
    const ptFeixe = svgEl.createSVGPoint();
    ptFeixe.x = feixeTelaX;
    ptFeixe.y = feixeTelaY;
    const feixeSVG = ptFeixe.matrixTransform(invCTM);

    // Calcular semi-largura da faixa em unidades SVG
    const ptBorda = svgEl.createSVGPoint();
    ptBorda.x = feixeTelaX + (rectFaixa.width / 2);
    ptBorda.y = feixeTelaY;
    const bordaSVG = ptBorda.matrixTransform(invCTM);
    const halfWSVG = Math.abs(bordaSVG.x - feixeSVG.x);

    // Calcular semi-altura da faixa em unidades SVG
    const ptTopo = svgEl.createSVGPoint();
    ptTopo.x = feixeTelaX;
    ptTopo.y = feixeTelaY + (rectFaixa.height / 2);
    const topoSVG = ptTopo.matrixTransform(invCTM);
    const halfHSVG = Math.abs(topoSVG.y - feixeSVG.y);

    // Verifica se algum olho está ocluído (situação monocular)
    const oclusoOD = oclusorOD || posAcessorio === 2;
    const oclusoOE = oclusorOE || posAcessorioOE === 2;
    const temOclusor = oclusoOD || oclusoOE;

    // Se estiver com MEM OU houver oclusor -> usa a Refração Dinâmica
    // Se estiver binocular E sem MEM -> usa a Refração Estática
    const usarDinamica = isModoMEM || temOclusor;

    // Acomodação: +1.25 D na dinâmica (MEM/Oclusor) e 0.00 D na estática pura (Binocular)
    acomodacao = usarDinamica ? 1.25 : 0.00;

    const rxEsfOD_Atual = usarDinamica ? rxDinEsfOD : rxEstEsfOD;
    const rxCilOD_Atual = usarDinamica ? rxDinCilOD : rxEstCilOD;
    const rxEixoOD_Atual = usarDinamica ? rxDinEixoOD : rxEstEixoOD;

    const rxEsfOE_Atual = usarDinamica ? rxDinEsfOE : rxEstEsfOE;
    const rxCilOE_Atual = usarDinamica ? rxDinCilOE : rxEstCilOE;
    const rxEixoOE_Atual = usarDinamica ? rxDinEixoOE : rxEstEixoOE;

    // Atualiza variáveis globais ativas
    rxEsfOD = rxEsfOD_Atual;
    rxCilOD = rxCilOD_Atual;
    rxEixoOD = rxEixoOD_Atual;
    rxEsfOE = rxEsfOE_Atual;
    rxCilOE = rxCilOE_Atual;
    rxEixoOE = rxEixoOE_Atual;

    const pupilas = {
        od: {
            cxSVG: 6680,
            cySVG: 16420,
            rSVG: 850,
            grupo: document.getElementById('grupo-reflexo-od'),
            gFaixa: document.getElementById('g-faixa-od'),
            faixaRef: document.getElementById('faixa-reflexo-od'),
            faixaFundo: document.getElementById('faixa-fundo-od'),
            flash: document.getElementById('flash-neutro-od'),
            esf: lenteEsfOD + (posAcessorio === 12 ? 2.00 : 0.00),
            cil: lenteCilOD,
            eixo: lenteEixoOD,
            rxEsf: rxEsfOD_Atual,
            rxCil: rxCilOD_Atual,
            rxEixo: rxEixoOD_Atual,
            ocluso: oclusoOD
        },
        oe: {
            cxSVG: 14320,
            cySVG: 16420,
            rSVG: 850,
            grupo: document.getElementById('grupo-reflexo-oe'),
            gFaixa: document.getElementById('g-faixa-oe'),
            faixaRef: document.getElementById('faixa-reflexo-oe'),
            faixaFundo: document.getElementById('faixa-fundo-oe'),
            flash: document.getElementById('flash-neutro-oe'),
            esf: lenteEsfOE + (posAcessorioOE === 12 ? 2.00 : 0.00),
            cil: lenteCilOE,
            eixo: lenteEixoOE,
            rxEsf: rxEsfOE_Atual,
            rxCil: rxCilOE_Atual,
            rxEixo: rxEixoOE_Atual,
            ocluso: oclusoOE
        }
    };

    const anguloFeixeRad = (eixoRetinoscopio * Math.PI) / 180;
    // Vetores unitários do sistema de coordenadas rotacionado da fenda no SVG
    const normalX = Math.cos(anguloFeixeRad);   // Eixo X local (perpendicular à fenda)
    const normalY = Math.sin(anguloFeixeRad);
    const paraleloX = -Math.sin(anguloFeixeRad); // Eixo Y local (paralelo à fenda)
    const paraleloY = Math.cos(anguloFeixeRad);

    const meridianoAvaliado = (eixoRetinoscopio + 90) % 180;

    ['od', 'oe'].forEach(olhoKey => {
        const p = pupilas[olhoKey];
        if (!p.grupo || !p.faixaRef || !p.flash) return;

        if (p.ocluso) {
            p.grupo.style.opacity = '0';
            return;
        }

        // Distância exata da faixa até o centro da pupila em unidades SVG
        const dx = feixeSVG.x - p.cxSVG;
        const dy = feixeSVG.y - p.cySVG;

        // Projeções exatas nos eixos locais da fenda
        const distNormalSVG = dx * normalX + dy * normalY;
        const distParalelaSVG = dx * paraleloX + dy * paraleloY;

        // Se a faixa estiver muito distante na vertical (fora da altura do olho)
        if (Math.abs(distParalelaSVG) > (halfHSVG + p.rSVG)) {
            p.grupo.style.opacity = '0';
            return;
        }

        p.grupo.style.opacity = '1';

        // 1. Cálculo Dióptrico no Meridiano Avaliado (Lei de Euler)
        const radPac = ((meridianoAvaliado - p.rxEixo) * Math.PI) / 180;
        const poderPaciente = p.rxEsf + p.rxCil * Math.pow(Math.sin(radPac), 2);

        const radLente = ((meridianoAvaliado - p.eixo) * Math.PI) / 180;
        const poderLente = p.esf + p.cil * Math.pow(Math.sin(radLente), 2);

        const deltaD = (poderPaciente - poderLente) + distanciaTrabalhoD;
        const absDelta = Math.abs(deltaD);

        // 2. Dinâmica do Reflexo Pupilar
        if (absDelta <= 0.18) {
            // Ponto Neutro: acende a pupila inteira quando a fenda cruza o olho
            if (Math.abs(distNormalSVG) <= (halfWSVG + p.rSVG)) {
                p.flash.style.opacity = '0.95';
            } else {
                p.flash.style.opacity = '0';
            }
            if (p.gFaixa) p.gFaixa.style.opacity = '0';
        } else {
            p.flash.style.opacity = '0';
            if (p.gFaixa) p.gFaixa.style.opacity = '1';

            // Sentido: deltaD > 0 => COM A REGRA (+1) | deltaD < 0 => CONTRA A REGRA (-1)
            const sentido = deltaD > 0 ? 1 : -1;

            // Deslocamento contínuo em coordenadas SVG exatas
            const deslocamentoSVG = distNormalSVG * sentido;

            const larguraBaseSVG = halfWSVG * 2;
            const larguraInterna = Math.min(2200, Math.max(larguraBaseSVG, larguraBaseSVG + (800 / (absDelta + 0.4))));
            const brilho = Math.max(0.4, Math.min(1.0, 1.0 - (absDelta * 0.07)));

            let anguloInterno = eixoRetinoscopio;
            if (Math.abs(p.rxCil) >= 0.25) {
                const dif = ((eixoRetinoscopio - p.rxEixo + 180) % 180);
                const desvio = (dif > 90 ? dif - 180 : dif) * 0.4;
                anguloInterno = (eixoRetinoscopio + desvio + 180) % 180;
            }

            if (p.gFaixa) {
                p.gFaixa.setAttribute('transform', `translate(${p.cxSVG}, ${p.cySVG}) rotate(${anguloInterno}) translate(${deslocamentoSVG}, 0)`);
            }
            p.faixaRef.setAttribute('x', -larguraInterna / 2);
            p.faixaRef.setAttribute('width', larguraInterna);
            p.faixaRef.style.fillOpacity = brilho;

            if (p.faixaFundo) {
                p.faixaFundo.setAttribute('x', -larguraInterna);
                p.faixaFundo.setAttribute('width', larguraInterna * 2);
            }
        }
    });
}


// Variáveis de estado global do simulador
let isChartVisible = true;
let isGlassesVisible = false; // Óculos começa na maleta
let currentLensZIndex = 11; // Controle dinâmico para a última lente colocada ficar na frente

// Refração Final do Paciente (Futuro: Virá do LocalStorage da Retinoscopia)
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
    const storedData = localStorage.getItem('pacienteData');
    if (storedData) {
        try {
            const data = JSON.parse(storedData);
            if (data.rxOD && data.rxOE) {
                rxEsfOD = data.rxOD.esf !== undefined ? data.rxOD.esf : 0;
                rxCilOD = data.rxOD.cil !== undefined ? data.rxOD.cil : 0;
                rxEixoOD = data.rxOD.eixo !== undefined ? data.rxOD.eixo : 0;
                rxEsfOE = data.rxOE.esf !== undefined ? data.rxOE.esf : 0;
                rxCilOE = data.rxOE.cil !== undefined ? data.rxOE.cil : 0;
                rxEixoOE = data.rxOE.eixo !== undefined ? data.rxOE.eixo : 0;
            }
            if (data.idade !== undefined) {
                idade = data.idade;
            }
        } catch (e) { console.error("Erro ao ler localStorage", e); }
    } else {
        idade = Math.floor(Math.random() * 31) + 10;
    }
}

gerarPaciente();

// Calcula a Demanda e Embaça o Cartão
function calcularVisao() {
    const oclOD_Efetivo = oclusorOD || posAcessorio === 2;
    const oclOE_Efetivo = oclusorOE || posAcessorioOE === 2;

    let olhoAtivo = '';
    if (oclOE_Efetivo && !oclOD_Efetivo) olhoAtivo = 'od';
    else if (oclOD_Efetivo && !oclOE_Efetivo) olhoAtivo = 'oe';
    else olhoAtivo = 'ambos';

    let excesso = 0;
    const calcularExcesso = (lenteEsf, rxEsf, lenteCil, rxCil, lenteEixo, rxEixo, ocluso) => {
        if (ocluso) return 0;
        
        let cilErrado = Math.abs(lenteCil - rxCil) > 0.25;
        let eixoErrado = false;
        if (Math.abs(rxCil) > 0.25) {
            let diffEixo = Math.abs(lenteEixo - rxEixo);
            if (diffEixo > 5 && diffEixo < 175) eixoErrado = true;
        }

        if (cilErrado || eixoErrado) return 2.0;

        let lenteEfetiva = lenteEsf - rxEsf;
        return Math.abs(lenteEfetiva);
    };

    const esfOD_Efetivo = lenteEsfOD + (posAcessorio === 12 ? 2.00 : 0.00);
    const esfOE_Efetivo = lenteEsfOE + (posAcessorioOE === 12 ? 2.00 : 0.00);

    if (olhoAtivo === 'od') {
        excesso = calcularExcesso(esfOD_Efetivo, rxEsfOD, lenteCilOD, rxCilOD, lenteEixoOD, rxEixoOD, false);
    } else if (olhoAtivo === 'oe') {
        excesso = calcularExcesso(esfOE_Efetivo, rxEsfOE, lenteCilOE, rxCilOE, lenteEixoOE, rxEixoOE, false);
    } else {
        let excOD = calcularExcesso(esfOD_Efetivo, rxEsfOD, lenteCilOD, rxCilOD, lenteEixoOD, rxEixoOD, oclOD_Efetivo);
        let excOE = calcularExcesso(esfOE_Efetivo, rxEsfOE, lenteCilOE, rxCilOE, lenteEixoOE, rxEixoOE, oclOE_Efetivo);
        excesso = Math.min(excOD, excOE);
    }

    let shouldStruggle = false;

    // A variÃÂ¡vel "excesso" representa o quanto passamos do limite do paciente (que ÃÂ© onde o J2 borra).
    if (excesso < -1.00) {
        // Tem muita folga de acomodaÃÂ§ÃÂ£o. VÃÂª perfeitamente J1.
        linhaAV = 1;
    } else if (excesso >= -1.00 && excesso < 0) {
        // J1 borrou (porque exige mais foco), mas ele ainda consegue ler J2!
        linhaAV = 2;

        // Quando chega a 0.50 ou 0.25 do limite de J2, ele pisca/esforÃÂ§a para manter o J2 nÃÂ­tido
        if (excesso === -0.50 || excesso === -0.25) {
            shouldStruggle = true;
        }
    } else if (excesso >= 0) {
        // Ultrapassou o limite (excesso 0 ou mais). J2 borrou!
        // Daqui pra frente, piora 1 linha a cada 0.50D a mais.
        // excesso = 0.00 -> linhaAV = 3 (lÃÂª J3)
        // excesso = 0.50 -> linhaAV = 4 (lÃÂª J4)
        // excesso = 1.00 -> linhaAV = 5 (lÃÂª J5)
        linhaAV = 3 + Math.floor(excesso / 0.50);

        if (linhaAV > 7) linhaAV = 7; // Borrado total (NÃÂ£o lÃÂª nem J6)
    }

    atualizarVisualCartao(shouldStruggle);
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

// FunÃÂ§ÃÂ£o que embaÃÂ§a visualmente as linhas do cartÃÂ£o menores que a linhaAV do paciente
function atualizarVisualCartao(shouldStruggle = false) {
    const rows = document.querySelectorAll('.chart-row');
    rows.forEach(row => {
        const j = parseInt(row.dataset.j);
        const textContent = row.querySelector('.text-content');
        if (!textContent) return;

        // Reseta animaÃÂ§ÃÂ£o de esforÃÂ§o caso exista
        textContent.classList.remove('struggle-blur');

        // Se a linha for Menor numericamente (ex: J2 < J3), significa que as letras sÃÂ£o menores e ele nÃÂ£o vÃÂª
        if (j < linhaAV) {
            textContent.style.filter = 'blur(4px)';
            textContent.style.opacity = '0.7';
        } else {
            textContent.style.filter = 'none';
            textContent.style.opacity = '1';

            // Se essa for a menor linha que ele consegue ler (linhaAV) e ele estÃÂ¡ no limite, anima!
            if (shouldStruggle && j === linhaAV) {
                // ForÃÂ§a o reflow para reiniciar a animaÃÂ§ÃÂ£o
                void textContent.offsetWidth;
                textContent.classList.add('struggle-blur');
            }
        }
    });
}

// Comandos JS para o Simulador de Amplitude de AcomodaÃÂ§ÃÂ£o
document.addEventListener('DOMContentLoaded', () => {
    console.log("Simulador de Amplitude de AcomodaÃÂ§ÃÂ£o iniciado.");

    // Evento do botÃÂ£o de fala (Ouvir o paciente)
    const btnFalar = document.getElementById('btn-falar');
    if (btnFalar) {
        btnFalar.addEventListener('click', () => {
            let texto = '';
            if (linhaAV > 6) {
                texto = 'NÃÂ£o estou conseguindo ler nenhuma linha do cartÃÂ£o.';
            } else {
                texto = `Eu consigo ler atÃÂ© a linha Jota ${linhaAV}.`;
            }

            // Cancela falas anteriores para nÃÂ£o encavalar
            window.speechSynthesis.cancel();

            const msg = new SpeechSynthesisUtterance(texto);
            msg.lang = 'pt-BR';

            // Voz dinÃÂ¢mica baseada na idade do paciente
            if (idade <= 12) {
                msg.rate = 1.2;  // CrianÃÂ§a fala um pouco mais rÃÂ¡pido
                msg.pitch = 1.8; // Tom bem agudo
            } else if (idade <= 25) {
                msg.rate = 1.1;
                msg.pitch = 1.2; // Jovem, tom ligeiramente agudo
            } else if (idade <= 50) {
                msg.rate = 1.0;
                msg.pitch = 1.0; // Adulto, voz padrÃÂ£o
            } else {
                msg.rate = 0.9;  // Idoso fala um pouco mais devagar
                msg.pitch = 0.8; // Tom mais grave
            }

            window.speechSynthesis.speak(msg);
        });
    }

    atualizarVisualCartao();

    const toggleChart = document.getElementById('toggle-chart');
    const nearChart = document.querySelector('.near-chart');
    if (toggleChart && nearChart) {
        toggleChart.addEventListener('change', (e) => {
            isChartVisible = e.target.checked;
            if (isChartVisible) nearChart.classList.remove('chart-hidden');
            else nearChart.classList.add('chart-hidden');
        });
    }

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

        // Limites (ajuste se o greens tiver limites diferentes)
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
            rotAceOD += 30;
            document.getElementById('rot-ace').style.transform = `rotate(${rotAceOD}deg)`;
            posAcessorio += 1;
            if (posAcessorio > 12) posAcessorio = 1;
            mostrarTextoAcessorio();
            calcularVisao();
        });

        addHoldListener(btnAceMenos, () => {
            playClickSound();
            rotAceOD -= 30;
            document.getElementById('rot-ace').style.transform = `rotate(${rotAceOD}deg)`;
            posAcessorio -= 1;
            if (posAcessorio < 1) posAcessorio = 12;
            mostrarTextoAcessorio();
            calcularVisao();
        });
    }(1 a 8)
            posAcessorio -= 1;
            if (posAcessorio < 1) posAcessorio = 8;
            mostrarTextoAcessorio();

            // Aqui podemos adicionar uma lógica futuramente para quando posAcessorio == X fazer algo na visão
        });
    }

    // Controle do Cilindro Cruzado de Jackson (CCJ) e Prismas de Risley (Exclusão MÃºtua)
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
        });

        addHoldListener(btnAceMenosOE, () => {
            playClickSound();
            rotAceOE -= 30; // Giro no sentido anti-horário
            document.getElementById('rot-ace-oe').style.transform = `rotate(${-rotAceOE}deg)`;
            posAcessorioOE -= 1;
            if (posAcessorioOE < 1) posAcessorioOE = 12;
            mostrarTextoAcessorioOE();
            calcularVisao();
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

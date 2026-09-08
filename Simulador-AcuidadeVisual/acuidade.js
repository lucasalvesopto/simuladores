// =========================================================================
// ⚙️ VARIÁVEIS DE CALIBRAÇÃO DO OCLUSOR COM O MOUSE (PROF. LUCAS)
// =========================================================================
const CALIBRACAO_OCLUSOR = {
    // 🔴 MOSTRAR HITBOX COLORIDA NA TELA PARA CALIBRAR (true / false)
    mostrarHitboxDebug: false,

    // 🖐️ POSIÇÃO DO OCLUSOR NO CURSOR DO MOUSE (em pixels)
    // offsetX: (+) Direita | (-) Esquerda
    offsetX: 0,
    // offsetY: (+) Baixo | (-) Cima (posição da empunhadura no mouse)
    offsetY: 80,

    // 🎯 CENTRO DA CONCHA DO OCLUSOR (o ponto exato do topo que oclui o olho)
    // offsetConchaY: deslocamento vertical do centro da concha em relação ao centro da imagem
    offsetConchaX: 0,
    offsetConchaY: -55,

    // 🎯 CALIBRAÇÃO DA HITBOX DA PUPILA / OLHOS DO PACIENTE:
    // Posição vertical da pupila (% da altura da imagem)
    hitboxPupilaY: 0.562,

    // Posições horizontais X dos olhos do paciente (% da largura da imagem)
    hitboxPupilaOD_X: 0.314, // Olho Direito
    hitboxPupilaOE_X: 0.686, // Olho Esquerdo

    // Raio de alcance da oclusão em pixels
    raioOclusaoOlho: 75
};

// =========================================================================
// TABELAS DE VALORES E RANKING DE ACUIDADE
// =========================================================================
const SNELLEN_RANK = {
    '20/200': 1,
    '20/100': 2,
    '20/70': 3,
    '20/50': 4,
    '20/40': 5,
    '20/30': 6,
    '20/25': 7,
    '20/20': 8,
    '20/15': 9
};

const JAEGER_RANK = {
    'J6': 1,
    'J5': 2,
    'J4': 3,
    'J3': 4,
    'J2': 5,
    'J1': 6
};

// Estado Global do Teste
let estadoTeste = {
    distancia: 'longe',  // 'longe' ou 'perto'
    olhoAberto: 'ao',    // 'ao', 'od', 'oe'
    oclusorTipo: null,   // null, 'opaco', 'pinhole'
    isComCorrecao: false // false (SC) ou true (CC)
};

// Referência ao oclusor atualmente seguro na mão
let oclusorAtivo = null; // Elemento DOM ativo
let isOclusorTravado = false; // Se true, fica fixo na posição e não segue o mouse

// Dados do Paciente
let paciente = {
    idade: 40,
    acuidadeVisual: {
        longe: {
            od: { sc: "20/40", ph: "20/20", cc: "20/20" },
            oe: { sc: "20/50", ph: "20/20", cc: "20/20" },
            ao: { sc: "20/30", ph: "20/20", cc: "20/20" }
        },
        perto: {
            od: { sc: "J2", cc: "J1" },
            oe: { sc: "J3", cc: "J1" },
            ao: { sc: "J2", cc: "J1" }
        }
    }
};

let falaTimeout = null;
let toastTimeout = null;
let cardInstrucoesTimeout = null;

function exibirCardInstrucoes() {
    const el = document.getElementById('card-instrucoes-oclusor');
    if (!el) return;
    el.classList.add('visivel');
    if (cardInstrucoesTimeout) clearTimeout(cardInstrucoesTimeout);
    cardInstrucoesTimeout = setTimeout(() => {
        el.classList.remove('visivel');
    }, 5000);
}

function ocultarCardInstrucoes() {
    const el = document.getElementById('card-instrucoes-oclusor');
    if (!el) return;
    if (cardInstrucoesTimeout) clearTimeout(cardInstrucoesTimeout);
    el.classList.remove('visivel');
}

// =========================================================================
// INICIALIZAÇÃO
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    carregarPacienteData();
    configurarEventosOclusores();
    atualizarStatusInterface();
    renderizarHitboxesDebug();
    mostrarFala("Olá! Clique no oclusor na lateral esquerda para iniciar o teste.", 4000);
});

window.addEventListener('resize', () => {
    renderizarHitboxesDebug();
});

// Carrega os dados da Ficha Clínica
function carregarPacienteData() {
    const raw = localStorage.getItem('pacienteData');
    if (raw) {
        try {
            const data = JSON.parse(raw);
            if (data.acuidadeVisual) paciente.acuidadeVisual = data.acuidadeVisual;
            if (data.idade !== undefined) paciente.idade = data.idade;
        } catch (e) {
            console.error("Erro ao carregar dados do paciente:", e);
        }
    }
}

// Configura o clique e arraste dos oclusores
function configurarEventosOclusores() {
    const btnOpaco = document.getElementById('btn-oclusor-opaco');
    const btnPH = document.getElementById('btn-oclusor-pinhole');
    const cardInst = document.getElementById('card-instrucoes-oclusor');

    // Clique no Oclusor Opaco
    btnOpaco.addEventListener('click', (e) => {
        e.stopPropagation();
        if (oclusorAtivo === btnOpaco) {
            alternarTravaOclusor();
        } else {
            pegarOclusor(btnOpaco, 'opaco', e.clientX, e.clientY);
        }
    });

    // Clique no Oclusor Pinhole
    btnPH.addEventListener('click', (e) => {
        e.stopPropagation();
        if (oclusorAtivo === btnPH) {
            alternarTravaOclusor();
        } else {
            pegarOclusor(btnPH, 'pinhole', e.clientX, e.clientY);
        }
    });

    // Movimento do Mouse na Janela
    window.addEventListener('mousemove', (e) => {
        if (!oclusorAtivo || isOclusorTravado) return;

        // Posição com as variáveis de calibração X e Y
        const posX = e.clientX + CALIBRACAO_OCLUSOR.offsetX;
        const posY = e.clientY + CALIBRACAO_OCLUSOR.offsetY;

        oclusorAtivo.style.left = `${posX}px`;
        oclusorAtivo.style.top = `${posY}px`;
        oclusorAtivo.style.transform = `translate(-50%, -50%)`;

        // Ponto real do centro da concha redonda no topo do oclusor
        const conchaX = posX + (CALIBRACAO_OCLUSOR.offsetConchaX || 0);
        const conchaY = posY + (CALIBRACAO_OCLUSOR.offsetConchaY || -55);

        // Verifica proximidade da concha do oclusor com os olhos do paciente
        verificarOclusaoOlhos(conchaX, conchaY);
    });

    // Clique na Janela para Travar / Destravar
    window.addEventListener('click', (e) => {
        if (!oclusorAtivo) return;

        // Se clicou em controles, painel da tabela ou links superiores, não mexe na trava
        if (e.target.closest('.panel-chart') || e.target.closest('.panel-top-controls') || e.target.closest('.back-button') || e.target.closest('.btn-ficha-shortcut') || e.target.closest('.btn-switch-sim')) {
            return;
        }

        if (!isOclusorTravado) {
            // Trava o oclusor na posição onde foi clicado!
            isOclusorTravado = true;
            oclusorAtivo.classList.add('travado');
            showToast("📌 Oclusor posicionado e travado! Clique nele para mover.");
        } else if (e.target.closest('#btn-oclusor-opaco') || e.target.closest('#btn-oclusor-pinhole')) {
            // Destrava ao clicar no oclusor
            isOclusorTravado = false;
            oclusorAtivo.classList.remove('travado');
            showToast("🔓 Oclusor destravado. Movimentando...");
        }
    });

    // Botão Direito guarda o oclusor na base
    window.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (oclusorAtivo) {
            guardarOclusor();
        }
    });
}

function alternarTravaOclusor() {
    if (!oclusorAtivo) return;
    isOclusorTravado = !isOclusorTravado;
    oclusorAtivo.classList.toggle('travado', isOclusorTravado);
    if (isOclusorTravado) {
        showToast("📌 Oclusor posicionado e travado! Clique nele para mover.");
    } else {
        showToast("🔓 Oclusor destravado. Movimentando...");
    }
}

// Pega o Oclusor na mão
function pegarOclusor(elemento, tipo, mouseX, mouseY) {
    if (oclusorAtivo) guardarOclusor();

    oclusorAtivo = elemento;
    isOclusorTravado = false;
    estadoTeste.oclusorTipo = tipo;
    elemento.classList.add('ativo');
    elemento.classList.remove('travado');

    // Posição inicial no clique
    const posX = (mouseX || window.innerWidth / 2) + CALIBRACAO_OCLUSOR.offsetX;
    const posY = (mouseY || window.innerHeight / 2) + CALIBRACAO_OCLUSOR.offsetY;

    elemento.style.left = `${posX}px`;
    elemento.style.top = `${posY}px`;
    elemento.style.transform = `translate(-50%, -50%)`;

    // Exibe card de instruções
    exibirCardInstrucoes();

    showToast(`Oclusor ${tipo === 'opaco' ? 'Opaco' : 'Pinhole (PH)'} selecionado. Mova e clique para posicionar.`);
    atualizarStatusInterface();
}

// Guarda o Oclusor de volta na base lateral
function guardarOclusor() {
    if (!oclusorAtivo) return;

    oclusorAtivo.classList.remove('ativo');
    oclusorAtivo.classList.remove('travado');
    oclusorAtivo.style.left = '';
    oclusorAtivo.style.top = '';
    oclusorAtivo.style.transform = '';

    oclusorAtivo = null;
    isOclusorTravado = false;
    estadoTeste.oclusorTipo = null;
    estadoTeste.olhoAberto = 'ao'; // Ambos os olhos abertos

    ocultarCardInstrucoes();
    document.getElementById('debug-concha-point')?.remove();
    atualizarStatusInterface();
    showToast("Oclusor guardado na base.");
}

// Detecta se a concha do oclusor está cobrindo o OD ou o OE do paciente
function verificarOclusaoOlhos(conchaX, conchaY) {
    const patientContainer = document.getElementById('patient-container');
    if (!patientContainer) return;

    const rect = patientContainer.getBoundingClientRect();

    // Coordenadas calculadas dos centros das pupilas na imagem do paciente
    // Olho Direito do paciente (à esquerda da nossa visão)
    const centroOD_X = rect.left + rect.width * (CALIBRACAO_OCLUSOR.hitboxPupilaOD_X ?? 0.314);
    const centroOD_Y = rect.top + rect.height * (CALIBRACAO_OCLUSOR.hitboxPupilaY ?? 0.562);

    // Olho Esquerdo do paciente (à direita da nossa visão)
    const centroOE_X = rect.left + rect.width * (CALIBRACAO_OCLUSOR.hitboxPupilaOE_X ?? 0.686);
    const centroOE_Y = rect.top + rect.height * (CALIBRACAO_OCLUSOR.hitboxPupilaY ?? 0.562);

    // Atualiza visualização das hitboxes na tela se o modo debug estiver ativado
    renderizarHitboxesDebug(centroOD_X, centroOD_Y, centroOE_X, centroOE_Y, conchaX, conchaY);

    const distOD = Math.hypot(conchaX - centroOD_X, conchaY - centroOD_Y);
    const distOE = Math.hypot(conchaX - centroOE_X, centroOE_Y ? conchaY - centroOE_Y : 0);

    let novoOlhoAberto = 'ao';

    if (distOD <= CALIBRACAO_OCLUSOR.raioOclusaoOlho) {
        // Cobrindo o Olho Direito (OD) -> Paciente enxerga com o Olho Esquerdo (OE)
        novoOlhoAberto = 'oe';
    } else if (distOE <= CALIBRACAO_OCLUSOR.raioOclusaoOlho) {
        // Cobrindo o Olho Esquerdo (OE) -> Paciente enxerga com o Olho Direito (OD)
        novoOlhoAberto = 'od';
    } else {
        // Fora dos olhos -> Ambos abertos (AO)
        novoOlhoAberto = 'ao';
    }

    if (estadoTeste.olhoAberto !== novoOlhoAberto) {
        estadoTeste.olhoAberto = novoOlhoAberto;
        atualizarStatusInterface();
    }
}

// Renderiza círculos visuais das hitboxes para calibração
function renderizarHitboxesDebug(odX, odY, oeX, oeY, conchaX, conchaY) {
    if (!CALIBRACAO_OCLUSOR.mostrarHitboxDebug) {
        document.getElementById('debug-hitbox-od')?.remove();
        document.getElementById('debug-hitbox-oe')?.remove();
        document.getElementById('debug-concha-point')?.remove();
        return;
    }

    const patientContainer = document.getElementById('patient-container');
    if (!patientContainer) return;
    const rect = patientContainer.getBoundingClientRect();

    const centroOD_X = odX ?? (rect.left + rect.width * (CALIBRACAO_OCLUSOR.hitboxPupilaOD_X ?? 0.314));
    const centroOD_Y = odY ?? (rect.top + rect.height * (CALIBRACAO_OCLUSOR.hitboxPupilaY ?? 0.562));
    const centroOE_X = oeX ?? (rect.left + rect.width * (CALIBRACAO_OCLUSOR.hitboxPupilaOE_X ?? 0.686));
    const centroOE_Y = oeY ?? (rect.top + rect.height * (CALIBRACAO_OCLUSOR.hitboxPupilaY ?? 0.562));

    const diametro = (CALIBRACAO_OCLUSOR.raioOclusaoOlho || 75) * 2;

    // Hitbox OD (Ciano)
    let elOD = document.getElementById('debug-hitbox-od');
    if (!elOD) {
        elOD = document.createElement('div');
        elOD.id = 'debug-hitbox-od';
        elOD.className = 'debug-hitbox debug-hitbox-od';
        document.body.appendChild(elOD);
    }
    elOD.style.width = `${diametro}px`;
    elOD.style.height = `${diametro}px`;
    elOD.style.left = `${centroOD_X - diametro / 2}px`;
    elOD.style.top = `${centroOD_Y - diametro / 2}px`;
    elOD.textContent = 'OD';

    // Hitbox OE (Âmbar)
    let elOE = document.getElementById('debug-hitbox-oe');
    if (!elOE) {
        elOE = document.createElement('div');
        elOE.id = 'debug-hitbox-oe';
        elOE.className = 'debug-hitbox debug-hitbox-oe';
        document.body.appendChild(elOE);
    }
    elOE.style.width = `${diametro}px`;
    elOE.style.height = `${diametro}px`;
    elOE.style.left = `${centroOE_X - diametro / 2}px`;
    elOE.style.top = `${centroOE_Y - diametro / 2}px`;
    elOE.textContent = 'OE';

    // Mira Vermelha no Ponto da Concha
    if (conchaX !== undefined && conchaY !== undefined && oclusorAtivo) {
        let elPoint = document.getElementById('debug-concha-point');
        if (!elPoint) {
            elPoint = document.createElement('div');
            elPoint.id = 'debug-concha-point';
            elPoint.className = 'debug-concha-point';
            document.body.appendChild(elPoint);
        }
        elPoint.style.left = `${conchaX}px`;
        elPoint.style.top = `${conchaY}px`;
    } else {
        document.getElementById('debug-concha-point')?.remove();
    }
}

// =========================================================================
// CONTROLES DE DISTÂNCIA E CORREÇÃO
// =========================================================================
function setDistancia(dist) {
    estadoTeste.distancia = dist;

    document.getElementById('btn-dist-longe').classList.toggle('active', dist === 'longe');
    document.getElementById('btn-dist-perto').classList.toggle('active', dist === 'perto');

    const snellenCont = document.getElementById('snellen-container');
    const jaegerCont = document.getElementById('jaeger-container');
    const chartTitle = document.getElementById('chart-title');

    if (dist === 'longe') {
        snellenCont.style.display = 'flex';
        jaegerCont.style.display = 'none';
        chartTitle.textContent = 'Tabela de Snellen (6m)';
    } else {
        snellenCont.style.display = 'none';
        jaegerCont.style.display = 'flex';
        chartTitle.textContent = 'Cartão de Jaeger (40cm)';
    }

    atualizarStatusInterface();
    showToast(`Distância: ${dist === 'longe' ? 'Longe (Snellen - 6m)' : 'Perto (Jaeger - 40cm)'}`);
}

function toggleCorrecao() {
    estadoTeste.isComCorrecao = !estadoTeste.isComCorrecao;

    const chk = document.getElementById('toggle-cc-checkbox');
    if (chk) chk.checked = estadoTeste.isComCorrecao;

    const card = document.getElementById('toggle-cc-card');
    if (card) card.classList.toggle('active', estadoTeste.isComCorrecao);

    // Exibe ou oculta a camada com os óculos sobreposta ao paciente
    const imgOculos = document.getElementById('patient-glasses');
    if (imgOculos) {
        imgOculos.style.display = estadoTeste.isComCorrecao ? 'block' : 'none';
    }

    // Mantém a imagem base sempre como lucas.svg
    const imgPaciente = document.getElementById('patient-img');
    if (imgPaciente && !imgPaciente.src.includes('lucas.svg')) {
        imgPaciente.src = 'Imagens/lucas.svg';
    }

    atualizarStatusInterface();
    showToast(estadoTeste.isComCorrecao ? "👓 Óculos com correção (CC) colocado no paciente." : "Sem correção (SC).");
}

// =========================================================================
// CÁLCULO E TESTE DE ACUIDADE VISUAL
// =========================================================================
function obterAcuidadeEsperada() {
    const { distancia, olhoAberto, oclusorTipo, isComCorrecao } = estadoTeste;
    const avObj = paciente.acuidadeVisual;

    if (distancia === 'longe') {
        const olhoData = avObj.longe[olhoAberto] || { sc: "20/40", ph: "20/20", cc: "20/20" };

        if (isComCorrecao) return olhoData.cc || "20/20";
        if (oclusorTipo === 'pinhole' && olhoAberto !== 'ao') return olhoData.ph || "20/20";
        return olhoData.sc || "20/40";
    } else {
        const olhoData = avObj.perto[olhoAberto] || { sc: "J2", cc: "J1" };

        if (isComCorrecao) return olhoData.cc || "J1";
        return olhoData.sc || "J2";
    }
}

function atualizarStatusInterface() {
    const { olhoAberto, oclusorTipo, isComCorrecao } = estadoTeste;

    // Feedback no Título Central (Fica Verde quando um olho é ocluído)
    const contentContainer = document.querySelector('.content-container');
    if (contentContainer) {
        const isOcluido = (olhoAberto === 'od' || olhoAberto === 'oe');
        contentContainer.classList.toggle('ocluido', isOcluido);
    }

    // Nomes descritivos
    const elOlho = document.getElementById('status-olho');
    if (elOlho) {
        let textoOlho = "Ambos os Olhos (AO)";
        if (olhoAberto === 'od') {
            textoOlho = oclusorTipo === 'pinhole' ? "Olho Direito (OD) [c/ PH]" : "Olho Direito (OD) [OE Ocluído]";
        } else if (olhoAberto === 'oe') {
            textoOlho = oclusorTipo === 'pinhole' ? "Olho Esquerdo (OE) [c/ PH]" : "Olho Esquerdo (OE) [OD Ocluído]";
        }
        elOlho.textContent = textoOlho;
    }

    const elCondicao = document.getElementById('status-condicao');
    if (elCondicao) {
        let cond = 'Sem Correção (SC)';
        if (isComCorrecao) {
            cond = 'Com Correção (CC)';
        } else if (oclusorTipo === 'pinhole' && olhoAberto !== 'ao') {
            cond = 'Furo Estenopeico (PH)';
        }
        elCondicao.textContent = cond;
    }

    const elAvEsp = document.getElementById('status-av-esperada');
    if (elAvEsp) {
        elAvEsp.textContent = obterAcuidadeEsperada();
    }
}

// Clique na Linha da Tabela
function testarLinha(linhaFracao, textoLinha) {
    const { distancia } = estadoTeste;
    const avEsperada = obterAcuidadeEsperada();

    document.querySelectorAll('.snellen-row, .jaeger-row').forEach(r => r.classList.remove('selected'));
    const clickedEl = event?.currentTarget;
    if (clickedEl) clickedEl.classList.add('selected');

    let consegueLer = false;

    if (distancia === 'longe') {
        const rankLinha = SNELLEN_RANK[linhaFracao] || 1;
        const rankEsperado = SNELLEN_RANK[avEsperada] || 5;
        consegueLer = (rankLinha <= rankEsperado);
    } else {
        const rankLinha = JAEGER_RANK[linhaFracao] || 1;
        const rankEsperado = JAEGER_RANK[avEsperada] || 5;
        consegueLer = (rankLinha <= rankEsperado);
    }

    if (consegueLer) {
        if (distancia === 'longe') {
            // Separa cada letra com vírgula e espaço para pausas naturais na fala
            const letrasComPausa = textoLinha.trim().split(/\s+/).join(', ');
            const textoFalado = `Consigo ler: ${letrasComPausa}.`;
            const textoVisual = `Consigo ler perfeitamente: "${textoLinha}"!`;
            falarTexto(textoFalado, textoVisual, true);
        } else {
            // Separa cada número com vírgula e espaço para pausas naturais na fala
            const numerosComPausa = textoLinha.trim().split(/\s+/).join(', ');
            const textoFalado = `Consigo ler: ${numerosComPausa}.`;
            const textoVisual = `Consigo ler nítido: "${textoLinha}"`;
            falarTexto(textoFalado, textoVisual, true);
        }
    } else {
        const falasDificuldade = [
            "Está muito embaçado nessa linha, não consigo identificar os caracteres.",
            "Vejo apenas borrões nessa linha, não dá para ler.",
            "Muito borrado, parece apenas uma mancha.",
            "Não consigo ler essa linha, está muito pequeno e confuso."
        ];
        const falaAleatoria = falasDificuldade[Math.floor(Math.random() * falasDificuldade.length)];
        falarTexto(falaAleatoria, null, false);
    }
}

// =========================================================================
// SISTEMA DE VOZ DO PACIENTE (WEB SPEECH SYNTHESIS - MODULADO PELA IDADE)
// =========================================================================
function falarTexto(textoFalado, textoVisual = null, isSoletrando = false) {
    // Atualiza balão visual na tela
    mostrarFala(textoVisual || textoFalado, isSoletrando ? 5000 : 4000);

    if (!('speechSynthesis' in window)) return;

    // Cancela falas anteriores para não encavalar
    window.speechSynthesis.cancel();

    const msg = new SpeechSynthesisUtterance(textoFalado);
    msg.lang = 'pt-BR';

    const idade = paciente.idade ?? 40;

    // Modulação de voz baseada na idade do paciente (igual ao simulador de Amplitude)
    let baseRate = 1.0;
    let basePitch = 1.0;

    if (idade <= 12) {
        baseRate = 1.15; // Criança fala um pouco mais rápido
        basePitch = 1.8; // Tom bem agudo
    } else if (idade <= 25) {
        baseRate = 1.05;
        basePitch = 1.2; // Jovem, tom ligeiramente agudo
    } else if (idade <= 50) {
        baseRate = 0.95;
        basePitch = 1.0; // Adulto, voz padrão
    } else {
        baseRate = 0.85; // Idoso fala um pouco mais devagar
        basePitch = 0.8; // Tom mais grave
    }

    // Se estiver soletrando letras, deixa o ritmo um pouco mais cadenciado e pausado
    if (isSoletrando) {
        baseRate = Math.max(0.75, baseRate * 0.85);
    }

    msg.rate = baseRate;
    msg.pitch = basePitch;

    // Tenta selecionar voz em português se disponível
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(v => v.lang.startsWith('pt') || v.lang.includes('BR'));
    if (ptVoice) {
        msg.voice = ptVoice;
    }

    window.speechSynthesis.speak(msg);
}

// Balão de fala visual do paciente
function mostrarFala(msg, tempoMs = 3500) {
    const bubble = document.getElementById('speech-bubble');
    if (!bubble) return;

    if (falaTimeout) clearTimeout(falaTimeout);

    bubble.textContent = msg;
    bubble.classList.add('active');

    falaTimeout = setTimeout(() => {
        bubble.classList.remove('active');
    }, tempoMs);
}

// Notificação Toast
function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

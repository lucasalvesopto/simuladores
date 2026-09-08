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

// Variáveis de Lentes Atuais no Rosto
let lenteEsfOD = 0; // Grau da lente esférica atual no OD
let lenteEsfOE = 0; // Grau da lente esférica atual no OE
let oclusorOD = false; // Se o OD está tapado
let oclusorOE = false; // Se o OE está tapado

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

// Calcula a Demanda de Acomodação e Embaça o Cartão
function calcularVisao() {
    let olhoAtivo = '';
    if (oclusorOE && !oclusorOD) olhoAtivo = 'od';
    else if (oclusorOD && !oclusorOE) olhoAtivo = 'oe';
    else olhoAtivo = 'ambos'; // Ambos abertos

    let excesso = 0;
    const calcularExcesso = (lenteEsf, rxEsf) => {
        let lenteEfetiva = lenteEsf - rxEsf;
        // Distância de leitura padrão 33cm (3.00 D)
        return Math.abs(lenteEfetiva);
    };

    if (olhoAtivo === 'od') {
        excesso = calcularExcesso(lenteEsfOD, rxEsfOD);
    } else if (olhoAtivo === 'oe') {
        excesso = calcularExcesso(lenteEsfOE, rxEsfOE);
    } else {
        let excOD = calcularExcesso(lenteEsfOD, rxEsfOD);
        let excOE = calcularExcesso(lenteEsfOE, rxEsfOE);
        excesso = Math.min(excOD, excOE);
    }

    let shouldStruggle = false;

    if (excesso <= 0.50) {
        linhaAV = 1; // Vê J1
    } else if (excesso <= 1.00) {
        linhaAV = 2; // Lê J2
    } else {
        linhaAV = Math.min(7, 2 + Math.floor(excesso / 0.50));
    }

    atualizarVisualCartao(shouldStruggle);
}

// Função que embaça visualmente as linhas do cartão menores que a linhaAV do paciente
function atualizarVisualCartao(shouldStruggle = false) {
    const rows = document.querySelectorAll('.chart-row');
    rows.forEach(row => {
        const j = parseInt(row.dataset.j);
        const textContent = row.querySelector('.text-content');
        if (!textContent) return;

        // Reseta animação de esforço caso exista
        textContent.classList.remove('struggle-blur');

        // Se a linha for Menor numericamente (ex: J2 < J3), significa que as letras são menores e ele não vê
        if (j < linhaAV) {
            textContent.style.filter = 'blur(4px)';
            textContent.style.opacity = '0.7';
        } else {
            textContent.style.filter = 'none';
            textContent.style.opacity = '1';

            // Se essa for a menor linha que ele consegue ler (linhaAV) e ele está no limite, anima!
            if (shouldStruggle && j === linhaAV) {
                // Força o reflow para reiniciar a animação
                void textContent.offsetWidth;
                textContent.classList.add('struggle-blur');
            }
        }
    });
}

// Comandos JS para o Simulador de Amplitude de Acomodação
document.addEventListener('DOMContentLoaded', () => {
    console.log("Simulador de Amplitude de Acomodação iniciado.");

    // Evento do botão de fala (Ouvir o paciente)
    const btnFalar = document.getElementById('btn-falar');
    if (btnFalar) {
        btnFalar.addEventListener('click', () => {
            let texto = '';
            if (linhaAV > 6) {
                texto = 'Não estou conseguindo ler nenhuma linha do cartão.';
            } else {
                texto = `Eu consigo ler até a linha Jota ${linhaAV}.`;
            }

            // Cancela falas anteriores para não encavalar
            window.speechSynthesis.cancel();

            const msg = new SpeechSynthesisUtterance(texto);
            msg.lang = 'pt-BR';

            // Voz dinâmica baseada na idade do paciente
            if (idade <= 12) {
                msg.rate = 1.2;  // Criança fala um pouco mais rápido
                msg.pitch = 1.8; // Tom bem agudo
            } else if (idade <= 25) {
                msg.rate = 1.1;
                msg.pitch = 1.2; // Jovem, tom ligeiramente agudo
            } else if (idade <= 50) {
                msg.rate = 1.0;
                msg.pitch = 1.0; // Adulto, voz padrão
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

    renderMaleta();
    initDragAndDrop();
    initLensesLogic();
    initAxisRotation();
});

// Renderização dinâmica da Maleta de Provas
function renderMaleta() {
    const maleta = document.getElementById('maleta-provas');
    if (!maleta) return;

    // Geração dos valores reais da Caixa de Provas
    const getEsfRange = () => {
        let arr = [];
        for (let i = 0.25; i <= 5.75; i += 0.25) arr.push(i);
        for (let i = 6.00; i <= 9.50; i += 0.50) arr.push(i);
        for (let i = 10.00; i <= 16.00; i += 1.00) arr.push(i);
        arr.push(18.0, 20.0);
        return arr.sort((a, b) => b - a); // maiores no topo
    };

    const getCilRange = () => {
        let arr = [];
        for (let i = 0.25; i <= 3.50; i += 0.25) arr.push(i);
        for (let i = 4.00; i <= 6.00; i += 0.50) arr.push(i);
        return arr.sort((a, b) => b - a);
    };

    const valuesEsfPos = getEsfRange();
    const valuesEsfNeg = valuesEsfPos.map(v => -v);
    const valuesCil = getCilRange();

    // --- Coluna 1: Negativa OD ---
    let colNegOD = '<div class="coluna-esf">';
    valuesEsfNeg.forEach(v => {
        colNegOD += `<div class="lente-btn red" data-tipo="esf" data-olho="od" data-grau="${v.toFixed(2)}">${v.toFixed(2)}</div>`;
    });
    colNegOD += '</div>';

    // --- Coluna 2: Negativa OE ---
    let colNegOE = '<div class="coluna-esf">';
    valuesEsfNeg.forEach(v => {
        colNegOE += `<div class="lente-btn red" data-tipo="esf" data-olho="oe" data-grau="${v.toFixed(2)}">${v.toFixed(2)}</div>`;
    });
    colNegOE += '</div>';

    // --- Centro da Maleta ---
    let centro = `<div class="centro-maleta">
        <div class="cil-grid">`;

    // Cilíndrica OD Vermelha (Negativa)
    centro += `<div class="coluna-esf">`;
    valuesCil.forEach(v => centro += `<div class="lente-btn red" data-tipo="cil" data-olho="od" data-grau="-${v.toFixed(2)}">-${v.toFixed(2)}</div>`);
    centro += `</div>`;

    // Cilíndrica OE Vermelha (Negativa)
    centro += `<div class="coluna-esf">`;
    valuesCil.forEach(v => centro += `<div class="lente-btn red" data-tipo="cil" data-olho="oe" data-grau="-${v.toFixed(2)}">-${v.toFixed(2)}</div>`);
    centro += `</div>`;

    // Cilíndrica OD Verde (Positiva)
    centro += `<div class="coluna-esf">`;
    valuesCil.forEach(v => centro += `<div class="lente-btn green" data-tipo="cil" data-olho="od" data-grau="+${v.toFixed(2)}">+${v.toFixed(2)}</div>`);
    centro += `</div>`;

    // Cilíndrica OE Verde (Positiva)
    centro += `<div class="coluna-esf">`;
    valuesCil.forEach(v => centro += `<div class="lente-btn green" data-tipo="cil" data-olho="oe" data-grau="+${v.toFixed(2)}">+${v.toFixed(2)}</div>`);
    centro += `</div>`;

    centro += `</div>
        <!-- Acessórios -->
        <div class="acessorios-row">
            <div class="lente-btn black acessorio-btn" data-tipo="oclusor" data-olho="od">Oclusor<br>OD</div>
            <div class="lente-btn black acessorio-btn" data-tipo="oclusor" data-olho="oe">Oclusor<br>OE</div>
        </div>
        <!-- Óculos -->
        <div class="oculos-placeholder">
            <svg viewBox="0 0 21000 29700" xmlns="http://www.w3.org/2000/svg" id="oculos-mini" class="drag-oculos" draggable="false" style="pointer-events: none;">
             <g style="pointer-events: visiblePainted; cursor: grab;">
              <path fill="#CECDCC" d="M19909.44 16502.66l0 263.82c0,168.22 -134.97,303.12 -299.37,303.12l-2769.15 0 0 -870.05 2769.15 -0.01c164.4,0 299.37,134.95 299.37,303.12z"/>
              <path fill="#CECDCC" d="M928.08 16766.48l0 -263.82c0,-168.22 134.97,-303.12 299.37,-303.12l2769.15 0 0 870.05 -2769.15 0.01c-164.4,0 -299.37,-134.95 -299.37,-303.12z"/>
              <path fill="#FD7C7C" d="M18970.69 17069.6l0 -870.06 638.81 0c164.74,0 299.94,134.95 299.94,303.17l0 263.77c0,168.22 -135.2,303.12 -299.94,303.12l-638.81 0z"/>
              <path fill="#FD7C7C" d="M1866.83 16199.54l0 870.06 -638.81 0c-164.74,0 -299.94,-134.95 -299.94,-303.17l0 -263.77c0,-168.22 135.2,-303.12 299.94,-303.12l638.81 0z"/>
              <path fill="black" d="M11895.55 16204.93c0,167.23 -134.17,302.81 -299.82,302.81l-2354.07 0c-165.55,0 -299.72,-135.58 -299.72,-302.74l0.12 -367.53c0,-167.18 134.05,-302.82 299.48,-302.82l2354.19 0c165.65,0 299.71,135.64 299.71,302.82l0.11 367.46z"/>
              <path fill="#0070C0" d="M6639.61 18324.33c-1026.43,0 -1861.34,-843.07 -1861.34,-1879.57 0,-1036.45 834.91,-1879.67 1861.34,-1879.67 1026.21,0 1861.01,843.22 1861.01,1879.67 0,1036.45 -834.8,1879.57 -1861.01,1879.57zm0 -4667.17c-1282.3,0 -2359.91,888.56 -2668.66,2087.19l-1209.08 -0.06c-165.44,0 -299.56,135.64 -299.56,302.68l0.06 1175.2c0,167.1 134.06,302.69 299.5,302.69l1267 -0.07c21.87,0 43.16,-2.62 63.54,-7.06 417.05,1005.91 1401.36,1714.66 2547.2,1714.66 1522.03,0 2760.26,-1250.59 2760.26,-2787.63 0.11,-1537.22 -1238.23,-2787.6 -2760.26,-2787.6z"/>
              <path fill="#0070C0" d="M12346.72 16444.76c0,-1036.45 833.54,-1879.67 1858.03,-1879.67 1024.61,0 1858.14,843.22 1858.14,1879.67 0,1036.45 -833.53,1879.57 -1858.14,1879.57 -1024.49,0 -1858.14,-843.07 -1858.03,-1879.57zm-897.64 0c0,1537.04 1235.94,2787.63 2755.67,2787.63 1143.78,0 2126.72,-708.75 2542.97,-1714.66 20.49,4.44 41.44,7.13 63.31,7.13l1264.9 -0.07c165.43,0 299.25,-135.52 299.25,-302.62l0 -1175.2c0,-167.1 -133.82,-302.62 -299.25,-302.62l-1206.86 -0.06c-308.3,-1198.63 -1384.07,-2087.13 -2664.32,-2087.13 -1519.73,0 -2755.79,1250.38 -2755.67,2787.6z"/>
              <path fill="#CECDCC" d="M18031.74 11613.42l0 263.82c0,168.22 -134.97,303.12 -299.37,303.12l-13917.46 0c-164.85,0 -299.37,-134.9 -299.37,-303.07l0 -263.87c0,-168.17 134.52,-303.06 299.37,-303.06l13917.46 -0.06c164.4,0 299.37,134.95 299.37,303.12z"/>
              <path fill="black" d="M10601.92 15590.85c0,202.89 -164.05,367.38 -366.45,367.38l0 0c-202.41,0 -366.23,-164.49 -366.23,-367.38l0 -4908.93c0,-203.06 163.82,-367.6 366.23,-367.6l0 0c202.4,0 366.33,164.54 366.33,367.6l0.12 4908.93z"/>
              <path fill="#FD7C7C" d="M11094.19 11745.38c0,480.44 -384.43,870.01 -858.61,870.01 -474.3,0 -858.61,-389.57 -858.61,-870.01 0.12,-480.65 384.31,-870.11 858.61,-870.11 474.18,0 858.61,389.46 858.61,870.11z"/>
              <path fill="#FD7C7C" d="M4454.28 11310.3l0 870.06 -638.8 0c-165.08,0 -299.94,-134.9 -299.94,-303.07l0 -263.87c0,-168.17 134.74,-303.06 299.94,-303.06l638.8 -0.06z"/>
              <path fill="#FD7C7C" d="M17092.99 12180.36l0 -870.06 638.81 0c164.74,0 299.94,134.95 299.94,303.17l0 263.77c0,168.22 -135.2,303.12 -299.94,303.12l-638.81 0z"/>
             </g>
            </svg>
        </div>
    </div>`;

    // --- Coluna 4: Positiva OD ---
    let colPosOD = '<div class="coluna-esf">';
    valuesEsfPos.forEach(v => {
        colPosOD += `<div class="lente-btn green" data-tipo="esf" data-olho="od" data-grau="+${v.toFixed(2)}">+${v.toFixed(2)}</div>`;
    });
    colPosOD += '</div>';

    // --- Coluna 5: Positiva OE ---
    let colPosOE = '<div class="coluna-esf">';
    valuesEsfPos.forEach(v => {
        colPosOE += `<div class="lente-btn green" data-tipo="esf" data-olho="oe" data-grau="+${v.toFixed(2)}">+${v.toFixed(2)}</div>`;
    });
    colPosOE += '</div>';

    // Junta tudo no grid da maleta
    maleta.innerHTML = colNegOD + colNegOE + centro + colPosOD + colPosOE;
}

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

function initLensesLogic() {
    const maleta = document.getElementById('maleta-provas');
    const patientImage = document.querySelector('.patient-image');
    let activeDragLens = null;

    // 1. Iniciar o arraste da lente da maleta
    const startLensDrag = (e, btn) => {
        if (!isGlassesVisible) {
            showToast("Por favor, posicione a armação de prova no rosto do paciente primeiro!");
            return;
        }

        activeDragLens = btn.cloneNode(true);
        // Remove classes que podem interferir no visual
        activeDragLens.style.position = 'fixed';
        activeDragLens.style.pointerEvents = 'none';
        activeDragLens.style.zIndex = '9999';
        activeDragLens.style.transform = 'translate(-50%, -50%) scale(1.2)';
        activeDragLens.style.boxShadow = '0 10px 20px rgba(0,0,0,0.8)';

        document.body.appendChild(activeDragLens);

        // Salvar os dados para usar no mouseup
        activeDragLens.dataset.tipo = btn.getAttribute('data-tipo');
        activeDragLens.dataset.olho = btn.getAttribute('data-olho');
        activeDragLens.dataset.grau = btn.getAttribute('data-grau');

        moveLensDrag(e);
    };

    const moveLensDrag = (e) => {
        if (!activeDragLens) return;
        let clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        let clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

        activeDragLens.style.left = clientX + 'px';
        activeDragLens.style.top = clientY + 'px';
    };

    const stopLensDrag = (e) => {
        if (!activeDragLens) return;

        let clientX = e.type.includes('mouse') ? e.clientX : e.changedTouches[0].clientX;
        let clientY = e.type.includes('mouse') ? e.clientY : e.changedTouches[0].clientY;

        const patientRect = patientImage.getBoundingClientRect();
        // Verifica se soltou em cima do rosto
        const isOverFace = (
            clientX >= patientRect.left &&
            clientX <= patientRect.right &&
            clientY >= patientRect.top &&
            clientY <= patientRect.bottom
        );

        if (isOverFace) {
            // Aplicar lente no rosto
            const tipo = activeDragLens.dataset.tipo;
            const olho = activeDragLens.dataset.olho;
            const grau = activeDragLens.dataset.grau;
            aplicarLente(tipo, olho, grau);
        }

        activeDragLens.remove();
        activeDragLens = null;
    };

    // Inicia arrastar quando mousedown num botão de lente
    maleta.addEventListener('mousedown', (e) => {
        const btn = e.target.closest('.lente-btn');
        if (!btn || btn.id === 'oculos-mini') return;
        e.preventDefault();
        startLensDrag(e, btn);
    });

    maleta.addEventListener('touchstart', (e) => {
        const btn = e.target.closest('.lente-btn');
        if (!btn || btn.id === 'oculos-mini') return;
        e.preventDefault();
        startLensDrag(e, btn);
    }, { passive: false });

    document.addEventListener('mousemove', moveLensDrag);
    document.addEventListener('touchmove', moveLensDrag, { passive: false });
    document.addEventListener('mouseup', stopLensDrag);
    document.addEventListener('touchend', stopLensDrag);

    // 2. Clicar nas lentes no rosto para tirar com animação
    document.addEventListener('click', (e) => {
        // Apenas remove se clicar no CABINHO da lente (texto), na imagem, ou na hitbox do oclusor
        if (e.target.closest('.grau-texto') || e.target.closest('img') || e.target.closest('.oclusor-hitbox')) {
            const lenteGroup = e.target.closest('.lente-group');
            if (lenteGroup && !lenteGroup.classList.contains('oculos-prova')) {
                removerLenteComAnimacao(lenteGroup);
            }
        }
    });
}

// Função utilitária para fazer a animação de saída de uma lente
function removerLenteComAnimacao(lenteGroup, isReplacing = false) {
    if (!lenteGroup || lenteGroup.classList.contains('lente-hidden')) return;

    // Cria um clone visual da lente exato como ela está agora
    const clone = lenteGroup.cloneNode(true);
    clone.removeAttribute('id');
    lenteGroup.parentNode.appendChild(clone);

    const img = clone.querySelector('img');
    const text = clone.querySelector('.grau-texto');

    // Força reflow
    clone.getBoundingClientRect();

    // Aplica a animação de saída no clone (fade-out deslizando para cima sem encolher)
    if (img) {
        img.style.transition = 'transform 0.4s ease-in, opacity 0.4s ease-in';
        img.style.transform = 'translateY(-150px)'; /* Sobe mantendo o tamanho original */
        img.style.opacity = '0';
    }
    if (text) {
        text.style.transition = 'transform 0.4s ease-in, opacity 0.4s ease-in';
        text.style.transform = 'translate(-50%, -50%) translateY(-150px)'; /* Acompanha a lente sem encolher */
        text.style.opacity = '0';
    }

    // Esconde a original INMEDIATAMENTE sem transição, para não gerar duplicação visual com o clone
    lenteGroup.style.transition = 'none';
    lenteGroup.classList.add('lente-hidden');
    lenteGroup.offsetHeight; // Força o reflow para aplicar instantaneamente
    
    // Restaura a transição da original para quando ela for usada de novo no futuro
    setTimeout(() => {
        lenteGroup.style.transition = '';
    }, 50);

    // Reseta o estado global se for uma lente esférica ou oclusor (APENAS se não for uma troca rápida)
    if (!isReplacing) {
        if (lenteGroup.classList.contains('lente-negativa-od') || lenteGroup.classList.contains('lente-positiva-od')) {
            lenteEsfOD = 0;
        } else if (lenteGroup.classList.contains('lente-negativa-oe') || lenteGroup.classList.contains('lente-positiva-oe')) {
            lenteEsfOE = 0;
        } else if (lenteGroup.classList.contains('oclusor-od')) {
            oclusorOD = false;
        } else if (lenteGroup.classList.contains('oclusor-oe')) {
            oclusorOE = false;
        }

        // Atualiza a visão assim que tira a lente com o dedo (sem substituir)
        calcularVisao();
    }

    // Remove o clone depois que a animação acaba
    setTimeout(() => {
        clone.remove();
    }, 400);
}

function aplicarLente(tipo, olho, grau) {
    if (tipo === 'esf') {
        // Anima a remoção das antigas antes de aplicar a nova (isReplacing = true)
        removerLenteComAnimacao(document.querySelector(`.lente-negativa-${olho}`), true);
        removerLenteComAnimacao(document.querySelector(`.lente-positiva-${olho}`), true);

        let val = parseFloat(grau);

        // Atualiza a variável de estado da lente esférica
        if (olho === 'od') lenteEsfOD = val;
        if (olho === 'oe') lenteEsfOE = val;

        if (val < 0) {
            const group = document.querySelector(`.lente-negativa-${olho}`);
            group.classList.remove('lente-hidden');
            currentLensZIndex++;
            group.style.zIndex = currentLensZIndex;
            let textEl = group.querySelector('.grau-texto');
            if (textEl) textEl.innerHTML = `-<br>${Math.abs(val).toFixed(2)}`;
        } else if (val > 0) {
            const group = document.querySelector(`.lente-positiva-${olho}`);
            group.classList.remove('lente-hidden');
            currentLensZIndex++;
            group.style.zIndex = currentLensZIndex;
            let textEl = group.querySelector('.grau-texto');
            if (textEl) textEl.innerHTML = `+<br>${Math.abs(val).toFixed(2)}`;
        }
    } else if (tipo === 'cil') {
        // Anima a remoção das antigas
        removerLenteComAnimacao(document.querySelector(`.lente-cil-${olho}`), true);
        removerLenteComAnimacao(document.querySelector(`.lente-cil-pos-${olho}`), true);

        let val = parseFloat(grau);
        if (val < 0) {
            const group = document.querySelector(`.lente-cil-${olho}`);
            group.classList.remove('lente-hidden');
            currentLensZIndex++;
            group.style.zIndex = currentLensZIndex;
            let textEl = group.querySelector('.grau-texto');
            if (textEl) textEl.innerHTML = `-<br>${Math.abs(val).toFixed(2)}`;
        } else if (val > 0) {
            const group = document.querySelector(`.lente-cil-pos-${olho}`);
            group.classList.remove('lente-hidden');
            currentLensZIndex++;
            group.style.zIndex = currentLensZIndex;
            let textEl = group.querySelector('.grau-texto');
            if (textEl) textEl.innerHTML = `+<br>${Math.abs(val).toFixed(2)}`;

            // O usuário pediu que a lente positiva comece automaticamente no eixo 90
            if (olho === 'od') {
                eixoOD = 90;
                document.documentElement.style.setProperty('--eixo-od', '90deg');
            } else {
                eixoOE = 90;
                document.documentElement.style.setProperty('--eixo-oe', '90deg');
            }
        }
    } else if (tipo === 'oclusor') {
        // Oclusor funciona como on/off
        const group = document.querySelector(`.oclusor-${olho}`);
        if (group.classList.contains('lente-hidden')) {
            group.classList.remove('lente-hidden');
            currentLensZIndex++;
            group.style.zIndex = currentLensZIndex;
            if (olho === 'od') oclusorOD = true;
            if (olho === 'oe') oclusorOE = true;
        } else {
            // Se clicar e já estiver lá, ele tira o oclusor (isReplacing = false, vai resetar as vars e calcularVisão lá dentro)
            removerLenteComAnimacao(group, false);
            return; // Se apenas tirou, não chama calcularVisao aqui embaixo de novo, pois já foi chamado
        }
    }

    // Atualiza a visão sempre que colocar qualquer lente no rosto!
    calcularVisao();
}

// Mecânica de Drag and Drop do Óculos
function initDragAndDrop() {
    const oculosRosto = document.getElementById('oculos-rosto');
    const patientImage = document.querySelector('.patient-image');
    const oculosMini = document.getElementById('oculos-mini');
    const maletaContainer = document.querySelector('.maleta-container');

    if (!oculosRosto || !oculosMini || !patientImage) return;

    let activeDragElement = null;
    let ghostElement = null;
    let isFromMaleta = false;

    // Previne comportamento nativo de drag de imagem html (mostrando miniatura opaca ao invés do nosso logic)
    oculosRosto.addEventListener('dragstart', e => e.preventDefault());
    oculosMini.addEventListener('dragstart', e => e.preventDefault());

    // START
    const startDrag = (e, element, fromMaleta) => {
        // e.preventDefault(); (Removido daqui para não travar cliques comuns)
        isFromMaleta = fromMaleta;

        if (fromMaleta) {
            // Arrastando DA MALETA: Criamos um fantasma
            ghostElement = element.cloneNode(true);
            ghostElement.classList.add('dragging');
            ghostElement.id = 'ghost-oculos';
            document.body.appendChild(ghostElement);
            element.style.opacity = 0; // Oculta original
            activeDragElement = ghostElement;
        } else {
            // Arrastando DO ROSTO: Pega a própria imagem grandona
            activeDragElement = element;
            activeDragElement.classList.add('dragging');
        }

        moveDrag(e); // Calcula a primeira posição central
    };

    // MOVE
    const moveDrag = (e) => {
        if (!activeDragElement) return;

        let clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        let clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

        activeDragElement.style.left = clientX + 'px';
        activeDragElement.style.top = clientY + 'px';
    };

    // STOP
    const stopDrag = (e) => {
        if (!activeDragElement) return;

        let clientX = e.type.includes('mouse') ? e.clientX : e.changedTouches[0].clientX;
        let clientY = e.type.includes('mouse') ? e.clientY : e.changedTouches[0].clientY;

        const patientRect = patientImage.getBoundingClientRect();

        // Colisão básica (bounding box hit)
        const isOverFace = (
            clientX >= patientRect.left &&
            clientX <= patientRect.right &&
            clientY >= patientRect.top &&
            clientY <= patientRect.bottom
        );

        if (isFromMaleta) {
            ghostElement.remove(); // Remove o fantasma flutuante

            if (isOverFace) {
                // VESTIU COM SUCESSO!
                isGlassesVisible = true;
                oculosRosto.classList.remove('oculos-hidden');
            } else {
                // ERROU O ROSTO: Voltar o óculos na maleta
                oculosMini.style.opacity = 1;
            }
        } else {
            // TIRANDO DO ROSTO:
            activeDragElement.classList.remove('dragging');
            activeDragElement.style.left = '';
            activeDragElement.style.top = '';

            if (!isOverFace) {
                // JOGOU FORA DO ROSTO:
                isGlassesVisible = false;
                oculosRosto.classList.add('oculos-hidden');
                oculosMini.style.opacity = 1; // Devolve pra caixa
            }
        }

        activeDragElement = null;
        ghostElement = null;
    };

    // Mouse events
    oculosMini.addEventListener('mousedown', e => { e.preventDefault(); startDrag(e, oculosMini, true); });
    oculosRosto.addEventListener('mousedown', (e) => {
        // Não arrastar o óculos se estiver clicando nos botões de eixo
        if (isRotatingAxis || e.target.closest('path:nth-child(3)') || e.target.closest('path:nth-child(4)')) return;
        e.preventDefault();
        startDrag(e, oculosRosto, false);
    });

    // Touch events (mobile/tablet)
    oculosMini.addEventListener('touchstart', e => { e.preventDefault(); startDrag(e, oculosMini, true); }, { passive: false });
    oculosRosto.addEventListener('touchstart', (e) => {
        if (isRotatingAxis || e.target.closest('path:nth-child(3)') || e.target.closest('path:nth-child(4)')) return;
        e.preventDefault();
        startDrag(e, oculosRosto, false);
    }, { passive: false });

    document.addEventListener('mousemove', moveDrag);
    document.addEventListener('touchmove', moveDrag, { passive: false });
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
}

// ==========================================
// ROTAÇÃO DOS EIXOS
// ==========================================
let eixoOD = 0;
let eixoOE = 0;
let isRotatingAxis = null;
let startMouseY = 0;
let startEixo = 0;
const textGeometries = { od: [], oe: [] };

function initAxisRotation() {
    const oculosRosto = document.getElementById('oculos-rosto');
    if (!oculosRosto) return;

    // path 3 = OE (Direita da tela), path 4 = OD (Esquerda da tela)
    const knobOE = oculosRosto.querySelector('g path:nth-child(3)');
    const knobOD = oculosRosto.querySelector('g path:nth-child(4)');

    if (knobOD) {
        knobOD.style.cursor = 'ns-resize';
        knobOD.addEventListener('mousedown', (e) => startAxisDrag(e, 'od'));
        knobOD.addEventListener('touchstart', (e) => startAxisDrag(e, 'od'), { passive: false });
    }
    if (knobOE) {
        knobOE.style.cursor = 'ns-resize';
        knobOE.addEventListener('mousedown', (e) => startAxisDrag(e, 'oe'));
        knobOE.addEventListener('touchstart', (e) => startAxisDrag(e, 'oe'), { passive: false });
    }

    document.documentElement.style.setProperty('--eixo-od', '0deg');
    document.documentElement.style.setProperty('--eixo-oe', '0deg');

    const style = document.createElement('style');
    style.innerHTML = `
        .lente-negativa-od, .lente-positiva-od, .lente-cil-od, .oclusor-od {
            transform-origin: 31.62% 55.37%;
            transform: translateX(-50%) rotate(var(--eixo-od));
        }
        .lente-cil-pos-od {
            transform-origin: 31.62% 55.37%;
            transform: translateX(-50%) rotate(calc(var(--eixo-od) - 90deg));
        }

        .lente-negativa-oe, .lente-positiva-oe, .lente-cil-oe, .oclusor-oe {
            transform-origin: 67.64% 55.37%;
            transform: translateX(-50%) rotate(var(--eixo-oe));
        }
        .lente-cil-pos-oe {
            transform-origin: 67.64% 55.37%;
            transform: translateX(-50%) rotate(calc(var(--eixo-oe) - 90deg));
        }
    `;
    document.head.appendChild(style);

    // Eventos do Popup (Slider Customizado)
    const slider = document.getElementById('axis-slider');
    const thumb = document.getElementById('axis-thumb');
    const btnFechar = document.getElementById('axis-fechar');
    const valorEl = document.getElementById('axis-valor');
    const popup = document.getElementById('axis-popup');

    if (slider) {
        slider.addEventListener('input', (e) => {
            if (!isRotatingAxis) return;
            const newVal = parseInt(e.target.value);

            // Busca o elemento sempre para não perder a referência após reabrir
            const currentValorEl = document.getElementById('axis-valor');
            if (currentValorEl) currentValorEl.textContent = newVal;

            // Move a bolinha vermelha visualmente
            // 0 -> top: 100%, 180 -> top: 0%
            const pct = (newVal / 180) * 100;
            thumb.style.top = `${100 - pct}%`;

            // Calcula a diferença para girar os textos corretamente
            const oldVal = isRotatingAxis === 'od' ? eixoOD : eixoOE;
            const deltaY = newVal - oldVal;

            if (isRotatingAxis === 'od') {
                eixoOD = newVal;
                document.documentElement.style.setProperty('--eixo-od', `${eixoOD}deg`);
                updateTexts('od', deltaY);
            } else {
                eixoOE = newVal;
                document.documentElement.style.setProperty('--eixo-oe', `${eixoOE}deg`);
                updateTexts('oe', deltaY);
            }
        });
    }

    if (btnFechar) {
        btnFechar.addEventListener('click', () => {
            popup.classList.add('hidden');
            isRotatingAxis = null;
        });
    }
}

function getPivot(olho) {
    const oculos = document.getElementById('oculos-rosto');
    const rect = oculos.getBoundingClientRect();
    return {
        x: rect.left + rect.width * (olho === 'od' ? 0.3162 : 0.6764),
        y: rect.top + rect.height * 0.5537
    };
}

function captureTextGeom(olho) {
    if (textGeometries[olho].length > 0) return;

    const pivot = getPivot(olho);
    const classes = olho === 'od' ?
        ['grau-od', 'grau-pos-od', 'grau-cil-od', 'grau-cil-pos-od'] :
        ['grau-oe', 'grau-pos-oe', 'grau-cil-oe', 'grau-cil-pos-oe'];

    classes.forEach(cls => {
        const el = document.querySelector('.' + cls);
        if (el) {
            const computed = window.getComputedStyle(el);
            const leftPx = parseFloat(computed.left);
            const topPx = parseFloat(computed.top);

            const dx = leftPx - pivot.x;
            const dy = topPx - pivot.y;
            const radius = Math.sqrt(dx * dx + dy * dy);
            const angleRad = Math.atan2(dy, dx);

            let cssVarName = '--lente-' + cls.replace('grau-', '').replace('pos', 'pos').replace('cil', 'cil').replace('-od', 'neg-od').replace('-oe', 'neg-oe');
            if (cls === 'grau-od') cssVarName = '--lente-neg-od-rot';
            if (cls === 'grau-oe') cssVarName = '--lente-neg-oe-rot';
            if (cls === 'grau-pos-od') cssVarName = '--lente-pos-od-rot';
            if (cls === 'grau-pos-oe') cssVarName = '--lente-pos-oe-rot';
            if (cls === 'grau-cil-od') cssVarName = '--lente-cil-od-rot';
            if (cls === 'grau-cil-oe') cssVarName = '--lente-cil-oe-rot';
            if (cls === 'grau-cil-pos-od') cssVarName = '--lente-cil-pos-od-rot';
            if (cls === 'grau-cil-pos-oe') cssVarName = '--lente-cil-pos-oe-rot';

            const rootStyles = getComputedStyle(document.documentElement);
            const initialRot = parseFloat(rootStyles.getPropertyValue(cssVarName)) || 0;

            textGeometries[olho].push({ el, radius, baseAngleRad: angleRad, baseRotDeg: initialRot });
        }
    });
}

function startAxisDrag(e, olho) {
    e.stopPropagation(); // Impede que o evento "suba" para a armação (evita arrastar o óculos)

    if (!isGlassesVisible) {
        showToast("Por favor, posicione a armação de prova no rosto primeiro!");
        return;
    }
    e.preventDefault();
    isRotatingAxis = olho;

    captureTextGeom(olho);

    const popup = document.getElementById('axis-popup');
    const labelTexto = document.getElementById('axis-label-texto');
    const slider = document.getElementById('axis-slider');
    const thumb = document.getElementById('axis-thumb');

    let currentEixo = olho === 'od' ? eixoOD : eixoOE;

    labelTexto.innerHTML = `Eixo ${olho.toUpperCase()}: <span id="axis-valor">${Math.round(currentEixo)}</span>°`;

    // Atualiza a posição visual da bolinha no inicio
    slider.value = Math.round(currentEixo);
    const pct = (Math.round(currentEixo) / 180) * 100;
    if (thumb) thumb.style.top = `${100 - pct}%`;

    // Posiciona o popup perto do mouse
    let clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    let clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;

    if (olho === 'od') {
        // Abre para a esquerda do clique para não tapar a armação
        let posLeft = clientX - 140;
        if (posLeft < 10) posLeft = 10;
        popup.style.left = `${posLeft}px`;
    } else {
        // Abre para a direita do clique
        let posLeft = clientX + 20;
        if (posLeft > window.innerWidth - 140) posLeft = window.innerWidth - 140;
        popup.style.left = `${posLeft}px`;
    }

    popup.style.top = `${clientY - 50}px`;
    popup.classList.remove('hidden');
}

function updateTexts(olho, deltaDeg) {
    const geomList = textGeometries[olho];
    const pivot = getPivot(olho);
    const deltaRad = deltaDeg * (Math.PI / 180);

    geomList.forEach(geom => {
        // Atualiza o baseAngle com o delta para a próxima vez
        geom.baseAngleRad += deltaRad;
        geom.baseRotDeg += deltaDeg;

        const newLeftPx = pivot.x + geom.radius * Math.cos(geom.baseAngleRad);
        const newTopPx = pivot.y + geom.radius * Math.sin(geom.baseAngleRad);

        // Converter de volta para porcentagem para suportar resize da tela
        const leftPct = (newLeftPx / window.innerWidth) * 100;
        const topPct = (newTopPx / window.innerHeight) * 100;

        geom.el.style.left = `${leftPct}%`;
        geom.el.style.top = `${topPct}%`;
        geom.el.style.transform = `rotate(${geom.baseRotDeg}deg)`;
    });
}

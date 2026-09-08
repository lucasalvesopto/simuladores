// =========================================================================
// 🎯 MAPEAMENTO ANATÔMICO DEFINITIVO DO PACIENTE LUCAS (SVG VETORIAL)
// Base padronizada para todos os Simuladores Clínicos
// =========================================================================

const MAPEAMENTO_LUCAS_BASE = {
    // ESTRUTURAS OCULARES MOTILIDADE E REFLEXOS
    olhoDireito: {
        esclera: { id: "olho-esclera-od", index: 19, className: "fil9", desc: "Esclera (fundo branco) OD" },
        irisExterna: { id: "olho-iris-marrom-od", index: 34, className: "fil10", desc: "Íris marrom escura OD" },
        irisInterna: { id: "olho-iris-vermelha-od", index: 35, className: "fil11", desc: "Íris vermelha OD" },
        pupila: { id: "olho-pupila-od", index: 36, className: "fil1", desc: "Pupila preta central OD" },
        todosElementos: [19, 34, 35, 36]
    },
    olhoEsquerdo: {
        esclera: { id: "olho-esclera-oe", index: 18, className: "fil9", desc: "Esclera (fundo branco) OE" },
        irisExterna: { id: "olho-iris-marrom-oe", index: 39, className: "fil10", desc: "Íris marrom escura OE" },
        irisInterna: { id: "olho-iris-vermelha-oe", index: 40, className: "fil11", desc: "Íris vermelha OE" },
        pupila: { id: "olho-pupila-oe", index: 63, className: "fil1", desc: "Pupila preta central OE" },
        todosElementos: [18, 39, 40, 63]
    },
    
    // ANEXOS OCULARES (PÁLPEBRAS, DOBRAS, CANTOS E BLUSH)
    palpebras: {
        superiorCiliosOD: { id: "palpebra-superior-cilios-od", index: 28, className: "fil1", desc: "Pálpebra superior / Cílios OD" },
        superiorCiliosOE: { id: "palpebra-superior-cilios-oe", index: 29, className: "fil1", desc: "Pálpebra superior / Cílios OE" },
        superiorDobraOD: { id: "palpebra-superior-dobra-od", index: 30, className: "fil7", desc: "Dobra superior da pálpebra OD" },
        superiorDobraOE: { id: "palpebra-superior-dobra-oe", index: 31, className: "fil7", desc: "Dobra superior da pálpebra OE" },
        cantoOD: { id: "olho-canto-caruncula-od", index: 37, className: "fil7", desc: "Carúncula lacrimal OD" },
        cantoOE: { id: "olho-canto-caruncula-oe", index: 38, className: "fil7", desc: "Carúncula lacrimal OE" },
        bochechaInferiorOD: { id: "bochecha-blush-od", index: 41, className: "fil12", desc: "Bochecha / Pálpebra inferior OD" },
        bochechaInferiorOE: { id: "bochecha-blush-oe", index: 42, className: "fil12", desc: "Bochecha / Pálpebra inferior OE" }
    },

    // SOBRANCELHAS
    sobrancelhas: {
        od: { id: "sobrancelha-od", index: 21, className: "fil1" },
        oe: { id: "sobrancelha-oe", index: 22, className: "fil1" }
    },

    // PELE E ROSTO (fil8)
    pele: {
        rostoBase: { id: "rosto-pele-base", index: 17, className: "fil8", desc: "Pele principal do rosto" },
        orelhaOD: { id: "orelha-pele-od", index: 32, className: "fil8", desc: "Orelha direita" },
        orelhaOE: { id: "orelha-pele-oe", index: 33, className: "fil8", desc: "Orelha esquerda" },
        pescoco: { id: "pescoco-pele", index: 46, className: "fil8", desc: "Pescoço" }
    },

    // EXPRESSÃO FACIAL
    face: {
        nariz: { id: "nariz", index: 43, className: "fil1" },
        bocaSorriso: { id: "boca-linha-sorriso", index: 44, className: "fil1" },
        dentes: { id: "boca-dentes", index: 45, className: "fil13" }
    },

    // COORDENADAS EXATAS DO CENTROIDE DAS PUPILAS (VIEWBOX 21000 x 29700)
    coordenadasPupilas: {
        od: { x: 6728.1, y: 16427.7, percentX: 32.0385, percentY: 55.3120 },
        oe: { x: 14133.6, y: 16429.2, percentX: 67.3030, percentY: 55.3170 }
    },

    // TABELA COMPLETA DOS 64 ELEMENTOS SEMÂNTICOS
    todosElementos: [
    {
        "id": "camisa-fundo",
        "desc": "Fundo branco e base da camisa"
    },
    {
        "id": "cabelo-base-contorno",
        "desc": "Base e contorno escuro do cabelo"
    },
    {
        "id": "cabelo-mecha-sombra-1",
        "desc": "Mecha de sombra do cabelo (topo/meio)"
    },
    {
        "id": "cabelo-mecha-castanho-1",
        "desc": "Mecha castanha média do cabelo"
    },
    {
        "id": "cabelo-mecha-sombra-2",
        "desc": "Mecha de sombra do cabelo (lateral direita)"
    },
    {
        "id": "cabelo-mecha-sombra-3",
        "desc": "Mecha de sombra do cabelo (lateral esquerda)"
    },
    {
        "id": "cabelo-mecha-castanho-claro-1",
        "desc": "Mecha castanho claro do cabelo"
    },
    {
        "id": "cabelo-mecha-castanho-escuro-1",
        "desc": "Mecha castanho escuro do cabelo"
    },
    {
        "id": "cabelo-mecha-castanho-suave",
        "desc": "Mecha castanho suave do topo"
    },
    {
        "id": "cabelo-sombra-lateral-oe",
        "desc": "Sombra do cabelo na lateral esquerda"
    },
    {
        "id": "cabelo-sombra-lateral-od",
        "desc": "Sombra do cabelo na lateral direita"
    },
    {
        "id": "cabelo-mecha-ponta-od",
        "desc": "Ponta de mecha lateral OD"
    },
    {
        "id": "cabelo-mecha-ponta-oe",
        "desc": "Ponta de mecha lateral OE"
    },
    {
        "id": "cabelo-contorno-lateral-oe",
        "desc": "Contorno escuro lateral OE"
    },
    {
        "id": "cabelo-contorno-lateral-od",
        "desc": "Contorno escuro lateral OD"
    },
    {
        "id": "testa-sombra-pele-oe",
        "desc": "Sombra da pele da testa abaixo do cabelo OE"
    },
    {
        "id": "testa-sombra-pele-od",
        "desc": "Sombra da pele da testa abaixo do cabelo OD"
    },
    {
        "id": "rosto-pele-base",
        "desc": "Pele principal do rosto e cabeça (fil8)"
    },
    {
        "id": "olho-esclera-oe",
        "desc": "Esclera (fundo branco) do Olho Esquerdo (fil9)"
    },
    {
        "id": "olho-esclera-od",
        "desc": "Esclera (fundo branco) do Olho Direito (fil9)"
    },
    {
        "id": "orelha-sombra-oe",
        "desc": "Sombra da orelha esquerda"
    },
    {
        "id": "sobrancelha-od",
        "desc": "Sobrancelha do Olho Direito"
    },
    {
        "id": "sobrancelha-oe",
        "desc": "Sobrancelha do Olho Esquerdo"
    },
    {
        "id": "sobrancelha-sombra-od",
        "desc": "Sombra da sobrancelha OD"
    },
    {
        "id": "sobrancelha-sombra-oe",
        "desc": "Sombra da sobrancelha OE"
    },
    {
        "id": "palpebra-superior-pele-od",
        "desc": "Pele acima da pálpebra superior OD"
    },
    {
        "id": "palpebra-superior-pele-oe",
        "desc": "Pele acima da pálpebra superior OE"
    },
    {
        "id": "cabelo-detalhe-orelha-od",
        "desc": "Detalhe escuro de cabelo próximo à orelha OD"
    },
    {
        "id": "palpebra-superior-cilios-od",
        "desc": "Pálpebra superior / Cílios pretos do Olho Direito"
    },
    {
        "id": "palpebra-superior-cilios-oe",
        "desc": "Pálpebra superior / Cílios pretos do Olho Esquerdo"
    },
    {
        "id": "palpebra-superior-dobra-od",
        "desc": "Linha da dobra palpebral superior OD"
    },
    {
        "id": "palpebra-superior-dobra-oe",
        "desc": "Linha da dobra palpebral superior OE"
    },
    {
        "id": "orelha-pele-od",
        "desc": "Pele da orelha direita (fil8)"
    },
    {
        "id": "orelha-pele-oe",
        "desc": "Pele da orelha esquerda (fil8)"
    },
    {
        "id": "olho-iris-marrom-od",
        "desc": "Íris marrom escura (anel externo) OD"
    },
    {
        "id": "olho-iris-vermelha-od",
        "desc": "Íris vermelha (anel interno) OD"
    },
    {
        "id": "olho-pupila-od",
        "desc": "Pupila preta central do Olho Direito"
    },
    {
        "id": "olho-canto-caruncula-od",
        "desc": "Canto interno / carúncula lacrimal OD"
    },
    {
        "id": "olho-canto-caruncula-oe",
        "desc": "Canto interno / carúncula lacrimal OE"
    },
    {
        "id": "olho-iris-marrom-oe",
        "desc": "Íris marrom escura (anel externo) OE"
    },
    {
        "id": "olho-iris-vermelha-oe",
        "desc": "Íris vermelha (anel interno) OE"
    },
    {
        "id": "bochecha-blush-od",
        "desc": "Bochecha / Blush rosado OD (pálpebra inferior)"
    },
    {
        "id": "bochecha-blush-oe",
        "desc": "Bochecha / Blush rosado OE (pálpebra inferior)"
    },
    {
        "id": "nariz",
        "desc": "Ponto do nariz"
    },
    {
        "id": "boca-linha-sorriso",
        "desc": "Linha preta do sorriso da boca"
    },
    {
        "id": "boca-dentes",
        "desc": "Dentes brancos do sorriso"
    },
    {
        "id": "pescoco-pele",
        "desc": "Pele do pescoço (fil8)"
    },
    {
        "id": "pescoco-sombra",
        "desc": "Sombra abaixo do queixo no pescoço"
    },
    {
        "id": "gola-camisa-branca-detalhe",
        "desc": "Detalhe da gola da camisa branca"
    },
    {
        "id": "gola-camisa-vermelha-od",
        "desc": "Detalhe vermelho da gola OD"
    },
    {
        "id": "gola-camisa-vermelha-oe",
        "desc": "Detalhe vermelho da gola OE"
    },
    {
        "id": "camisa-sombra-ombro-oe",
        "desc": "Sombra da camisa no ombro OE"
    },
    {
        "id": "camisa-sombra-ombro-od",
        "desc": "Sombra da camisa no ombro OD"
    },
    {
        "id": "camisa-dobra-ombro-oe",
        "desc": "Dobra do tecido da camisa OE"
    },
    {
        "id": "camisa-dobra-ombro-od",
        "desc": "Dobra do tecido da camisa OD"
    },
    {
        "id": "camisa-gola-vermelha-central",
        "desc": "Gola vermelha central da camisa"
    },
    {
        "id": "camisa-costura-ombro-oe",
        "desc": "Linha de costura do ombro OE"
    },
    {
        "id": "camisa-costura-ombro-od",
        "desc": "Linha de costura do ombro OD"
    },
    {
        "id": "camisa-tecido-base-oe",
        "desc": "Tecido base da camisa OE"
    },
    {
        "id": "camisa-tecido-lateral-oe",
        "desc": "Tecido lateral da camisa OE"
    },
    {
        "id": "camisa-tecido-ponta-oe",
        "desc": "Tecido ponta da manga OE"
    },
    {
        "id": "camisa-tecido-lateral-od",
        "desc": "Tecido lateral da camisa OD"
    },
    {
        "id": "camisa-tecido-ponta-od",
        "desc": "Tecido ponta da manga OD"
    },
    {
        "id": "olho-pupila-oe",
        "desc": "Pupila preta central do Olho Esquerdo"
    }
]
};

// Exportação para Node.js ou Window Browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MAPEAMENTO_LUCAS_BASE;
}
if (typeof window !== 'undefined') {
    window.MAPEAMENTO_LUCAS_BASE = MAPEAMENTO_LUCAS_BASE;
}

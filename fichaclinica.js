/**
 * =========================================================================
 * 📋 FICHA CLÍNICA & HUB DE NAVEGAÇÃO ENTRE SIMULADORES E TESTES
 * Arquivo: fichaclinica.js (Pasta Raiz)
 * =========================================================================
 * Este módulo provê um modal moderno, responsivo e com filtro instantâneo
 * para permitir navegação rápida entre todas as 21 seções clínicas da Ficha
 * e entre os Simuladores práticos do laboratório optométrico.
 */

(function () {
    // Detecta se a página executada está em uma subpasta (ex: Simulador-MEO/MEO.html) ou na raiz
    const isSubdir = window.location.pathname.includes('/Simulador-') ||
                     (window.location.pathname.split('/').length > 2 && 
                      !window.location.pathname.endsWith('/index.html') && 
                      !window.location.pathname.endsWith('/fichaclinica.html'));
    const prefixoRaiz = isSubdir ? '../' : './';

    // Mapeamento Oficial de Todas as Seções Clínicas (com números originais e status)
    const SECOES_FICHA = [
        {
            numero: '1',
            id: 'secao-identificacao',
            icone: '👤',
            titulo: '1. Identificação Pessoal',
            descricao: 'Nome / Idade / Profissão / Passatempo / Último exame / Ajuda óptica prescrita / Encaminhado por',
            cor: '#38BDF8',
            status: '',
            simuladorUrl: null
        },
        {
            numero: '2',
            id: 'secao-anamnese',
            icone: '📋',
            titulo: '2. Anamnese',
            descricao: 'Motivo da consulta e tempo de queixa / Antecedentes pessoais gerais / Antecedentes pessoais oculares / Sintomas',
            cor: '#0284C7',
            status: '',
            simuladorUrl: null
        },
        {
            numero: '3',
            id: 'secao-lensometria',
            icone: '🔍',
            titulo: '3. Lensometria',
            descricao: 'Dioptrias esféricas, cilíndricas, eixo e adição das lentes corretivas em uso',
            cor: '#6366F1',
            status: '',
            simuladorUrl: null
        },
        {
            numero: '4',
            id: 'secao-av',
            icone: '👁️',
            titulo: '4. Acuidade Visual',
            descricao: 'Tabelas Snellen VL (6m) e Jaeger VP (40cm) - SC / PH / CC monocular e binocular',
            cor: '#10B981',
            status: 'check',
            simuladorUrl: 'Simulador-AcuidadeVisual/acuidade.html'
        },
        {
            numero: '5',
            id: 'secao-meo',
            icone: '🎯',
            titulo: '5. Motilidade Ocular',
            descricao: 'Hirschberg, Kappa, Ducções monoculares (SPEC) e Versões binoculares (Duplo H)',
            cor: '#10B981',
            status: 'check',
            simuladorUrl: 'Simulador-MEO/MEO.html'
        },
        {
            numero: '5',
            id: 'secao-pupilar',
            icone: '💡',
            titulo: '5. Avaliação Pupilar',
            descricao: 'Reflexos fotomotor direto, consensual, teste de swinging flashlight e diâmetros estáticos/dinâmicos',
            cor: '#EC4899',
            status: '',
            simuladorUrl: null
        },
        {
            numero: '6',
            id: 'secao-biomicroscopia',
            icone: '🔬',
            titulo: '6. Biomicroscopia com Lâmpada de Fenda',
            descricao: 'Análise de anexos, córnea, câmara anterior, íris, ângulo e cristalino',
            cor: '#8B5CF6',
            status: '',
            simuladorUrl: null
        },
        {
            numero: '7',
            id: 'secao-oftalmoscopia',
            icone: '🔆',
            titulo: '7. Oftalmoscopia',
            descricao: 'Avaliação de fundo de olho: papila óptica (escavação), mácula, fóvea e arcadas vasculares',
            cor: '#D946EF',
            status: '',
            simuladorUrl: null
        },
        {
            numero: '8',
            id: 'secao-cera',
            icone: '⭕',
            titulo: '8. Ceratometria',
            descricao: 'Curvatura anterior da córnea (K1 e K2), eixos principais e astigmatismo corneano de Javal',
            cor: '#10B981',
            status: 'check',
            simuladorUrl: 'Simulador-Ceratometria/ceratometria.html'
        },
        {
            numero: '9',
            id: 'secao-coverteste',
            icone: '🛡️',
            titulo: '9. Coverteste',
            descricao: 'Cover unilateral e alternado para longe e perto (diagnóstico de Forias e Tropias)',
            cor: '#06B6D4',
            status: '',
            simuladorUrl: null
        },
        {
            numero: '10',
            id: 'secao-rx-estatica',
            icone: '🔦',
            titulo: '10. Refração: Retinoscopia',
            descricao: 'Retinoscopia Estática / Dinâmica (MEM, Mohindra, sombras com/contra e neutralização)',
            cor: '#10B981',
            status: 'check',
            simuladorUrl: 'Simulador-Retinoscopia/retinoscopia.html'
        },
        {
            numero: '10',
            id: 'secao-subjetivo',
            icone: '👓',
            titulo: '10. Refração: Subjetivo / Afinamento',
            descricao: 'Subjetivo monocular / afinamento com cilindro cruzado de Jackson e balanço binocular',
            cor: '#F59E0B',
            status: 'relogio',
            simuladorUrl: null
        },
        {
            numero: '11',
            id: 'secao-forometria',
            icone: '📐',
            titulo: '11. Forometria: PPC e Reservas Fusionais',
            descricao: 'Ponto Próximo de Convergência (Ruptura/Recuperação) e Reservas Fusionais Positiva/Negativa',
            cor: '#3B82F6',
            status: '',
            simuladorUrl: null
        },
        {
            numero: '11',
            id: 'secao-acc',
            icone: '📏',
            titulo: '11. Amplitude de Acomodação',
            descricao: 'Método de Sheard, Donders (push-up) e cálculo da AA esperada por Hofstetter',
            cor: '#10B981',
            status: 'check',
            simuladorUrl: 'Simulador-AmplitudeAcomodacao/amplitude.html'
        },
        {
            numero: '11',
            id: 'secao-flexibilidade',
            icone: '🔄',
            titulo: '11. Flexibilidade de Acomodação',
            descricao: 'Ciclos por minuto (cpm) monocular e binocular com flippers ±2.00 D',
            cor: '#F59E0B',
            status: 'relogio',
            simuladorUrl: 'Simulador-FlexibilidadeAcomodativa/flexibilidade.html'
        },
        {
            numero: '12',
            id: 'secao-cores',
            icone: '🎨',
            titulo: '12. Visão de Cores',
            descricao: 'Avaliação de discromatopsias congênitas e adquiridas (Tabelas de Ishihara / D-15)',
            cor: '#EC4899',
            status: '',
            simuladorUrl: null
        },
        {
            numero: '13',
            id: 'secao-amsler',
            icone: '🏁',
            titulo: '13. Amsler',
            descricao: 'Tela de Amsler para identificação de metamorfopsias, escotomas centrais e distorções',
            cor: '#64748B',
            status: '',
            simuladorUrl: null
        },
        {
            numero: '14',
            id: 'secao-estereopsia',
            icone: '🕶️',
            titulo: '14. Estereopsia',
            descricao: 'Visão tridimensional e acuidade estereoscópica em segundos de arco (Titmus / Randot)',
            cor: '#8B5CF6',
            status: '',
            simuladorUrl: null
        },
        {
            numero: '15',
            id: 'secao-rx-final',
            icone: '📄',
            titulo: '15. Rx Final',
            descricao: 'Receita óptica compensada para longe, meia distância e perto com cálculo da adição',
            cor: '#38BDF8',
            status: '',
            simuladorUrl: null
        },
        {
            numero: '16',
            id: 'secao-diagnostico',
            icone: '🩺',
            titulo: '16. Diagnóstico',
            descricao: 'Conclusão integrada: diagnósticos refrativos, acomodativos, binoculares e saúde ocular',
            cor: '#14B8A6',
            status: '',
            simuladorUrl: null
        },
        {
            numero: '17',
            id: 'secao-conduta',
            icone: '📝',
            titulo: '17. Conduta',
            descricao: 'Prescrição óptica, higiene visual, ergonomia, terapia visual ou encaminhamentos necessários',
            cor: '#10B981',
            status: '',
            simuladorUrl: null
        }
    ];

    // Mapeamento de Todos os Simuladores Clínicos Interativos
    const SIMULADORES_TESTES = [
        {
            icone: '🎯',
            titulo: 'Motilidade Ocular (MEO)',
            caminho: 'Simulador-MEO/MEO.html',
            cor: '#38BDF8',
            status: 'check',
            badge: 'Hirschberg / Ducções / Versões'
        },
        {
            icone: '🔬',
            titulo: 'Ceratometria de Javal',
            caminho: 'Simulador-Ceratometria/ceratometria.html',
            cor: '#EC4899',
            status: 'check',
            badge: 'Miras & Astigmatismo Corneano'
        },
        {
            icone: '👁️',
            titulo: 'Acuidade Visual',
            caminho: 'Simulador-AcuidadeVisual/acuidade.html',
            cor: '#38BDF8',
            status: 'check',
            badge: 'Tabela Snellen & Optotipos'
        },
        {
            icone: '🔦',
            titulo: 'Retinoscopia Clínica',
            caminho: 'Simulador-Retinoscopia/retinoscopia.html',
            cor: '#FBBF24',
            status: 'check',
            badge: 'Faixa, Sombras & Eixos'
        },
        {
            icone: '📏',
            titulo: 'Amplitude de Acomodação',
            caminho: 'Simulador-AmplitudeAcomodacao/amplitude.html',
            cor: '#34D399',
            status: 'check',
            badge: 'Ponto Próximo / Sheard'
        },
        {
            icone: '🔄',
            titulo: 'Flexibilidade Acomodativa',
            caminho: 'Simulador-FlexibilidadeAcomodativa/flexibilidade.html',
            cor: '#10B981',
            status: 'relogio',
            badge: 'Flippers +/-2.00 D'
        },
        {
            icone: '👓',
            titulo: 'Ametropias & Refração',
            caminho: 'Simulador-Ametropias/ametropias.html',
            cor: '#A855F7',
            status: 'check',
            badge: 'Miopia, Hipermetropia & Astig'
        }
    ];

    // Injeção de Estilos CSS no Head
    function injetarEstilosModal() {
        if (document.getElementById('modal-ficha-clinica-style')) return;

        const style = document.createElement('style');
        style.id = 'modal-ficha-clinica-style';
        style.textContent = `
            /* Overlay do Modal de Navegação */
            .modal-ficha-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(15, 23, 42, 0.88);
                backdrop-filter: blur(14px);
                z-index: 100000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 16px;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.25s ease, visibility 0.25s ease;
            }

            .modal-ficha-overlay.ativo {
                opacity: 1;
                visibility: visible;
            }

            /* Janela do Modal */
            .modal-ficha-janela {
                background: #0B1329;
                border: 1px solid rgba(255, 255, 255, 0.16);
                border-radius: 20px;
                width: 100%;
                max-width: 860px;
                max-height: 92vh;
                overflow: hidden;
                box-shadow: 0 25px 60px rgba(0, 0, 0, 0.85), 0 0 40px rgba(56, 189, 248, 0.18);
                transform: scale(0.96) translateY(12px);
                transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
                display: flex;
                flex-direction: column;
                color: #F8FAFC;
                font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }

            .modal-ficha-overlay.ativo .modal-ficha-janela {
                transform: scale(1) translateY(0);
            }

            /* Cabeçalho do Modal */
            .modal-ficha-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px 24px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                background: rgba(30, 41, 59, 0.6);
            }

            .modal-ficha-title-box h3 {
                font-size: 1.25rem;
                font-weight: 800;
                color: #F8FAFC;
                display: flex;
                align-items: center;
                gap: 10px;
                margin: 0;
            }

            .modal-ficha-title-box p {
                margin: 4px 0 0 0;
                font-size: 0.82rem;
                color: #94A3B8;
            }

            .btn-fechar-modal-ficha {
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.15);
                color: #94A3B8;
                border-radius: 8px;
                width: 32px;
                height: 32px;
                font-size: 1rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }

            .btn-fechar-modal-ficha:hover {
                background: rgba(239, 68, 68, 0.25);
                border-color: #EF4444;
                color: #F87171;
                transform: rotate(90deg);
            }

            /* Barra de Controles: Abas e Busca */
            .modal-ficha-toolbar {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 12px 24px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                background: rgba(15, 23, 42, 0.5);
                gap: 16px;
                flex-wrap: wrap;
            }

            .modal-ficha-tabs {
                display: flex;
                gap: 8px;
            }

            .tab-btn-ficha {
                background: transparent;
                border: none;
                border-bottom: 2px solid transparent;
                color: #94A3B8;
                font-weight: 700;
                font-size: 0.9rem;
                padding: 6px 12px;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                align-items: center;
                gap: 6px;
                border-radius: 6px 6px 0 0;
            }

            .tab-btn-ficha.ativa {
                color: #38BDF8;
                border-bottom-color: #38BDF8;
                background: rgba(56, 189, 248, 0.08);
            }

            .tab-btn-ficha:hover:not(.ativa) {
                color: #F8FAFC;
                background: rgba(255, 255, 255, 0.04);
            }

            .modal-busca-box {
                position: relative;
                flex: 1;
                max-width: 280px;
                min-width: 180px;
            }

            .modal-busca-input {
                width: 100%;
                background: rgba(30, 41, 59, 0.8);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 8px;
                padding: 6px 12px 6px 32px;
                color: #F8FAFC;
                font-size: 0.85rem;
                outline: none;
                transition: border-color 0.2s;
            }

            .modal-busca-input:focus {
                border-color: #38BDF8;
                box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.25);
            }

            .modal-busca-icone {
                position: absolute;
                left: 10px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 0.85rem;
                color: #94A3B8;
                pointer-events: none;
            }

            /* Corpo do Modal com Rolagem */
            .modal-ficha-corpo {
                padding: 16px 24px;
                overflow-y: auto;
                flex: 1;
                max-height: calc(92vh - 200px);
            }

            .modal-secao-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
                gap: 12px;
            }

            /* Card de Seção da Ficha Clínica */
            .card-secao-item {
                position: relative;
                display: flex;
                flex-direction: column;
                background: rgba(30, 41, 59, 0.55);
                border: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 12px;
                padding: 12px 14px;
                text-decoration: none;
                color: inherit;
                transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
                gap: 8px;
            }

            .card-secao-item:hover {
                background: rgba(30, 41, 59, 0.9);
                border-color: rgba(56, 189, 248, 0.4);
                transform: translateY(-2px);
                box-shadow: 0 8px 22px rgba(0, 0, 0, 0.4);
            }

            .card-secao-topo {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .card-secao-numero {
                width: 32px;
                height: 32px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 800;
                font-size: 0.88rem;
                background: rgba(15, 23, 42, 0.8);
                border: 1px solid rgba(255, 255, 255, 0.15);
                flex-shrink: 0;
            }

            .card-secao-titulo-wrap {
                display: flex;
                flex-direction: column;
                flex: 1;
                min-width: 0;
            }

            .card-secao-titulo {
                font-weight: 700;
                font-size: 0.95rem;
                color: #F8FAFC;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 6px;
            }

            .card-secao-titulo-texto {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .card-secao-desc {
                font-size: 0.77rem;
                color: #94A3B8;
                line-height: 1.35;
                padding-left: 44px;
            }

            /* Badges de Status (Check e Relógio) */
            .badge-status-wrap {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                padding: 2px 8px;
                border-radius: 9999px;
                font-size: 0.72rem;
                font-weight: 700;
                letter-spacing: 0.3px;
                flex-shrink: 0;
            }

            .badge-status-check {
                background: rgba(16, 185, 129, 0.18);
                border: 1px solid rgba(16, 185, 129, 0.5);
                color: #34D399;
            }

            .badge-status-relogio {
                background: rgba(245, 158, 11, 0.18);
                border: 1px solid rgba(245, 158, 11, 0.5);
                color: #FBBF24;
            }

            .badge-status-ficha {
                background: rgba(56, 189, 248, 0.12);
                border: 1px solid rgba(56, 189, 248, 0.3);
                color: #38BDF8;
            }

            /* Ações do Card (Links) */
            .card-secao-acoes {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 8px;
                margin-top: 2px;
                padding-top: 6px;
                border-top: 1px solid rgba(255, 255, 255, 0.05);
            }

            .btn-acao-card {
                font-size: 0.76rem;
                font-weight: 700;
                padding: 4px 10px;
                border-radius: 6px;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                gap: 5px;
                transition: all 0.15s ease;
            }

            .btn-acao-ficha {
                background: rgba(56, 189, 248, 0.12);
                border: 1px solid rgba(56, 189, 248, 0.35);
                color: #38BDF8;
            }

            .btn-acao-ficha:hover {
                background: rgba(56, 189, 248, 0.28);
                color: #FFFFFF;
                transform: translateY(-1px);
            }

            .btn-acao-simulador {
                background: rgba(16, 185, 129, 0.15);
                border: 1px solid rgba(16, 185, 129, 0.4);
                color: #34D399;
            }

            .btn-acao-simulador:hover {
                background: rgba(16, 185, 129, 0.3);
                color: #FFFFFF;
                transform: translateY(-1px);
            }

            /* Rodapé do Modal */
            .modal-ficha-rodape {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 14px 24px;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                background: rgba(15, 23, 42, 0.95);
                flex-wrap: wrap;
                gap: 12px;
            }

            .btn-ficha-completa {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                background: linear-gradient(135deg, #0284C7, #0369A1);
                color: white;
                text-decoration: none;
                padding: 8px 16px;
                border-radius: 8px;
                font-weight: 700;
                font-size: 0.88rem;
                transition: all 0.2s;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .btn-ficha-completa:hover {
                background: linear-gradient(135deg, #38BDF8, #0284C7);
                transform: translateY(-1px);
                box-shadow: 0 4px 16px rgba(56, 189, 248, 0.4);
            }

            @media (max-width: 640px) {
                .modal-secao-grid {
                    grid-template-columns: 1fr;
                }
                .modal-ficha-toolbar {
                    flex-direction: column;
                    align-items: stretch;
                }
                .modal-busca-box {
                    max-width: 100%;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Cria a estrutura HTML do Modal
    function criarEstruturaModal() {
        if (document.getElementById('modal-ficha-clinica-overlay')) return;

        injetarEstilosModal();

        const overlay = document.createElement('div');
        overlay.id = 'modal-ficha-clinica-overlay';
        overlay.className = 'modal-ficha-overlay';
        overlay.onclick = function (e) {
            if (e.target === overlay) fecharModalFichaClinica();
        };

        // Renderização dos cards das seções da Ficha Clínica
        const htmlCardsSecoes = SECOES_FICHA.map(s => {
            let badgeHtml = '';
            if (s.status === 'check') {
                badgeHtml = `<span class="badge-status-wrap badge-status-check">✔ Concluído</span>`;
            } else if (s.status === 'relogio') {
                badgeHtml = `<span class="badge-status-wrap badge-status-relogio">⏳ Em construção</span>`;
            } else {
                badgeHtml = `<span class="badge-status-wrap badge-status-ficha">📋 Ficha</span>`;
            }

            let btnSimulador = '';
            if (s.simuladorUrl) {
                btnSimulador = `
                    <a href="${prefixoRaiz}${s.simuladorUrl}" class="btn-acao-card btn-acao-simulador" onclick="fecharModalFichaClinica()" title="Abrir Simulador Prático">
                        🔬 Abrir Simulador ➔
                    </a>
                `;
            }

            return `
                <div class="card-secao-item" data-busca="${s.numero} ${s.titulo.toLowerCase()} ${s.descricao.toLowerCase()}">
                    <div class="card-secao-topo">
                        <div class="card-secao-numero" style="color: ${s.cor}; border-color: ${s.cor}40;">
                            ${s.numero}
                        </div>
                        <div class="card-secao-titulo-wrap">
                            <div class="card-secao-titulo">
                                <span class="card-secao-titulo-texto">${s.titulo}</span>
                                ${badgeHtml}
                            </div>
                        </div>
                    </div>
                    <div class="card-secao-desc">
                        ${s.descricao}
                    </div>
                    <div class="card-secao-acoes">
                        <a href="${prefixoRaiz}fichaclinica.html#${s.id}" class="btn-acao-card btn-acao-ficha" onclick="fecharModalFichaClinica()">
                            📑 Ir para Seção ➔
                        </a>
                        ${btnSimulador}
                    </div>
                </div>
            `;
        }).join('');

        // Renderização dos cards dos simuladores
        const htmlCardsSimuladores = SIMULADORES_TESTES.map(sim => {
            let badgeHtml = '';
            if (sim.status === 'check') {
                badgeHtml = `<span class="badge-status-wrap badge-status-check">✔ Pronto</span>`;
            } else if (sim.status === 'relogio') {
                badgeHtml = `<span class="badge-status-wrap badge-status-relogio">⏳ Em construção</span>`;
            }

            return `
                <div class="card-secao-item" data-busca="${sim.titulo.toLowerCase()} ${sim.badge.toLowerCase()}">
                    <div class="card-secao-topo">
                        <div class="card-secao-numero" style="border-color: ${sim.cor}40; font-size: 1.15rem;">
                            ${sim.icone}
                        </div>
                        <div class="card-secao-titulo-wrap">
                            <div class="card-secao-titulo">
                                <span class="card-secao-titulo-texto">${sim.titulo}</span>
                                ${badgeHtml}
                            </div>
                        </div>
                    </div>
                    <div class="card-secao-desc">
                        ${sim.badge}
                    </div>
                    <div class="card-secao-acoes">
                        <a href="${prefixoRaiz}${sim.caminho}" class="btn-acao-card btn-acao-simulador" onclick="fecharModalFichaClinica()">
                            🔬 Iniciar Simulador ➔
                        </a>
                    </div>
                </div>
            `;
        }).join('');

        overlay.innerHTML = `
            <div class="modal-ficha-janela">
                <div class="modal-ficha-header">
                    <div class="modal-ficha-title-box">
                        <h3>📋 Menu Clínico & Simuladores</h3>
                        <p>Acesse todas as 21 etapas do exame e simuladores optométricos</p>
                    </div>
                    <button type="button" class="btn-fechar-modal-ficha" onclick="fecharModalFichaClinica()" title="Fechar (Esc)">✕</button>
                </div>

                <div class="modal-ficha-toolbar">
                    <div class="modal-ficha-tabs">
                        <button type="button" id="tab-btn-secoes" class="tab-btn-ficha ativa" onclick="alternarAbaModalFicha('secoes')">
                            📑 Seções da Ficha (${SECOES_FICHA.length})
                        </button>
                        <button type="button" id="tab-btn-simuladores" class="tab-btn-ficha" onclick="alternarAbaModalFicha('simuladores')">
                            🔬 Simuladores (${SIMULADORES_TESTES.length})
                        </button>
                    </div>
                    <div class="modal-busca-box">
                        <span class="modal-busca-icone">🔍</span>
                        <input type="text" id="input-busca-secoes" class="modal-busca-input" placeholder="Filtrar exame ou teste..." oninput="filtrarSecoesModal(this.value)">
                    </div>
                </div>

                <div class="modal-ficha-corpo">
                    <div id="painel-tab-secoes" class="modal-secao-grid">
                        ${htmlCardsSecoes}
                    </div>
                    <div id="painel-tab-simuladores" class="modal-secao-grid" style="display: none;">
                        ${htmlCardsSimuladores}
                    </div>
                </div>

                <div class="modal-ficha-rodape">
                    <span style="font-size: 0.8rem; color: #94A3B8;">💡 Selecione uma etapa para saltar diretamente para a seção correspondente.</span>
                    <a href="${prefixoRaiz}fichaclinica.html" class="btn-ficha-completa">
                        📋 Abrir Ficha Completa ➔
                    </a>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Tecla ESC fecha o modal
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') fecharModalFichaClinica();
        });
    }

    // Filtragem rápida em tempo real das seções do modal
    window.filtrarSecoesModal = function (termo) {
        termo = termo.toLowerCase().trim();
        const itens = document.querySelectorAll('.card-secao-item');
        itens.forEach(item => {
            const dataBusca = item.getAttribute('data-busca') || '';
            if (!termo || dataBusca.includes(termo)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    };

    // Alterna entre abas do modal (Seções da Ficha vs Simuladores)
    window.alternarAbaModalFicha = function (aba) {
        const btnSecoes = document.getElementById('tab-btn-secoes');
        const btnSimuladores = document.getElementById('tab-btn-simuladores');
        const painelSecoes = document.getElementById('painel-tab-secoes');
        const painelSimuladores = document.getElementById('painel-tab-simuladores');
        const inputBusca = document.getElementById('input-busca-secoes');

        if (!btnSecoes || !btnSimuladores || !painelSecoes || !painelSimuladores) return;

        if (inputBusca) {
            inputBusca.value = '';
            filtrarSecoesModal('');
        }

        if (aba === 'secoes') {
            btnSecoes.classList.add('ativa');
            btnSimuladores.classList.remove('ativa');
            painelSecoes.style.display = 'grid';
            painelSimuladores.style.display = 'none';
        } else {
            btnSecoes.classList.remove('ativa');
            btnSimuladores.classList.add('ativa');
            painelSecoes.style.display = 'none';
            painelSimuladores.style.display = 'grid';
        }
    };

    // Abre o Modal
    window.abrirModalFichaClinica = function (e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        criarEstruturaModal();
        const overlay = document.getElementById('modal-ficha-clinica-overlay');
        if (overlay) {
            overlay.classList.add('ativo');
            const inputBusca = document.getElementById('input-busca-secoes');
            if (inputBusca) {
                inputBusca.value = '';
                filtrarSecoesModal('');
                setTimeout(() => inputBusca.focus(), 150);
            }
        }
    };

    // Fecha o Modal
    window.fecharModalFichaClinica = function () {
        const overlay = document.getElementById('modal-ficha-clinica-overlay');
        if (overlay) {
            overlay.classList.remove('ativo');
        }
    };

    // Conecta automaticamente os botões "Ficha Clínica" existentes na página
    function conectarBotoesFichaExistentes() {
        criarEstruturaModal();

        const seletores = [
            'a.btn-switch-sim[href*="fichaclinica.html"]',
            'button.btn-switch-sim[onclick*="fichaclinica"]',
            '#btn-ficha-clinica',
            'a[href*="fichaclinica.html"]:not(.card-secao-link):not(.btn-ficha-completa):not(.btn-acao-ficha):not(.btn-acao-simulador)'
        ];

        seletores.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                // Se não for um link de dentro do próprio modal
                if (!el.closest('.modal-ficha-overlay')) {
                    el.addEventListener('click', function (e) {
                        e.preventDefault();
                        abrirModalFichaClinica(e);
                    });
                }
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', conectarBotoesFichaExistentes);
    } else {
        conectarBotoesFichaExistentes();
    }
})();

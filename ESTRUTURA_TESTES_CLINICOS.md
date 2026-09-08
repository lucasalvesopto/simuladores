# 📋 Matriz Completa de Testes Clínicos Optométricos

> **Documento Oficial de Especificação e Mapeamento de Simuladores Clínicos**  
> *Estrutura pedagógica e clínica para o sistema de simulação optométrica e ficha clínica interativa.*

---

## 🗺️ Visão Geral dos 17 Módulos de Avaliação

| Nº | Módulo Clínico | Tipo de Interação | Módulo no Sistema / Simulador |
|---|---|---|---|
| **1** | **Identificação Pessoal** | Cadastro & Dados Demográficos | `fichaclinica.html` |
| **2** | **Anamnese** | Histórico, Antecedentes e Sintomas | `fichaclinica.html` |
| **3** | **Lensometria** | Medição de Óculos em Uso | `fichaclinica.html` / `Simulador-Lensometria` |
| **4** | **Acuidade Visual** | Snellen (6m), Jaeger (40cm), SC/PH/CC | `Simulador-AcuidadeVisual/` 🟢 |
| **5** | **Motilidade Ocular** | Hirschberg, Kappa, Ducções, Versões, Reflexos | `Simulador-MotilidadeOcular/` |
| **6** | **Biomicroscopia (Lâmpada de Fenda)** | Análise de Anexos e Segmento Anterior | `Simulador-Biomicroscopia/` |
| **7** | **Oftalmoscopia** | Brückner, Fundo de Olho (Papila, Mácula, Vasos) | `Simulador-Oftalmoscopia/` |
| **8** | **Ceratometria** | Curvatura Corneana (K1, K2, Eixo, Miras) | `Simulador-Ceratometria/` 🟢 |
| **9** | **Cover Teste** | Alinhamento e Desvios (VL, 40cm, 20cm, SC/CC) | `CoverTeste/` 🟢 |
| **10** | **Retinoscopia & Refração** | Estática, Mohindra, Subjetivo, Afinamento, ADD | `Simulador-Retinoscopia/` 🟢 |
| **11** | **Forometria & Função Acomodativa** | PPC, RFP, RFN, Amplitude (AA) e Flexibilidade | `Simulador-AmplitudeAcomodacao/` 🟢 <br> `Simulador-FlexibilidadeAcomodativa/` 🟢 |
| **12** | **Visão de Cores** | Teste de Ishihara / Farnsworth | `Simulador-VisaoCores/` |
| **13** | **Tela de Amsler** | Avaliação Macular e Metamorfopsia | `Simulador-Amsler/` |
| **14** | **Estereopsia** | Teste de Titmus / Randot / TNO | `Simulador-Estereopsia/` |
| **15** | **Rx Final (Prescrição)** | Dioptrias (Esf, Cil, Eixo, DNP/DP, ADD, Lente) | `fichaclinica.html` |
| **16** | **Diagnóstico** | Diagnóstico Visual, Motor e Ocular | `fichaclinica.html` |
| **17** | **Conduta** | Conduta Clínica Visual, Motora e Ocular | `fichaclinica.html` |

---

## 1. 🪪 IDENTIFICAÇÃO PESSOAL

* **Data da Avaliação:** `DD/MM/AAAA`
* **Sexo:** Masculino / Feminino
* **Nome Completo:** Texto
* **RG / Documento:** Texto
* **Idade:** Numérico
* **Data de Nascimento:** `DD/MM/AAAA`
* **Profissão / Ocupação:** Texto
* **Endereço Completo:** Texto
* **Origem / Procedência:** Texto
* **Telefone de Contato:** Telefone / Celular
* **Passatempo / Atividades Visuais:** Texto
* **Nome do Responsável:** (se menor ou dependente)
* **Data do Último Exame Visual:** `DD/MM/AAAA` ou "Nunca realizou"
* **Encaminhado por:** Profissional / Instituição
* **Ajuda Óptica Prescrita Anteriormente:** Sim / Não / Detalhes

---

## 2. 🩺 ANAMNESE

### 2.1 Queixa Principal
* **MC (Motivo da Consulta):** Relato livre do paciente
* **Tempo de Queixa:** Início e evolução dos sintomas

### 2.2 Antecedentes Pessoais e Familiares Gerais (P / F / Tratamento)
* **Vasculares:** Hipertensão, cardiopatias, etc.
* **Diabetes:** Tipo 1, Tipo 2, controle glicêmico.
* **Imunes:** Doenças autoimunes, artrite, lúpus, etc.
* **Neurológico:** AVC, enxaqueca, convulsões, etc.
* **Outros:** Especificar
* **OBS / Medicamentos em Uso:** Observações clínicas gerais

### 2.3 Antecedentes Pessoais e Familiares Oculares (P / F / Tratamento)
* Trauma Ocular
* Corpo Estranho
* Queimaduras Oculares
* Histórico Cirúrgico Ocular
* Inflamações (Uveíte, Blefarite, etc.)
* Catarata
* Cegueira
* Descolamento de Retina
* Glaucoma
* Toxoplasmose Ocular
* Estrabismo
* Processos Alérgicos Oculares
* Pterígio
* Defeito de Refração (Miopia, Hipermetropia, Astigmatismo, Presbiopia)
* Outros (especifique)

### 2.4 Sintomas Referidos (Sinalização Sim / Não)
| Sintoma | Descrição Clínica |
|---|---|
| **Visão Borrada** | Longe, Perto ou ambas |
| **Cefaleia** | Frontal, temporal, occipital, matutina ou vespertina |
| **Lacrimejamento** | Epífora constante ou esporádica |
| **Hiperemia** | Olho vermelho difuso ou ciliar |
| **Astenopia** | Cansaço e fadiga visual após esforço |
| **Dor Ocular** | Dor profunda, superficial ou à movimentação |
| **Ardência** | Sensação de queimação ocular |
| **Secreção** | Aquosa, mucosa ou purulenta |
| **Diplopia** | Visão dupla monocular ou binocular |
| **Prurido** | Coceira nos olhos |
| **Fotopsias / Fosfenos** | Flashes luminosos ou faíscas na visão |
| **Fotofobia** | Sensibilidade excessiva à luz |
| **Miodesopsias** | Moscas volantes / pontos flutuantes |
| **Halos** | Halos coloridos ao redor de fontes luminosas |
| **Enxaqueca** | Com ou sem aura visual |
| **Estrabismo** | Desvio ocular perceptível |
| **Outros** | Especificar |

---

## 3. 🔬 LENSOMETRIA

Medição das lentes em uso atual pelo paciente:

* **Parâmetros por Olho:**
  $$\text{Olho} \quad|\quad \text{Esférico (Esf)} \quad|\quad \text{Cilíndrico (Cil)} \quad|\quad \text{Eixo (º)} \quad|\quad \text{Adição (ADD)} \quad|\quad \text{Prisma} \quad|\quad \text{Base}$$

* **Medições Realizadas:**
  * **OD - VL:** Olho Direito para Visão de Longe
  * **OE - VL:** Olho Esquerdo para Visão de Longe
  * **OD - VP:** Olho Direito para Visão de Perto
  * **OE - VP:** Olho Esquerdo para Visão de Perto

---

## 4. 👁️ ACUIDADE VISUAL *(Implementado no Simulador)*

* **Tipo de Optotipo Utilizado:** Letras Snellen / Números Jaeger / Direcional 'E' / Símbolos Infantis
* **Visão de Longe (VL - 6 metros):**
  * **OD (Olho Direito):** Sem Correção (**SC**) | Com Furo Estenopeico (**PH**) | Com Correção (**CC**)
  * **OE (Olho Esquerdo):** Sem Correção (**SC**) | Com Furo Estenopeico (**PH**) | Com Correção (**CC**)
  * **AO (Ambos os Olhos):** Sem Correção (**SC**) | Com Furo Estenopeico (**PH**) | Com Correção (**CC**)
* **Visão de Perto (VP - 40 cm):**
  * **OD (Olho Direito):** Sem Correção (**SC**) | Com Correção (**CC**)
  * **OE (Olho Esquerdo):** Sem Correção (**SC**) | Com Correção (**CC**)
  * **AO (Ambos os Olhos):** Sem Correção (**SC**) | Com Correção (**CC**)

---

## 5. 🎯 MOTILIDADE OCULAR

* **Teste de Kappa:** Ângulo Kappa OD / OE (Positivo, Negativo, Zero)
* **Teste de Hirschberg:** Reflexo corneano corneal centrado, nasal ou temporal
* **Ducções (Monocular):**
  * OD: Dextrodução, Levodrução, Supradrução, Infradrução
  * OE: Dextrodução, Levodrução, Supradrução, Infradrução
* **Versões (Binocular):**
  * Dextroversão, Levoversão, Supraversão, Infraversão, Dextrosupraversão, Levosupraversão, Dextroinfraversão, Levoinfraversão
* **Reflexos Pupilares e Balanço Sensório-Motor:**
  * **Fotomotor Direto:** OD / OE (Normorreativo, Hiporreativo, Arreativo)
  * **Consensual / Indireto:** OD / OE
  * **Acomodativo / Proximidade:** OD / OE (Miose sincinética na convergência)
  * **Balanço Pupilar:** `PIRRLA` (Pupilas Isocóricas, Redondas, Reativas à Luz e Acomodação) / `NMG` (Defeito Pupilar Aferente Relativo / Marcus Gunn)
* **Observações:** Nistagmo, limitações musculares ou paresias.

---

## 6. 🔬 BIOMICROSCOPIA COM LÂMPADA DE FENDA

Avaliação detalhada das estruturas do segmento anterior:

* **Estruturas Avaliadas (OD / OE):**
  1. **Sobrancelhas:** Densidade, integridade, lesões.
  2. **Cílios:** Triquíase, madarose, blefarite.
  3. **Pálpebras:** Posição, entrópio, ectrópio, ptose, meibomite.
  4. **Conjuntiva:** Bulbar, tarsal, fórnice, hiperemia, folículos, papilas.
  5. **Esclerótica:** Coloração, episclerite, esclerite.
  6. **Córneas:** Transparência, integridade epitelial, ceratite, leucomas, BUT (Break-Up Time).
  7. **Íris:** Cor, padrão criptal, sinequias anteriores/posteriores, coloboma.
  8. **Cristalino:** Transparência, opacidades, catarata (nuclear, cortical, subcapsular).
  9. **Câmara Anterior:** Profundidade (Van Herick), transparência (Tyndall / Flare ausente/presente).
* **Esquema Gráfico Ocular:** Desenho esquemático de achados OD e OE
* **Observações:** Detalhes de biomicroscopia e testes com fluoresceína.

---

## 7. 🔦 OFTALMOSCOPIA (FUNDO DE OLHO)

* **Teste de Brückner:** Avaliação do reflexo vermelho binocular simultâneo
* **Avaliação do Fundo de Olho (OD / OE):**
  * **Papila / Disco Óptico:** Limites, formato, bordas nítidas/elevadas.
  * **Escavação:** Relação E/D (ex: 0.2, 0.3, 0.6, assimétrica).
  * **Mácula:** Brilho foveal presente/ausente, aspecto, edema, drusas.
  * **Fixação:** Central, foveal, estável / excêntrica.
  * **Relação A/V (Artéria/Veia):** Padrão normal (2/3), cruzamentos patológicos, tortuosidade.
  * **Cor da Retina:** Normal, pálida, acinzentada, pigmentações.
  * **Lente Utilizada:** Dioptrias da cabeça do oftalmoscópio para foco.

---

## 8. 📐 CERATOMETRIA *(Implementado no Simulador)*

* **Medições:**
  * **OD:** K1 (Dioptria e Eixo) | K2 (Dioptria e Eixo) | Astigmatismo Corneano ($\Delta K$)
  * **OE:** K1 (Dioptria e Eixo) | K2 (Dioptria e Eixo) | Astigmatismo Corneano ($\Delta K$)
* **Tipo de Ceratometria:** A favor da regra (WTR), Contra a regra (ATR), Oblíquo, Irregular
* **Qualidade das Miras:** Nítidas, distorcidas, ovais, pulsáteis
* **Observações:** Relação com ceratocone, ectasias ou cirurgia refrativa.

---

## 9. 🔲 COVER TESTE *(Implementado no Simulador)*

* **Métodos:** Unilateral (Detecção de Tropias) / Alternado (Quantificação de Forias)
* **Distâncias e Condições de Teste:**
  * **Visão de Longe (VL - 6m):** Sem Correção (**SC**) / Com Correção (**CC**)
  * **Visão Intermediária (40 cm):** Sem Correção (**SC**) / Com Correção (**CC**)
  * **Visão de Perto Crítica (20 cm):** Sem Correção (**SC**) / Com Correção (**CC**)
* **Resultados Registrados:**
  * Ortoforia / Ortotropia
  * Endoforia / Endotropia ($E / ET$) com valor em dioptrias prismáticas ($\Delta$)
  * Exoforia / Exotropia ($X / XT$) com valor em dioptrias prismáticas ($\Delta$)
  * Hiperforia / Hipertropia ($H / HT$) OD/OE

---

## 10. 🎯 RETINOSCOPIA & REFRAÇÃO SUBJETIVA *(Implementado no Simulador)*

* **Retinoscopia Estática (6m):**
  * OD: Esf. | Cil. | Eixo $\rightarrow$ AV alcançada
  * OE: Esf. | Cil. | Eixo $\rightarrow$ AV alcançada
* **Retinoscopia Dinâmica de Mohindra (Sem cicloplegia / Perto no escuro):**
  * OD: Esf. | Cil. | Eixo | Fator de correção ($-1.25$ D)
  * OE: Esf. | Cil. | Eixo | Fator de correção ($-1.25$ D)
* **Refração Subjetiva (Monocular e Binocular):**
  * Teste do Vermelho/Verde (Bicromático)
  * Cilindro Cruzado de Jackson (JCC) para Eixo e Potência
* **Afinamento:**
  * Balanço Biocular / Binocular
  * Confirmação da melhor esfera e cilindro
* **Adição (ADD):**
  * Cilindros Cruzados Fundidos (FCC)
  * Adição em função da idade / tabela de meia amplitude $\rightarrow$ AV Perto (J1)

---

## 11. ⚖️ FOROMETRIA & FUNÇÃO ACOMODATIVA *(Implementado no Simulador)*

* **PPC (Ponto Próximo de Convergência):**
  * Estímulo Objeto Real (**OR**): Quebra / Recuperação (cm)
  * Estímulo **Luz**: Quebra / Recuperação (cm)
  * Estímulo **Filtro Vermelho**: Quebra / Recuperação (cm)
* **Reservas Fusionais:**
  * **RFP (Reserva Fusional Positiva / Base Temporal):** VL e VP (Borrão / Quebra / Recuperação)
  * **RFN (Reserva Fusional Negativa / Base Nasal):** VL e VP (Borrão / Quebra / Recuperação)
* **AA (Amplitude de Acomodação - Donders / Sheard):**
  * OD: Dioptrias (D)
  * OE: Dioptrias (D)
  * AO: Dioptrias (D)
  * Comparação com a fórmula de Hofstetter: $\text{AA esperada} = 18.5 - 0.3 \times \text{Idade}$
* **Flexibilidade Acomodativa (Flipper $\pm 2.00$ D a 40 cm):**
  * OD: Ciclos por Minuto (cpm)
  * OE: Ciclos por Minuto (cpm)
  * AO: Ciclos por Minuto (cpm) e dificuldade (+ / -)
* **Nível Visual / Dt:** Distância de trabalho

---

## 12. 🎨 VISÃO DE CORES

* **Tabelas Utilizadas:** Ishihara (14 / 24 / 38 Pranchas)
* **Avaliação Monocular:**
  * **OD:** Nº de acertos / total de pranchas
  * **OE:** Nº de acertos / total de pranchas
* **Interpretação Diagnóstica:**
  * Normal (Tricromata Típico)
  * Protanopia / Protanomalia (Defeito no Vermelho)
  * Deuteranopia / Deuteranomalia (Defeito no Verde)
  * Tritanopia / Tritanomalia (Defeito no Azul)
  * Acromatopsia (Monocromasia)

---

## 13. 🏁 TELA DE AMSLER

* **Avaliação da Retina Central (10º centrais):**
  * **OD:** Normal / Metamorfopsia / Escotoma Relativo / Escotoma Absoluto
  * **OE:** Normal / Metamorfopsia / Escotoma Relativo / Escotoma Absoluto
* **Localização e Desenho:** Mapeamento do quadrante afetado

---

## 14. 🕶️ ESTEREOPSIA

* **Teste Selecionado:** Titmus Stereo Fly / Randot / TNO / Lang
* **Medição em Segundos de Arco ($''$):**
  * Mosca / Formas grosseiras ($3000''$)
  * Animais / Símbolos ($400''$ a $100''$)
  * Círculos Graduados ($800''$ a $40''$ de arco)
* **Desempenho:** OD / OE / Binocular

---

## 15. 👓 PRESCRIÇÃO FINAL (RX FINAL)

* **Graduação Óptica Recomendada:**
  * **OD:** Esférico | Cilíndrico | Eixo | AV Longe | AV Perto
  * **OE:** Esférico | Cilíndrico | Eixo | AV Longe | AV Perto
  * **Adição (ADD):** Dioptrias (D) para perto
  * **DNP / DP:** Distância Naso-Pupilar OD / OE e Distância Pupilar total
* **Especificações das Lentes:**
  * **Material:** Resina CR-39 / Policarbonato / Trivex / Alto Índice (1.67, 1.74)
  * **Filtros e Tratamentos:** Antirreflexo, Filtro Azul (Blue UV), Fotossensível (Transitions)
  * **Tipo de Desenho:** Visão Simples (Longe/Perto), Bifocal, Multifocal / Progressivo
  * **Observações para o Laboratório:** Altura de montagem, curva base, prisma prescrito

---

## 16. 🩺 DIAGNÓSTICO CLÍNICO INTEGRADO

* **Diagnóstico Visual:**
  * Emétrope, Miopia simples/composta, Hipermetropia simples/composta, Astigmatismo misto, Presbiopia, Ambliopia (estrábica, refracional, privação).
* **Diagnóstico Motor:**
  * Ortoforia, Insuficiência de Convergência, Excesso de Convergência, Insuficiência de Divergência, Foria Descompensada, Tropia manifesta.
* **Diagnóstico Ocular / Patológico:**
  * Segmento anterior e posterior normais / patologia identificada (olho seco, blefarite, suspeita de glaucoma, catarata, etc.).

---

## 17. 💊 CONDUTA CLÍNICA & CONDUTA TERAPÊUTICA

* **Conduta Visual:**
  * Prescrição de óculos com compensação óptica total/parcial, lentes de contato, auxílios ópticos especiais ou manutenção do Rx atual.
* **Conduta Motora / Funcional:**
  * Terapia visual comportamental / ortóptica (exercícios acomodativos, convergência, prismas de alívio).
* **Conduta Ocular / Encaminhamento:**
  * Higiene palpebral, lágrimas artificiais, pausas ergonômicas (Regra 20-20-20) e/ou encaminhamento médico oftalmológico para especialidade correspondente.

---

> 🚀 **Desenvolvido para os Simuladores Interativos de Ensino de Optometria - Prof. Lucas**

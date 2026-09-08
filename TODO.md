# 📋 Lista de Tarefas e Melhorias (TODO)

Este documento centraliza as tarefas pendentes, em andamento e concluídas para o ecossistema de simuladores clínicos integrados à [Ficha Clínica](fichaclinica.html).

---

## 🎯 Prioridade Imediata: Ceratometria

- [x] Adicionar seção de Ceratometria na Ficha Clínica (`fichaclinica.html`).
- [x] Suporte aos dados de OD e OE no `localStorage` (`pacienteData.ceratometria`).
- [x] Adicionar Toggle Switch OD / OE no Simulador de Ceratometria (`Simulador-Ceratometria`).
- [x] Leitura dinâmica e aplicação dos dados de OD e OE ao alternar o toggle.
- [ ] **Implementar Mecânica Completa do Eixo na Ceratometria**:
  - [ ] Implementar rotação óptica realista das miras no ceratômetro com base no valor de eixo do paciente (0° a 180°).
  - [ ] Calcular desalinhamento tangencial/rotacional quando o tambor de eixo não coincidir com o eixo principal do paciente.
  - [ ] Habilitar configuração e sorteio de eixos oblíquos na Ficha Clínica para OD e OE (atualmente fixos em 180°).
  - [ ] Sincronizar o tambor de eixo do simulador com o valor real do paciente.

---

## 🌐 Integrações com a Ficha Clínica (`fichaclinica.html`)

### 1. Amplitude de Acomodação (Sheard & Donders)
- [x] Leitura de dados de acomodação (OD / OE) e histerese (recobro) na Armação de Prova.
- [x] Leitura de dados de acomodação no Foróptero Greens.
- [ ] Botão de exportar resultado medido pelo aluno de volta para a ficha clínica.

### 2. Ceratometria
- [x] Registro de K1, K2 e cálculo de astigmatismo corneano.
- [x] Sincronização OD / OE via toggle no simulador.
- [ ] Sincronização dinâmica de eixo.

### 3. Flexibilidade Acomodativa (Flipper Acomodativo)
- [x] Criação da pasta `FlexibilidadeAcomodativa` e organização dos arquivos de imagem (`flipper.svg`).
- [x] Limpeza e remoção das variáveis/lógicas herdadas de Amplitude de Acomodação.
- [ ] Implementar o elemento visual do Flipper (+2.00 / -2.00 D) na interface com controle de rotação/flip.
- [ ] Mecânica de teste Monocular (OD / OE com oclusor) e Binocular (OU).
- [ ] Cronômetro integrado de 60 segundos com contador de ciclos por minuto (**cpm**).
- [ ] Lógica de tempo de resposta/clareamento do paciente ("ficou nítido") e efeito de fadiga acomodativa.
- [ ] Criar seção de Flexibilidade Acomodativa (Monocular OD/OE e Binocular OU) na Ficha Clínica (`fichaclinica.html`).
- [x] Adicionar card do simulador de Flexibilidade Acomodativa no menu principal (`index.html`).

### 4. Retinoscopia
- [x] Criação da pasta `Simulador-Retinoscopia` a partir da base padronizada (Armação de Prova & Greens).
- [x] Mapeamento vetorial exato das pupilas via `SVG clipPath` (`OD: M5770.46...` e `OE: M15091.27...` em viewBox `21000x29700`).
- [ ] Criar seção de Retinoscopia (Estática / Dinâmica / Distância de Trabalho) na Ficha Clínica (`fichaclinica.html`).
- [ ] Implementar a mecânica visual da faixa luminosa do retinoscópio (movimento com/contra, espessura da faixa, brilho e neutralização).
- [x] Conectar reflexos dióptricos e eixos aos dados do paciente no `localStorage` (`pacienteData.rxOD` e `pacienteData.rxOE`).
- [x] Integração completa das 12 lentes acessórias com passos de 30 graus no Foróptero de Greens (1: Lente Zero, 2: Oclusor, 3: ±0.50, 4: 6ΔBU/10ΔBD, 5: PH, 6: ±0.12, 7: Mira, 8: RL/GL, 9: WMH, 10: WMV, 11: P, 12: R +2.00 D).
- [ ] Salvar resultado encontrado pelo aluno.

### 5. Cover Test
- [ ] Criar seção de Motilidade Ocular / Cover Test na Ficha Clínica (Ortoforia, Endo, Exo, Hiper, Hipo).
- [ ] Conectar desvios e movimentos do paciente ao simulador de Cover Test.

### 6. Exame Subjetivo e Afinamento
- [ ] Criar seção de Refração Subjetiva e Acuidade Visual na Ficha Clínica.
- [ ] Integrar respostas visuais do paciente às lentes colocadas no refrator.

---

## 🛠️ Melhorias Gerais de UX e Usabilidade
- [ ] Botão de "Importar / Exportar Ficha em JSON" para salvar casos clínicos de pacientes pré-configurados.
- [ ] Modo Avaliação / Gabarito Oculto (onde o aluno não vê os dados reais antes de concluir o exame).
- [ ] Relatório de desempenho comparando o resultado medido pelo aluno com o gabarito do paciente.

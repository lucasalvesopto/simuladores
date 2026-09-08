# 📦 Template Base para Novos Simuladores (Caixa de Prova & Greens)

Esta pasta serve como **modelo base padronizado e limpo** para a criação de novos simuladores ópticos e exames clínicos no ecossistema.

---

## 📂 Conteúdo do Template

1. **Armação e Caixa de Provas**:
   - [`index.html`](index.html): Interface com maleta de lentes esféricas, cilíndricas, óculos de prova e cartela de acuidade visual.
   - [`comandos.js`](comandos.js): Lógica de arrastar e soltar lentes na armação, rotação de eixo e cálculo visual neutro.

2. **Foróptero Greens**:
   - [`greens.html`](greens.html): Interface com o refrator Greens interativo.
   - [`greens.js`](greens.js): Controles de esférico, cilíndrico, eixo, lentes acessórias (aberto/oclusor), CCJ e prismas de Risley.

3. **Recursos Visuais**:
   - [`Imagens/`](Imagens/): SVGs e texturas de alta definição para óculos, Greens, lentes e paciente.

---

## 🚀 Como criar um novo simulador a partir desta base

1. **Copiar a pasta** `Base com Caixa de Prova` com o nome do novo exame (ex: `NovoExame/`).
2. **Personalizar**:
   - O `<title>` em `index.html` e `greens.html`.
   - Adicionar os parâmetros específicos do exame no JavaScript (`comandos.js` e `greens.js`).
   - Implementar a mecânica óptica ou comportamental do teste na função `calcularVisao()`.
3. **Conectar à Ficha Clínica**:
   - Ler os dados do paciente em `localStorage.getItem('pacienteData')`.
   - Criar os campos correspondentes na [fichaclinica.html](../fichaclinica.html).

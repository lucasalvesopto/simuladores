// ui.js - Gerencia exclusivamente a estética da interface (Tambores 3D e Knobs)
// A lógica matemática da simulação ótica permanece em comandos.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Gerar números dos tambores
    gerarTrilhaTambor('track-vert', 36, 52, 0.25);
    gerarTrilhaTambor('track-horiz', 36, 52, 0.25);
    gerarTrilhaTambor('track-eixo', -90, 90, 5, true); // O tambor visual do eixo mostra números de 5 em 5

    // 2. Sincronizar Tambores com Sliders Invisíveis
    sincronizarTamborVertical('vertical-range', 'track-vert');
    sincronizarTamborVertical('horizontal-range', 'track-horiz');
    sincronizarTamborHorizontal('eixo-range', 'track-eixo');

    // 3. Sincronizar Botões Giratórios (Knobs) com Sliders Invisíveis
    sincronizarKnob('ocular-range', 'knob-ocular');
    sincronizarKnob('altura-range', 'knob-altura');
    sincronizarKnob('queixeira-range', 'knob-queixeira');
    sincronizarKnob('foco-range', 'knob-foco');

    // Sincronizar Círculo do Joystick Lateral
    sincronizarSliderLateral('lateral-range', 'thumb-lateral');

    // 4. Habilitar Scroll do Mouse em todos os controles
    habilitarScrollMouse('vertical-range');
    habilitarScrollMouse('horizontal-range');
    habilitarScrollMouse('eixo-range');
    habilitarScrollMouse('ocular-range');
    habilitarScrollMouse('altura-range');
    habilitarScrollMouse('queixeira-range');
    habilitarScrollMouse('foco-range');
});

// Permite usar a rodinha do mouse para girar tambores e botões
function habilitarScrollMouse(sliderId) {
    const slider = document.getElementById(sliderId);
    if (!slider) return;

    slider.addEventListener('wheel', (e) => {
        e.preventDefault(); // Impede a página de rolar
        const step = parseFloat(slider.step) || 1;
        let val = parseFloat(slider.value);
        
        if (e.deltaY < 0) {
            val += step; // Rolou para cima: aumenta
        } else {
            val -= step; // Rolou para baixo: diminui
        }
        
        // Mantém dentro dos limites min/max
        val = Math.max(parseFloat(slider.min), Math.min(parseFloat(slider.max), val));
        
        slider.value = val;
        // Dispara o evento de input para a interface e a ótica se atualizarem
        slider.dispatchEvent(new Event('input'));
    });
}

function gerarTrilhaTambor(trackId, min, max, step, isHorizontal = false) {
    const track = document.getElementById(trackId);
    if (!track) return;
    
    for (let i = min; i <= max; i += step) {
        const div = document.createElement('div');
        div.className = 'drum-tick';
        
        let texto = isHorizontal ? i.toString() : i.toFixed(2);
        
        // Se for 0 no eixo, adicionar um destaque
        if (isHorizontal && i === 0) {
            div.style.color = '#ea580c';
            div.style.fontWeight = 'bold';
        }
        
        div.textContent = texto;
        track.appendChild(div);
    }
}

function sincronizarTamborVertical(sliderId, trackId) {
    const slider = document.getElementById(sliderId);
    const track = document.getElementById(trackId);
    if (!slider || !track) return;

    // Altura de cada número definida no CSS é 30px
    const tickHeight = 30;

    function atualizar() {
        const val = parseFloat(slider.value);
        const min = parseFloat(slider.min);
        const step = parseFloat(slider.step);
        
        // Quantos steps visuais existem entre o valor atual e o mínimo
        const stepsDiff = (val - min) / step;
        
        // O offset é negativo para rolar a fita para cima conforme o valor aumenta
        const offset = -(stepsDiff * tickHeight);
        
        track.style.transform = `translateY(${offset}px)`;
    }

    slider.addEventListener('input', atualizar);
    // Pequeno delay para garantir que o CSS renderizou o layout
    setTimeout(atualizar, 50); 
}

function sincronizarTamborHorizontal(sliderId, trackId) {
    const slider = document.getElementById(sliderId);
    const track = document.getElementById(trackId);
    if (!slider || !track) return;

    // Largura de cada número definida no CSS é 50px
    const tickWidth = 50; 
    
    function atualizar() {
        const val = parseFloat(slider.value);
        const min = parseFloat(slider.min);
        
        // O slider original tem step 1, mas desenhamos números de 5 em 5 no HTML.
        // O cálculo fracionário permite rolagem super suave a cada 1 grau.
        const stepsDiff = (val - min) / 5; 
        const offset = -(stepsDiff * tickWidth);
        
        track.style.transform = `translateX(${offset}px)`;
    }

    slider.addEventListener('input', atualizar);
    setTimeout(atualizar, 50); 
}

function sincronizarKnob(sliderId, knobId) {
    const slider = document.getElementById(sliderId);
    const knob = document.getElementById(knobId);
    if (!slider || !knob) return;

    function atualizar() {
        const val = parseFloat(slider.value);
        const min = parseFloat(slider.min);
        const max = parseFloat(slider.max);
        
        // Mapear de min..max para -135deg..135deg (giro de 270 graus estilo potenciômetro)
        const range = max - min;
        const percent = (val - min) / range;
        const graus = -135 + (percent * 270);
        
        knob.style.transform = `rotate(${graus}deg)`;
    }

    slider.addEventListener('input', atualizar);
    setTimeout(atualizar, 50); 
}

function sincronizarSliderLateral(sliderId, thumbId) {
    const slider = document.getElementById(sliderId);
    const thumb = document.getElementById(thumbId);
    if (!slider || !thumb) return;

    function atualizar() {
        const val = parseFloat(slider.value);
        const min = parseFloat(slider.min);
        const max = parseFloat(slider.max);
        
        // Posição percentual (0 a 100%)
        const percent = ((val - min) / (max - min)) * 100;
        
        // O transform: translate(-50%, -50%) no CSS garante que o centro do círculo alinhe
        thumb.style.left = `${percent}%`;
    }

    slider.addEventListener('input', atualizar);
    setTimeout(atualizar, 50);
}

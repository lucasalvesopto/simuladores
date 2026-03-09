
(function () {
    // FORCE ALERT TO CONFIRM EXECUTION
    alert("MODO DESIGNER ATIVADO! \nSe ver esta mensagem, o script carregou. \nClique OK para continuar.");
    console.log("Designer Mode 4.0 Started");

    // 1. Check if already injected
    if (document.getElementById('designer-toggle-btn')) return;

    // 2. Setup Base References
    const container = document.getElementById('app-container') || document.body;
    const baseWidth = 1920;
    const baseHeight = 1080;

    // 3. State
    let selectedElement = null;
    let draggableElements = [];
    let isResizing = false;

    // 4. Keyboard Shortcut (Spacebar)
    document.addEventListener('keydown', (e) => {
        // Toggle panel on Spacebar, provided we aren't typing in an input
        if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault(); // Prevent scrolling
            togglePanel();
        }
    });

    function togglePanel() {
        const panel = document.getElementById('designer-panel');
        if (panel) {
            panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
        }
    }

    // 5. UI Construction
    // Toggle Button (Top Right) - Increased Z-Index and Size
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'designer-toggle-btn';
    toggleBtn.innerHTML = '🛠️';
    toggleBtn.title = "Abrir Painel (Ou aperte ESPAÇO)";
    toggleBtn.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 2147483647; /* Max Z-Index */
        font-size: 30px;
        background: #e74c3c;
        color: white;
        border: 3px solid white;
        border-radius: 50%;
        width: 60px;
        height: 60px;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    toggleBtn.addEventListener('click', togglePanel);
    document.body.appendChild(toggleBtn);

    // Main Panel (Modal)
    const panel = document.createElement('div');
    panel.id = 'designer-panel';
    panel.style.cssText = `
        position: fixed;
        right: 90px;
        top: 20px;
        bottom: 20px;
        width: 350px;
        background: rgba(30, 39, 46, 0.98);
        color: white;
        z-index: 2147483647;
        font-family: 'Segoe UI', monospace;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 0 30px rgba(0,0,0,0.7);
        display: flex; 
        flex-direction: column;
        gap: 15px;
        border: 1px solid #57606f;
    `;
    // Open by default
    panel.style.display = 'flex';

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    const title = document.createElement('h3');
    title.innerText = "Modo Designer 4.0";
    title.style.margin = "0";
    title.style.color = "#00d2d3";
    const closeBtn = document.createElement('button');
    closeBtn.innerText = "❌";
    closeBtn.style.background = "transparent";
    closeBtn.style.border = "none";
    closeBtn.style.color = "white";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.fontSize = "18px";
    closeBtn.addEventListener('click', () => panel.style.display = 'none');
    header.appendChild(title);
    header.appendChild(closeBtn);
    panel.appendChild(header);

    // Helper text
    const helpText = document.createElement('div');
    helpText.innerText = "Espaço: Abrir/Fechar | Shift+Arrastar: Redimensionar";
    helpText.style.fontSize = "11px";
    helpText.style.color = "#bdc3c7";
    panel.appendChild(helpText);

    // Property Inputs
    const propsContainer = document.createElement('div');
    propsContainer.style.background = 'rgba(255,255,255,0.05)';
    propsContainer.style.padding = '10px';
    propsContainer.style.borderRadius = '8px';

    const propTypes = ['Left', 'Top', 'Width', 'Height'];
    const inputs = {};

    propTypes.forEach(prop => {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.alignItems = 'center';
        row.style.marginBottom = '8px';

        const label = document.createElement('label');
        label.innerText = prop + ' (%)';
        label.style.fontSize = '13px';
        label.style.width = '80px';

        const input = document.createElement('input');
        input.type = 'number';
        input.step = '0.01';
        input.style.width = '100px';
        input.style.padding = '6px';
        input.style.background = '#2f3542';
        input.style.border = '1px solid #57606f';
        input.style.color = '#fff';
        input.style.borderRadius = '4px';

        input.addEventListener('input', (e) => {
            if (selectedElement) {
                updateElementFromInput(prop.toLowerCase(), parseFloat(e.target.value));
            }
        });

        inputs[prop.toLowerCase()] = input;
        row.appendChild(label);
        row.appendChild(input);
        propsContainer.appendChild(row);
    });
    panel.appendChild(propsContainer);

    // Element List Title
    const listTitle = document.createElement('div');
    listTitle.innerHTML = "<b>Elementos da Página</b> <small>(Selecione para editar)</small>";
    listTitle.style.fontSize = "13px";
    listTitle.style.marginTop = "10px";
    panel.appendChild(listTitle);

    // Element List
    const listContainer = document.createElement('div');
    listContainer.style.flex = '1';
    listContainer.style.overflowY = 'auto';
    listContainer.style.background = '#2f3542';
    listContainer.style.borderRadius = '6px';
    listContainer.style.border = '1px solid #57606f';
    panel.appendChild(listContainer);

    // Generate Button
    const genBtn = document.createElement('button');
    genBtn.innerText = "💾 SALVAR (Copiar CSS)";
    genBtn.style.cssText = `
        padding: 15px;
        background: #e67e22;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        font-size: 14px;
        margin-top: 5px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
    `;
    genBtn.addEventListener('click', generateCSS);
    panel.appendChild(genBtn);

    document.body.appendChild(panel);

    // 6. Initialize Elements (BROAD SELECTION)
    function initElements() {
        listContainer.innerHTML = '';
        draggableElements = [];

        // Exclude UI itself
        const excludeIds = ['designer-panel', 'designer-toggle-btn', 'app-container'];
        const excludeTags = ['SCRIPT', 'STYLE', 'HEAD', 'META', 'TITLE', 'LINK', 'BR'];

        // Recursive or Select All?
        // Let's use Select All Descendants of container
        const allNodes = container.querySelectorAll('*');

        allNodes.forEach(el => {
            if (excludeIds.includes(el.id)) return;
            if (excludeTags.includes(el.tagName)) return;
            if (el.closest('#designer-panel')) return;
            if (el.closest('#designer-toggle-btn')) return;

            // Only consider elements that have some dimension or are likely UI elements
            const style = window.getComputedStyle(el);
            if (style.display === 'none' && el.tagName !== 'IMG' && !el.id) return; // Skip hidden unnamed fluff

            if (['IMG', 'BUTTON', 'INPUT', 'TABLE', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'LABEL'].includes(el.tagName)) {

                // Avoid selecting table guts
                if (el.tagName === 'TD' || el.tagName === 'TR' || el.tagName === 'TBODY' || el.tagName === 'THEAD' || el.tagName === 'TH') return;

                if (el.closest('#tabela') && el.id !== 'tabela') return; // Don't break table internals
                if (el.closest('#tabela2') && el.id !== 'tabela2') return;

                makeDraggable(el);
                draggableElements.push(el);
                addToPanelList(el);
            }
        });
    }

    function addToPanelList(el) {
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.padding = '8px';
        item.style.borderBottom = '1px solid #444';
        item.style.fontSize = '12px';
        item.style.cursor = 'pointer';

        // Visibility Toggle
        const eyeBtn = document.createElement('span');
        eyeBtn.innerText = el.style.display === 'none' ? '🙈' : '👁️';
        eyeBtn.style.marginRight = '10px';
        eyeBtn.style.minWidth = '20px';
        eyeBtn.onclick = (e) => {
            e.stopPropagation();
            if (el.style.display === 'none') {
                el.style.display = '';
                eyeBtn.innerText = '👁️';
            } else {
                el.style.display = 'none';
                eyeBtn.innerText = '🙈';
            }
        };
        item.appendChild(eyeBtn);

        // Name
        const nameSpan = document.createElement('span');
        nameSpan.innerText = getFriendlyName(el);
        nameSpan.style.flex = '1';
        nameSpan.onclick = () => selectElement(el);
        item.appendChild(nameSpan);

        el._listItem = item;
        listContainer.appendChild(item);
    }

    function getFriendlyName(el) {
        if (el.id) return `#${el.id}`;
        if (el.tagName === 'IMG') {
            const src = el.getAttribute('src');
            return 'IMG: ' + (src ? src.split('/').pop() : 'No Src');
        }
        if (el.innerText && el.innerText.length < 20) return `${el.tagName}: ${el.innerText}`;
        if (el.className) return `.${el.className}`;
        return `${el.tagName} (No ID)`;
    }

    // 7. Interaction Logic
    function selectElement(el) {
        if (selectedElement) {
            selectedElement.style.outline = 'none';
            selectedElement.style.boxShadow = 'none';
            if (selectedElement._listItem) selectedElement._listItem.style.background = 'transparent';
        }

        selectedElement = el;

        // Ensure absolute if not already
        const style = window.getComputedStyle(el);
        if (style.position !== 'absolute' && style.position !== 'fixed') {
            // Convert to absolute at current position?
            const scale = getCurrentScale();
            const containerRect = container.getBoundingClientRect();
            const rect = el.getBoundingClientRect();

            el.style.position = 'absolute';
            el.style.left = (((rect.left - containerRect.left) / scale / baseWidth) * 100) + '%';
            el.style.top = (((rect.top - containerRect.top) / scale / baseHeight) * 100) + '%';
            el.style.width = ((rect.width / scale / baseWidth) * 100) + '%';

            console.log("Converted " + el.tagName + " to absolute");
        }

        if (el._listItem) {
            el._listItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            el._listItem.style.background = '#2980b9';
        }

        el.style.outline = '3px solid #00d2d3';
        el.style.boxShadow = '0 0 15px #00d2d3, 0 0 5px white';

        updateInputsFromElement(el);
    }

    function updateInputsFromElement(el) {
        const scale = getCurrentScale();
        const containerRect = container.getBoundingClientRect();
        const rect = el.getBoundingClientRect();

        const leftPx = (rect.left - containerRect.left) / scale;
        const topPx = (rect.top - containerRect.top) / scale;
        const widthPx = rect.width / scale;
        const heightPx = rect.height / scale;

        inputs['left'].value = ((leftPx / baseWidth) * 100).toFixed(2);
        inputs['top'].value = ((topPx / baseHeight) * 100).toFixed(2);
        inputs['width'].value = ((widthPx / baseWidth) * 100).toFixed(2);
        inputs['height'].value = ((heightPx / baseHeight) * 100).toFixed(2);
    }

    function getCurrentScale() {
        return container.getBoundingClientRect().width / container.offsetWidth;
    }

    function updateElementFromInput(prop, val) {
        if (!selectedElement) return;
        selectedElement.style[prop] = val + '%';
    }


    // 8. Drag & Resize
    let startX, startY;
    let startLeft, startTop, startWidth, startHeight;

    function makeDraggable(el) {
        el.addEventListener('mousedown', (e) => {
            if (e.target.closest('#designer-panel') || e.target.closest('#designer-toggle-btn')) return;
            e.preventDefault();
            e.stopPropagation();

            selectElement(el);

            startX = e.clientX;
            startY = e.clientY;

            // Calc starting %
            const scale = getCurrentScale();
            const containerRect = container.getBoundingClientRect();
            const rect = el.getBoundingClientRect();

            startLeft = ((rect.left - containerRect.left) / scale / baseWidth) * 100;
            startTop = ((rect.top - containerRect.top) / scale / baseHeight) * 100;
            startWidth = (rect.width / scale / baseWidth) * 100;
            startHeight = (rect.height / scale / baseHeight) * 100;

            isResizing = e.shiftKey;
            el.style.cursor = isResizing ? 'se-resize' : 'grabbing';

            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });
    }

    function onMove(e) {
        if (!selectedElement) return;
        e.preventDefault();

        const scale = getCurrentScale();
        const deltaX = (e.clientX - startX) / scale;
        const deltaY = (e.clientY - startY) / scale;

        const deltaXPercent = (deltaX / baseWidth) * 100;
        const deltaYPercent = (deltaY / baseHeight) * 100;

        if (isResizing) {
            const newW = startWidth + deltaXPercent;
            selectedElement.style.width = newW.toFixed(2) + '%';

            if (selectedElement.tagName !== 'IMG' || e.altKey) {
                const newH = startHeight + deltaYPercent;
                selectedElement.style.height = newH.toFixed(2) + '%';
            } else {
                selectedElement.style.height = 'auto';
            }
        } else {
            const newL = startLeft + deltaXPercent;
            const newT = startTop + deltaYPercent;
            selectedElement.style.left = newL.toFixed(2) + '%';
            selectedElement.style.top = newT.toFixed(2) + '%';
        }
        updateInputsFromElement(selectedElement);
    }

    function onUp() {
        if (selectedElement) selectedElement.style.cursor = 'pointer';
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
    }

    // 9. Generate CSS
    function getCSSSelector(el) {
        if (el.id) return `#${el.id}`;
        if (el.tagName === 'IMG') {
            const src = el.getAttribute('src');
            if (src) return `img[src*="${src.split('/').pop().split('?')[0]}"]`;
        }
        if (el.classList.length > 0) return `.${el.classList[0]}`;
        return el.tagName.toLowerCase();
    }

    function generateCSS() {
        let css = `/* CSS Gerado (Designer 4.0) */\n`;
        css += `#app-container {\n    position: relative;\n    width: 1920px;\n    height: 1080px;\n}\n\n`;

        draggableElements.forEach(el => {
            // Only output if positioned
            if (el.style.position !== 'absolute') return;
            if (el.style.display === 'none') {
                css += `/* ${getCSSSelector(el)} está oculto (display: none) */\n`;
                return;
            }

            const scale = getCurrentScale();
            const containerRect = container.getBoundingClientRect();
            const rect = el.getBoundingClientRect();

            const left = ((rect.left - containerRect.left) / scale / baseWidth) * 100;
            const top = ((rect.top - containerRect.top) / scale / baseHeight) * 100;
            const width = (rect.width / scale / baseWidth) * 100;
            const height = (rect.height / scale / baseHeight) * 100;

            css += `${getCSSSelector(el)} {\n`;
            css += `    position: absolute;\n`;
            css += `    left: ${left.toFixed(2)}%;\n`;
            css += `    top: ${top.toFixed(2)}%;\n`;

            if (el.style.width && el.style.width !== 'auto') {
                css += `    width: ${width.toFixed(2)}%;\n`;
            }
            if (el.style.height && el.style.height !== 'auto' && el.style.height !== '') {
                css += `    height: ${height.toFixed(2)}%;\n`;
            }
            css += `}\n`;
        });

        console.clear();
        console.log(css);
        alert("CSS Gerado no Console (F12)! Copie e envie.");
    }

    // Start
    initElements();
    panel.style.display = 'flex'; // Force open

})();

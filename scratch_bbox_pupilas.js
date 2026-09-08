const fs = require('fs');

const meoCode = fs.readFileSync('Simulador-MEO/meo.js', 'utf8');

// Extrair LUCAS_SVG_RAW atual
const startMarker = 'const LUCAS_SVG_RAW = "';
const startIdx = meoCode.indexOf(startMarker);
const endIdx = meoCode.indexOf('";\r\n\r\n// =========================================================================', startIdx);
const rawEscaped = meoCode.substring(startIdx + startMarker.length, endIdx !== -1 ? endIdx : meoCode.indexOf('";\n\n//', startIdx));
const svg = JSON.parse('"' + rawEscaped + '"');

// Tag 36 (Pupila OD)
// d="M5770.46 16480.26c-152.99,-806.55 828.3,-1604.57 1541.82,-1025.97 276.89,266.19 367.61,461.98 373.45,825.82 -4.7,69.5 -8.67,139.91 -17.19,209.86 -20.72,602.12 -636.52,1141.64 -1236.59,911.05 -392.54,-124.05 -625.64,-527.46 -661.49,-920.76z"

function calcularBoundingBoxPath(d) {
    let curX = 0, curY = 0;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

    function addPt(x, y) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
    }

    // Parse básico de SVG path com M e c
    const tokens = d.match(/([a-zA-Z]|[-+]?[0-9]*\.?[0-9]+(?:e[-+]?[0-9]+)?)/g);
    let i = 0;
    let cmd = '';
    while (i < tokens.length) {
        const t = tokens[i];
        if (/^[a-zA-Z]$/.test(t)) {
            cmd = t;
            i++;
        }
        if (cmd === 'M') {
            curX = parseFloat(tokens[i++]);
            curY = parseFloat(tokens[i++]);
            addPt(curX, curY);
            cmd = 'L'; // subsequentes são linhas
        } else if (cmd === 'm') {
            curX += parseFloat(tokens[i++]);
            curY += parseFloat(tokens[i++]);
            addPt(curX, curY);
            cmd = 'l';
        } else if (cmd === 'c') {
            const dx1 = parseFloat(tokens[i++]);
            const dy1 = parseFloat(tokens[i++]);
            const dx2 = parseFloat(tokens[i++]);
            const dy2 = parseFloat(tokens[i++]);
            const dx = parseFloat(tokens[i++]);
            const dy = parseFloat(tokens[i++]);
            // aproxima curva com ponto de controle e final
            addPt(curX + dx1, curY + dy1);
            addPt(curX + dx2, curY + dy2);
            curX += dx;
            curY += dy;
            addPt(curX, curY);
        } else if (cmd === 'C') {
            const x1 = parseFloat(tokens[i++]);
            const y1 = parseFloat(tokens[i++]);
            const x2 = parseFloat(tokens[i++]);
            const y2 = parseFloat(tokens[i++]);
            curX = parseFloat(tokens[i++]);
            curY = parseFloat(tokens[i++]);
            addPt(x1, y1);
            addPt(x2, y2);
            addPt(curX, curY);
        } else if (cmd === 'z' || cmd === 'Z') {
            i++;
        } else {
            i++;
        }
    }

    return { minX, maxX, minY, maxY, centroX: (minX + maxX)/2, centroY: (minY + maxY)/2 };
}

const tags = svg.match(/<(path|polygon)[^>]*>/g) || [];
const dPupilaOD = (tags[36].match(/d="([^"]+)"/) || [])[1];
const dPupilaOE = (tags[63].match(/d="([^"]+)"/) || [])[1];

const bboxOD = calcularBoundingBoxPath(dPupilaOD);
const bboxOE = calcularBoundingBoxPath(dPupilaOE);

console.log('OD BBox:', bboxOD);
console.log('OE BBox:', bboxOE);

console.log(`OD %: X = ${(bboxOD.centroX / 21000 * 100).toFixed(4)}%, Y = ${(bboxOD.centroY / 29700 * 100).toFixed(4)}%`);
console.log(`OE %: X = ${(bboxOE.centroX / 21000 * 100).toFixed(4)}%, Y = ${(bboxOE.centroY / 29700 * 100).toFixed(4)}%`);

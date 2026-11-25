// =========================================
// GENERADOR DE TEMAS ALTERNATIVOS
// =========================================
// Lee styles.css y crea temas-pokemon.css con las paletas del segundo set de Pokémon
// (Clefairy, Mewtwo y Pikachu). Cada color de la paleta original se convierte al tono
// nuevo conservando su luminosidad, así los contrastes siguen funcionando.
//
// Uso:  npm run temas      (volver a ejecutarlo si se cambian colores en styles.css)
const fs = require("fs");
const path = require("path");

const RAIZ = path.join(__dirname, "..");
const ENTRADA = path.join(RAIZ, "styles.css");
const SALIDA = path.join(RAIZ, "temas-pokemon.css");

// Para cada pantalla: qué tonos se reemplazan (rango en grados) y por cuál
const PALETAS = {
    principal: { clase: "tema-bulbasaur", nombre: "Clefairy (rosa)", desde: [115, 180], hacia: 338, saturacion: 1.0 },
    estudio: { clase: "tema-estudio", nombre: "Mewtwo (lila psíquico)", desde: [235, 300], hacia: 286, saturacion: 0.6 },
    descanso: { clase: "tema-descanso", nombre: "Pikachu (amarillo y marrón)", desde: [185, 225], hacia: 42, saturacion: 1.15 }
};

const PREFIJO = 'html[data-set="alt"]';

// ---------- Colores ----------
function rgbAHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max === min) return [0, 0, l];
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h;
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    return [h * 60, s, l];
}

function hslARgb(h, s, l) {
    h /= 360;
    if (s === 0) return [l, l, l].map(v => Math.round(v * 255));
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const canal = (t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };
    return [canal(h + 1 / 3), canal(h), canal(h - 1 / 3)].map(v => Math.round(v * 255));
}

// Devuelve el color convertido, o null si no pertenece a la paleta
function convertir(r, g, b, paleta) {
    const [h, s, l] = rgbAHsl(r, g, b);
    if (s < 0.12 || h < paleta.desde[0] || h > paleta.desde[1]) return null;
    return hslARgb(paleta.hacia, Math.min(1, s * paleta.saturacion), l);
}

const aHex = (n) => n.toString(16).padStart(2, "0");
const REGEX_COLOR = /#([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3})\b|rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/gi;

function convertirValor(valor, paleta) {
    let cambio = false;
    const nuevo = valor.replace(REGEX_COLOR, (texto, hex, r, g, b, a) => {
        let rgb, alfaHex = "";
        if (hex) {
            let h = hex;
            if (h.length === 3) h = h.split("").map(c => c + c).join("");
            if (h.length === 8) { alfaHex = h.slice(6); h = h.slice(0, 6); }
            rgb = [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16));
        } else {
            rgb = [r, g, b].map(Number);
        }
        const convertido = convertir(...rgb, paleta);
        if (!convertido) return texto;
        cambio = true;
        if (hex) return "#" + convertido.map(aHex).join("") + alfaHex;
        return a !== undefined ? `rgba(${convertido.join(", ")}, ${a})` : `rgb(${convertido.join(", ")})`;
    });
    return cambio ? nuevo : null;
}

// ---------- CSS ----------
// Reglas de primer nivel (se ignoran @media, @keyframes, etc.)
function leerReglas(css) {
    css = css.replace(/\/\*[\s\S]*?\*\//g, "");
    const reglas = [];
    let i = 0;
    while (i < css.length) {
        const llave = css.indexOf("{", i);
        if (llave === -1) break;
        const selector = css.slice(i, llave).trim();
        // Buscar el cierre respetando llaves anidadas
        let profundidad = 1, j = llave + 1;
        while (j < css.length && profundidad > 0) {
            if (css[j] === "{") profundidad++;
            else if (css[j] === "}") profundidad--;
            j++;
        }
        const cuerpo = css.slice(llave + 1, j - 1);
        if (!selector.startsWith("@")) reglas.push({ selector, cuerpo });
        i = j;
    }
    return reglas;
}

const TODAS_LAS_CLASES = Object.values(PALETAS).map(p => p.clase).concat("tema-auth");

// Adapta un selector a la pantalla indicada, o devuelve null si no corresponde
function adaptarSelector(selector, paleta) {
    const clasePropia = TODAS_LAS_CLASES.find(c => selector.includes(c));
    if (clasePropia && clasePropia !== paleta.clase) return null;
    if (/^(html|:root|\*)/.test(selector)) return null;
    if (clasePropia) return `${PREFIJO} ${selector}`;
    if (/^body\b/.test(selector)) return `${PREFIJO} ${selector.replace(/^body/, `body.${paleta.clase}`)}`;
    return `${PREFIJO} body.${paleta.clase} ${selector}`;
}

function generar() {
    const reglas = leerReglas(fs.readFileSync(ENTRADA, "utf8"));
    const salida = [
        "/* =========================================",
        "   TEMAS ALTERNATIVOS (ARCHIVO GENERADO)",
        "   No editar a mano: se crea con `npm run temas` a partir de styles.css",
        "   ========================================= */",
        ""
    ];

    for (const paleta of Object.values(PALETAS)) {
        salida.push(`/* ---------- ${paleta.nombre} ---------- */`);
        let cantidad = 0;
        for (const { selector, cuerpo } of reglas) {
            const declaraciones = cuerpo.split(";")
                .map(d => d.trim())
                .filter(d => d.includes(":"))
                .map(d => {
                    const pos = d.indexOf(":");
                    const prop = d.slice(0, pos).trim();
                    const valor = convertirValor(d.slice(pos + 1).trim(), paleta);
                    return valor ? `    ${prop}: ${valor};` : null;
                })
                .filter(Boolean);
            if (declaraciones.length === 0) continue;

            const selectores = selector.split(",")
                .map(s => adaptarSelector(s.trim(), paleta))
                .filter(Boolean);
            if (selectores.length === 0) continue;

            salida.push(`${selectores.join(",\n")} {`, ...declaraciones, "}");
            cantidad++;
        }
        salida.push("");
        console.log(`${paleta.nombre}: ${cantidad} reglas`);
    }

    fs.writeFileSync(SALIDA, salida.join("\n"));
    console.log(`Generado ${path.relative(RAIZ, SALIDA)}`);
}

generar();

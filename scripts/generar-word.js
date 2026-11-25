// =========================================
// GENERADOR DE DOCUMENTOS WORD
// =========================================
// Convierte docs/INSTALACION.md y docs/MANUAL_DE_USUARIO.md en archivos .docx con portada,
// encabezado, numeración de páginas y las capturas de pantalla incluidas.
//
// Uso:  npm run word      (volver a ejecutarlo si se cambian los .md)
const fs = require("fs");
const path = require("path");
const {
    Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell,
    WidthType, ShadingType, BorderStyle, ImageRun, ExternalHyperlink, Header, Footer, PageNumber,
    LevelFormat, PageBreak, TabStopType
} = require("docx");

const RAIZ = path.join(__dirname, "..");
const DOCUMENTOS = [
    { md: "docs/INSTALACION.md", salida: "docs/INSTALACION.docx", titulo: "Guía de instalación", subtitulo: "Cómo instalar FOCUS para usarlo y cómo preparar el proyecto para programar" },
    { md: "docs/MANUAL_DE_USUARIO.md", salida: "docs/MANUAL_DE_USUARIO.docx", titulo: "Manual de usuario", subtitulo: "Todas las funciones de FOCUS, paso a paso" }
];

const VERSION = require(path.join(RAIZ, "package.json")).version;
const FECHA = new Date().toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });

const FUENTE = "Calibri";
const FUENTE_CODIGO = "Consolas";
const COLOR_ACENTO = "4B2BB3";
const COLOR_TEXTO = "222222";
const COLOR_SUAVE = "666666";
const ANCHO_CONTENIDO = 9026; // A4 con márgenes de 1" (en DXA)
const ANCHO_IMAGEN_MAX = 600;  // píxeles

// ---------- Texto en línea: **negrita**, `código`, [enlace](url) ----------
const PATRONES = [
    { tipo: "negrita", re: /\*\*(.+?)\*\*/ },
    { tipo: "codigo", re: /`([^`]+)`/ },
    { tipo: "enlace", re: /\[([^\]]+)\]\(([^)]+)\)/ }
];

function textoEnLinea(texto, estilo = {}) {
    const partes = [];
    let resto = texto;
    while (resto.length > 0) {
        let mejor = null;
        for (const p of PATRONES) {
            const m = p.re.exec(resto);
            if (m && (!mejor || m.index < mejor.m.index)) mejor = { p, m };
        }
        if (!mejor) {
            partes.push(new TextRun({ text: resto, ...estilo }));
            break;
        }
        if (mejor.m.index > 0) partes.push(new TextRun({ text: resto.slice(0, mejor.m.index), ...estilo }));
        const [completo, contenido, url] = mejor.m;
        if (mejor.p.tipo === "negrita") {
            partes.push(...textoEnLinea(contenido, { ...estilo, bold: true }));
        } else if (mejor.p.tipo === "codigo") {
            partes.push(new TextRun({ text: contenido, ...estilo, font: FUENTE_CODIGO, size: 20, color: "7A1D5C" }));
        } else if (/^https?:\/\//.test(url)) {
            partes.push(new ExternalHyperlink({
                link: url,
                children: [new TextRun({ text: contenido, ...estilo, style: "Hyperlink" })]
            }));
        } else {
            // Enlaces internos o a otros .md: en Word quedan como texto
            partes.push(...textoEnLinea(contenido, estilo));
        }
        resto = resto.slice(mejor.m.index + completo.length);
    }
    return partes;
}

// ---------- Imágenes ----------
function tamanoPng(buffer) {
    return { ancho: buffer.readUInt32BE(16), alto: buffer.readUInt32BE(20) };
}

function imagen(rutaMd, alt, ruta) {
    const archivo = path.join(path.dirname(rutaMd), ruta);
    const datos = fs.readFileSync(archivo);
    const { ancho, alto } = tamanoPng(datos);
    // Las imágenes chicas (ventana flotante) se agrandan un poco; las grandes se ajustan al ancho
    const objetivo = ancho < 300 ? ancho * 1.5 : Math.min(ANCHO_IMAGEN_MAX, ancho);
    const escala = objetivo / ancho;
    return [
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 160, after: 60 },
            keepNext: true,
            children: [new ImageRun({
                type: "png",
                data: datos,
                transformation: { width: Math.round(ancho * escala), height: Math.round(alto * escala) },
                altText: { title: alt, description: alt, name: alt }
            })]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [new TextRun({ text: alt, italics: true, size: 18, color: COLOR_SUAVE })]
        })
    ];
}

// ---------- Tablas ----------
function celdasDeFila(linea) {
    return linea.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(c => c.trim());
}

function tabla(filas, conEncabezado = true) {
    const encabezado = filas[0];
    const cuerpo = conEncabezado ? filas.slice(1) : filas;
    const columnas = encabezado.length;
    // Ancho de cada columna proporcional a su texto más largo (con mínimo)
    const largos = Array.from({ length: columnas }, (_, i) =>
        Math.max(8, ...filas.map(f => (f[i] || "").replace(/\*\*|`/g, "").length)));
    const total = largos.reduce((a, b) => a + b, 0);
    let anchos = largos.map(l => Math.max(1300, Math.round(ANCHO_CONTENIDO * l / total)));
    const ajuste = ANCHO_CONTENIDO - anchos.reduce((a, b) => a + b, 0);
    anchos[anchos.indexOf(Math.max(...anchos))] += ajuste;

    const borde = { style: BorderStyle.SINGLE, size: 4, color: "D9D2F2" };
    const bordes = { top: borde, bottom: borde, left: borde, right: borde };
    const celda = (texto, i, esEncabezado) => new TableCell({
        width: { size: anchos[i], type: WidthType.DXA },
        borders: bordes,
        shading: esEncabezado ? { type: ShadingType.CLEAR, fill: "EDE8FB", color: "auto" } : undefined,
        margins: { top: 70, bottom: 70, left: 110, right: 110 },
        children: [new Paragraph({
            spacing: { before: 0, after: 0 },
            children: textoEnLinea(texto || "", esEncabezado ? { bold: true, color: "2B1055" } : {})
        })]
    });

    return new Table({
        width: { size: ANCHO_CONTENIDO, type: WidthType.DXA },
        columnWidths: anchos,
        rows: [
            ...(conEncabezado ? [new TableRow({ tableHeader: true, children: encabezado.map((t, i) => celda(t, i, true)) })] : []),
            ...cuerpo.map(f => new TableRow({ children: Array.from({ length: columnas }, (_, i) => celda(f[i], i, false)) }))
        ]
    });
}

// ---------- Conversión de Markdown ----------
function convertir(rutaMd) {
    const lineas = fs.readFileSync(rutaMd, "utf8").replace(/\r\n/g, "\n").split("\n");
    const bloques = [];
    let i = 0;
    let saltarHastaSiguienteSeccion = false;
    let numeracion = 0;
    let primerH2 = true;

    // El título "# ..." del .md se reemplaza por la portada
    while (i < lineas.length && !lineas[i].startsWith("# ")) i++;
    i++;

    while (i < lineas.length) {
        const linea = lineas[i];
        const limpia = linea.trim();

        if (limpia.startsWith("## ")) {
            const titulo = limpia.slice(3);
            // El índice con enlaces no sirve en Word: se omite esa sección
            saltarHastaSiguienteSeccion = /^Índice$/i.test(titulo);
            if (!saltarHastaSiguienteSeccion) {
                bloques.push(new Paragraph({ heading: HeadingLevel.HEADING_1, pageBreakBefore: !primerH2, children: textoEnLinea(titulo) }));
                primerH2 = false;
            }
            i++;
            continue;
        }
        if (saltarHastaSiguienteSeccion) { i++; continue; }

        if (limpia.startsWith("### ")) {
            bloques.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: textoEnLinea(limpia.slice(4)) }));
            i++;
            continue;
        }

        if (limpia === "" || limpia === "---") { i++; continue; }

        // Bloque de código
        if (limpia.startsWith("```")) {
            i++;
            const codigo = [];
            while (i < lineas.length && !lineas[i].trim().startsWith("```")) codigo.push(lineas[i++]);
            i++;
            codigo.forEach((c, n) => bloques.push(new Paragraph({
                shading: { type: ShadingType.CLEAR, fill: "F4F2FA", color: "auto" },
                indent: { left: 240, right: 240 },
                spacing: { before: n === 0 ? 120 : 0, after: n === codigo.length - 1 ? 160 : 0 },
                keepNext: n < codigo.length - 1,
                children: [new TextRun({ text: c || " ", font: FUENTE_CODIGO, size: 19 })]
            })));
            continue;
        }

        // Imagen sola en su línea
        const img = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(limpia);
        if (img) {
            bloques.push(...imagen(rutaMd, img[1], img[2]));
            i++;
            continue;
        }

        // Tabla
        if (limpia.startsWith("|")) {
            const filas = [];
            while (i < lineas.length && lineas[i].trim().startsWith("|")) {
                const fila = celdasDeFila(lineas[i]);
                if (!fila.every(c => /^:?-{3,}:?$/.test(c))) filas.push(fila);
                i++;
            }
            // Una tabla con encabezado vacío (| | |) se muestra sin fila de títulos
            const sinEncabezado = filas[0].every(c => c === "");
            if (sinEncabezado) filas.shift();
            bloques.push(tabla(filas, !sinEncabezado));
            bloques.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
            continue;
        }

        // Cita / nota
        if (limpia.startsWith(">")) {
            const texto = [];
            while (i < lineas.length && lineas[i].trim().startsWith(">")) {
                texto.push(lineas[i].trim().replace(/^>\s?/, ""));
                i++;
            }
            bloques.push(new Paragraph({
                shading: { type: ShadingType.CLEAR, fill: "F6F3FF", color: "auto" },
                border: { left: { style: BorderStyle.SINGLE, size: 18, color: COLOR_ACENTO, space: 8 } },
                indent: { left: 200, right: 200 },
                spacing: { before: 120, after: 160 },
                children: textoEnLinea(texto.join(" "))
            }));
            continue;
        }

        // Listas (con viñetas o numeradas; las líneas con sangría continúan el elemento)
        const vineta = /^(\s*)- (.*)$/.exec(linea);
        const numero = /^(\s*)\d+\. (.*)$/.exec(linea);
        if (vineta || numero) {
            const esNumerada = Boolean(numero);
            if (esNumerada) numeracion++;
            const referencia = esNumerada ? `numeros-${numeracion}` : "vinetas";
            while (i < lineas.length) {
                const v = /^(\s*)- (.*)$/.exec(lineas[i]);
                const n = /^(\s*)\d+\. (.*)$/.exec(lineas[i]);
                const m = esNumerada ? (n || v) : (v || n);
                if (!m) break;
                const nivel = m[1].length >= 2 ? 1 : 0;
                let texto = m[2];
                i++;
                while (i < lineas.length && /^\s{2,}\S/.test(lineas[i]) && !/^\s*(- |\d+\. )/.test(lineas[i])) {
                    texto += " " + lineas[i].trim();
                    i++;
                }
                const ref = (nivel === 1 && !n) ? "vinetas" : (n && !esNumerada ? `numeros-${++numeracion}` : referencia);
                bloques.push(new Paragraph({
                    numbering: { reference: ref, level: ref === "vinetas" ? nivel : 0 },
                    spacing: { after: 60 },
                    children: textoEnLinea(texto)
                }));
            }
            bloques.push(new Paragraph({ spacing: { after: 60 }, children: [] }));
            continue;
        }

        // Párrafo normal (une las líneas seguidas)
        const texto = [];
        while (i < lineas.length) {
            const l = lineas[i].trim();
            if (l === "" || /^(#|>|\||```|!\[|- |\d+\. |---$)/.test(l)) break;
            texto.push(l);
            i++;
        }
        bloques.push(new Paragraph({ children: textoEnLinea(texto.join(" ")) }));
    }
    return { bloques, cantidadNumeraciones: numeracion };
}

// ---------- Portada ----------
function portada(titulo, subtitulo) {
    const icono = fs.readFileSync(path.join(RAIZ, "build", "icon.png"));
    return [
        new Paragraph({ spacing: { before: 1800 }, alignment: AlignmentType.CENTER, children: [
            new ImageRun({ type: "png", data: icono, transformation: { width: 150, height: 150 }, altText: { title: "Ícono de FOCUS", description: "Tomate con reloj", name: "icono" } })
        ] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 360, after: 120 }, children: [
            new TextRun({ text: "FOCUS", font: FUENTE, size: 72, bold: true, color: COLOR_ACENTO })
        ] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [
            new TextRun({ text: "Temporizador Pomodoro para estudiar", size: 28, color: COLOR_SUAVE })
        ] }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 600, after: 120 },
            border: { top: { style: BorderStyle.SINGLE, size: 8, color: "D9D2F2", space: 18 } },
            children: [new TextRun({ text: titulo, size: 44, bold: true, color: COLOR_TEXTO })]
        }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 1600 }, children: [
            new TextRun({ text: subtitulo, size: 24, color: COLOR_SUAVE })
        ] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [
            new TextRun({ text: `Versión ${VERSION}  ·  ${FECHA}`, size: 22, color: COLOR_SUAVE })
        ] }),
        new Paragraph({ children: [new PageBreak()] })
    ];
}

// ---------- Documento ----------
function crearDocumento({ md, salida, titulo, subtitulo }) {
    const rutaMd = path.join(RAIZ, md);
    const { bloques, cantidadNumeraciones } = convertir(rutaMd);

    const nivelVineta = (nivel) => ({
        level: nivel, format: LevelFormat.BULLET, text: nivel === 0 ? "•" : "◦", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720 + nivel * 360, hanging: 300 } } }
    });
    const numeraciones = [{ reference: "vinetas", levels: [nivelVineta(0), nivelVineta(1)] }];
    for (let n = 1; n <= cantidadNumeraciones + 5; n++) {
        numeraciones.push({ reference: `numeros-${n}`, levels: [{
            level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }] });
    }

    const doc = new Document({
        creator: "FOCUS",
        title: `FOCUS — ${titulo}`,
        description: subtitulo,
        styles: {
            default: { document: { run: { font: FUENTE, size: 22, color: COLOR_TEXTO }, paragraph: { spacing: { after: 120, line: 288 } } } },
            paragraphStyles: [
                { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
                  run: { font: FUENTE, size: 34, bold: true, color: COLOR_ACENTO },
                  paragraph: { spacing: { before: 120, after: 200 }, keepNext: true, outlineLevel: 0,
                      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "D9D2F2", space: 6 } } } },
                { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
                  run: { font: FUENTE, size: 26, bold: true, color: "2B1055" },
                  paragraph: { spacing: { before: 280, after: 120 }, keepNext: true, outlineLevel: 1 } }
            ]
        },
        numbering: { config: numeraciones },
        sections: [{
            properties: {
                page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } },
                titlePage: true
            },
            headers: {
                default: new Header({ children: [new Paragraph({
                    tabStops: [{ type: TabStopType.RIGHT, position: ANCHO_CONTENIDO }],
                    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "D9D2F2", space: 4 } },
                    children: [
                        new TextRun({ text: "FOCUS", bold: true, color: COLOR_ACENTO, size: 18 }),
                        new TextRun({ text: `\t${titulo}`, color: COLOR_SUAVE, size: 18 })
                    ]
                })] }),
                first: new Header({ children: [new Paragraph({ children: [] })] })
            },
            footers: {
                default: new Footer({ children: [new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({ text: "Página ", size: 18, color: COLOR_SUAVE }),
                        new TextRun({ children: [PageNumber.CURRENT], size: 18, color: COLOR_SUAVE }),
                        new TextRun({ text: " de ", size: 18, color: COLOR_SUAVE }),
                        new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: COLOR_SUAVE })
                    ]
                })] }),
                first: new Footer({ children: [new Paragraph({ children: [] })] })
            },
            children: [...portada(titulo, subtitulo), ...bloques]
        }]
    });

    return Packer.toBuffer(doc).then(buffer => {
        fs.writeFileSync(path.join(RAIZ, salida), buffer);
        console.log(`Generado ${salida}`);
    });
}

(async () => {
    for (const d of DOCUMENTOS) await crearDocumento(d);
})();

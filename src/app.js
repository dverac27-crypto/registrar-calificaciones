// ============================================================================
// CONFIGURACIÓN Y VECTORES PARALELOS GLOBALES
// ============================================================================
const NOTA_MINIMA = 0;
const NOTA_MAXIMA = 10;
const NOTA_APROBACION = 7;

// Vectores paralelos solicitados para almacenar estudiantes y sus notas
let nombres = [];
let notas = [];

// ============================================================================
// FUNCIÓN 1: REGISTRAR ESTUDIANTE Y CALIFICACIÓN
// ============================================================================
function registrarNota() {
    const inputNombre = document.getElementById("nombreEstudiante");
    const inputNota = document.getElementById("notaEstudiante");

    const nombre = inputNombre.value.trim();
    const nota = parseFloat(inputNota.value);

    // 1. Validaciones con condicionales (if)
    if (nombre === "") {
        mostrarMensaje("Error: Debe ingresar el nombre del estudiante.", "error");
        return;
    }

    if (isNaN(nota) || nota < NOTA_MINIMA || nota > NOTA_MAXIMA) {
        mostrarMensaje("Error: La nota debe ser un número válido entre 0 y 10.", "error");
        return;
    }

    // Validar que no se repita el mismo estudiante (recorriendo con ciclo for)
    for (let i = 0; i < nombres.length; i++) {
        if (nombres[i].toLowerCase() === nombre.toLowerCase()) {
            mostrarMensaje(`Error: El estudiante "${nombre}" ya tiene una nota registrada.`, "error");
            return;
        }
    }

    // 2. Almacenar datos en los vectores paralelos
    nombres.push(nombre);
    notas.push(nota);

    // 3. Limpiar campos y actualizar listado
    inputNombre.value = "";
    inputNota.value = "";
    inputNombre.focus();

    mostrarMensaje(`Calificación registrada: ${nombre} (${nota.toFixed(1)}). Presione "Calcular Estadísticas" para actualizar el resumen.`, "exito");
    renderizarTablaEstudiantes();
}

// ============================================================================
// FUNCIÓN 2: RENDERIZAR TABLA DE ESTUDIANTES (USO DE CICLO FOR Y SWITCH)
// ============================================================================
function renderizarTablaEstudiantes() {
    const tbody = document.getElementById("tablaEstudiantes");
    tbody.innerHTML = "";

    if (nombres.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="empty-row">No hay calificaciones registradas todavía.</td></tr>`;
        return;
    }

    // Ciclo FOR para recorrer los vectores paralelos nombres[] y notas[]
    for (let i = 0; i < nombres.length; i++) {
        const notaActual = notas[i];
        let clasificacion = "";
        let claseBadge = "";

        // Condicional múltiple (switch) para categorizar el rendimiento según la nota
        switch (true) {
            case (notaActual >= 9):
                clasificacion = "Excelente (Aprobado)";
                claseBadge = "badge-aprobado";
                break;
            case (notaActual >= NOTA_APROBACION):
                clasificacion = "Bueno (Aprobado)";
                claseBadge = "badge-aprobado";
                break;
            case (notaActual >= 5):
                clasificacion = "Regular (Reprobado)";
                claseBadge = "badge-reprobado";
                break;
            default:
                clasificacion = "Insuficiente (Reprobado)";
                claseBadge = "badge-reprobado";
                break;
        }

        const fila = `
            <tr>
                <td>${i + 1}</td>
                <td><strong>${nombres[i]}</strong></td>
                <td>${notaActual.toFixed(1)}</td>
                <td><span class="badge ${claseBadge}">${clasificacion}</span></td>
            </tr>
        `;
        tbody.innerHTML += fila;
    }
}

// ============================================================================
// FUNCIÓN 3: CALCULAR ESTADÍSTICAS DEL GRUPO (USO DE CICLO WHILE)
// ============================================================================
function calcularEstadisticas() {
    // Validar que existan datos antes de calcular
    if (notas.length === 0) {
        mostrarMensaje("Error: No hay estudiantes registrados para calcular estadísticas.", "error");
        return;
    }

    // Acumuladores y variables de control
    let sumatoria = 0;
    let notaMasAlta = notas[0];
    let estudianteDestacado = nombres[0];
    let cantidadAprobados = 0;
    let i = 0;

    // Ciclo WHILE para recorrer el vector notas[]
    while (i < notas.length) {
        const notaActual = notas[i];

        // 1. Sumatoria para el promedio
        sumatoria += notaActual;

        // 2. Búsqueda de la nota más alta y a quién pertenece
        if (notaActual > notaMasAlta) {
            notaMasAlta = notaActual;
            estudianteDestacado = nombres[i];
        } else if (notaActual === notaMasAlta && i > 0) {
            // Si hay empate en la nota máxima, se agregan ambos nombres
            estudianteDestacado += `, ${nombres[i]}`;
        }

        // 3. Conteo de estudiantes aprobados (nota >= 7)
        if (notaActual >= NOTA_APROBACION) {
            cantidadAprobados++;
        }

        i++;
    }

    // Cálculos finales: promedio general y porcentaje de aprobados
    const totalEstudiantes = notas.length;
    const promedioGeneral = sumatoria / totalEstudiantes;
    const porcentajeAprobados = (cantidadAprobados / totalEstudiantes) * 100;

    // Mostrar resultados en las tarjetas estadísticas
    document.getElementById("statPromedio").textContent = promedioGeneral.toFixed(2);
    document.getElementById("statMaxima").textContent = `${notaMasAlta} (${estudianteDestacado})`;
    document.getElementById("statAprobados").textContent = `${porcentajeAprobados.toFixed(0)}% (${cantidadAprobados}/${totalEstudiantes})`;
    document.getElementById("statTotal").textContent = `${totalEstudiantes} (Suma: ${sumatoria.toFixed(1)})`;

    mostrarMensaje(
        `Estadísticas calculadas — Promedio: ${promedioGeneral.toFixed(2)} | Nota más alta: ${notaMasAlta} (${estudianteDestacado}) | Aprobados: ${cantidadAprobados}/${totalEstudiantes} (${porcentajeAprobados.toFixed(0)}%)`,
        "exito"
    );
}

// ============================================================================
// FUNCIONES AUXILIARES Y DATOS DE PRUEBA
// ============================================================================
function mostrarMensaje(texto, tipo) {
    const panel = document.getElementById("panelMensaje");
    panel.textContent = texto;
    panel.className = `mensaje ${tipo}`;
}

/**
 * Carga el conjunto de datos exacto del ejemplo propuesto en el caso de estudio.
 */
function cargarDatosPrueba() {
    nombres = ["Ana", "Luis", "Marta", "José"];
    notas = [9, 6, 8, 7];

    renderizarTablaEstudiantes();
    calcularEstadisticas();
}
// Toast para mensajes
function mostrarToastElectrico(mensaje) {
    let toast = document.getElementById('toast-electrico');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-electrico';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = mensaje;
    toast.className = 'toast show';
    setTimeout(() => {
        toast.className = 'toast';
    }, 2500);
}

// Guardar el estado actual del formulario de permiso eléctrico
function guardarProgresoElectrico() {
    let historial = JSON.parse(localStorage.getItem('historialElectrico') || '[]');
    let numeroProgreso = 1;
    if (historial.length > 0) {
        const maxProgreso = Math.max(...historial.map(item => item.numeroProgreso || 0));
        numeroProgreso = maxProgreso + 1;
    }
    // Guardar campos principales
    const formData = {
        numeroProgreso: numeroProgreso,
        codigo: document.getElementById('codigo').value,
        fechaExpedicion: document.getElementById('fecha-expedicion').value,
        fechaInicial: document.getElementById('fecha-inicial').value,
        fechaFinal: document.getElementById('fecha-final').value,
        horaInicial: document.getElementById('hora-inicial').value,
        horaFinal: document.getElementById('hora-final').value,
        empresa: document.getElementById('empresa').value,
        area: document.getElementById('area').value,
        numPersonas: document.getElementById('num-personas').value,
        responsable: document.getElementById('responsable').value,
        actividad: document.getElementById('actividad').value,
        // EPP
        epp: obtenerEPP(),
        // Equipos de seguridad
        equipos: obtenerEquipos(),
        // Competencias
        competencias: obtenerTablaPorSeccion(4),
        // Planeación
        planeacion: obtenerTablaPorSeccion(5),
        // Ejecución
        ejecucion: obtenerTablaPorSeccion(6),
        // Medidas y observaciones
        medidas: document.getElementById('medidas').value,
        observaciones: document.getElementById('observaciones').value,
        // Afectaciones
        riesgos: obtenerRadio('riesgos'),
        riesgosAdyacentes: obtenerRadio('riesgos-adyacentes'),
        acciones: document.getElementById('acciones').value,
        // Firmas emisor
        emisor: obtenerEmisor(),
        // Firmas ejecutores
        ejecutores: obtenerEjecutores(),
        fechaGuardado: new Date().toISOString()
    };
    historial.push(formData);
    localStorage.setItem('historialElectrico', JSON.stringify(historial));
    mostrarToastElectrico('Progreso guardado exitosamente');
    mostrarHistorialElectrico();
}

function obtenerEPP() {
    return {
        equipoCaidas: document.getElementById('equipo-caidas').checked,
        gafas: document.getElementById('gafas').checked,
        botas: document.getElementById('botas').checked,
        ropaAlgodon: document.getElementById('ropa-algodon').checked,
        casco: document.getElementById('casco').checked,
        guantes: document.getElementById('guantes').checked,
        equipoEspecial: document.getElementById('equipo-especial').value,
        otroEpp: document.getElementById('otro-epp').value
    };
}

function obtenerEquipos() {
    return {
        verificador: document.getElementById('verificador').checked,
        cinta: document.getElementById('cinta').checked,
        dispositivos: document.getElementById('dispositivos').checked,
        tarjetas: document.getElementById('tarjetas').checked,
        barreras: document.getElementById('barreras').checked,
        tapetes: document.getElementById('tapetes').checked,
        pertigas: document.getElementById('pertigas').checked,
        tierra: document.getElementById('tierra').checked,
        otroEquipo: document.getElementById('otro-equipo').value
    };
}

function obtenerTablaPorSeccion(seccion) {
    // seccion: 4=competencias, 5=planeacion, 6=ejecucion
    const tables = document.querySelectorAll('.table-container table');
    const table = tables[seccion-4];
    if (!table) return [];
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    return rows.map(tr => Array.from(tr.querySelectorAll('input')).map(input => {
        if (input.type === 'radio') {
            return input.checked ? input.value : '';
        } else if (input.type === 'checkbox') {
            return input.checked;
        } else {
            return input.value;
        }
    }));
}

function obtenerRadio(name) {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.value : '';
}

function obtenerEmisor() {
    return {
        nombre: document.getElementById('nombre-emisor').value,
        cc: document.getElementById('cc-emisor').value,
        firma: obtenerFirmaCanvas('firma-emisor')
    };
}

function obtenerEjecutores() {
    let ejecutores = [];
    for (let i = 1; i <= 9; i++) {
        ejecutores.push({
            fecha: document.getElementById(`fecha-ejecutor-${i}`).value,
            nombre: document.getElementById(`nombre-ejecutor-${i}`).value,
            cedula: document.getElementById(`cedula-ejecutor-${i}`).value,
            firma: obtenerFirmaCanvas(`firma-ejecutor-${i}`)
        });
    }
    return ejecutores;
}

function obtenerFirmaCanvas(id) {
    const canvas = document.getElementById(id);
    if (!canvas) return '';
    return canvas.toDataURL();
}

// Mostrar el historial de formularios eléctricos
function mostrarHistorialElectrico() {
    const historial = JSON.parse(localStorage.getItem('historialElectrico') || '[]');
    const historialContainer = document.getElementById('historial-electrico');
    if (!historialContainer) return;
    if (historial.length === 0) {
        historialContainer.innerHTML = '<p>No hay registros guardados</p>';
        return;
    }
    let html = '<h2>Formularios en Progreso</h2><div class="historial-lista">';
    const historialOrdenado = [...historial].sort((a, b) => new Date(a.fechaGuardado) - new Date(b.fechaGuardado));
    historialOrdenado.forEach((formData) => {
        const fecha = new Date(formData.fechaGuardado).toLocaleString();
        const indiceOriginal = historial.indexOf(formData);
        html += `
            <div class="historial-item">
                <p><strong>Progreso ${formData.numeroProgreso}</strong></p>
                <p><strong>Código:</strong> ${formData.codigo || 'No especificado'}</p>
                <p><strong>Empresa:</strong> ${formData.empresa || 'No especificada'}</p>
                <p><strong>Área:</strong> ${formData.area || 'No especificada'}</p>
                <p><strong>Guardado:</strong> ${fecha}</p>
                <div class="historial-buttons">
                    <button onclick="cargarFormularioElectrico(${indiceOriginal})" class="btn-cargar">Cargar</button>
                    <button onclick="eliminarFormularioElectrico(${indiceOriginal})" class="btn-eliminar">Eliminar</button>
                </div>
            </div>
        `;
    });
    html += '</div>';
    historialContainer.innerHTML = html;
}

// Cargar un formulario guardado
function cargarFormularioElectrico(index) {
    const historial = JSON.parse(localStorage.getItem('historialElectrico') || '[]');
    const formData = historial[index];
    if (!formData) {
        mostrarToastElectrico('No se encontró el formulario');
        return;
    }
    try {
        document.getElementById('codigo').value = formData.codigo || '';
        document.getElementById('fecha-expedicion').value = formData.fechaExpedicion || '';
        document.getElementById('fecha-inicial').value = formData.fechaInicial || '';
        document.getElementById('fecha-final').value = formData.fechaFinal || '';
        document.getElementById('hora-inicial').value = formData.horaInicial || '';
        document.getElementById('hora-final').value = formData.horaFinal || '';
        document.getElementById('empresa').value = formData.empresa || '';
        document.getElementById('area').value = formData.area || '';
        document.getElementById('num-personas').value = formData.numPersonas || '';
        document.getElementById('responsable').value = formData.responsable || '';
        document.getElementById('actividad').value = formData.actividad || '';
        // EPP
        restaurarEPP(formData.epp);
        // Equipos
        restaurarEquipos(formData.equipos);
        // Competencias
        restaurarTablaPorSeccion(4, formData.competencias);
        // Planeación
        restaurarTablaPorSeccion(5, formData.planeacion);
        // Ejecución
        restaurarTablaPorSeccion(6, formData.ejecucion);
        // Medidas y observaciones
        document.getElementById('medidas').value = formData.medidas || '';
        document.getElementById('observaciones').value = formData.observaciones || '';
        // Afectaciones
        restaurarRadio('riesgos', formData.riesgos);
        restaurarRadio('riesgos-adyacentes', formData.riesgosAdyacentes);
        document.getElementById('acciones').value = formData.acciones || '';
        // Firmas emisor
        restaurarEmisor(formData.emisor);
        // Firmas ejecutores
        restaurarEjecutores(formData.ejecutores);
        mostrarToastElectrico('Formulario cargado exitosamente');
    } catch (error) {
        mostrarToastElectrico('Error al cargar el formulario');
    }
}

function restaurarEPP(epp) {
    if (!epp) return;
    document.getElementById('equipo-caidas').checked = !!epp.equipoCaidas;
    document.getElementById('gafas').checked = !!epp.gafas;
    document.getElementById('botas').checked = !!epp.botas;
    document.getElementById('ropa-algodon').checked = !!epp.ropaAlgodon;
    document.getElementById('casco').checked = !!epp.casco;
    document.getElementById('guantes').checked = !!epp.guantes;
    document.getElementById('equipo-especial').value = epp.equipoEspecial || '';
    document.getElementById('otro-epp').value = epp.otroEpp || '';
}

function restaurarEquipos(equipos) {
    if (!equipos) return;
    document.getElementById('verificador').checked = !!equipos.verificador;
    document.getElementById('cinta').checked = !!equipos.cinta;
    document.getElementById('dispositivos').checked = !!equipos.dispositivos;
    document.getElementById('tarjetas').checked = !!equipos.tarjetas;
    document.getElementById('barreras').checked = !!equipos.barreras;
    document.getElementById('tapetes').checked = !!equipos.tapetes;
    document.getElementById('pertigas').checked = !!equipos.pertigas;
    document.getElementById('tierra').checked = !!equipos.tierra;
    document.getElementById('otro-equipo').value = equipos.otroEquipo || '';
}

function restaurarTablaPorSeccion(seccion, datos) {
    const tables = document.querySelectorAll('.table-container table');
    const table = tables[seccion-4];
    if (!table || !datos) return;
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    datos.forEach((fila, i) => {
        if (!rows[i]) return;
        const inputs = Array.from(rows[i].querySelectorAll('input'));
        fila.forEach((valor, j) => {
            if (inputs[j].type === 'radio') {
                inputs[j].checked = valor === inputs[j].value;
            } else if (inputs[j].type === 'checkbox') {
                inputs[j].checked = !!valor;
            } else {
                inputs[j].value = valor;
            }
        });
    });
}

function restaurarRadio(name, value) {
    const radios = document.querySelectorAll(`input[name="${name}"]`);
    radios.forEach(radio => {
        radio.checked = radio.value === value;
    });
}

// Función para configurar el canvas en alta resolución y devolver el contexto escalado
function setupHighResCanvas(canvas) {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    const ctx = canvas.getContext("2d");
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    ctx.scale(ratio, ratio);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    return ctx;
}

// Función para centrar y mantener la proporción de la imagen en el canvas
function drawImageCentered(ctx, img, canvas) {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    const canvasWidth = rect.width;
    const canvasHeight = rect.height;
    const imgRatio = img.width / img.height;
    const canvasRatio = canvasWidth / canvasHeight;
    let drawWidth, drawHeight, drawX, drawY;
    if (imgRatio > canvasRatio) {
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgRatio;
        drawX = 0;
        drawY = (canvasHeight - drawHeight) / 2;
    } else {
        drawHeight = canvasHeight;
        drawWidth = canvasHeight * imgRatio;
        drawX = (canvasWidth - drawWidth) / 2;
        drawY = 0;
    }
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
}

function restaurarEmisor(emisor) {
    if (!emisor) return;
    document.getElementById('nombre-emisor').value = emisor.nombre || '';
    document.getElementById('cc-emisor').value = emisor.cc || '';
    if (emisor.firma) {
        const canvas = document.getElementById('firma-emisor');
        if (canvas) {
            const ctx = setupHighResCanvas(canvas);
            const img = new Image();
            img.src = emisor.firma;
            img.onload = () => drawImageCentered(ctx, img, canvas);
        }
    }
}

function restaurarEjecutores(ejecutores) {
    if (!ejecutores) return;
    for (let i = 1; i <= 9; i++) {
        const ej = ejecutores[i-1] || {};
        document.getElementById(`fecha-ejecutor-${i}`).value = ej.fecha || '';
        document.getElementById(`nombre-ejecutor-${i}`).value = ej.nombre || '';
        document.getElementById(`cedula-ejecutor-${i}`).value = ej.cedula || '';
        if (ej.firma) {
            const canvas = document.getElementById(`firma-ejecutor-${i}`);
            if (canvas) {
                const ctx = setupHighResCanvas(canvas);
                const img = new Image();
                img.src = ej.firma;
                img.onload = () => drawImageCentered(ctx, img, canvas);
            }
        }
    }
}

// Eliminar un formulario del historial
function eliminarFormularioElectrico(index) {
    if (confirm('¿Estás seguro de que deseas eliminar este formulario del historial?')) {
        let historial = JSON.parse(localStorage.getItem('historialElectrico') || '[]');
        historial.splice(index, 1);
        localStorage.setItem('historialElectrico', JSON.stringify(historial));
        mostrarHistorialElectrico();
        mostrarToastElectrico('Formulario eliminado exitosamente');
    }
}

// Inicializar el historial y botón de limpiar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    mostrarHistorialElectrico();
    document.getElementById('reloadButtonElectrico').onclick = function() {
        // Limpiar campos principales
        document.getElementById('codigo').value = '';
        document.getElementById('fecha-expedicion').value = '';
        document.getElementById('fecha-inicial').value = '';
        document.getElementById('fecha-final').value = '';
        document.getElementById('hora-inicial').value = '';
        document.getElementById('hora-final').value = '';
        document.getElementById('empresa').value = '';
        document.getElementById('area').value = '';
        document.getElementById('num-personas').value = '';
        document.getElementById('responsable').value = '';
        document.getElementById('actividad').value = '';
        // EPP
        document.getElementById('equipo-caidas').checked = false;
        document.getElementById('gafas').checked = false;
        document.getElementById('botas').checked = false;
        document.getElementById('ropa-algodon').checked = false;
        document.getElementById('casco').checked = false;
        document.getElementById('guantes').checked = false;
        document.getElementById('equipo-especial').value = '';
        document.getElementById('otro-epp').value = '';
        // Equipos
        document.getElementById('verificador').checked = false;
        document.getElementById('cinta').checked = false;
        document.getElementById('dispositivos').checked = false;
        document.getElementById('tarjetas').checked = false;
        document.getElementById('barreras').checked = false;
        document.getElementById('tapetes').checked = false;
        document.getElementById('pertigas').checked = false;
        document.getElementById('tierra').checked = false;
        document.getElementById('otro-equipo').value = '';
        // Competencias, planeación, ejecución
        const tables = document.querySelectorAll('.table-container table');
        tables.forEach(table => {
            table.querySelectorAll('input[type="radio"]').forEach(input => input.checked = false);
        });
        // Medidas y observaciones
        document.getElementById('medidas').value = '';
        document.getElementById('observaciones').value = '';
        // Afectaciones
        restaurarRadio('riesgos', '');
        restaurarRadio('riesgos-adyacentes', '');
        document.getElementById('acciones').value = '';
        // Firmas emisor
        document.getElementById('nombre-emisor').value = '';
        document.getElementById('cc-emisor').value = '';
        const canvasEmisor = document.getElementById('firma-emisor');
        if (canvasEmisor) {
            const ctx = canvasEmisor.getContext('2d');
            ctx.clearRect(0, 0, canvasEmisor.width, canvasEmisor.height);
        }
        // Firmas ejecutores
        for (let i = 1; i <= 9; i++) {
            document.getElementById(`fecha-ejecutor-${i}`).value = '';
            document.getElementById(`nombre-ejecutor-${i}`).value = '';
            document.getElementById(`cedula-ejecutor-${i}`).value = '';
            const canvas = document.getElementById(`firma-ejecutor-${i}`);
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        // Enfocar el primer campo
        const primerCampo = document.getElementById('codigo');
        if (primerCampo) {
            primerCampo.focus();
            primerCampo.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        mostrarToastElectrico('Formulario recargado exitosamente');
    };
}); 
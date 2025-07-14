// Toast para mensajes
function mostrarToastPermisoTrabajo(mensaje) {
    let toast = document.getElementById('toast-permisotrabajo');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-permisotrabajo';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = mensaje;
    toast.className = 'toast show';
    setTimeout(() => {
        toast.className = 'toast';
    }, 2500);
}

// Guardar el estado actual del formulario de permiso de trabajo en altura
function guardarProgresoPermisoTrabajo() {
    let historial = JSON.parse(localStorage.getItem('historialPermisoTrabajo') || '[]');
    let numeroProgreso = 1;
    if (historial.length > 0) {
        const maxProgreso = Math.max(...historial.map(item => item.numeroProgreso || 0));
        numeroProgreso = maxProgreso + 1;
    }
    // Guardar campos principales
    const formData = {
        numeroProgreso: numeroProgreso,
        codigo: document.getElementById('codigo').value,
        codigo2: document.getElementById('codigo2') ? document.getElementById('codigo2').value : '',
        fechaVigencia: document.getElementById('fecha-vigencia').value,
        fechaExpedicion: document.getElementById('fecha-expedicion-date').value,
        fechaInicio: document.getElementById('fecha-inicio').value,
        horaInicio: document.getElementById('hora-inicio').value,
        fechaFin: document.getElementById('fecha-fin').value,
        horaFin: document.getElementById('hora-fin').value,
        empresa: document.getElementById('empresa').value,
        proceso: document.getElementById('proceso').value,
        ubicacion: document.getElementById('ubicacion').value,
        descripcionTrabajo: document.getElementById('descripcion-trabajo').value,
        tipoTrabajo: obtenerRadio('tipo-trabajo'),
        otroTrabajo: document.getElementById('otro-trabajo').value,
        altura: document.getElementById('altura').value,
        arl: document.getElementById('arl').value,
        riesgos: obtenerCheckboxes('riesgos'),
        otroRiesgo: document.getElementById('otro-riesgo').value,
        // Medidas de prevención
        medidasPrevencion: obtenerMedidasPrevencion(),
        otraMedida: document.getElementById('otra-medida') ? document.getElementById('otra-medida').value : '',
        // EPP
        epp: obtenerCheckboxes('epp'),
        otrosEpp: document.getElementById('otros-epp') ? document.getElementById('otros-epp').value : '',
        // Inspección de elementos y sistemas
        inspeccion: obtenerInspeccionElementos(),
        // Sistema de prevención
        sistemaPrevencion: obtenerCheckboxes('sistema-prevencion'),
        otrosSistemas: document.getElementById('otros-sistemas') ? document.getElementById('otros-sistemas').value : '',
        // Equipos de acceso
        equiposAcceso: obtenerCheckboxes('equipos-acceso'),
        otrosEquipos: document.getElementById('otros-equipos') ? document.getElementById('otros-equipos').value : '',
        // Herramientas
        herramientas: obtenerCheckboxes('herramientas'),
        otrasHerramientas: document.getElementById('otras-herramientas') ? document.getElementById('otras-herramientas').value : '',
        // Ejecutores
        ejecutores: obtenerEjecutores(),
        // Emisor responsable
        emisor: obtenerEmisorResponsable(),
        // Observaciones finales
        observacionesFinales: document.getElementById('observaciones-finales') ? document.getElementById('observaciones-finales').value : '',
        // Estado final
        estadoFinal: obtenerRadio('estado-final'),
        // Firmas finales
        firmaEjecutorFinal: obtenerFirmaCanvas('firma-ejecutor-final'),
        nombreFirmaEjecutor: document.getElementById('nombre-firma-ejecutor') ? document.getElementById('nombre-firma-ejecutor').value : '',
        firmaEmisorFinal: obtenerFirmaCanvas('firma-emisor-final'),
        nombreFirmaEmisor: document.getElementById('nombre-firma-emisor') ? document.getElementById('nombre-firma-emisor').value : '',
        fechaGuardado: new Date().toISOString()
    };
    historial.push(formData);
    localStorage.setItem('historialPermisoTrabajo', JSON.stringify(historial));
    mostrarToastPermisoTrabajo('Progreso guardado exitosamente');
    mostrarHistorialPermisoTrabajo();
}

function obtenerRadio(name) {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    return checked ? checked.value : '';
}

function obtenerCheckboxes(name) {
    return Array.from(document.querySelectorAll(`input[name='${name}']`)).filter(cb => cb.checked).map(cb => cb.value);
}

function obtenerMedidasPrevencion() {
    const medidas = [
        'demarcacion', 'portaherramientas', 'superficie-apoyo', 'lineas-energia', 'linea-vida',
        'tarea-acompanada', 'informacion-riesgos', 'elementos-enganche', 'acordonado',
        'revision-equipos', 'conoce-normas'
    ];
    return medidas.map(medida => ({
        medida,
        valor: obtenerRadio(medida)
    }));
}

function obtenerInspeccionElementos() {
    // Selecciona la tabla de inspección (la primera tabla con thead que contiene 'Elemento / Sistemas')
    const tablas = Array.from(document.querySelectorAll('table'));
    const tabla = tablas.find(t => t.querySelector('thead th') && t.querySelector('thead th').textContent.includes('Elemento'));
    if (!tabla) return [];
    const filas = Array.from(tabla.querySelectorAll('tbody tr'));
    return filas.map(tr => {
        // Para cada celda, guarda el valor del textarea o el valor del radio seleccionado
        return Array.from(tr.cells).map(td => {
            const textarea = td.querySelector('textarea');
            if (textarea) return textarea.value;
            const radios = td.querySelectorAll('input[type="radio"]');
            if (radios.length > 0) {
                const checked = Array.from(radios).find(r => r.checked);
                return checked ? checked.value : '';
            }
            return '';
        });
    });
}

function obtenerEjecutores() {
    const filas = document.querySelectorAll('#tabla-ejecutores tbody tr');
    return Array.from(filas).map((tr, i) => ({
        nombre: tr.querySelector('.ejecutor-nombre') ? tr.querySelector('.ejecutor-nombre').value : '',
        cedula: tr.querySelector('.ejecutor-cedula') ? tr.querySelector('.ejecutor-cedula').value : '',
        firma: (() => {
            const canvas = tr.querySelector('.ejecutor-firma');
            return canvas ? canvas.toDataURL() : '';
        })(),
        aptoTsa: obtenerRadio(`apto-tsa-${i}`),
        certificadoTsa: obtenerRadio(`certificado-tsa-${i}`)
    }));
}

function obtenerEmisorResponsable() {
    const tabla = document.getElementById('tabla-emisor-firma');
    if (!tabla) return {};
    return {
        nombre: document.getElementById('nombre-emisor') ? document.getElementById('nombre-emisor').value : '',
        cedula: document.getElementById('cedula-emisor') ? document.getElementById('cedula-emisor').value : '',
        firma: (() => {
            const canvas = tabla.querySelector('.signatureCanvas');
            return canvas ? canvas.toDataURL() : '';
        })()
    };
}

function obtenerFirmaCanvas(id) {
    const canvas = document.getElementById(id);
    if (!canvas) return '';
    return canvas.toDataURL();
}

// Mostrar el historial de formularios de permiso de trabajo en altura
function mostrarHistorialPermisoTrabajo() {
    const historial = JSON.parse(localStorage.getItem('historialPermisoTrabajo') || '[]');
    const historialContainer = document.getElementById('historial-permisotrabajo');
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
                <p><strong>Ubicación:</strong> ${formData.ubicacion || 'No especificada'}</p>
                <p><strong>Guardado:</strong> ${fecha}</p>
                <div class="historial-buttons">
                    <button onclick="cargarFormularioPermisoTrabajo(${indiceOriginal})" class="btn-cargar">Cargar</button>
                    <button onclick="eliminarFormularioPermisoTrabajo(${indiceOriginal})" class="btn-eliminar">Eliminar</button>
                </div>
            </div>
        `;
    });
    html += '</div>';
    historialContainer.innerHTML = html;
}

// Cargar un formulario guardado
function cargarFormularioPermisoTrabajo(index) {
    const historial = JSON.parse(localStorage.getItem('historialPermisoTrabajo') || '[]');
    const formData = historial[index];
    if (!formData) {
        mostrarToastPermisoTrabajo('No se encontró el formulario');
        return;
    }
    try {
        document.getElementById('codigo').value = formData.codigo || '';
        if(document.getElementById('codigo2')) document.getElementById('codigo2').value = formData.codigo2 || '';
        document.getElementById('fecha-vigencia').value = formData.fechaVigencia || '';
        document.getElementById('fecha-expedicion-date').value = formData.fechaExpedicion || '';
        document.getElementById('fecha-inicio').value = formData.fechaInicio || '';
        document.getElementById('hora-inicio').value = formData.horaInicio || '';
        document.getElementById('fecha-fin').value = formData.fechaFin || '';
        document.getElementById('hora-fin').value = formData.horaFin || '';
        document.getElementById('empresa').value = formData.empresa || '';
        document.getElementById('proceso').value = formData.proceso || '';
        document.getElementById('ubicacion').value = formData.ubicacion || '';
        document.getElementById('descripcion-trabajo').value = formData.descripcionTrabajo || '';
        restaurarRadio('tipo-trabajo', formData.tipoTrabajo);
        document.getElementById('otro-trabajo').value = formData.otroTrabajo || '';
        document.getElementById('altura').value = formData.altura || '';
        document.getElementById('arl').value = formData.arl || '';
        restaurarCheckboxes('riesgos', formData.riesgos);
        document.getElementById('otro-riesgo').value = formData.otroRiesgo || '';
        restaurarMedidasPrevencion(formData.medidasPrevencion);
        if(document.getElementById('otra-medida')) document.getElementById('otra-medida').value = formData.otraMedida || '';
        restaurarCheckboxes('epp', formData.epp);
        if(document.getElementById('otros-epp')) document.getElementById('otros-epp').value = formData.otrosEpp || '';
        if(formData.inspeccion) restaurarInspeccionElementos(formData.inspeccion);
        restaurarCheckboxes('sistema-prevencion', formData.sistemaPrevencion);
        if(document.getElementById('otros-sistemas')) document.getElementById('otros-sistemas').value = formData.otrosSistemas || '';
        restaurarCheckboxes('equipos-acceso', formData.equiposAcceso);
        if(document.getElementById('otros-equipos')) document.getElementById('otros-equipos').value = formData.otrosEquipos || '';
        restaurarCheckboxes('herramientas', formData.herramientas);
        if(document.getElementById('otras-herramientas')) document.getElementById('otras-herramientas').value = formData.otrasHerramientas || '';
        restaurarEjecutores(formData.ejecutores);
        restaurarEmisorResponsable(formData.emisor);
        if(document.getElementById('observaciones-finales')) document.getElementById('observaciones-finales').value = formData.observacionesFinales || '';
        restaurarRadio('estado-final', formData.estadoFinal);
        if(document.getElementById('nombre-firma-ejecutor')) document.getElementById('nombre-firma-ejecutor').value = formData.nombreFirmaEjecutor || '';
        restaurarFirmaCanvas('firma-ejecutor-final', formData.firmaEjecutorFinal);
        if(document.getElementById('nombre-firma-emisor')) document.getElementById('nombre-firma-emisor').value = formData.nombreFirmaEmisor || '';
        restaurarFirmaCanvas('firma-emisor-final', formData.firmaEmisorFinal);
        mostrarToastPermisoTrabajo('Formulario cargado exitosamente');
    } catch (error) {
        mostrarToastPermisoTrabajo('Error al cargar el formulario');
    }
}

function restaurarRadio(name, value) {
    const radios = document.querySelectorAll(`input[name="${name}"]`);
    radios.forEach(radio => {
        radio.checked = radio.value === value;
    });
}

function restaurarCheckboxes(name, values) {
    const checkboxes = document.querySelectorAll(`input[name='${name}']`);
    checkboxes.forEach(cb => {
        cb.checked = values && values.includes(cb.value);
    });
}

function restaurarMedidasPrevencion(medidas) {
    if (!medidas) return;
    medidas.forEach(medida => {
        restaurarRadio(medida.medida, medida.valor);
    });
}

// --- INICIO: Funciones para alta resolución de firmas ---
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
// --- FIN: Funciones para alta resolución de firmas ---

function restaurarEjecutores(ejecutores) {
    if (!ejecutores) return;
    const filas = document.querySelectorAll('#tabla-ejecutores tbody tr');
    ejecutores.forEach((ej, i) => {
        if (!filas[i]) return;
        if (filas[i].querySelector('.ejecutor-nombre')) filas[i].querySelector('.ejecutor-nombre').value = ej.nombre || '';
        if (filas[i].querySelector('.ejecutor-cedula')) filas[i].querySelector('.ejecutor-cedula').value = ej.cedula || '';
        if (filas[i].querySelector('.ejecutor-firma')) {
            const canvas = filas[i].querySelector('.ejecutor-firma');
            if (canvas && ej.firma) {
                const ctx = setupHighResCanvas(canvas);
                const img = new Image();
                img.src = ej.firma;
                img.onload = () => drawImageCentered(ctx, img, canvas);
            }
        }
        restaurarRadio(`apto-tsa-${i}`, ej.aptoTsa);
        restaurarRadio(`certificado-tsa-${i}`, ej.certificadoTsa);
    });
}

function restaurarEmisorResponsable(emisor) {
    if (!emisor) return;
    if(document.getElementById('nombre-emisor')) document.getElementById('nombre-emisor').value = emisor.nombre || '';
    if(document.getElementById('cedula-emisor')) document.getElementById('cedula-emisor').value = emisor.cedula || '';
    const tabla = document.getElementById('tabla-emisor-firma');
    if (tabla && emisor.firma) {
        const canvas = tabla.querySelector('.signatureCanvas');
        if (canvas) {
            const ctx = setupHighResCanvas(canvas);
            const img = new Image();
            img.src = emisor.firma;
            img.onload = () => drawImageCentered(ctx, img, canvas);
        }
    }
}

function restaurarFirmaCanvas(id, dataUrl) {
    const canvas = document.getElementById(id);
    if (!canvas || !dataUrl) return;
    const ctx = setupHighResCanvas(canvas);
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => drawImageCentered(ctx, img, canvas);
}

function restaurarInspeccionElementos(datos) {
    // Selecciona la tabla de inspección (la primera tabla con thead que contiene 'Elemento / Sistemas')
    const tablas = Array.from(document.querySelectorAll('table'));
    const tabla = tablas.find(t => t.querySelector('thead th') && t.querySelector('thead th').textContent.includes('Elemento'));
    if (!tabla || !datos) return;
    const filas = Array.from(tabla.querySelectorAll('tbody tr'));
    datos.forEach((fila, i) => {
        if (!filas[i]) return;
        Array.from(filas[i].cells).forEach((td, j) => {
            const textarea = td.querySelector('textarea');
            if (textarea) textarea.value = fila[j] || '';
            const radios = td.querySelectorAll('input[type="radio"]');
            if (radios.length > 0) {
                radios.forEach(radio => {
                    radio.checked = (fila[j] === radio.value);
                });
            }
        });
    });
}

// Eliminar un formulario del historial
function eliminarFormularioPermisoTrabajo(index) {
    if (confirm('¿Estás seguro de que deseas eliminar este formulario del historial?')) {
        let historial = JSON.parse(localStorage.getItem('historialPermisoTrabajo') || '[]');
        historial.splice(index, 1);
        localStorage.setItem('historialPermisoTrabajo', JSON.stringify(historial));
        mostrarHistorialPermisoTrabajo();
        mostrarToastPermisoTrabajo('Formulario eliminado exitosamente');
    }
}

// Inicializar el historial y botón de limpiar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    mostrarHistorialPermisoTrabajo();
    document.getElementById('reloadButtonPermisoTrabajo').onclick = function() {
        // Limpiar campos principales
        document.getElementById('codigo').value = '';
        if(document.getElementById('codigo2')) document.getElementById('codigo2').value = '';
        document.getElementById('fecha-vigencia').value = '';
        document.getElementById('fecha-expedicion-date').value = '';
        document.getElementById('fecha-inicio').value = '';
        document.getElementById('hora-inicio').value = '';
        document.getElementById('fecha-fin').value = '';
        document.getElementById('hora-fin').value = '';
        document.getElementById('empresa').value = '';
        document.getElementById('proceso').value = '';
        document.getElementById('ubicacion').value = '';
        document.getElementById('descripcion-trabajo').value = '';
        restaurarRadio('tipo-trabajo', '');
        document.getElementById('otro-trabajo').value = '';
        document.getElementById('altura').value = '';
        document.getElementById('arl').value = '';
        restaurarCheckboxes('riesgos', []);
        document.getElementById('otro-riesgo').value = '';
        const medidas = [
            'demarcacion', 'portaherramientas', 'superficie-apoyo', 'lineas-energia', 'linea-vida',
            'tarea-acompanada', 'informacion-riesgos', 'elementos-enganche', 'acordonado',
            'revision-equipos', 'conoce-normas'
        ];
        medidas.forEach(medida => restaurarRadio(medida, ''));
        if(document.getElementById('otra-medida')) document.getElementById('otra-medida').value = '';
        restaurarCheckboxes('epp', []);
        if(document.getElementById('otros-epp')) document.getElementById('otros-epp').value = '';
        restaurarCheckboxes('sistema-prevencion', []);
        if(document.getElementById('otros-sistemas')) document.getElementById('otros-sistemas').value = '';
        restaurarCheckboxes('equipos-acceso', []);
        if(document.getElementById('otros-equipos')) document.getElementById('otros-equipos').value = '';
        restaurarCheckboxes('herramientas', []);
        if(document.getElementById('otras-herramientas')) document.getElementById('otras-herramientas').value = '';
        // Limpiar ejecutores
        const filas = document.querySelectorAll('#tabla-ejecutores tbody tr');
        filas.forEach((tr, i) => {
            if (tr.querySelector('.ejecutor-nombre')) tr.querySelector('.ejecutor-nombre').value = '';
            if (tr.querySelector('.ejecutor-cedula')) tr.querySelector('.ejecutor-cedula').value = '';
            if (tr.querySelector('.ejecutor-firma')) {
                const canvas = tr.querySelector('.ejecutor-firma');
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            restaurarRadio(`apto-tsa-${i}`, '');
            restaurarRadio(`certificado-tsa-${i}`, '');
        });
        // Limpiar emisor responsable
        if(document.getElementById('nombre-emisor')) document.getElementById('nombre-emisor').value = '';
        if(document.getElementById('cedula-emisor')) document.getElementById('cedula-emisor').value = '';
        const tabla = document.getElementById('tabla-emisor-firma');
        if (tabla) {
            const canvas = tabla.querySelector('.signatureCanvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
        if(document.getElementById('observaciones-finales')) document.getElementById('observaciones-finales').value = '';
        restaurarRadio('estado-final', '');
        if(document.getElementById('nombre-firma-ejecutor')) document.getElementById('nombre-firma-ejecutor').value = '';
        if(document.getElementById('firma-ejecutor-final')) {
            const canvas = document.getElementById('firma-ejecutor-final');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        if(document.getElementById('nombre-firma-emisor')) document.getElementById('nombre-firma-emisor').value = '';
        if(document.getElementById('firma-emisor-final')) {
            const canvas = document.getElementById('firma-emisor-final');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        // Limpiar inspección de elementos
        (function limpiarInspeccion(){
            const tablas = Array.from(document.querySelectorAll('table'));
            const tabla = tablas.find(t => t.querySelector('thead th') && t.querySelector('thead th').textContent.includes('Elemento'));
            if (!tabla) return;
            const filas = Array.from(tabla.querySelectorAll('tbody tr'));
            filas.forEach(tr => {
                Array.from(tr.cells).forEach(td => {
                    const textarea = td.querySelector('textarea');
                    if (textarea) textarea.value = '';
                    const radios = td.querySelectorAll('input[type="radio"]');
                    if (radios.length > 0) radios.forEach(radio => radio.checked = false);
                });
            });
        })();
        // Enfocar el primer campo
        const primerCampo = document.getElementById('codigo2');
        if (primerCampo) {
            primerCampo.focus();
            primerCampo.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        mostrarToastPermisoTrabajo('Formulario recargado exitosamente');
    };
}); 

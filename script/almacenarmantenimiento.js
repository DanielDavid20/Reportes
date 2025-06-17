// Función para guardar el estado actual del formulario
function guardarProgreso() {
    // Obtener historial existente o crear uno nuevo
    let historial = JSON.parse(localStorage.getItem('historialMantenimiento') || '[]');
    
    // Determinar el número de progreso
    let numeroProgreso = 1;
    if (historial.length > 0) {
        // Encontrar el número más alto de progreso
        const maxProgreso = Math.max(...historial.map(item => item.numeroProgreso || 0));
        numeroProgreso = maxProgreso + 1;
    }

    const formData = {
        numeroProgreso: numeroProgreso, // Añadir el número de progreso al objeto
        estadoEquipo: document.getElementById('estado-equipo').value,
        tipoMantenimiento: document.querySelector('input[name="tipo-mantenimiento"]:checked')?.value,
        cliente: document.getElementById('cliente').value,
        nit: document.getElementById('nit').value,
        direccion: document.getElementById('direccion').value,
        fechaServicio: document.getElementById('fecha-servicio').value,
        marca: document.getElementById('marca').value,
        tipo: document.getElementById('tipo').value,
        modelo: document.getElementById('modelo').value,
        capacidad: document.getElementById('capacidad').value,
        numeroSerie: document.getElementById('numero-serie').value,
        refrigerante: document.getElementById('refrigerante').value,
        reporteFallas: document.getElementById('reporte-fallas').value,
        repuestosUtilizados: document.getElementById('repuestos-utilizados').value,
        firmaTecnico: document.getElementById('signature-tecnico').toDataURL(),
        firmaRecibido: document.getElementById('signature-received').toDataURL(),
        firmaCoordinador: document.getElementById('signature-coordinador').toDataURL(),
        actividades: Array.from(document.querySelectorAll('#actividades tr')).map(row => ({
            descripcion: row.cells[1].textContent,
            efectuado: row.querySelector('input[type="checkbox"]').checked,
            detalles: row.querySelector('input[type="text"]').value
        })),
        parametros: Array.from(document.querySelectorAll('#parametros tr')).map(row => ({
            descripcion: row.cells[1].textContent,
            efectuado: row.querySelector('input[type="checkbox"]').checked,
            detalles: row.querySelector('input[type="text"]').value
        })),
        fechaGuardado: new Date().toISOString()
    };

    historial.push(formData);
    localStorage.setItem('historialMantenimiento', JSON.stringify(historial));
    
    alert('Progreso guardado exitosamente');
    mostrarHistorial();
}

// Función para cargar un formulario guardado
function cargarFormulario(index) {
    const historial = JSON.parse(localStorage.getItem('historialMantenimiento') || '[]');
    const formData = historial[index];

    if (!formData) {
        alert('No se encontró el formulario');
        return;
    }

    try {
        // Restaurar datos básicos
        document.getElementById('estado-equipo').value = formData.estadoEquipo || '';
        if (formData.tipoMantenimiento) {
            document.querySelector(`input[name="tipo-mantenimiento"][value="${formData.tipoMantenimiento}"]`).checked = true;
        }
        document.getElementById('cliente').value = formData.cliente || '';
        document.getElementById('nit').value = formData.nit || '';
        document.getElementById('direccion').value = formData.direccion || '';
        document.getElementById('fecha-servicio').value = formData.fechaServicio || '';
        document.getElementById('marca').value = formData.marca || '';
        document.getElementById('tipo').value = formData.tipo || '';
        document.getElementById('modelo').value = formData.modelo || '';
        document.getElementById('capacidad').value = formData.capacidad || '';
        document.getElementById('numero-serie').value = formData.numeroSerie || '';
        document.getElementById('refrigerante').value = formData.refrigerante || '';
        document.getElementById('reporte-fallas').value = formData.reporteFallas || '';
        document.getElementById('repuestos-utilizados').value = formData.repuestosUtilizados || '';

        // Restaurar firmas
        if (formData.firmaTecnico) {
            const ctxTecnico = document.getElementById('signature-tecnico').getContext('2d');
            const imgTecnico = new Image();
            imgTecnico.src = formData.firmaTecnico;
            imgTecnico.onload = () => ctxTecnico.drawImage(imgTecnico, 0, 0);
        }

        if (formData.firmaRecibido) {
            const ctxRecibido = document.getElementById('signature-received').getContext('2d');
            const imgRecibido = new Image();
            imgRecibido.src = formData.firmaRecibido;
            imgRecibido.onload = () => ctxRecibido.drawImage(imgRecibido, 0, 0);
        }

        if (formData.firmaCoordinador) {
            const ctxCoordinador = document.getElementById('signature-coordinador').getContext('2d');
            const imgCoordinador = new Image();
            imgCoordinador.src = formData.firmaCoordinador;
            imgCoordinador.onload = () => ctxCoordinador.drawImage(imgCoordinador, 0, 0);
        }

        // Restaurar actividades
        if (formData.actividades) {
            formData.actividades.forEach((actividad, index) => {
                const row = document.querySelectorAll('#actividades tr')[index];
                if (row) {
                    const checkbox = row.querySelector('input[type="checkbox"]');
                    const textInput = row.querySelector('input[type="text"]');
                    if (checkbox) checkbox.checked = actividad.efectuado;
                    if (textInput) textInput.value = actividad.detalles || '';
                }
            });
        }

        // Restaurar parámetros
        if (formData.parametros) {
            formData.parametros.forEach((parametro, index) => {
                const row = document.querySelectorAll('#parametros tr')[index];
                if (row) {
                    const checkbox = row.querySelector('input[type="checkbox"]');
                    const textInput = row.querySelector('input[type="text"]');
                    if (checkbox) checkbox.checked = parametro.efectuado;
                    if (textInput) textInput.value = parametro.detalles || '';
                }
            });
        }

        // Enfocar el primer campo del formulario
        const primerCampo = document.getElementById('estado-equipo');
        if (primerCampo) {
            primerCampo.focus();
            primerCampo.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Notificación de éxito
        if (typeof mostrarToast === 'function') {
            mostrarToast('Formulario cargado exitosamente');
        } else {
            alert('Formulario cargado exitosamente');
        }
    } catch (error) {
        console.error('Error al cargar el formulario:', error);
        alert('Error al cargar el formulario. Por favor, intente nuevamente.');
    }
}

// Función para eliminar un formulario del historial
function eliminarFormulario(index) {
    if (confirm('¿Estás seguro de que deseas eliminar este formulario del historial?')) {
        let historial = JSON.parse(localStorage.getItem('historialMantenimiento') || '[]');
        historial.splice(index, 1);
        localStorage.setItem('historialMantenimiento', JSON.stringify(historial));
        mostrarHistorial(); // Actualizar la vista del historial
        alert('Formulario eliminado exitosamente');
    }
}

// Función para mostrar el historial
function mostrarHistorial() {
    const historial = JSON.parse(localStorage.getItem('historialMantenimiento') || '[]');
    const historialContainer = document.getElementById('historial-container');
    
    if (!historialContainer) {
        console.error('No se encontró el contenedor del historial');
        return;
    }

    if (historial.length === 0) {
        historialContainer.innerHTML = '<p>No hay registros guardados</p>';
        return;
    }

    let html = '<h2>Formularios en Progreso</h2><div class="historial-lista">';
    
    // Ordenar por fecha
    const historialOrdenado = [...historial].sort((a, b) => {
        return new Date(a.fechaGuardado) - new Date(b.fechaGuardado);
    });
    
    historialOrdenado.forEach((formData) => {
        const fecha = new Date(formData.fechaGuardado).toLocaleString();
        const indiceOriginal = historial.indexOf(formData);
        html += `
            <div class="historial-item">
                <p><strong>Progreso ${formData.numeroProgreso}</strong></p>
                <p><strong>Cliente:</strong> ${formData.cliente || 'No especificado'}</p>
                <p><strong>Dirección:</strong> ${formData.direccion || 'No especificada'}</p>
                <p><strong>Fecha:</strong> ${fecha}</p>
                <div class="historial-buttons">
                    <button onclick="cargarFormulario(${indiceOriginal})" class="btn-cargar">Cargar este formulario</button>
                    <button onclick="eliminarFormulario(${indiceOriginal})" class="btn-eliminar">Eliminar</button>
                </div>
            </div>
        `;
    });

    html += '</div>';
    historialContainer.innerHTML = html;
}

// Función para recargar el formulario
function recargarFormulario() {
    if (confirm('¿Estás seguro de que deseas recargar el formulario? Se perderán todos los datos no guardados.')) {
        // Limpiar campos básicos
        document.getElementById('estado-equipo').value = '';
        document.querySelectorAll('input[name="tipo-mantenimiento"]').forEach(radio => radio.checked = false);
        document.getElementById('cliente').value = '';
        document.getElementById('nit').value = '';
        document.getElementById('direccion').value = '';
        document.getElementById('fecha-servicio').value = '';
        document.getElementById('marca').value = '';
        document.getElementById('tipo').value = '';
        document.getElementById('modelo').value = '';
        document.getElementById('capacidad').value = '';
        document.getElementById('numero-serie').value = '';
        document.getElementById('refrigerante').value = '';
        document.getElementById('reporte-fallas').value = '';
        document.getElementById('repuestos-utilizados').value = '';

        // Limpiar firmas
        const limpiarCanvas = (canvasId) => {
            const canvas = document.getElementById(canvasId);
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };

        limpiarCanvas('signature-tecnico');
        limpiarCanvas('signature-received');
        limpiarCanvas('signature-coordinador');

        // Limpiar actividades
        document.querySelectorAll('#actividades tr').forEach(row => {
            const checkbox = row.querySelector('input[type="checkbox"]');
            const textInput = row.querySelector('input[type="text"]');
            if (checkbox) checkbox.checked = false;
            if (textInput) textInput.value = '';
        });

        // Limpiar parámetros
        document.querySelectorAll('#parametros tr').forEach(row => {
            const checkbox = row.querySelector('input[type="checkbox"]');
            const textInput = row.querySelector('input[type="text"]');
            if (checkbox) checkbox.checked = false;
            if (textInput) textInput.value = '';
        });

        // Enfocar el primer campo del formulario
        const primerCampo = document.getElementById('estado-equipo');
        if (primerCampo) {
            primerCampo.focus();
            primerCampo.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Notificación de éxito
        if (typeof mostrarToast === 'function') {
            mostrarToast('Formulario recargado exitosamente');
        } else {
            alert('Formulario recargado exitosamente');
        }
    }
}

// Inicializar el historial cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    mostrarHistorial();
}); 
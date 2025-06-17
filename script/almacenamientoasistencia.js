// Función para limpiar el formulario de asistencia
function limpiarFormularioAsistencia() {
    // Limpiar campos básicos
    document.getElementById('Nombreact').value = '';
    document.getElementById('entidad').value = '';
    document.getElementById('Nombre').value = '';
    document.getElementById('lugar').value = '';
    document.getElementById('fecha-servicio').value = '';
    document.getElementById('tipo').value = '';
    document.getElementById('Duracion').value = '';
    document.getElementById('Objeto-actividad').value = '';

    // Limpiar tabla de asistencia (deja solo la primera fila)
    const tbody = document.querySelector('#asistenciaTable tbody');
    if (tbody) {
        while (tbody.rows.length > 1) {
            tbody.deleteRow(1);
        }
        // Limpiar la primera fila
        Array.from(tbody.rows[0].cells).forEach((cell, idx) => {
            if (idx < 3) cell.textContent = '';
        });
        // Limpiar canvas de la primera fila
        const canvas = tbody.rows[0].querySelector('.signatureCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    // Limpiar firma del coordinador
    const canvasCoord = document.getElementById('signature-coordinador');
    if (canvasCoord) {
        const ctx = canvasCoord.getContext('2d');
        ctx.clearRect(0, 0, canvasCoord.width, canvasCoord.height);
    }

    // Enfocar el primer campo
    const primerCampo = document.getElementById('Nombreact');
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

// Función para mostrar notificación tipo toast (si no existe en el HTML principal)
if (!document.getElementById('toast')) {
    const toastDiv = document.createElement('div');
    toastDiv.id = 'toast';
    toastDiv.className = 'toast';
    document.body.appendChild(toastDiv);
}

function mostrarToast(mensaje) {
    const toast = document.getElementById('toast');
    toast.textContent = mensaje;
    toast.className = 'toast show';
    setTimeout(() => {
        toast.className = 'toast';
    }, 2500);
}

// Guardar el estado actual del formulario de asistencia
function guardarProgresoAsistencia() {
    let historial = JSON.parse(localStorage.getItem('historialAsistencia') || '[]');
    let numeroProgreso = 1;
    if (historial.length > 0) {
        const maxProgreso = Math.max(...historial.map(item => item.numeroProgreso || 0));
        numeroProgreso = maxProgreso + 1;
    }
    const formData = {
        numeroProgreso: numeroProgreso,
        Nombreact: document.getElementById('Nombreact').value,
        entidad: document.getElementById('entidad').value,
        Nombre: document.getElementById('Nombre').value,
        lugar: document.getElementById('lugar').value,
        fechaServicio: document.getElementById('fecha-servicio').value,
        tipo: document.getElementById('tipo').value,
        Duracion: document.getElementById('Duracion').value,
        ObjetoActividad: document.getElementById('Objeto-actividad').value,
        // Guardar tabla de asistencia (datos y firmas)
        asistencia: Array.from(document.querySelectorAll('#asistenciaTable tbody tr')).map(row => ({
            nombre: row.cells[0]?.textContent || '',
            cedula: row.cells[1]?.textContent || '',
            cargo: row.cells[2]?.textContent || '',
            firma: (() => {
                const canvas = row.querySelector('.signatureCanvas');
                return canvas ? canvas.toDataURL() : '';
            })()
        })),
        // Guardar firma del coordinador como imagen
        firmaCoordinador: document.getElementById('signature-coordinador').toDataURL(),
        fechaGuardado: new Date().toISOString()
    };
    historial.push(formData);
    localStorage.setItem('historialAsistencia', JSON.stringify(historial));
    mostrarToast('Progreso guardado exitosamente');
    mostrarHistorialAsistencia();
}

// Mostrar el historial de formularios de asistencia
function mostrarHistorialAsistencia() {
    const historial = JSON.parse(localStorage.getItem('historialAsistencia') || '[]');
    const historialContainer = document.getElementById('historial-asistencia');
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
                <p><strong>Actividad:</strong> ${formData.Nombreact || 'No especificada'}</p>
                <p><strong>Entidad:</strong> ${formData.entidad || 'No especificada'}</p>
                <p><strong>Fecha:</strong> ${fecha}</p>
                <div class="historial-buttons">
                    <button onclick="cargarFormularioAsistencia(${indiceOriginal})" class="btn-cargar">Cargar</button>
                    <button onclick="eliminarFormularioAsistencia(${indiceOriginal})" class="btn-eliminar">Eliminar</button>
                </div>
            </div>
        `;
    });
    html += '</div>';
    historialContainer.innerHTML = html;
}

// Cargar un formulario guardado
function cargarFormularioAsistencia(index) {
    const historial = JSON.parse(localStorage.getItem('historialAsistencia') || '[]');
    const formData = historial[index];
    if (!formData) {
        mostrarToast('No se encontró el formulario');
        return;
    }
    try {
        document.getElementById('Nombreact').value = formData.Nombreact || '';
        document.getElementById('entidad').value = formData.entidad || '';
        document.getElementById('Nombre').value = formData.Nombre || '';
        document.getElementById('lugar').value = formData.lugar || '';
        document.getElementById('fecha-servicio').value = formData.fechaServicio || '';
        document.getElementById('tipo').value = formData.tipo || '';
        document.getElementById('Duracion').value = formData.Duracion || '';
        document.getElementById('Objeto-actividad').value = formData.ObjetoActividad || '';
        // Restaurar tabla de asistencia (datos y firmas)
        const tbody = document.querySelector('#asistenciaTable tbody');
        if (tbody) {
            // Limpiar todas las filas excepto la primera
            while (tbody.rows.length > 1) tbody.deleteRow(1);
            // Rellenar filas
            formData.asistencia.forEach((asist, idx) => {
                let row;
                if (idx === 0) {
                    row = tbody.rows[0];
                } else {
                    row = tbody.insertRow();
                    for (let i = 0; i < 5; i++) row.insertCell();
                    row.cells[0].setAttribute('contenteditable', 'true');
                    row.cells[1].setAttribute('contenteditable', 'true');
                    row.cells[2].setAttribute('contenteditable', 'true');
                    row.cells[3].innerHTML = '<canvas class="signatureCanvas" width="400" height="200"></canvas>';
                    row.cells[4].innerHTML = `<button class='clearSignatureButton' style='width:90%'>Limpiar Firma</button> <button class='deleteRowButton' style='width:90%'>Eliminar fila</button>`;
                }
                row.cells[0].textContent = asist.nombre || '';
                row.cells[1].textContent = asist.cedula || '';
                row.cells[2].textContent = asist.cargo || '';
                // Restaurar firma en el canvas de la fila
                const canvas = row.querySelector('.signatureCanvas');
                if (canvas && asist.firma) {
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    const img = new Image();
                    img.src = asist.firma;
                    img.onload = () => ctx.drawImage(img, 0, 0);
                }
            });
        }
        // Restaurar firma del coordinador
        if (formData.firmaCoordinador) {
            const canvasCoord = document.getElementById('signature-coordinador');
            if (canvasCoord) {
                const ctx = canvasCoord.getContext('2d');
                const img = new Image();
                img.src = formData.firmaCoordinador;
                img.onload = () => ctx.drawImage(img, 0, 0);
            }
        }
        // Enfocar el primer campo
        const primerCampo = document.getElementById('Nombreact');
        if (primerCampo) {
            primerCampo.focus();
            primerCampo.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        mostrarToast('Formulario cargado exitosamente');
    } catch (error) {
        mostrarToast('Error al cargar el formulario');
    }
}

// Eliminar un formulario del historial
function eliminarFormularioAsistencia(index) {
    if (confirm('¿Estás seguro de que deseas eliminar este formulario del historial?')) {
        let historial = JSON.parse(localStorage.getItem('historialAsistencia') || '[]');
        historial.splice(index, 1);
        localStorage.setItem('historialAsistencia', JSON.stringify(historial));
        mostrarHistorialAsistencia();
        mostrarToast('Formulario eliminado exitosamente');
    }
}

// Inicializar el historial al cargar la página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mostrarHistorialAsistencia);
} else {
    mostrarHistorialAsistencia();
} 
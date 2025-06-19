// Toast para mensajes
function mostrarToastTrabajoAltura(mensaje) {
    let toast = document.getElementById('toast-trabajoaltura');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-trabajoaltura';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = mensaje;
    toast.className = 'toast show';
    setTimeout(() => {
        toast.className = 'toast';
    }, 2500);
}

// Guardar el estado actual del formulario de trabajo en altura
function guardarProgresoTrabajoAltura() {
    let historial = JSON.parse(localStorage.getItem('historialTrabajoAltura') || '[]');
    let numeroProgreso = 1;
    if (historial.length > 0) {
        const maxProgreso = Math.max(...historial.map(item => item.numeroProgreso || 0));
        numeroProgreso = maxProgreso + 1;
    }
    // Guardar campos principales
    const formData = {
        numeroProgreso: numeroProgreso,
        codigo: document.getElementById('codigo').value,
        nombre: document.getElementById('nombre').value,
        cedula: document.getElementById('cedula').value,
        cargo: document.getElementById('cargo').value,
        lugar: document.getElementById('lugar').value,
        descripcion: document.getElementById('descripcion').value,
        // Guardar tabla de análisis de tareas
        tablaTareas: obtenerTablaTareasATS(),
        // Guardar tabla de firmas
        firmas: obtenerFirmasATS(),
        fechaGuardado: new Date().toISOString()
    };
    historial.push(formData);
    localStorage.setItem('historialTrabajoAltura', JSON.stringify(historial));
    mostrarToastTrabajoAltura('Progreso guardado exitosamente');
    mostrarHistorialTrabajoAltura();
}

// Obtener datos de la tabla de análisis de tareas
function obtenerTablaTareasATS() {
    const table = document.querySelectorAll('.table-responsive table')[1];
    if (!table) return [];
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    return rows.map(tr => Array.from(tr.children).map(td => td.innerHTML));
}

// Obtener datos de la tabla de firmas
function obtenerFirmasATS() {
    const table = document.getElementById('reportadoPorTable');
    if (!table) return [];
    const row = table.querySelector('tbody tr');
    if (!row) return [];
    return [
        row.cells[0].textContent,
        row.cells[1].querySelector('canvas') ? row.cells[1].querySelector('canvas').toDataURL() : '',
        row.cells[2].textContent,
        row.cells[3].querySelector('canvas') ? row.cells[3].querySelector('canvas').toDataURL() : ''
    ];
}

// Mostrar el historial de formularios de trabajo en altura
function mostrarHistorialTrabajoAltura() {
    const historial = JSON.parse(localStorage.getItem('historialTrabajoAltura') || '[]');
    const historialContainer = document.getElementById('historial-trabajoaltura');
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
                <p><strong>Nombre:</strong> ${formData.nombre || 'No especificado'}</p>
                <p><strong>Lugar:</strong> ${formData.lugar || 'No especificado'}</p>
                <p><strong>Guardado:</strong> ${fecha}</p>
                <div class="historial-buttons">
                    <button onclick="cargarFormularioTrabajoAltura(${indiceOriginal})" class="btn-cargar">Cargar</button>
                    <button onclick="eliminarFormularioTrabajoAltura(${indiceOriginal})" class="btn-eliminar">Eliminar</button>
                </div>
            </div>
        `;
    });
    html += '</div>';
    historialContainer.innerHTML = html;
}

// Cargar un formulario guardado
function cargarFormularioTrabajoAltura(index) {
    const historial = JSON.parse(localStorage.getItem('historialTrabajoAltura') || '[]');
    const formData = historial[index];
    if (!formData) {
        mostrarToastTrabajoAltura('No se encontró el formulario');
        return;
    }
    try {
        document.getElementById('codigo').value = formData.codigo || '';
        document.getElementById('nombre').value = formData.nombre || '';
        document.getElementById('cedula').value = formData.cedula || '';
        document.getElementById('cargo').value = formData.cargo || '';
        document.getElementById('lugar').value = formData.lugar || '';
        document.getElementById('descripcion').value = formData.descripcion || '';
        // Restaurar tabla de tareas
        restaurarTablaTareasATS(formData.tablaTareas);
        // Restaurar firmas
        restaurarFirmasATS(formData.firmas);
        mostrarToastTrabajoAltura('Formulario cargado exitosamente');
    } catch (error) {
        mostrarToastTrabajoAltura('Error al cargar el formulario');
    }
}

// Restaurar datos en la tabla de análisis de tareas
function restaurarTablaTareasATS(datos) {
    const table = document.querySelectorAll('.table-responsive table')[1];
    if (!table || !datos) return;
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    datos.forEach((fila, i) => {
        if (!rows[i]) return;
        fila.forEach((valor, j) => {
            rows[i].children[j].innerHTML = valor;
        });
    });
}

// Restaurar las firmas
function restaurarFirmasATS(datos) {
    if (!datos) return;
    const table = document.getElementById('reportadoPorTable');
    if (!table) return;
    const row = table.querySelector('tbody tr');
    if (!row) return;
    // Responsable ATS
    if (row.cells[0]) row.cells[0].textContent = datos[0] || '';
    // Firma Responsable
    const canvasResp = row.cells[1].querySelector('canvas');
    if (canvasResp && datos[1]) {
        const ctx = canvasResp.getContext('2d');
        ctx.clearRect(0, 0, canvasResp.width, canvasResp.height);
        const img = new Image();
        img.src = datos[1];
        img.onload = () => ctx.drawImage(img, 0, 0);
    }
    // Coordinador de Alturas
    if (row.cells[2]) row.cells[2].textContent = datos[2] || '';
    // Firma Coordinador
    const canvasCoord = row.cells[3].querySelector('canvas');
    if (canvasCoord && datos[3]) {
        const ctx = canvasCoord.getContext('2d');
        ctx.clearRect(0, 0, canvasCoord.width, canvasCoord.height);
        const img = new Image();
        img.src = datos[3];
        img.onload = () => ctx.drawImage(img, 0, 0);
    }
}

// Eliminar un formulario del historial
function eliminarFormularioTrabajoAltura(index) {
    if (confirm('¿Estás seguro de que deseas eliminar este formulario del historial?')) {
        let historial = JSON.parse(localStorage.getItem('historialTrabajoAltura') || '[]');
        historial.splice(index, 1);
        localStorage.setItem('historialTrabajoAltura', JSON.stringify(historial));
        mostrarHistorialTrabajoAltura();
        mostrarToastTrabajoAltura('Formulario eliminado exitosamente');
    }
}

// Inicializar el historial y botón de limpiar al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    mostrarHistorialTrabajoAltura();
    document.getElementById('reloadButtonTrabajoAltura').onclick = function() {
        // Limpiar campos principales
        document.getElementById('codigo').value = '';
        document.getElementById('nombre').value = '';
        document.getElementById('cedula').value = '';
        document.getElementById('cargo').value = '';
        document.getElementById('lugar').value = '';
        document.getElementById('descripcion').value = '';
        // Limpiar tabla de tareas
        const table = document.querySelectorAll('.table-responsive table')[1];
        if (table) {
            table.querySelectorAll('tbody tr').forEach(tr => {
                tr.querySelectorAll('td').forEach(td => {
                    td.innerHTML = '';
                });
            });
        }
        // Limpiar firmas
        const row = document.getElementById('reportadoPorTable').querySelector('tbody tr');
        if (row) {
            if (row.cells[0]) row.cells[0].textContent = '';
            if (row.cells[1]) {
                const canvas = row.cells[1].querySelector('canvas');
                if (canvas) {
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            }
            if (row.cells[2]) row.cells[2].textContent = '';
            if (row.cells[3]) {
                const canvas = row.cells[3].querySelector('canvas');
                if (canvas) {
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            }
        }
        // Enfocar el primer campo
        const primerCampo = document.getElementById('codigo');
        if (primerCampo) {
            primerCampo.focus();
            primerCampo.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        mostrarToastTrabajoAltura('Formulario recargado exitosamente');
    };
}); 
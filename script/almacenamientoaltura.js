// Toast para mensajes
function mostrarToastAltura(mensaje) {
    let toast = document.getElementById('toast-altura');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-altura';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = mensaje;
    toast.className = 'toast show';
    setTimeout(() => {
        toast.className = 'toast';
    }, 2500);
}

// Guardar el estado actual del formulario de inspección de altura
function guardarProgresoAltura() {
    let historial = JSON.parse(localStorage.getItem('historialAltura') || '[]');
    let numeroProgreso = 1;
    if (historial.length > 0) {
        const maxProgreso = Math.max(...historial.map(item => item.numeroProgreso || 0));
        numeroProgreso = maxProgreso + 1;
    }
    // Guardar campos principales
    const formData = {
        numeroProgreso: numeroProgreso,
        lugarejecucion: document.getElementById('lugarejecucion').value,
        responsableEquipo: document.getElementById('Responsablequipo').value,
        fechaServicio: document.getElementById('fecha-servicio').value,
        observaciones: document.getElementById('observaciones') ? document.getElementById('observaciones').value : '',
        // Guardar todas las tablas de chequeo por id
        arnes: obtenerTablaPorId('tablaArnes'),
        adaptador: obtenerTablaPorId('tablaAdaptador'),
        eslinga: obtenerTablaPorId('tablaEslinga'),
        cinturon: obtenerTablaPorId('tablaCinturon'),
        mosquetones: obtenerTablaPorId('tablaMosquetones'),
        casco: obtenerTablaPorId('tablaCasco'),
        lineaVida: obtenerTablaPorId('tablaLineaVida'),
        // Guardar tabla de firma final
        firmaFinal: obtenerFirmaFinalAltura(),
        fechaGuardado: new Date().toISOString()
    };
    historial.push(formData);
    localStorage.setItem('historialAltura', JSON.stringify(historial));
    mostrarToastAltura('Progreso guardado exitosamente');
    mostrarHistorialAltura();
}

// Obtener datos de una tabla por id
function obtenerTablaPorId(idTabla) {
    const table = document.getElementById(idTabla);
    if (!table) return [];
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    return rows.map(tr => Array.from(tr.querySelectorAll('td,th')).map(td => {
        if (td.querySelector('input[type="checkbox"]')) {
            return td.querySelector('input[type="checkbox"]').checked;
        } else if (td.querySelector('input[type="text"]')) {
            return td.querySelector('input[type="text"]').value;
        } else {
            return td.textContent.trim();
        }
    }));
}

// Obtener datos de la tabla de firma final
function obtenerFirmaFinalAltura() {
    const table = document.getElementById('reportadoPorTable');
    if (!table) return [];
    const row = table.querySelector('tbody tr');
    if (!row) return [];
    return [
        row.cells[0].querySelector('canvas') ? row.cells[0].querySelector('canvas').toDataURL() : '',
        row.cells[1].textContent,
        row.cells[2].textContent
    ];
}

// Mostrar el historial de formularios de altura
function mostrarHistorialAltura() {
    const historial = JSON.parse(localStorage.getItem('historialAltura') || '[]');
    const historialContainer = document.getElementById('historial-altura');
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
                <p><strong>Lugar:</strong> ${formData.lugarejecucion || 'No especificado'}</p>
                <p><strong>Responsable:</strong> ${formData.responsableEquipo || 'No especificado'}</p>
                <p><strong>Fecha:</strong> ${formData.fechaServicio || 'No especificada'}</p>
                <p><strong>Guardado:</strong> ${fecha}</p>
                <div class="historial-buttons">
                    <button onclick="cargarFormularioAltura(${indiceOriginal})" class="btn-cargar">Cargar</button>
                    <button onclick="eliminarFormularioAltura(${indiceOriginal})" class="btn-eliminar">Eliminar</button>
                </div>
            </div>
        `;
    });
    html += '</div>';
    historialContainer.innerHTML = html;
}

// Cargar un formulario guardado
function cargarFormularioAltura(index) {
    const historial = JSON.parse(localStorage.getItem('historialAltura') || '[]');
    const formData = historial[index];
    if (!formData) {
        mostrarToastAltura('No se encontró el formulario');
        return;
    }
    try {
        document.getElementById('lugarejecucion').value = formData.lugarejecucion || '';
        document.getElementById('Responsablequipo').value = formData.responsableEquipo || '';
        document.getElementById('fecha-servicio').value = formData.fechaServicio || '';
        if (document.getElementById('observaciones')) {
            document.getElementById('observaciones').value = formData.observaciones || '';
        }
        // Restaurar tablas principales por id
        restaurarTablaPorId('tablaArnes', formData.arnes);
        restaurarTablaPorId('tablaAdaptador', formData.adaptador);
        restaurarTablaPorId('tablaEslinga', formData.eslinga);
        restaurarTablaPorId('tablaCinturon', formData.cinturon);
        restaurarTablaPorId('tablaMosquetones', formData.mosquetones);
        restaurarTablaPorId('tablaCasco', formData.casco);
        restaurarTablaPorId('tablaLineaVida', formData.lineaVida);
        // Restaurar firma final
        restaurarFirmaFinalAltura(formData.firmaFinal);
        mostrarToastAltura('Formulario cargado exitosamente');
    } catch (error) {
        mostrarToastAltura('Error al cargar el formulario');
    }
}

// Restaurar datos en una tabla por id
function restaurarTablaPorId(idTabla, datos) {
    const table = document.getElementById(idTabla);
    if (!table || !datos) return;
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    datos.forEach((fila, i) => {
        if (!rows[i]) return;
        fila.forEach((valor, j) => {
            const td = rows[i].children[j];
            if (!td) return;
            if (td.querySelector('input[type="checkbox"]')) {
                td.querySelector('input[type="checkbox"]').checked = !!valor;
            } else if (td.querySelector('input[type="text"]')) {
                td.querySelector('input[type="text"]').value = valor;
            } else {
                td.textContent = valor;
            }
        });
    });
}

// Restaurar la firma final
function restaurarFirmaFinalAltura(datos) {
    if (!datos) return;
    const table = document.getElementById('reportadoPorTable');
    if (!table) return;
    const row = table.querySelector('tbody tr');
    if (!row) return;
    // Firma (canvas)
    const canvas = row.cells[0].querySelector('canvas');
    if (canvas && datos[0]) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const img = new Image();
        img.src = datos[0];
        img.onload = () => ctx.drawImage(img, 0, 0);
    }
    // Nombre y cédula
    if (row.cells[1]) row.cells[1].textContent = datos[1] || '';
    if (row.cells[2]) row.cells[2].textContent = datos[2] || '';
}

// Eliminar un formulario del historial
function eliminarFormularioAltura(index) {
    if (confirm('¿Estás seguro de que deseas eliminar este formulario del historial?')) {
        let historial = JSON.parse(localStorage.getItem('historialAltura') || '[]');
        historial.splice(index, 1);
        localStorage.setItem('historialAltura', JSON.stringify(historial));
        mostrarHistorialAltura();
        mostrarToastAltura('Formulario eliminado exitosamente');
    }
}

// Inicializar el historial al cargar la página
document.addEventListener('DOMContentLoaded', mostrarHistorialAltura); 
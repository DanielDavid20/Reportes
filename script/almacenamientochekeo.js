// Toast para mensajes
function mostrarToastChekeo(mensaje) {
    let toast = document.getElementById('toast-chekeo');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-chekeo';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = mensaje;
    toast.className = 'toast show';
    setTimeout(() => {
        toast.className = 'toast';
    }, 2500);
}

// Guardar el estado actual del formulario de chequeo
function guardarProgresoChekeo() {
    let historial = JSON.parse(localStorage.getItem('historialChekeo') || '[]');
    let numeroProgreso = 1;
    if (historial.length > 0) {
        const maxProgreso = Math.max(...historial.map(item => item.numeroProgreso || 0));
        numeroProgreso = maxProgreso + 1;
    }
    // Guardar campos principales
    const formData = {
        numeroProgreso: numeroProgreso,
        fechaServicio: document.getElementById('fecha-servicio').value,
        diligenciado: document.getElementById('Diligenciado').value,
        dependencia: document.getElementById('Dependencia').value,
        cargo: document.getElementById('cargo').value,
        // Guardar todas las tablas de chequeo
        herramientas: obtenerTabla('INSPECCION DE HERRAMIENTAS'),
        herramientasManuales: obtenerTabla('Herramientas Manuales'),
        tipoHerramienta: obtenerTablaPorEncabezados([
            'TIPO DE HERRAMIENTA', 'ÓPTIMO', 'REGULAR', 'DEFICIENTE', 'NO SE TIENE', 'OBSERVACIONES'
        ]),
        otrasHerramientas: obtenerTabla('Si existe otro tipo de herramienta'),
        herramientasMalEstado: obtenerTabla('Reporte de Herramientas en Mal Estado'),
        // Guardar tabla de firma final
        firmaFinal: obtenerFirmaFinal(),
        fechaGuardado: new Date().toISOString()
    };
    historial.push(formData);
    localStorage.setItem('historialChekeo', JSON.stringify(historial));
    mostrarToastChekeo('Progreso guardado exitosamente');
    mostrarHistorialChekeo();
}

// Obtener datos de una tabla por el texto del encabezado
function obtenerTabla(titulo) {
    const th = Array.from(document.querySelectorAll('table th')).find(th => th.textContent.includes(titulo));
    if (!th) return [];
    const table = th.closest('table');
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

// Restaurar datos en una tabla por el texto del encabezado
function restaurarTabla(titulo, datos) {
    const th = Array.from(document.querySelectorAll('table th')).find(th => th.textContent.includes(titulo));
    if (!th) return;
    const table = th.closest('table');
    if (!table) return;
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    if (!datos) return;
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

// Obtener datos de una tabla por encabezados exactos
function obtenerTablaPorEncabezados(encabezados) {
    const tablas = Array.from(document.querySelectorAll('table'));
    for (const table of tablas) {
        const ths = Array.from(table.querySelectorAll('thead tr:last-child th'));
        const textos = ths.map(th => th.textContent.trim().toUpperCase());
        if (encabezados.every((enc, i) => textos[i] === enc.toUpperCase())) {
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
    }
    return [];
}

// Obtener datos de la tabla de firma final
function obtenerFirmaFinal() {
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

// Mostrar el historial de formularios de chequeo
function mostrarHistorialChekeo() {
    const historial = JSON.parse(localStorage.getItem('historialChekeo') || '[]');
    const historialContainer = document.getElementById('historial-chekeo');
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
                <p><strong>Diligenciado:</strong> ${formData.diligenciado || 'No especificado'}</p>
                <p><strong>Fecha:</strong> ${formData.fechaServicio || 'No especificada'}</p>
                <p><strong>Guardado:</strong> ${fecha}</p>
                <div class="historial-buttons">
                    <button onclick="cargarFormularioChekeo(${indiceOriginal})" class="btn-cargar">Cargar</button>
                    <button onclick="eliminarFormularioChekeo(${indiceOriginal})" class="btn-eliminar">Eliminar</button>
                </div>
            </div>
        `;
    });
    html += '</div>';
    historialContainer.innerHTML = html;
}

// Cargar un formulario guardado
function cargarFormularioChekeo(index) {
    const historial = JSON.parse(localStorage.getItem('historialChekeo') || '[]');
    const formData = historial[index];
    if (!formData) {
        mostrarToastChekeo('No se encontró el formulario');
        return;
    }
    try {
        document.getElementById('fecha-servicio').value = formData.fechaServicio || '';
        document.getElementById('Diligenciado').value = formData.diligenciado || '';
        document.getElementById('Dependencia').value = formData.dependencia || '';
        document.getElementById('cargo').value = formData.cargo || '';
        // Restaurar tablas principales
        restaurarTabla('INSPECCION DE HERRAMIENTAS', formData.herramientas);
        restaurarTabla('Herramientas Manuales', formData.herramientasManuales);
        restaurarTablaPorEncabezados([
            'TIPO DE HERRAMIENTA', 'ÓPTIMO', 'REGULAR', 'DEFICIENTE', 'NO SE TIENE', 'OBSERVACIONES'
        ], formData.tipoHerramienta);
        restaurarTabla('Si existe otro tipo de herramienta', formData.otrasHerramientas);
        restaurarTabla('Reporte de Herramientas en Mal Estado', formData.herramientasMalEstado);
        // Restaurar firma final
        restaurarFirmaFinal(formData.firmaFinal);
        mostrarToastChekeo('Formulario cargado exitosamente');
    } catch (error) {
        mostrarToastChekeo('Error al cargar el formulario');
    }
}

// Restaurar datos en una tabla por encabezados exactos
function restaurarTablaPorEncabezados(encabezados, datos) {
    const tablas = Array.from(document.querySelectorAll('table'));
    for (const table of tablas) {
        const ths = Array.from(table.querySelectorAll('thead tr:last-child th'));
        const textos = ths.map(th => th.textContent.trim().toUpperCase());
        if (encabezados.every((enc, i) => textos[i] === enc.toUpperCase())) {
            const rows = Array.from(table.querySelectorAll('tbody tr'));
            if (!datos) return;
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
            return;
        }
    }
}

// Restaurar la firma final
function restaurarFirmaFinal(datos) {
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
function eliminarFormularioChekeo(index) {
    if (confirm('¿Estás seguro de que deseas eliminar este formulario del historial?')) {
        let historial = JSON.parse(localStorage.getItem('historialChekeo') || '[]');
        historial.splice(index, 1);
        localStorage.setItem('historialChekeo', JSON.stringify(historial));
        mostrarHistorialChekeo();
        mostrarToastChekeo('Formulario eliminado exitosamente');
    }
}

// Inicializar el historial al cargar la página
document.addEventListener('DOMContentLoaded', mostrarHistorialChekeo); 
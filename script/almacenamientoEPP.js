// Función para mostrar notificación tipo toast
function mostrarToast(mensaje) {
    const toast = document.getElementById('toast');
    toast.textContent = mensaje;
    toast.className = 'toast show';
    setTimeout(() => {
        toast.className = 'toast';
    }, 2500);
}

// Guardar el estado actual del formulario de EPP
function guardarProgresoEPP() {
    let historial = JSON.parse(localStorage.getItem('historialEPP') || '[]');
    let numeroProgreso = 1;
    if (historial.length > 0) {
        const maxProgreso = Math.max(...historial.map(item => item.numeroProgreso || 0));
        numeroProgreso = maxProgreso + 1;
    }
    // Guardar filas de la tabla principal (nombre, firma, EPP)
    const filas = Array.from(document.querySelectorAll('#asistenciaTable tbody tr')).filter(row => row.querySelector('.signatureCanvas'));
    const asistencia = filas.map(row => {
        // Obtener subtabla de EPP de esta fila
        const eppRows = row.querySelectorAll('table tbody tr');
        const epp = Array.from(eppRows).map(eppRow => {
            return {
                nombre: eppRow.cells[0]?.textContent || '',
                utiliza: eppRow.cells[1]?.querySelector('select')?.value || '',
                estado: eppRow.cells[2]?.querySelector('select')?.value || ''
            };
        });
        // Buscar la fila de observaciones justo después de la fila del trabajador
        let observaciones = '';
        if (row.nextElementSibling && row.nextElementSibling.querySelector('textarea')) {
            observaciones = row.nextElementSibling.querySelector('textarea').value;
        }
        return {
            nombre: row.cells[0]?.textContent || '',
            firma: (() => {
                const canvas = row.querySelector('.signatureCanvas');
                return canvas ? canvas.toDataURL() : '';
            })(),
            epp: epp,
            observaciones: observaciones
        };
    });
    
    // Guardar datos de la tabla final (REPORTADO POR y ENCARGADO SG-SST)
    const reportadoPor = document.querySelector('#reportadoPorTable tbody tr td:first-child')?.textContent || '';
    const encargadoSGST = document.querySelector('#reportadoPorTable tbody tr td:nth-child(3)')?.textContent || '';
    const firmasFinales = Array.from(document.querySelectorAll('#reportadoPorTable .signatureCanvas')).map(canvas => canvas.toDataURL());
    
    const formData = {
        numeroProgreso: numeroProgreso,
        Lugarinspeccion: document.getElementById('Lugarinspeccion').value,
        fechaServicio: document.getElementById('fecha-servicio').value,
        asistencia: asistencia,
        reportadoPor: reportadoPor,
        encargadoSGST: encargadoSGST,
        firmasFinales: firmasFinales,
        fechaGuardado: new Date().toISOString()
    };
    historial.push(formData);
    localStorage.setItem('historialEPP', JSON.stringify(historial));
    mostrarToast('Progreso guardado exitosamente');
    mostrarHistorialEPP();
}

// Mostrar el historial de formularios de EPP
function mostrarHistorialEPP() {
    const historial = JSON.parse(localStorage.getItem('historialEPP') || '[]');
    const historialContainer = document.getElementById('historial-epp');
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
                <p><strong>Lugar:</strong> ${formData.Lugarinspeccion || 'No especificado'}</p>
                <p><strong>Fecha:</strong> ${formData.fechaServicio || 'No especificada'}</p>
                <p><strong>Guardado:</strong> ${fecha}</p>
                <div class="historial-buttons">
                    <button onclick="cargarFormularioEPP(${indiceOriginal})" class="btn-cargar">Cargar</button>
                    <button onclick="eliminarFormularioEPP(${indiceOriginal})" class="btn-eliminar">Eliminar</button>
                </div>
            </div>
        `;
    });
    html += '</div>';
    historialContainer.innerHTML = html;
}

// Cargar un formulario guardado
function cargarFormularioEPP(index) {
    const historial = JSON.parse(localStorage.getItem('historialEPP') || '[]');
    const formData = historial[index];
    if (!formData) {
        mostrarToast('No se encontró el formulario');
        return;
    }
    try {
        document.getElementById('Lugarinspeccion').value = formData.Lugarinspeccion || '';
        document.getElementById('fecha-servicio').value = formData.fechaServicio || '';
        
        // Restaurar filas de la tabla principal
        const tbody = document.querySelector('#asistenciaTable tbody');
        if (tbody) {
            // Limpiar todas las filas existentes
            tbody.innerHTML = '';
            
            // Crear las filas de trabajadores y observaciones
            formData.asistencia.forEach((asist, idx) => {
                // Crear fila del trabajador
                const workerRow = tbody.insertRow();
                // Celda 1: Nombre
                const cellNombre = workerRow.insertCell();
                cellNombre.setAttribute('contenteditable', 'true');
                cellNombre.textContent = asist.nombre || '';
                // Celda 2: Firma
                const cellFirma = workerRow.insertCell();
                cellFirma.innerHTML = '<canvas class="signatureCanvas" width="500" height="140"></canvas>';
                // Celda 3: Botones
                const cellBotones = workerRow.insertCell();
                cellBotones.classList.add('hide-column');
                cellBotones.innerHTML = `<button class="clearSignatureButton">Limpiar Firma</button> <button class="deleteRowButton">Eliminar fila</button>`;
                // Celda 4: EPP
                const cellEPP = workerRow.insertCell();
                cellEPP.colSpan = 2;
                cellEPP.innerHTML = generarSubtablaEPP();
                
                // Restaurar firma
                const canvas = workerRow.querySelector('.signatureCanvas');
                if (canvas && asist.firma) {
                    const ctx = canvas.getContext('2d');
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    const img = new Image();
                    img.src = asist.firma;
                    img.onload = () => ctx.drawImage(img, 0, 0);
                }
                
                // Restaurar selects de EPP
                if (asist.epp && Array.isArray(asist.epp)) {
                    const eppTable = cellEPP.querySelector('table');
                    if (eppTable) {
                        const eppRows = eppTable.querySelectorAll('tbody tr');
                        asist.epp.forEach((eppObj, i) => {
                            if (eppRows[i]) {
                                const selects = eppRows[i].querySelectorAll('select');
                                if (selects[0]) selects[0].value = eppObj.utiliza;
                                if (selects[1]) selects[1].value = eppObj.estado;
                            }
                        });
                    }
                }
                
                // Crear fila de observaciones después de la fila del trabajador
                const obsRow = tbody.insertRow();
                obsRow.innerHTML = `<td colspan="5" style="padding-top:8px; border-top:2px solid #3498db;"><textarea style="font-family: Arial, sans-serif; width:98%; min-height:50px;">Observaciones: </textarea></td>`;
                if (obsRow.querySelector('textarea')) {
                    obsRow.querySelector('textarea').value = asist.observaciones || '';
                }
            });
        }
        
        // Restaurar firmas de la tabla final
        const firmasFinales = formData.firmasFinales || [];
        const canvasFinales = document.querySelectorAll('#reportadoPorTable .signatureCanvas');
        canvasFinales.forEach((canvas, i) => {
            if (firmasFinales[i]) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                const img = new Image();
                img.src = firmasFinales[i];
                img.onload = () => ctx.drawImage(img, 0, 0);
            }
        });
        
        // Restaurar campos de REPORTADO POR y ENCARGADO SG-SST
        const reportadoPorCell = document.querySelector('#reportadoPorTable tbody tr td:first-child');
        const encargadoSGSTCell = document.querySelector('#reportadoPorTable tbody tr td:nth-child(3)');
        
        if (reportadoPorCell && formData.reportadoPor) {
            reportadoPorCell.textContent = formData.reportadoPor;
        }
        if (encargadoSGSTCell && formData.encargadoSGST) {
            encargadoSGSTCell.textContent = formData.encargadoSGST;
        }
        
        // Enfocar el primer campo
        const primerCampo = document.getElementById('Lugarinspeccion');
        if (primerCampo) {
            primerCampo.focus();
            primerCampo.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        mostrarToast('Formulario cargado exitosamente');
    } catch (error) {
        console.error('Error al cargar formulario:', error);
        mostrarToast('Error al cargar el formulario');
    }
}

// Eliminar un formulario del historial
function eliminarFormularioEPP(index) {
    if (confirm('¿Estás seguro de que deseas eliminar este formulario del historial?')) {
        let historial = JSON.parse(localStorage.getItem('historialEPP') || '[]');
        historial.splice(index, 1);
        localStorage.setItem('historialEPP', JSON.stringify(historial));
        mostrarHistorialEPP();
        mostrarToast('Formulario eliminado exitosamente');
    }
}

// Limpiar el formulario (igual que reload pero con toast y enfoque)
document.getElementById('reloadButton').onclick = function() {
    // Limpiar campos básicos
    document.getElementById('Lugarinspeccion').value = '';
    document.getElementById('fecha-servicio').value = '';
    // Limpiar tabla principal
    const tbody = document.querySelector('#asistenciaTable tbody');
    if (tbody) {
        while (tbody.rows.length > 1) tbody.deleteRow(1);
        // Limpiar la primera fila
        const row = tbody.rows[0];
        if (row) {
            row.cells[0].textContent = '';
            const canvas = row.querySelector('.signatureCanvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
            // Limpiar selects
            const selects = row.querySelectorAll('select');
            selects.forEach(sel => sel.value = '');
        }
    }
    // Limpiar firmas de la tabla final
    const canvasFinales = document.querySelectorAll('#reportadoPorTable .signatureCanvas');
    canvasFinales.forEach(canvas => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    // Limpiar campos de REPORTADO POR y ENCARGADO SG-SST
    const reportadoPorCell = document.querySelector('#reportadoPorTable tbody tr td:first-child');
    const encargadoSGSTCell = document.querySelector('#reportadoPorTable tbody tr td:nth-child(3)');
    if (reportadoPorCell) {
        reportadoPorCell.textContent = '';
    }
    if (encargadoSGSTCell) {
        encargadoSGSTCell.textContent = '';
    }
    // Enfocar el primer campo
    const primerCampo = document.getElementById('Lugarinspeccion');
    if (primerCampo) {
        primerCampo.focus();
        primerCampo.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    mostrarToast('Formulario recargado exitosamente');
};

// Inicializar el historial al cargar la página
document.addEventListener('DOMContentLoaded', mostrarHistorialEPP);

// Generar subtabla EPP igual que el botón +
function generarSubtablaEPP() {
    return `
        <table id="asistenciaTable">
            <thead>
                <tr>
                    <th>EPP Asignado</th>
                    <th>Utiliza</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Gafas claras</td>
                    <td>
                        <select required>
                            <option value="" disabled selected></option>
                            <option value="si">Sí</option>
                            <option value="no">No</option>
                        </select>
                    </td>
                    <td>
                        <select required>
                             <option value="" disabled selected></option>
                            <option value="bueno">Bueno</option>
                            <option value="malo">Malo</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Gafas oscuras</td>
                    <td>
                        <select required>
                             <option value="" disabled selected></option>
                            <option value="si">Sí</option>
                            <option value="no">No</option>
                        </select>
                    </td>
                    <td>
                        <select required>
                            <option value="" disabled selected></option>
                            <option value="bueno">Bueno</option>
                            <option value="malo">Malo</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Ropa de dotación</td>
                    <td>
                        <select required>
                            <option value="" disabled selected></option>
                            <option value="si">Sí</option>
                            <option value="no">No</option>
                        </select>
                    </td>
                    <td>
                        <select required>
                             <option value="" disabled selected></option>
                            <option value="bueno">Bueno</option>
                            <option value="malo">Malo</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Botas de seguridad</td>
                    <td>
                        <select required>
                             <option value="" disabled selected></option>
                            <option value="si">Sí</option>
                            <option value="no">No</option>
                        </select>
                    </td>
                    <td>
                        <select required>
                             <option value="" disabled selected></option>
                            <option value="bueno">Bueno</option>
                            <option value="malo">Malo</option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Guantes de seguridad</td>
                    <td>
                        <select required>
                             <option value="" disabled selected></option>
                            <option value="si">Sí</option>
                            <option value="no">No</option>
                        </select>
                    </td>
                    <td>
                        <select required>
                             <option value="" disabled selected></option>
                            <option value="bueno">Bueno</option>
                            <option value="malo">Malo</option>
                        </select>
                    </td>
                </tr>
            </tbody>
        </table>
    `;
} 
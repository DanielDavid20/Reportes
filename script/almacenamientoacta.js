// Toast para mensajes en el formulario de Acta
function mostrarToastActa(mensaje) {
    let toast = document.getElementById('actaToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'actaToast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = mensaje;
    toast.className = 'toast show';
    setTimeout(() => {
        toast.className = 'toast';
    }, 2500);
}

// --- Funciones para obtener datos del formulario ---
function obtenerItemsActa() {
    const items = [];
    document.querySelectorAll('#itemsContainer .item input').forEach(input => {
        items.push(input.value);
    });
    return items;
}

// --- Funciones principales de guardado, carga y eliminación ---

// Guardar el estado actual del formulario de acta
function guardarProgresoActa() {
    let historial = JSON.parse(localStorage.getItem('historialActa') || '[]');
    let numeroProgreso = 1;
    if (historial.length > 0) {
        const maxProgreso = Math.max(...historial.map(item => item.numeroProgreso || 0));
        numeroProgreso = isFinite(maxProgreso) ? maxProgreso + 1 : 1;
    }

    const formData = {
        numeroProgreso: numeroProgreso,
        fecha: document.getElementById('fecha').value,
        municipio: document.getElementById('municipio').value,
        iglesia: document.getElementById('iglesia').value,
        representante: document.getElementById('representante').value,
        ccRepresentante: document.getElementById('ccRepresentante').value,
        pastor: document.getElementById('pastor').value,
        ccPastor: document.getElementById('ccPastor').value,
        items: obtenerItemsActa(),
        firmaRepresentante: document.getElementById('firmaRepresentante').toDataURL(),
        firmaPastor: document.getElementById('firmaPastor').toDataURL(),
        fechaGuardado: new Date().toISOString()
    };

    historial.push(formData);
    localStorage.setItem('historialActa', JSON.stringify(historial));
    mostrarToastActa('Progreso guardado exitosamente');
    mostrarHistorialActa(); // Actualiza la lista en el modal
}

// Mostrar el historial de actas en el modal
function mostrarHistorialActa() {
    const historial = JSON.parse(localStorage.getItem('historialActa') || '[]');
    const historialContainer = document.getElementById('actaHistorialLista');
    if (!historialContainer) return;

    // Ordenar el historial por numeroProgreso para asegurar el orden de guardado
    historial.sort((a, b) => (a.numeroProgreso || 0) - (b.numeroProgreso || 0));

    if (historial.length === 0) {
        historialContainer.innerHTML = '<p>No hay progresos guardados.</p>';
        return;
    }

    let html = '';
    historial.forEach((formData, index) => {
        const fecha = new Date(formData.fechaGuardado).toLocaleString();

        html += `
            <div class="acta-historial-item">
                <p><strong>Progreso #${formData.numeroProgreso}</strong></p>
                <p><strong>Municipio:</strong> ${formData.municipio || 'N/A'}</p>
                <p><strong>Iglesia:</strong> ${formData.iglesia || 'N/A'}</p>
                <p><strong>Guardado:</strong> ${fecha}</p>
                <div class="acta-historial-buttons">
                    <button onclick="cargarFormularioActa(${index})" class="btn-cargar">Cargar</button>
                    <button onclick="eliminarFormularioActa(${index})" class="btn-eliminar">Eliminar</button>
                </div>
            </div>
        `;
    });
    historialContainer.innerHTML = html;
}

// Cargar un formulario de acta guardado
function cargarFormularioActa(index) {
    const historial = JSON.parse(localStorage.getItem('historialActa') || '[]');
    const formData = historial[index];
    if (!formData) {
        mostrarToastActa('Error: No se encontró el progreso.');
        return;
    }

    try {
        // Restaurar campos de texto
        document.getElementById('fecha').value = formData.fecha || '';
        document.getElementById('municipio').value = formData.municipio || '';
        document.getElementById('iglesia').value = formData.iglesia || '';
        document.getElementById('representante').value = formData.representante || '';
        document.getElementById('ccRepresentante').value = formData.ccRepresentante || '';
        document.getElementById('pastor').value = formData.pastor || '';
        document.getElementById('ccPastor').value = formData.ccPastor || '';

        // Restaurar ítems
        const itemsContainer = document.getElementById('itemsContainer');
        itemsContainer.innerHTML = '';
        if (formData.items && formData.items.length > 0) {
            formData.items.forEach(itemText => {
                const div = document.createElement('div');
                div.className = 'item';
                div.innerHTML = `
                    <input type="text" value="${itemText}" required>
                    <button type="button" onclick="this.parentElement.remove()">❌</button>
                `;
                itemsContainer.appendChild(div);
            });
        }

        // Restaurar firmas
        const firmaRepresentanteCanvas = document.getElementById('firmaRepresentante');
        restaurarFirma(firmaRepresentanteCanvas, formData.firmaRepresentante);

        const firmaPastorCanvas = document.getElementById('firmaPastor');
        restaurarFirma(firmaPastorCanvas, formData.firmaPastor);

        mostrarToastActa('Progreso cargado exitosamente.');
        document.getElementById('actaProgressModal').style.display = 'none'; // Cerrar modal
    } catch (e) {
        console.error("Error al cargar el formulario:", e);
        mostrarToastActa('Error al cargar el progreso.');
    }
}

function restaurarFirma(canvas, dataURL) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (dataURL && !dataURL.endsWith('data:,')) { // No cargar si está vacío
        const img = new Image();
        img.src = dataURL;
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
    }
}

// Eliminar un formulario de acta del historial
function eliminarFormularioActa(index) {
    if (confirm('¿Estás seguro de que deseas eliminar este progreso?')) {
        let historial = JSON.parse(localStorage.getItem('historialActa') || '[]');
        historial.splice(index, 1);
        localStorage.setItem('historialActa', JSON.stringify(historial));
        mostrarHistorialActa();
        mostrarToastActa('Progreso eliminado.');
    }
}

// Limpiar el formulario de acta
function limpiarFormularioActa() {
    if (confirm('¿Estás seguro de que deseas limpiar todos los campos del formulario?')) {
        document.getElementById('actaForm').reset();
        document.getElementById('itemsContainer').innerHTML = '';
        
        // Limpiar firmas
        const firmaRepresentanteCanvas = document.getElementById('firmaRepresentante');
        const ctxRep = firmaRepresentanteCanvas.getContext('2d');
        ctxRep.clearRect(0, 0, firmaRepresentanteCanvas.width, firmaRepresentanteCanvas.height);

        const firmaPastorCanvas = document.getElementById('firmaPastor');
        const ctxPas = firmaPastorCanvas.getContext('2d');
        ctxPas.clearRect(0, 0, firmaPastorCanvas.width, firmaPastorCanvas.height);
        
        // Resetear fecha a hoy
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        document.getElementById('fecha').value = `${yyyy}-${mm}-${dd}`;

        mostrarToastActa('Formulario limpiado.');
    }
}


// Inicializar el historial al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    mostrarHistorialActa();

    // Asignar evento al botón de guardar
    const guardarBtn = document.getElementById('guardarProgresoActa');
    if (guardarBtn) {
        guardarBtn.addEventListener('click', guardarProgresoActa);
    }

    const limpiarBtn = document.getElementById('limpiarFormularioActa');
    if (limpiarBtn) {
        limpiarBtn.addEventListener('click', limpiarFormularioActa);
    }

    // Lógica para abrir y cerrar el modal
    const modal = document.getElementById('actaProgressModal');
    const verBtn = document.getElementById('verProgresosActa');
    const closeBtn = document.getElementById('closeActaProgressModal');

    if(verBtn) {
        verBtn.onclick = function() {
            modal.style.display = "block";
            mostrarHistorialActa(); // Asegurarse de que el contenido está actualizado
        }
    }

    if(closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = "none";
        }
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});

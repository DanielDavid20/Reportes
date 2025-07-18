document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('signatureModal');
    const modalCanvas = document.getElementById('modalCanvas');
    const ctx = modalCanvas.getContext('2d');
    let isDrawing = false; // Variable para saber si está dibujando
    let currentCanvas = null; // Canvas actual para firmar

    // Función para abrir el modal
    const openModal = (canvas) => {
        currentCanvas = canvas;
        modal.style.display = "block";
        ctx.clearRect(0, 0, modalCanvas.width, modalCanvas.height); // Limpiar el canvas del modal antes de empezar

        // Ajustar el tamaño del canvas modal
        const modalContent = document.querySelector('.modal-content');
        modalCanvas.width = modalContent.clientWidth - 40; // Margen (20px a cada lado)
        modalCanvas.height = 150; // Altura fija
    };

    // Abre el modal al hacer clic en cualquier canvas de firma
    const tables = ['asistenciaTable', 'reportadoPorTable'];
    tables.forEach(tableId => {
        document.getElementById(tableId).addEventListener('click', function (event) {
            if (event.target.classList.contains('signatureCanvas')) {
                openModal(event.target);
            }
        });
    });

    // Manejo del modal de firma
    const closeModal = document.querySelector('.close');
    closeModal.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    // Manejador para el dibujo en el canvas
    const startDrawing = (e) => {
        isDrawing = true;
        draw(e);
    };

    const stopDrawing = () => {
        isDrawing = false;
        ctx.beginPath(); // Reiniciar el camino
    };

    const draw = (e) => {
        if (!isDrawing) return; // Si no está dibujando, salir

        const rect = modalCanvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left; // Coordenada X ajustada
        const y = (e.clientY || e.touches[0].clientY) - rect.top; // Coordenada Y ajustada

        ctx.lineWidth = 3; // Espesor de la línea
      
        ctx.strokeStyle = 'rgb(13, 0, 255)'; // Color negro vivo con opacidad máxima

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    // Añadir eventos para mouse y touch
    modalCanvas.addEventListener('mousedown', startDrawing);
    modalCanvas.addEventListener('mouseup', stopDrawing);
    modalCanvas.addEventListener('mousemove', draw);
    modalCanvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDrawing(e); });
    modalCanvas.addEventListener('touchend', stopDrawing);
    modalCanvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); });

    // Guardar la firma en el canvas específico de la tabla
    document.getElementById('saveSignature').addEventListener('click', function () {
        if (currentCanvas) {
            const signatureCtx = currentCanvas.getContext('2d');
            signatureCtx.drawImage(modalCanvas, 0, 0, currentCanvas.width, currentCanvas.height);
        }
        modal.style.display = "none"; // Cerrar el modal
    });

    // Limpiar las firmas
    document.getElementById('clearSignatureReportedBy').addEventListener('click', function () {
        const canvas = document.querySelector('#reportadoPorTable tbody tr td:nth-child(2) .signatureCanvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
    });

    document.getElementById('clearSignatureEncargado').addEventListener('click', function () {
        const canvas = document.querySelector('#reportadoPorTable tbody tr td:nth-child(4) .signatureCanvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
    });

    // Opción para agregar nuevas filas en asistenciaTable
    document.getElementById('addRowBtn').addEventListener('click', function () {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
         <td contenteditable="true" class="cell" style="border: 1px solid #ccc; padding: 5px; width: 15%;"></td>
            <td class="cell"><canvas class="signatureCanvas" width="500" height="140"></canvas></td>
           <td class="cell hide-column"> <!-- Añadir la clase aquí -->
                <button class="clearSignatureButton">Limpiar Firma</button>
                <button class="deleteRowButton">Eliminar fila</button>
            </td>
            <td class="cell" colspan="2"> <!-- Unir celdas para EPP Asignado -->
                <table style="border: none; width: 100%;">
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
                                <select id="utiliza-gafas-claras" required>
                                    <option value="" disabled selected></option>
                                    <option value="si">Sí</option>
                                    <option value="no">No</option>
                                </select>
                            </td>
                            <td>
                                <select id="estado-gafas-claras" required>
                                    <option value="" disabled selected></option>
                                    <option value="bueno">Bueno</option>
                                    <option value="malo">Malo</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Gafas oscuras</td>
                            <td>
                                <select id="utiliza-gafas-oscuras" required>
                                    <option value="" disabled selected></option>
                                    <option value="si">Sí</option>
                                    <option value="no">No</option>
                                </select>
                            </td>
                            <td>
                                <select id="estado-gafas-oscuras" required>
                                    <option value="" disabled selected></option>
                                    <option value="bueno">Bueno</option>
                                    <option value="malo">Malo</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Ropa de dotación</td>
                            <td>
                                <select id="utiliza-ropa" required>
                                    <option value="" disabled selected></option>
                                    <option value="si">Sí</option>
                                    <option value="no">No</option>
                                </select>
                            </td>
                            <td>
                                <select id="estado-ropa" required>
                                    <option value="" disabled selected></option>
                                    <option value="bueno">Bueno</option>
                                    <option value="malo">Malo</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Botas de seguridad</td>
                            <td>
                                <select id="utiliza-botas" required>
                                    <option value="" disabled selected></option>
                                    <option value="si">Sí</option>
                                    <option value="no">No</option>
                                </select>
                            </td>
                            <td>
                                <select id="estado-botas" required>
                                    <option value="" disabled selected></option>
                                    <option value="bueno">Bueno</option>
                                    <option value="malo">Malo</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>Guantes de seguridad</td>
                            <td>
                                <select id="utiliza-guantes" required>
                                    <option value="" disabled selected></option>
                                    <option value="si">Sí</option>
                                    <option value="no">No</option>
                                </select>
                            </td>
                            <td>
                                <select id="estado-guantes" required>
                                    <option value="" disabled selected></option>
                                    <option value="bueno">Bueno</option>
                                    <option value="malo">Malo</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>

        `;

        // Fila de observaciones
        const obsRow = document.createElement('tr');
        obsRow.innerHTML = `
           <td colspan="3">
               <textarea style="font-family: Arial, sans-serif;">Observaciones: </textarea>
           </td>
        `;
        
        // Agregar la nueva fila y la fila de observaciones
        document.querySelector('#asistenciaTable tbody').appendChild(newRow);
        document.querySelector('#asistenciaTable tbody').appendChild(obsRow);
    });

    // Manejador para limpiar y eliminar filas en asistenciaTable
    document.getElementById('asistenciaTable').addEventListener('click', function (event) {
        // Limpiar firma
        if (event.target.classList.contains('clearSignatureButton')) {
            const row = event.target.closest('tr'); // Obtener la fila correspondiente
            const canvas = row.querySelector('.signatureCanvas'); // Obtener el canvas de esa fila
            const ctx = canvas.getContext('2d'); // Obtener su contexto
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
        }

        // Eliminar fila
        if (event.target.classList.contains('deleteRowButton')) {
            const row = event.target.closest('tr'); // Obtener la fila correspondiente
            row.nextElementSibling.remove(); // Eliminar la fila de observaciones
            row.remove(); // Eliminar la fila de la tabla
        }
    });

    // Configuración de la fecha de servicio
    const fechaServicioInput = document.getElementById('fecha-servicio');
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // Agregar un cero delante del mes y día si son menores a 10
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }

    const todayFormatted = `${year}-${month}-${day}`;
    fechaServicioInput.value = todayFormatted;
});
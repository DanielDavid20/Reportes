document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('signatureModal');
    const modalCanvas = document.getElementById('modalCanvas');
    const ctx = modalCanvas.getContext('2d');
    let isDrawing = false; // Variable para saber si está dibujando
    let currentCanvas = null; // Canvas actual para firmar

    // Abre el modal al hacer clic en cualquier canvas de firma
    document.getElementById('asistenciaTable').addEventListener('click', function (event) {
        if (event.target.classList.contains('signatureCanvas')) {
            currentCanvas = event.target; // Guarda la referencia del canvas actual
            modal.style.display = "block";
            ctx.clearRect(0, 0, modalCanvas.width, modalCanvas.height); // Limpiar el canvas del modal antes de empezar

            // Ajustar el tamaño del canvas modal para que se adapte al modal
            const modalContent = document.querySelector('.modal-content');
            modalCanvas.width = modalContent.clientWidth - 40; // Margen (20px a cada lado)
            modalCanvas.height = 150; // Altura fija
        }
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

        // Obtener la posición del mouse o toque en relación al canvas
        const rect = modalCanvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left; // Coordenada X ajustada
        const y = (e.clientY || e.touches[0].clientY) - rect.top; // Coordenada Y ajustada

        ctx.lineWidth = 3; // Espesor de la línea
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'rgba(0, 0, 0, 1)'; // Color negro con máxima intensidad

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
    
    // Opción para agregar nuevas filas
    document.getElementById('addRowBtn').addEventListener('click', function () {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
             <td contenteditable="true" style="border: 1px solid #ccc; padding: 5px; width: 15%;"></td>
                <td contenteditable="true" style="border: 1px solid #ccc; padding: 5px; width: 15%;"></td>
                <td contenteditable="true" style="border: 1px solid #ccc; padding: 5px; width: 15%;"></td>
                <td><canvas class="signatureCanvas" width="400" height="200"></canvas></td>
                <td>
                <button class="clearSignatureButton">Limpiar Firma</button>
                <button class="deleteRowButton">Eliminar fila</button> <!-- Nuevo botón para eliminar -->
            </td>
        `;
        document.querySelector('#asistenciaTable tbody').appendChild(newRow);
    });

    // Manejador para los botones de limpiar firma y eliminar fila
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
            row.remove(); // Eliminar la fila de la tabla
        }
    });

    // Código para el canvas del coordinador
    const coordinatorCanvas = document.getElementById('signature-coordinador');
    if (coordinatorCanvas) {
        const coordinatorCtx = coordinatorCanvas.getContext('2d');
        let isCoordinatingDrawing = false;

        // Manejo de eventos para dibujar en el canvas del coordinador
        const startCoordinatorDrawing = (e) => {
            isCoordinatingDrawing = true;
            drawCoordinator(e); // Llama a la función draw para empezar a dibujar
        };

        const stopCoordinatorDrawing = () => {
            isCoordinatingDrawing = false;
            coordinatorCtx.beginPath(); // Reiniciar el camino
        };

        const drawCoordinator = (e) => {
            if (!isCoordinatingDrawing) return; // Si no está dibujando, salir

            // Obtener la posición del mouse o toque en relación al canvas
            const rect = coordinatorCanvas.getBoundingClientRect();
            const x = (e.clientX || e.touches[0].clientX) - rect.left; // Coordenada X ajustada
            const y = (e.clientY || e.touches[0].clientY) - rect.top; // Coordenada Y ajustada

            coordinatorCtx.lineWidth = 2; // Espesor de la línea
            coordinatorCtx.lineCap = 'round';
            coordinatorCtx.strokeStyle = 'black'; // Color de la firma

            coordinatorCtx.lineTo(x, y);
            coordinatorCtx.stroke();
            coordinatorCtx.beginPath();
            coordinatorCtx.moveTo(x, y);
        };

        // Añadir eventos para mouse y touch en el canvas del coordinador
        coordinatorCanvas.addEventListener('mousedown', startCoordinatorDrawing);
        coordinatorCanvas.addEventListener('mouseup', stopCoordinatorDrawing);
        coordinatorCanvas.addEventListener('mousemove', drawCoordinator);
        coordinatorCanvas.addEventListener('touchstart', (e) => { e.preventDefault(); startCoordinatorDrawing(e); });
        coordinatorCanvas.addEventListener('touchend', stopCoordinatorDrawing);
        coordinatorCanvas.addEventListener('touchmove', (e) => { e.preventDefault(); drawCoordinator(e); });

        // Limpiar la firma del coordinador
        document.getElementById('clear-signature-coordinador').addEventListener('click', function() {
            coordinatorCtx.clearRect(0, 0, coordinatorCanvas.width, coordinatorCanvas.height);
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
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
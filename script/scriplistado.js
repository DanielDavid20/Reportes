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
            modalCanvas.height = 150; // Altura fija (puedes ajustar esto según tus necesidades)
        }
    });

    // Manejo del modal de firma
    const closeModal = document.querySelector('.close');
    closeModal.onclick = function () {
        modal.style.display = "none";
    }
    
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

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
        const rect = modalCanvas.getBoundingClientRect(); // Obtener el tamaño y posición
        const x = (e.clientX || e.touches[0].clientX) - rect.left; // Coordenada X ajustada
        const y = (e.clientY || e.touches[0].clientY) - rect.top; // Coordenada Y ajustada

        ctx.lineWidth = 2; // Espesor de la línea
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'black'; // Color de la firma

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

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
            <td><input type="text" placeholder="Nombre"></td>
            <td><input type="text" placeholder="Cédula"></td>
            <td><input type="text" placeholder="Cargo"></td>
            <td><canvas class="signatureCanvas" width="200" height="100"></canvas></td>
            <td><button class="clearSignatureButton">Limpiar Firma</button></td> <!-- Nuevo botón para limpiar -->
        `;
        document.querySelector('#asistenciaTable tbody').appendChild(newRow);
    });

    // Manejador para los botones de limpiar firma
    document.getElementById('asistenciaTable').addEventListener('click', function (event) {
        if (event.target.classList.contains('clearSignatureButton')) {
            const row = event.target.closest('tr'); // Obtener la fila correspondiente
            const canvas = row.querySelector('.signatureCanvas'); // Obtener el canvas de esa fila
            const ctx = canvas.getContext('2d'); // Obtener su contexto
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('signature-coordinador');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    // Manejo de eventos para dibujar en el canvas
    const startDrawing = (e) => {
        isDrawing = true;
        draw(e); // Llama a la función draw para empezar a dibujar
    };

    const stopDrawing = () => {
        isDrawing = false;
        ctx.beginPath(); // Reiniciar el camino
    };

    const draw = (e) => {
        if (!isDrawing) return; // Si no está dibujando, salir

        // Obtener la posición del mouse o toque en relación al canvas
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left; // Coordenada X ajustada
        const y = (e.clientY || e.touches[0].clientY) - rect.top; // Coordenada Y ajustada

        ctx.lineWidth = 2; // Espesor de la línea
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'black'; // Color de la firma

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    // Añadir eventos para mouse y touch
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDrawing(e); });
    canvas.addEventListener('touchend', stopDrawing);
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); });

    // Limpiar la firma
    document.getElementById('clear-signature-coordinador').addEventListener('click', function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
});
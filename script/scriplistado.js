document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('signatureModal');
    const modalCanvas = document.getElementById('modalCanvas');
    const modalBody = document.querySelector('.modal-body');
    const ctx = modalCanvas.getContext('2d');
    let isDrawing = false; // Variable para saber si está dibujando
    let currentCanvas = null; // Canvas actual para firmar
    let lastPoint = null; // Último punto para un dibujo más suave

    // --- DELEGACIÓN DE EVENTOS PARA ABRIR EL MODAL Y LIMPIAR FIRMAS ---
    document.body.addEventListener('click', function (event) {
        // Abrir modal desde un canvas de la tabla o del coordinador
        if (event.target.classList.contains('signatureCanvas')) {
            openSignatureModal(event.target);
        }
        // Limpiar firma del coordinador
        if (event.target.matches('#signature-pad-coordinador .clearSignatureButton')) {
            const canvas = document.getElementById('signature-coordinador');
            const canvasCtx = canvas.getContext('2d');
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        }
    });

    // --- MANEJO DEL MODAL ---
    const closeModalBtn = document.querySelector('.close');
    closeModalBtn.onclick = closeSignatureModal;
    window.onclick = function (event) {
        if (event.target == modal) {
            closeSignatureModal();
        }
    };

    function openSignatureModal(targetCanvas) {
        currentCanvas = targetCanvas;
        modal.style.display = "block";
        document.body.style.overflow = 'hidden'; // Evitar scroll del fondo
        // Retrasar el re-dimensionamiento para asegurar que el modal es visible
        setTimeout(() => {
            resizeModalCanvas();
            ctx.clearRect(0, 0, modalCanvas.width, modalCanvas.height);
        }, 50);
    }

    function closeSignatureModal() {
        modal.style.display = "none";
        document.body.style.overflow = 'auto'; // Reactivar scroll
    }

    // --- LÓGICA DEL CANVAS DE ALTA RESOLUCIÓN (PARA MEJOR CALIDAD EN MÓVILES) ---
    function resizeModalCanvas() {
        const rect = modalBody.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        // Ajustar el tamaño de renderizado del canvas (memoria)
        modalCanvas.width = rect.width * dpr;
        modalCanvas.height = rect.height * dpr;

        // Ajustar el tamaño de visualización del canvas (CSS)
        modalCanvas.style.width = `${rect.width}px`;
        modalCanvas.style.height = `${rect.height}px`;

        // Escalar el contexto para que las coordenadas coincidan
        ctx.scale(dpr, dpr);

        // Configurar estilo de línea
        ctx.lineWidth = 2; // Una línea más fina se ve mejor en alta resolución
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
    }
    window.addEventListener('resize', () => {
        if (modal.style.display === 'block') {
            resizeModalCanvas();
        }
    });

    // --- LÓGICA DE DIBUJO MEJORADA ---
    function getPenPosition(e) {
        const rect = modalCanvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    }

    const startDrawing = (e) => {
        e.preventDefault();
        isDrawing = true;
        lastPoint = getPenPosition(e);
    };

    const stopDrawing = () => {
        isDrawing = false;
        ctx.beginPath();
    };

    const draw = (e) => {
        if (!isDrawing) return;
        e.preventDefault();
        const currentPoint = getPenPosition(e);
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(currentPoint.x, currentPoint.y);
        ctx.stroke();
        lastPoint = currentPoint;
    };

    // Añadir eventos para mouse y touch
    modalCanvas.addEventListener('mousedown', startDrawing);
    modalCanvas.addEventListener('mouseup', stopDrawing);
    modalCanvas.addEventListener('mouseout', stopDrawing);
    modalCanvas.addEventListener('mousemove', draw);

    modalCanvas.addEventListener('touchstart', startDrawing, { passive: false });
    modalCanvas.addEventListener('touchend', stopDrawing);
    modalCanvas.addEventListener('touchmove', draw, { passive: false });

    // --- GUARDAR FIRMA ---
    document.getElementById('saveSignature').addEventListener('click', function () {
        if (currentCanvas) {
            const signatureCtx = currentCanvas.getContext('2d');
            // Limpiar el canvas de destino
            signatureCtx.clearRect(0, 0, currentCanvas.width, currentCanvas.height);
            // Dibujar la firma del modal (alta resolución) en el canvas de destino (tamaño original)
            // `drawImage` se encarga de escalar la imagen.
            signatureCtx.drawImage(modalCanvas, 0, 0, currentCanvas.width, currentCanvas.height);
        }
        closeSignatureModal();
    });
    
    // --- LÓGICA DE LA TABLA (AGREGAR/ELIMINAR FILAS) ---
    document.getElementById('addRowBtn').addEventListener('click', function () {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
             <td contenteditable="true"></td>
                <td contenteditable="true"></td>
                <td contenteditable="true"></td>
                <td><canvas class="signatureCanvas" width="400" height="200"></canvas></td>
                <td>
                <button class="clearSignatureButton">Limpiar Firma</button>
                <button class="deleteRowButton">Eliminar fila</button>
            </td>
        `;
        document.querySelector('#asistenciaTable tbody').appendChild(newRow);
    });

    document.getElementById('asistenciaTable').addEventListener('click', function (event) {
        if (event.target.classList.contains('clearSignatureButton')) {
            const row = event.target.closest('tr');
            const canvas = row.querySelector('.signatureCanvas');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        if (event.target.classList.contains('deleteRowButton')) {
            const row = event.target.closest('tr');
            row.remove();
        }
    });

    // --- INICIALIZACIÓN DE FECHA ---
    const fechaServicioInput = document.getElementById('fecha-servicio');
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    // Agregar un cero delante del mes y día si son menores a 10
    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;

    const todayFormatted = `${year}-${month}-${day}`;
    fechaServicioInput.value = todayFormatted;
});
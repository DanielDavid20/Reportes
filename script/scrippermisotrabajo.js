document.addEventListener('DOMContentLoaded', function () {
    // Configurar fecha actual SOLO si existen los campos
    const today = new Date();
    const dia = document.getElementById('dia-expedicion');
    const mes = document.getElementById('mes-expedicion');
    const ano = document.getElementById('ano-expedicion');
    if (dia && mes && ano) {
        dia.value = String(today.getDate()).padStart(2, '0');
        mes.value = String(today.getMonth() + 1).padStart(2, '0');
        ano.value = today.getFullYear();
    }
    const vigencia = document.getElementById('fecha-vigencia');
    if (vigencia) vigencia.value = '2022-10-06';

    // Manejo del modal de firma
    const modal = document.getElementById('signatureModal');
    const modalCanvas = document.getElementById('modalCanvas');
    const ctx = modalCanvas.getContext('2d');
    let isDrawing = false;
    let currentCanvas = null;

    // Función para asignar eventos a todos los canvas de firma (incluyendo los de la tabla de ejecutores)
    function asignarEventosCanvasFirma() {
        document.querySelectorAll('.signatureCanvas').forEach(canvas => {
            if (!canvas.dataset.listener) {
                canvas.addEventListener('click', function() {
                    abrirModalFirmaDesdeCanvas(this);
                });
                canvas.dataset.listener = 'true';
            }
        });
    }

    // Asignar evento a los botones 'Firmar' para abrir el modal de firma
    function asignarEventosBotonFirma() {
        document.querySelectorAll('.abrirModalFirma').forEach(boton => {
            if (!boton.dataset.listener) {
                boton.addEventListener('click', function() {
                    // Buscar el canvas hermano en la celda
                    const canvas = this.parentElement.querySelector('.signatureCanvas');
                    if (canvas) {
                        currentCanvas = canvas;
                        modal.style.display = "block";
                        ajustarCanvasModal();
                    }
                });
                boton.dataset.listener = 'true';
            }
        });
    }

    // Llamar a la función después de cargar el DOM
    asignarEventosCanvasFirma();
    asignarEventosBotonFirma();

    // Cerrar modal
    document.querySelector('.close').onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    // Funcionalidad de dibujo
    const startDrawing = (e) => {
        isDrawing = true;
        draw(e);
    };

    const stopDrawing = () => {
        isDrawing = false;
        ctx.beginPath();
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const rect = modalCanvas.getBoundingClientRect();
        const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
        const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = '#0a0a0a';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = '#222';
        ctx.shadowBlur = 0.5;
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    // Eventos para dibujar
    modalCanvas.addEventListener('mousedown', startDrawing);
    modalCanvas.addEventListener('mouseup', stopDrawing);
    document.removeEventListener('mousemove', draw);
    modalCanvas.addEventListener('mousemove', draw);

    // Eventos para pantallas táctiles
    modalCanvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        startDrawing(e);
    });
    modalCanvas.addEventListener('touchend', stopDrawing);
    modalCanvas.removeEventListener('touchmove', draw);
    modalCanvas.addEventListener('touchmove', function(e) { e.preventDefault(); draw(e); });

    // Función para configurar el canvas en alta resolución y devolver el contexto escalado
    function setupHighResCanvas(canvas, width, height) {
        const ratio = window.devicePixelRatio || 1;
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        const ctx = canvas.getContext("2d");
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(ratio, ratio);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        return ctx;
    }

    // Guardar firma
    document.getElementById('saveSignature').addEventListener('click', function() {
        if (currentCanvas) {
            // Ajustar el canvas destino a alta resolución
            const width = currentCanvas.offsetWidth || 120;
            const height = currentCanvas.offsetHeight || 50;
            const signatureCtx = setupHighResCanvas(currentCanvas, width, height);

            // Crear una imagen temporal de la firma del modal
            const img = new Image();
            img.onload = function() {
                // Calcular proporciones para centrar y mantener calidad
                const imgRatio = img.width / img.height;
                const canvasRatio = width / height;
                let drawWidth, drawHeight, drawX, drawY;
                if (imgRatio > canvasRatio) {
                    drawWidth = width;
                    drawHeight = width / imgRatio;
                    drawX = 0;
                    drawY = (height - drawHeight) / 2;
                } else {
                    drawHeight = height;
                    drawWidth = height * imgRatio;
                    drawX = (width - drawWidth) / 2;
                    drawY = 0;
                }
                signatureCtx.clearRect(0, 0, width, height);
                signatureCtx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
            };
            img.src = modalCanvas.toDataURL();
        }
        modal.style.display = "none";
    });

    // Limpiar firma en modal
    document.getElementById('clearModalSignature').addEventListener('click', function() {
        ctx.clearRect(0, 0, modalCanvas.width, modalCanvas.height);
        ctx.fillStyle = "#f9f9f9";
        ctx.fillRect(0, 0, modalCanvas.width, modalCanvas.height);
    });

    // Limpiar firmas individuales
    document.querySelectorAll('.clearSignatureButton').forEach(button => {
        button.addEventListener('click', function() {
            // Buscar el canvas hermano en la celda
            const canvas = this.parentElement.querySelector('.signatureCanvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        });
    });

    // Guardar permiso
    document.getElementById('guardar-permiso').addEventListener('click', function() {
        // Validar campos requeridos
        if (!document.getElementById('descripcion-trabajo').value) {
            alert('Por favor complete la descripción del trabajo');
            return;
        }

        // Aquí iría la lógica para guardar el permiso
        alert('Permiso guardado correctamente');
        
        // Opcional: Generar PDF o enviar datos al servidor
    });

    // Manejo del tipo de trabajo "Otro"
    document.querySelector('input[name="tipo-trabajo"][value="otro"]').addEventListener('change', function() {
        document.getElementById('otro-trabajo').disabled = !this.checked;
    });

    // Manejo del riesgo "Otro"
    document.querySelector('input[name="riesgos"][value="otro"]').addEventListener('change', function() {
        document.getElementById('otro-riesgo').disabled = !this.checked;
    });

    // Mejorar la calidad de la tinta y el modal de firma
    // 1. Reducir el ancho del modal de firma
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.maxWidth = '420px'; // Más cómodo en escritorio
        modalContent.style.width = '95%';
    }

    // 2. Ajustar el tamaño del canvas del modal al abrir
    function ajustarCanvasModal() {
        let width = 540;
        let height = 220;
        // Si es móvil, usar casi todo el ancho disponible
        if (window.innerWidth < 600) {
            width = Math.min(window.innerWidth * 0.98, 540);
            height = 200;
        }
        if (modalContent && modalCanvas) {
            modalContent.style.maxWidth = width + 'px';
            modalContent.style.width = width + 'px';
            if (window.innerWidth < 600) {
                modalContent.style.width = '98vw';
                modalContent.style.maxWidth = '98vw';
            }
            modalCanvas.width = width;
            modalCanvas.height = height;
            modalCanvas.style.width = width + 'px';
            modalCanvas.style.height = height + 'px';
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, modalCanvas.width, modalCanvas.height);
            ctx.fillStyle = "#f9f9f9";
            ctx.fillRect(0, 0, modalCanvas.width, modalCanvas.height);
        }
    }

    // Usar la función de ajuste de canvas al abrir el modal
    function abrirModalFirmaDesdeCanvas(canvas) {
        currentCanvas = canvas;
        modal.style.display = "block";
        ajustarCanvasModal();
    }

    // Llama a ajustarCanvasModal también en window resize para responsividad
    document.addEventListener('DOMContentLoaded', function() {
        window.addEventListener('resize', function() {
            if (modal.style.display === 'block') {
                ajustarCanvasModal();
            }
        });
    });
});
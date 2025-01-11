document.addEventListener("DOMContentLoaded", () => {
    // Cargar actividades y parámetros
    const actividades = [
        'Limpieza de filtros',
        'Limpieza del evaporador',
        'VERIFICACION DE SISTEMA ELECTRICO',
        'SISTEMA DE PROTECCION',
        'Limpieza de blower evaporador',
        'Ajuste de contacto electrico',
        'Limpieza de caja electrica',
        'Limpieza de drenaje',
        'Verificacion de operatividad del termostato',
        'Limpieza de condesadora'
    ];

    const parametros = [
        'Presion de baja',
        'Presion de alta',
        'Amperaje del compresor',
        'Voltaje de alimentacion'
    ];

    const actividadesTable = document.getElementById('actividades');
    const parametrosTable = document.getElementById('parametros');

    actividades.forEach((actividad, index) => {
        actividadesTable.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${actividad}</td>
                <td><input type="checkbox"></td>
                <td><input type="text" placeholder="Descripción"></td>
            </tr>
        `;
    });

    parametros.forEach((parametro, index) => {
        parametrosTable.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${parametro}</td>
                <td><input type="checkbox"></td>
                <td><input type="text" placeholder="Descripción"></td>
            </tr>
        `;
    });

    // Manejo de las firmas
    const setupSignaturePad = (canvasId, clearButtonId) => {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
        let drawing = false;
        let lastX, lastY;
        let touchPoints = [];

        const getCoordinates = (clientX, clientY) => {
            const rect = canvas.getBoundingClientRect();
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        };

        canvas.addEventListener('mousedown', (e) => {
            drawing = true;
            const coords = getCoordinates(e.clientX, e.clientY);
            touchPoints.push({ x: coords.x, y: coords.y });
            lastX = coords.x;
            lastY = coords.y;
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!drawing) return;
            const coords = getCoordinates(e.clientX, e.clientY);
            touchPoints.push({ x: coords.x, y: coords.y });
            drawCurve();
            lastX = coords.x;
            lastY = coords.y;
        });

        canvas.addEventListener('mouseup', () => {
            drawing = false;
            touchPoints = [];
        });

        canvas.addEventListener('mouseout', () => {
            drawing = false;
            touchPoints = [];
        });

        // Event handlers para dispositivos táctiles
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            drawing = true;
            const coords = getCoordinates(e.touches[0].clientX, e.touches[0].clientY);
            touchPoints.push({ x: coords.x, y: coords.y });
            lastX = coords.x;
            lastY = coords.y;
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!drawing) return;

            const coords = getCoordinates(e.touches[0].clientX, e.touches[0].clientY);
            touchPoints.push({ x: coords.x, y: coords.y });
            drawCurve();
            lastX = coords.x;
            lastY = coords.y;
        });

        canvas.addEventListener('touchend', () => {
            drawing = false;
            touchPoints = [];
        });

        function drawCurve() {
            if (touchPoints.length < 2) return;

            ctx.lineWidth = 2;
            ctx.strokeStyle = 'blue';
            ctx.beginPath();
            const start = touchPoints[touchPoints.length - 2];
            const end = touchPoints[touchPoints.length - 1];
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        }

        document.getElementById(clearButtonId).addEventListener('click', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
    };

    // Configurar cada firma
    setupSignaturePad('signature-received', 'clear-signature-received');
    setupSignaturePad('signature-tecnico', 'clear-signature-tecnico');
    setupSignaturePad('signature-coordinador', 'clear-signature-coordinador');
});

    // Ejemplo de crear un botón para mostrar/ocultar un elemento
    document.addEventListener('DOMContentLoaded', function() {
        const toggleButton = document.getElementById('toggleTable');
        const tableContainer = document.getElementById('tableContainer');

        toggleButton.addEventListener('click', function() {
            if (tableContainer.style.display === 'none' || tableContainer.style.display === '') {
                tableContainer.style.display = 'block'; // Mostrar
                toggleButton.textContent = 'Ocultar Tabla'; // Cambiar texto
            } else {
                tableContainer.style.display = 'none'; // Ocultar
                toggleButton.textContent = 'Mostrar Tabla'; // Cambiar texto
            }
        });
    });
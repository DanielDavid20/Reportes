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
            lastX = coords.x;
            lastY = coords.y;
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!drawing) return;
            const coords = getCoordinates(e.clientX, e.clientY);
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(coords.x, coords.y);
            ctx.stroke();
            lastX = coords.x;
            lastY = coords.y;
        });

        canvas.addEventListener('mouseup', () => {
            drawing = false;
        });

        canvas.addEventListener('mouseout', () => {
            drawing = false;
        });

        // Event handlers para dispositivos táctiles
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent scrolling
            drawing = true;
            const coords = getCoordinates(e.touches[0].clientX, e.touches[0].clientY);
            lastX = coords.x;
            lastY = coords.y;
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!drawing) return;
        
            const coords = getCoordinates(e.touches[0].clientX, e.touches[0].clientY);
            
            // Ajustar la posición de la línea para que esté más arriba del dedo
            const yOffset = 10; // Cambia este valor para ajustar la distancia hacia arriba
            const startX = lastX;
            const startY = lastY + yOffset;
            const endX = coords.x;
            const endY = coords.y + yOffset;
        
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
            
            lastX = coords.x;
            lastY = coords.y;
        });

        canvas.addEventListener('touchend', () => {
            drawing = false;
        });

        document.getElementById(clearButtonId).addEventListener('click', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
    };

    // Configurar cada firma
    setupSignaturePad('signature-received', 'clear-signature-received');
    setupSignaturePad('signature-tecnico', 'clear-signature-tecnico');
    setupSignaturePad('signature-coordinador', 'clear-signature-coordinador');
});
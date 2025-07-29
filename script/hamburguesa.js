// Abrir y cerrar menú lateral
const menuToggle = document.getElementById('menu-toggle');
const sideMenu = document.getElementById('side-menu');
const closeMenu = document.getElementById('close-menu');
const overlay = document.createElement('div');
overlay.className = 'menu-overlay';

// Asegurarse de que el menú esté cerrado al cargar la página
window.addEventListener('DOMContentLoaded', function() {
  // Remover cualquier estado activo que pudiera haber quedado
  sideMenu.classList.remove('active');
  menuToggle.classList.remove('active');
  document.body.classList.remove('menu-open');
  if (document.body.contains(overlay)) {
    document.body.removeChild(overlay);
  }
});

// Función para abrir el menú
function openMenuFunction(e) {
  // Prevenir comportamiento por defecto
  if (e) e.preventDefault();
  
  // Si el menú ya está abierto, no hacer nada
  if (sideMenu.classList.contains('active')) return;
  
  sideMenu.classList.add('active');
  menuToggle.classList.add('active');
  document.body.classList.add('menu-open');
  
  // Asegurarse de que el overlay no esté ya añadido
  if (!document.body.contains(overlay)) {
    document.body.appendChild(overlay);
  }
}

// Añadir eventos para clic y táctil
menuToggle.addEventListener('click', openMenuFunction);
menuToggle.addEventListener('touchstart', function(e) {
  e.preventDefault(); // Prevenir comportamiento por defecto
  openMenuFunction(e);
}, { passive: false });

function closeMenuFunction() {
  // Añadir clase de transición para salida suave
  sideMenu.classList.add('closing');
  
  // Usar setTimeout para permitir que la animación termine
  setTimeout(() => {
    sideMenu.classList.remove('active');
    sideMenu.classList.remove('closing');
    menuToggle.classList.remove('active');
    document.body.classList.remove('menu-open');
    
    // Remover overlay si existe
    if (document.body.contains(overlay)) {
      // Añadir clase para animación de salida
      overlay.classList.add('fade-out');
      
      setTimeout(() => {
        if (document.body.contains(overlay)) {
          document.body.removeChild(overlay);
          overlay.classList.remove('fade-out');
        }
      }, 300); // Tiempo para la animación de desvanecimiento
    }
  }, 50); // Pequeño retraso para permitir que la clase 'closing' tenga efecto
}

closeMenu.addEventListener('click', closeMenuFunction);

// Cerrar menú al hacer clic o tocar fuera
overlay.addEventListener('click', closeMenuFunction);
overlay.addEventListener('touchstart', function(e) {
  // Prevenir comportamiento por defecto solo si es necesario
  if (sideMenu.classList.contains('active')) {
    e.preventDefault();
    closeMenuFunction();
  }
}, { passive: false });

// Cerrar menú con tecla ESC
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && sideMenu.classList.contains('active')) {
    closeMenuFunction();
  }
});

// Cerrar menú al cambiar el tamaño de la ventana a un tamaño grande
window.addEventListener('resize', function() {
  if (window.innerWidth > 992 && sideMenu.classList.contains('active')) {
    closeMenuFunction();
  }
});

// Mostrar inicial del usuario en el header desde loggedUserFName
function mostrarInicialUsuario() {
  const nombreSpan = document.getElementById('loggedUserFName');
  let nombre = '';
  if (nombreSpan && nombreSpan.textContent.trim().length > 0) {
    nombre = nombreSpan.textContent.trim();
  }
  if (nombre && nombre.length > 0) {
    document.getElementById('user-initial').textContent = nombre[0].toUpperCase();
  } else {
    document.getElementById('user-initial').textContent = '';
  }
}

// Esperar a que el DOM y el nombre estén listos
function esperarNombreYMostrarInicial() {
  const nombreSpan = document.getElementById('loggedUserFName');
  if (nombreSpan && nombreSpan.textContent.trim().length > 0) {
    mostrarInicialUsuario();
  } else {
    setTimeout(esperarNombreYMostrarInicial, 200);
  }
}
esperarNombreYMostrarInicial();

// Dropdown usuario
const userInitial = document.getElementById('user-initial');
const userDropdown = document.getElementById('user-dropdown');
const userDropdownEmail = document.getElementById('user-dropdown-email');
const loggedUserEmail = document.getElementById('loggedUserEmail');
const logoutBtn = document.getElementById('logout-btn');

function mostrarDropdownUsuario() {
  if (loggedUserEmail && userDropdownEmail) {
    userDropdownEmail.textContent = loggedUserEmail.textContent || '';
  }
  userDropdown.style.display = 'flex';
}
function ocultarDropdownUsuario() {
  userDropdown.style.display = 'none';
}
userInitial.addEventListener('click', function(e) {
  e.stopPropagation();
  if (userDropdown.style.display === 'flex') {
    ocultarDropdownUsuario();
  } else {
    mostrarDropdownUsuario();
  }
});
userInitial.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    userInitial.click();
  }
});
document.addEventListener('click', function(e) {
  if (userDropdown.style.display === 'flex' && !userDropdown.contains(e.target) && e.target !== userInitial) {
    ocultarDropdownUsuario();
  }
});
window.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') ocultarDropdownUsuario();
});
// Logout (puedes personalizar la acción)
if (logoutBtn) {
  logoutBtn.onclick = function() {
    // Aquí puedes poner tu lógica de logout
    window.location.href = 'index.html';
  };
}
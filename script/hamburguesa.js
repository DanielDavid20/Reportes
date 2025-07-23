// Script para menú hamburguesa
const menuToggle = document.getElementById('menu-toggle');
const sideMenu = document.getElementById('side-menu');
const closeMenu = document.getElementById('close-menu');

menuToggle.addEventListener('click', () => {
  sideMenu.classList.add('open');
  document.body.classList.add('menu-open');
});

closeMenu.addEventListener('click', () => {
  sideMenu.classList.remove('open');
  document.body.classList.remove('menu-open');
});

// Cerrar menú al hacer clic fuera del menú
window.addEventListener('click', (e) => {
  if (
    sideMenu.classList.contains('open') &&
    !sideMenu.contains(e.target) &&
    e.target !== menuToggle &&
    !menuToggle.contains(e.target)
  ) {
    sideMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
  }
});

// Opcional: cerrar menú con la tecla ESC
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && sideMenu.classList.contains('open')) {
    sideMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
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
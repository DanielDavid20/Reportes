// Importar las funciones que necesitas desde los SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, deleteUser } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, getDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAXszytDgsmZyreTP9aLHBMYXno-Zj3oyQ",
    authDomain: "login-form-ca18a.firebaseapp.com",
    projectId: "login-form-ca18a",
    storageBucket: "login-form-ca18a.firebasestorage.app",
    messagingSenderId: "872700542438",
    appId: "1:872700542438:web:5f59303405574e7194aa27"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

// Observa el estado de autenticación
onAuthStateChanged(auth, (user) => {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (loggedInUserId) {
        console.log(user);
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    document.getElementById('loggedUserFName').innerText = userData.firstName;
                    document.getElementById('loggedUserEmail').innerText = userData.email;
                    document.getElementById('loggedUserLName').innerText = userData.lastName;

                } else {
                    console.log("No se encontró un documento que coincida con el ID");
                }
            })
            .catch((error) => {
                console.log("Error al obtener el documento: ", error);
            });
    } else {
        console.log("User ID not found in local storage");
    }
});

// Manejo de los botones de cierre de sesión
const logoutButton = document.getElementById('logout-btn');
const sideMenuLogoutButton = document.getElementById('side-menu-logout-btn');

function handleLogout() {
    signOut(auth).then(() => {
        localStorage.removeItem('loggedInUserId');
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error('Error al cerrar sesión:', error);
    });
}

if (logoutButton) {
    logoutButton.addEventListener('click', handleLogout);
}

if (sideMenuLogoutButton) {
    sideMenuLogoutButton.addEventListener('click', handleLogout);
}

// Original logout button handling
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('loggedInUserId');
        signOut(auth)
            .then(() => {
                window.location.href = 'index.html';
            })
            .catch((error) => {
                console.error('Error al cerrar sesión:', error);
            });
    });
}

// Manejo del botón de eliminar cuenta
// Este botón solo está presente en la página Eliminarcuenta.html, no en principal.html
const deleteAccountButton = document.getElementById('deleteAccount');

if (deleteAccountButton) {
    deleteAccountButton.addEventListener('click', () => {
        const confirmDelete = confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es permanente y no se puede revertir. Pero puedes registrarte de nuevo");
        if (confirmDelete) {
            const loggedInUserId = localStorage.getItem('loggedInUserId');
            const user = auth.currentUser;

            // Eliminar el documento de Firestore
            const docRef = doc(db, "users", loggedInUserId);
            deleteDoc(docRef)
                .then(() => {
                    console.log("Documento eliminado correctamente de Firestore");

                    // Eliminar la cuenta de Firebase Authentication
                    deleteUser(user)
                        .then(() => {
                            console.log("Cuenta eliminada correctamente de Firebase Authentication");
                            localStorage.removeItem('loggedInUserId');
                            window.location.href = 'index.html';
                        })
                        .catch((error) => {
                            console.error("Error al eliminar la cuenta de Firebase Authentication: ", error);
                        });
                })
                .catch((error) => {
                    console.error("Error al eliminar el documento de Firestore: ", error);
                });
        }
    });
}


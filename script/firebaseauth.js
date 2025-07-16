 // Import the functions you need from the SDKs you need
 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
 import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
 import{getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"
 
 const firebaseConfig = {
    apiKey: "AIzaSyAXszytDgsmZyreTP9aLHBMYXno-Zj3oyQ",
    authDomain: "login-form-ca18a.firebaseapp.com",
    projectId: "login-form-ca18a",
    storageBucket: "login-form-ca18a.firebasestorage.app",
    messagingSenderId: "872700542438",
    appId: "1:872700542438:web:5f59303405574e7194aa27"
 };

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);

 function showMessage(message, divId){
    var messageDiv=document.getElementById(divId);
    messageDiv.style.display="block";
    messageDiv.innerHTML=message;
    messageDiv.style.opacity=1;
    setTimeout(function(){
        messageDiv.style.opacity=0;
    },5000);
 }
 function validarEmail(email) {
    // Expresión regular básica para validar email
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function marcarCampoInvalido(id) {
    const campo = document.getElementById(id);
    campo.style.borderBottom = '2px solid red';
}
function limpiarCampoInvalido(id) {
    const campo = document.getElementById(id);
    campo.style.borderBottom = '';
}

// Limpiar el rojo al escribir
['fName','lName','rEmail','rPassword','email','password'].forEach(id => {
    const campo = document.getElementById(id);
    if (campo) {
        campo.addEventListener('input', () => limpiarCampoInvalido(id));
    }
});

const signUp=document.getElementById('submitSignUp');
signUp.addEventListener('click', (event)=>{
    event.preventDefault();
    const email=document.getElementById('rEmail').value.trim();
    const password=document.getElementById('rPassword').value.trim();
    const firstName=document.getElementById('fName').value.trim();
    const lastName=document.getElementById('lName').value.trim();

    let camposFaltantes = [];
    if (!firstName) { marcarCampoInvalido('fName'); camposFaltantes.push('Nombre'); }
    if (!lastName) { marcarCampoInvalido('lName'); camposFaltantes.push('Apellido'); }
    if (!email) { marcarCampoInvalido('rEmail'); camposFaltantes.push('Correo electrónico'); }
    if (!password) { marcarCampoInvalido('rPassword'); camposFaltantes.push('Contraseña'); }
    if (camposFaltantes.length > 0) {
        showMessage('Falta completar: ' + camposFaltantes.join(', '), 'signUpMessage');
        return;
    }
    if (!validarEmail(email)) {
        marcarCampoInvalido('rEmail');
        showMessage('Por favor, ingresa un correo electrónico válido.', 'signUpMessage');
        return;
    }
    if (password.length < 6) {
        marcarCampoInvalido('rPassword');
        showMessage('La contraseña debe tener al menos 6 caracteres.', 'signUpMessage');
        return;
    }

    const auth=getAuth();
    const db=getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential)=>{
        const user=userCredential.user;
        const userData={
            email: email,
            firstName: firstName,
            lastName:lastName
        };
        showMessage('Cuenta creada exitosamente', 'signUpMessage');
        const docRef=doc(db, "users", user.uid);
        setDoc(docRef,userData)
        .then(()=>{
            window.location.href='index.html';
        })
        .catch((error)=>{
            console.error("error writing document", error);

        });
    })
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode=='auth/email-already-in-use'){
            showMessage('¡El correo electrónico ya está registrado!', 'signUpMessage');
        }
        else{
            showMessage('No se pudo crear el usuario', 'signUpMessage');
        }
    })
 });

 const signIn=document.getElementById('submitSignIn');
 signIn.addEventListener('click', (event)=>{
    event.preventDefault();
    const email=document.getElementById('email').value.trim();
    const password=document.getElementById('password').value.trim();

    let camposFaltantes = [];
    if (!email) { marcarCampoInvalido('email'); camposFaltantes.push('Correo electrónico'); }
    if (!password) { marcarCampoInvalido('password'); camposFaltantes.push('Contraseña'); }
    if (camposFaltantes.length > 0) {
        showMessage('Falta completar: ' + camposFaltantes.join(', '), 'signInMessage');
        return;
    }
    if (!validarEmail(email)) {
        marcarCampoInvalido('email');
        showMessage('Por favor, ingresa un correo electrónico válido.', 'signInMessage');
        return;
    }
    if (password.length < 6) {
        marcarCampoInvalido('password');
        showMessage('La contraseña debe tener al menos 6 caracteres.', 'signInMessage');
        return;
    }
    const auth=getAuth();

    signInWithEmailAndPassword(auth, email,password)
    .then((userCredential)=>{
        showMessage('Inicio de sesión exitoso', 'signInMessage');
        const user=userCredential.user;
        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href='principal.html';
    })
    .catch((error)=>{
        const errorCode=error.code;
        if(errorCode==='auth/invalid-credential'){
            showMessage('Correo o contraseña incorrectos', 'signInMessage');
        }
        else{
            showMessage('La cuenta no existe', 'signInMessage');
        }
    })
 })
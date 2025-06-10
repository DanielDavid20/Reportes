// Variables para el sistema de firmas
let currentSignatureCanvas = null
const signatureModal = document.getElementById("signatureModal")
const signaturePad = document.getElementById("signaturePad")
let ctx = signaturePad.getContext("2d")
let isDrawing = false
let lastX = 0
let lastY = 0
let currentColor = "#000000"
let currentSize = 2
let resizeTimeout = null

// Configurar un canvas con alta resolución
function setupHighResCanvas(canvas) {
  if (!canvas || !canvas.getContext) return null

  const rect = canvas.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return null

  const ratio = Math.max(window.devicePixelRatio || 1, 1)

  // Configurar dimensiones reales
  canvas.width = rect.width * ratio
  canvas.height = rect.height * ratio

  // Mantener el tamaño visual
  canvas.style.width = rect.width + "px"
  canvas.style.height = rect.height + "px"

  // Configurar el contexto
  const context = canvas.getContext("2d")
  context.scale(ratio, ratio)
  context.lineJoin = "round"
  context.lineCap = "round"
  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = "high"

  return context
}

// Inicializar todos los canvas del formulario
function initializeFormCanvases() {
  // Configurar todos los canvas de firma del formulario
  document.querySelectorAll(".signatureCanvas, .mini-signature").forEach((canvas) => {
    if (canvas && canvas.offsetWidth > 0 && canvas.offsetHeight > 0) {
      setupHighResCanvas(canvas)
    }
  })
}

// Función para validar campos obligatorios
function validarCamposObligatorios() {
  const camposObligatorios = [
    { id: "fecha-expedicion", nombre: "Fecha de Expedición del Permiso" },
    { id: "fecha-inicial", nombre: "Fecha Inicial de Vigencia" },
    { id: "fecha-final", nombre: "Fecha Final de Vigencia" },
    { id: "hora-inicial", nombre: "Hora Inicial" },
    { id: "hora-final", nombre: "Hora Final" },
    { id: "empresa", nombre: "Empresa Contratista" },
    { id: "area", nombre: "Área o Lugar" },
    { id: "num-personas", nombre: "Número de Personas Ejecutoras" },
    { id: "responsable", nombre: "Responsable de los Trabajos" },
    { id: "actividad", nombre: "Actividad a Realizar" },
  ]

  const camposVacios = []

  // Validar cada campo obligatorio
  camposObligatorios.forEach((campo) => {
    const elemento = document.getElementById(campo.id)
    if (!elemento || !elemento.value.trim()) {
      camposVacios.push(campo.nombre)
    }
  })

  // Si hay campos vacíos, mostrar alerta
  if (camposVacios.length > 0) {
    let mensaje = "Por favor complete los siguientes campos obligatorios:\n\n"
    camposVacios.forEach((campo) => {
      mensaje += "• " + campo + "\n"
    })

    alert(mensaje)

    // Enfocar el primer campo vacío
    const primerCampoVacio = document.getElementById(
      camposObligatorios.find((campo) => camposVacios.includes(campo.nombre))?.id,
    )
    if (primerCampoVacio) {
      primerCampoVacio.focus()
      primerCampoVacio.scrollIntoView({ behavior: "smooth", block: "center" })
    }

    return false
  }

  return true
}

// Función para validar formato de fecha
function validarFormatoFecha(fecha) {
  const regex = /^\d{4}-\d{2}-\d{2}$/
  return regex.test(fecha)
}

// Función para validar formato de hora
function validarFormatoHora(hora) {
  const regex = /^\d{2}:\d{2}$/
  return regex.test(hora)
}

// Función para validar que la fecha final sea posterior a la inicial
function validarRangoFechas() {
  const fechaInicial = document.getElementById("fecha-inicial").value
  const fechaFinal = document.getElementById("fecha-final").value

  if (fechaInicial && fechaFinal) {
    const dateInicial = new Date(fechaInicial)
    const dateFinal = new Date(fechaFinal)

    if (dateFinal < dateInicial) {
      alert("La fecha final debe ser posterior o igual a la fecha inicial.")
      return false
    }
  }

  return true
}

// Función para validar que la hora final sea posterior a la inicial (mismo día)
function validarRangoHoras() {
  const fechaInicial = document.getElementById("fecha-inicial").value
  const fechaFinal = document.getElementById("fecha-final").value
  const horaInicial = document.getElementById("hora-inicial").value
  const horaFinal = document.getElementById("hora-final").value

  // Solo validar horas si es el mismo día
  if (fechaInicial === fechaFinal && horaInicial && horaFinal) {
    const [horaIni, minIni] = horaInicial.split(":").map(Number)
    const [horaFin, minFin] = horaFinal.split(":").map(Number)

    const minutosIni = horaIni * 60 + minIni
    const minutosFin = horaFin * 60 + minFin

    if (minutosFin <= minutosIni) {
      alert("La hora final debe ser posterior a la hora inicial.")
      return false
    }
  }

  return true
}

// Función para validar número de personas
function validarNumeroPersonas() {
  const numPersonas = document.getElementById("num-personas").value

  if (numPersonas && (isNaN(numPersonas) || Number.parseInt(numPersonas) <= 0)) {
    alert("El número de personas ejecutoras debe ser un número mayor a 0.")
    return false
  }

  return true
}

// Función de validación completa
function validacionCompleta() {
  return validarCamposObligatorios() && validarRangoFechas() && validarRangoHoras() && validarNumeroPersonas()
}

// Inicializar el modal de firma
function initSignatureModal() {
  // Inicializar canvas del formulario primero
  initializeFormCanvases()

  // Configurar eventos para los botones de firmar
  document.querySelectorAll(".sign-button").forEach((button) => {
    button.addEventListener("click", function () {
      const targetId = this.getAttribute("data-signature-target")
      openSignatureModal(targetId)
    })
  })

  // Configurar eventos para los botones de limpiar
  document.querySelectorAll(".clearSignatureButton").forEach((button) => {
    button.addEventListener("click", function () {
      const canvas = this.closest(".signature-pad, td, .mobile-signature-field").querySelector("canvas")
      clearCanvas(canvas)
    })
  })

  // Configurar el modal
  document.querySelector(".close").addEventListener("click", closeSignatureModal)
  document.getElementById("cancelSignature").addEventListener("click", closeSignatureModal)
  document.getElementById("saveSignature").addEventListener("click", saveSignature)
  document.getElementById("clearSignatureModal").addEventListener("click", clearModalSignature)
  document.getElementById("penColor").addEventListener("change", (e) => {
    currentColor = e.target.value
  })
  document.getElementById("penSize").addEventListener("change", (e) => {
    currentSize = Number.parseInt(e.target.value)
  })

  // Configurar eventos de dibujo para ratón
  signaturePad.addEventListener("mousedown", startDrawing)
  signaturePad.addEventListener("mousemove", draw)
  signaturePad.addEventListener("mouseup", stopDrawing)
  signaturePad.addEventListener("mouseout", stopDrawing)

  // Configurar eventos táctiles solo para el canvas de firma
  signaturePad.addEventListener("touchstart", handleTouchStart, { passive: false })
  signaturePad.addEventListener("touchmove", handleTouchMove, { passive: false })
  signaturePad.addEventListener("touchend", stopDrawing)

  // Cerrar modal al hacer clic fuera
  window.addEventListener("click", (event) => {
    if (event.target === signatureModal) {
      closeSignatureModal()
    }
  })

  // Configurar eventos de los botones principales
  setupMainButtons()
}

// Configurar eventos de los botones principales
function setupMainButtons() {
  // Botón Guardar (ahora imprime)
  const guardarBtn = document.getElementById("guardar")
  if (guardarBtn) {
    guardarBtn.addEventListener("click", () => {
      if (validacionCompleta()) {
        // Mostrar mensaje de confirmación antes de imprimir
        if (confirm("¿Desea imprimir el formulario? Asegúrese de que todos los datos estén correctos.")) {
          // Preparar para impresión
          prepareForPrint()

          // Pequeño delay para que se procesen los cambios
          setTimeout(() => {
            window.print()
          }, 500)
        }
      }
    })
  }

  // Botón Imprimir
  const imprimirBtn = document.getElementById("imprimir")
  if (imprimirBtn) {
    imprimirBtn.addEventListener("click", async () => {
      if (validacionCompleta()) {
        // Preparar para impresión y esperar a que se complete
        await prepareForPrint()
        // Imprimir
        window.print()
      }
    })
  }

  // Crear y configurar botón de recargar si no existe
  let recargarBtn = document.getElementById("recargar")
  if (!recargarBtn) {
    recargarBtn = document.createElement("button")
    recargarBtn.id = "recargar"
    recargarBtn.type = "button"
    recargarBtn.textContent = "Nuevo"
    recargarBtn.style.backgroundColor = "#dc3545"
    recargarBtn.style.color = "white"

    // Añadir el botón al contenedor de acciones
    const formActions = document.querySelector(".form-actions")
    if (formActions) {
      formActions.appendChild(recargarBtn)
    }
  }

  // Configurar evento del botón recargar
  recargarBtn.addEventListener("click", () => {
    if (confirm("¿Está seguro que desea limpiar todo el formulario? Se perderán todos los datos ingresados.")) {
      window.location.reload()
    }
  })
}

// Abrir modal de firma
function openSignatureModal(targetId) {
  currentSignatureCanvas = document.getElementById(targetId)
  signatureModal.style.display = "block"
  resizeSignaturePad()
  clearModalSignature()
}

// Cerrar modal de firma
function closeSignatureModal() {
  signatureModal.style.display = "none"
  currentSignatureCanvas = null
}

// Redimensionar el pad de firma - VERSIÓN MEJORADA RESPONSIVA
function resizeSignaturePad() {
  // Esperar a que el modal esté completamente visible
  setTimeout(() => {
    const container = document.querySelector(".signature-canvas-container")
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    if (containerRect.width === 0 || containerRect.height === 0) return

    const ratio = Math.max(window.devicePixelRatio || 1, 1)

    // Calcular dimensiones basadas en el contenedor
    const width = containerRect.width
    const height = containerRect.height

    // Configurar el canvas
    signaturePad.width = width * ratio
    signaturePad.height = height * ratio
    signaturePad.style.width = width + "px"
    signaturePad.style.height = height + "px"

    // Configurar el contexto
    ctx = signaturePad.getContext("2d")
    ctx.scale(ratio, ratio)
    ctx.lineJoin = "round"
    ctx.lineCap = "round"
    ctx.strokeStyle = currentColor
    ctx.lineWidth = currentSize
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"

    // Limpiar el canvas
    ctx.clearRect(0, 0, signaturePad.width, signaturePad.height)
  }, 100)
}

// Limpiar el canvas del modal
function clearModalSignature() {
  if (ctx && signaturePad.width > 0 && signaturePad.height > 0) {
    ctx.clearRect(0, 0, signaturePad.width, signaturePad.height)
  }
}

// Limpiar un canvas específico
function clearCanvas(canvas) {
  if (!canvas || !canvas.getContext) return

  const context = canvas.getContext("2d")
  if (context && canvas.width > 0 && canvas.height > 0) {
    context.clearRect(0, 0, canvas.width, canvas.height)
  }
}

// Guardar la firma - VERSIÓN MEJORADA PARA MANTENER CALIDAD
function saveSignature() {
  if (!currentSignatureCanvas) return

  // Verificar que el canvas del modal tiene dimensiones válidas
  if (signaturePad.width === 0 || signaturePad.height === 0) {
    alert("Error: El canvas de firma no está inicializado correctamente.")
    return
  }

  // Verificar que hay contenido en el canvas
  const imageData = ctx.getImageData(0, 0, signaturePad.width, signaturePad.height)
  const hasContent = imageData.data.some((channel, index) => index % 4 === 3 && channel !== 0)

  if (!hasContent) {
    alert("Por favor, dibuje una firma antes de guardar.")
    return
  }

  // Configurar el canvas destino con alta resolución
  const destCtx = setupHighResCanvas(currentSignatureCanvas)
  if (!destCtx) {
    alert("Error: No se pudo configurar el canvas de destino.")
    return
  }

  // Limpiar el canvas destino
  destCtx.clearRect(0, 0, currentSignatureCanvas.offsetWidth, currentSignatureCanvas.offsetHeight)

  // Crear imagen temporal del canvas de firma
  const tempCanvas = document.createElement("canvas")
  const tempCtx = tempCanvas.getContext("2d")

  // Configurar canvas temporal con las dimensiones originales
  tempCanvas.width = signaturePad.width
  tempCanvas.height = signaturePad.height

  // Copiar la firma al canvas temporal
  tempCtx.drawImage(signaturePad, 0, 0)

  // Calcular las dimensiones para mantener la proporción
  const sourceRatio = tempCanvas.width / tempCanvas.height
  const destWidth = currentSignatureCanvas.offsetWidth
  const destHeight = currentSignatureCanvas.offsetHeight
  const destRatio = destWidth / destHeight

  let drawWidth, drawHeight, drawX, drawY

  if (sourceRatio > destRatio) {
    // La firma es más ancha, ajustar por ancho
    drawWidth = destWidth
    drawHeight = destWidth / sourceRatio
    drawX = 0
    drawY = (destHeight - drawHeight) / 2
  } else {
    // La firma es más alta, ajustar por altura
    drawHeight = destHeight
    drawWidth = destHeight * sourceRatio
    drawX = (destWidth - drawWidth) / 2
    drawY = 0
  }

  // Dibujar la firma manteniendo las proporciones
  destCtx.drawImage(tempCanvas, drawX, drawY, drawWidth, drawHeight)

  // Guardar referencia al canvas actual antes de cerrar el modal
  const savedCanvas = currentSignatureCanvas

  closeSignatureModal()

  // Desplazarse a la posición del canvas que se acaba de firmar
  setTimeout(() => {
    if (savedCanvas) {
      savedCanvas.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, 300)
}

// Función para optimizar canvas antes de imprimir - MEJORADA
function optimizeCanvasForPrint() {
  const allCanvas = document.querySelectorAll(".signatureCanvas, .mini-signature")

  allCanvas.forEach((canvas) => {
    if (!canvas || !canvas.getContext) return

    try {
      const ctx = canvas.getContext("2d")
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const hasContent = imageData.data.some((channel, index) => index % 4 === 3 && channel !== 0)

      if (hasContent) {
        // Crear un canvas temporal con mejor resolución para impresión
        const tempCanvas = document.createElement("canvas")
        const tempCtx = tempCanvas.getContext("2d")

        // Configurar dimensiones optimizadas para impresión (300 DPI equivalente)
        const printScale = 3 // Aumentado para mejor calidad
        tempCanvas.width = canvas.offsetWidth * printScale
        tempCanvas.height = canvas.offsetHeight * printScale

        // Configurar contexto para mejor calidad
        tempCtx.scale(printScale, printScale)
        tempCtx.drawImage(canvas, 0, 0, canvas.offsetWidth, canvas.offsetHeight)

        // Convertir a imagen y reemplazar el canvas original
        const img = new Image()
        img.onload = () => {
          // Limpiar el canvas original
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          // Dibujar la imagen optimizada
          ctx.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight)
        }
        img.src = tempCanvas.toDataURL("image/png", 1.0)
      }
    } catch (error) {
      console.warn("Error al procesar canvas para impresión:", error)
    }
  })
}

// Función para preparar el documento para impresión - MEJORADA
function prepareForPrint() {
  // Optimizar todos los canvas
  optimizeCanvasForPrint()

  // Asegurar que todos los inputs tengan sus valores visibles
  const inputs = document.querySelectorAll(
    'input[type="text"], input[type="date"], input[type="time"], input[type="number"], textarea',
  )
  inputs.forEach((input) => {
    if (input.value) {
      input.setAttribute("value", input.value)
    }
  })

  // Marcar checkboxes y radios seleccionados
  const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked')
  checkboxes.forEach((cb) => cb.setAttribute("checked", "checked"))

  const radios = document.querySelectorAll('input[type="radio"]:checked')
  radios.forEach((radio) => radio.setAttribute("checked", "checked"))

  // Añadir clase especial para impresión
  document.body.classList.add("printing")

  // Forzar un pequeño delay para asegurar que los canvas se procesen
  return new Promise((resolve) => {
    setTimeout(resolve, 500)
  })
}

// Función para limpiar después de imprimir
function cleanupAfterPrint() {
  document.body.classList.remove("printing")

  // Reinicializar los canvas si es necesario
  setTimeout(() => {
    initializeFormCanvases()
  }, 100)
}

// Funciones de dibujo
function startDrawing(e) {
  isDrawing = true
  ;[lastX, lastY] = getPosition(e)
}

function draw(e) {
  if (!isDrawing) return

  ctx.strokeStyle = currentColor
  ctx.lineWidth = currentSize

  const [x, y] = getPosition(e)

  ctx.beginPath()
  ctx.moveTo(lastX, lastY)
  ctx.lineTo(x, y)
  ctx.stroke()

  lastX = x
  lastY = y
}

function stopDrawing() {
  isDrawing = false
}

function getPosition(e) {
  const rect = signaturePad.getBoundingClientRect()
  let x, y

  if (e.type.includes("touch")) {
    x = e.touches[0].clientX - rect.left
    y = e.touches[0].clientY - rect.top
  } else {
    x = e.clientX - rect.left
    y = e.clientY - rect.top
  }

  return [x, y]
}

// Manejadores de eventos táctiles
function handleTouchStart(e) {
  e.preventDefault() // Prevenir el comportamiento predeterminado solo para el canvas
  const touch = e.touches[0]
  const mouseEvent = new MouseEvent("mousedown", {
    clientX: touch.clientX,
    clientY: touch.clientY
  })
  signaturePad.dispatchEvent(mouseEvent)
}

function handleTouchMove(e) {
  e.preventDefault() // Prevenir el comportamiento predeterminado solo para el canvas
  const touch = e.touches[0]
  const mouseEvent = new MouseEvent("mousemove", {
    clientX: touch.clientX,
    clientY: touch.clientY
  })
  signaturePad.dispatchEvent(mouseEvent)
}

// Función para validar en tiempo real
function setupRealTimeValidation() {
  // Validación en tiempo real para fechas
  document.getElementById("fecha-inicial").addEventListener("change", validarRangoFechas)
  document.getElementById("fecha-final").addEventListener("change", validarRangoFechas)

  // Validación en tiempo real para horas
  document.getElementById("hora-inicial").addEventListener("change", validarRangoHoras)
  document.getElementById("hora-final").addEventListener("change", validarRangoHoras)

  // Validación en tiempo real para número de personas
  document.getElementById("num-personas").addEventListener("input", validarNumeroPersonas)
}

// Configurar eventos de impresión
window.addEventListener("beforeprint", async () => {
  await prepareForPrint()
})

window.addEventListener("afterprint", () => {
  document.body.classList.remove("printing")
})

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  initSignatureModal()
  setupRealTimeValidation()
})

// Listener para cuando la página esté completamente cargada
window.addEventListener("load", () => {
  initializeFormCanvases()
})

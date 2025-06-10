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

    // Enfocar el primer campo vacío sin forzar el scroll
    const primerCampoVacio = document.getElementById(
      camposObligatorios.find((campo) => camposVacios.includes(campo.nombre))?.id,
    )
    if (primerCampoVacio) {
      primerCampoVacio.focus()
      // Solo hacer scroll suave si el campo no está visible
      const rect = primerCampoVacio.getBoundingClientRect()
      const isVisible = (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      )
      
      if (!isVisible) {
        primerCampoVacio.scrollIntoView({ behavior: "smooth", block: "center" })
      }
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

  // Configurar eventos de dibujo
  signaturePad.addEventListener("mousedown", startDrawing)
  signaturePad.addEventListener("mousemove", draw)
  signaturePad.addEventListener("mouseup", stopDrawing)
  signaturePad.addEventListener("mouseout", stopDrawing)

  // Configurar eventos táctiles mejorados
  setupTouchScrolling()

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

  // Botón Imprimir (funcionalidad adicional)
  const imprimirBtn = document.getElementById("imprimir")
  if (imprimirBtn) {
    imprimirBtn.addEventListener("click", () => {
      if (validacionCompleta()) {
        // Preparar para impresión
        prepareForPrint()

        setTimeout(() => {
          window.print()
        }, 500)
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

  // Guardar la posición de desplazamiento actual
  const scrollPosition = window.pageYOffset || document.documentElement.scrollTop

  // En dispositivos móviles, manejar el scroll de manera más suave
  if (window.innerWidth <= 768) {
    document.body.style.overflow = "hidden"
    // Eliminar la posición fija que causa el problema
    document.body.style.position = "relative"
    document.body.style.width = "100%"
  }

  resizeSignaturePad()
  clearModalSignature()
}

// Cerrar modal de firma
function closeSignatureModal() {
  signatureModal.style.display = "none"
  currentSignatureCanvas = null

  // Restaurar el desplazamiento normal en dispositivos móviles
  document.body.style.overflow = "auto"
  document.body.style.position = "static"
  document.body.style.width = "auto"
  document.body.style.touchAction = "auto"

  // Desplazarse a la posición del canvas que se estaba firmando
  if (currentSignatureCanvas) {
    setTimeout(() => {
      currentSignatureCanvas.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 100)
  }
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

// Función para optimizar canvas antes de imprimir - CORREGIDA
function optimizeCanvasForPrint() {
  const allCanvas = document.querySelectorAll(".signatureCanvas, .mini-signature")

  allCanvas.forEach((canvas) => {
    // Verificar que el canvas existe y tiene contexto
    if (!canvas || !canvas.getContext) return

    // Verificar que el canvas tiene dimensiones válidas
    if (canvas.width === 0 || canvas.height === 0 || canvas.offsetWidth === 0 || canvas.offsetHeight === 0) {
      console.warn("Canvas sin dimensiones válidas, saltando optimización:", canvas)
      return
    }

    try {
      const ctx = canvas.getContext("2d")
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      // Verificar si hay contenido
      const hasContent = imageData.data.some((channel, index) => index % 4 === 3 && channel !== 0)

      if (hasContent) {
        // Crear un canvas temporal con mejor resolución para impresión
        const tempCanvas = document.createElement("canvas")
        const tempCtx = tempCanvas.getContext("2d")

        // Configurar dimensiones optimizadas para impresión (300 DPI equivalente)
        const printScale = 2
        tempCanvas.width = canvas.offsetWidth * printScale
        tempCanvas.height = canvas.offsetHeight * printScale

        // Configurar contexto para mejor calidad
        tempCtx.imageSmoothingEnabled = false
        tempCtx.webkitImageSmoothingEnabled = false
        tempCtx.mozImageSmoothingEnabled = false
        tempCtx.msImageSmoothingEnabled = false

        // Escalar y dibujar el contenido original
        tempCtx.scale(printScale, printScale)
        tempCtx.drawImage(canvas, 0, 0, canvas.offsetWidth, canvas.offsetHeight)

        // Reemplazar el canvas original con la versión optimizada
        try {
          const dataURL = tempCanvas.toDataURL("image/png", 1.0)
          const img = new Image()
          img.onload = () => {
            // Limpiar el canvas original
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            // Dibujar la imagen optimizada
            ctx.drawImage(img, 0, 0, canvas.offsetWidth, canvas.offsetHeight)
          }
          img.src = dataURL
        } catch (e) {
          console.warn("No se pudo optimizar el canvas para impresión:", e)
        }
      }
    } catch (error) {
      console.warn("Error al procesar canvas para impresión:", error, canvas)
    }
  })
}

// Función para preparar el documento para impresión
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

// Modificar la función handleTouchStart para limitar preventDefault solo al canvas
function handleTouchStart(e) {
  // Prevenir el comportamiento predeterminado solo dentro del canvas de firma
  e.preventDefault()
  const touch = e.touches[0]
  const mouseEvent = new MouseEvent("mousedown", {
    clientX: touch.clientX,
    clientY: touch.clientY,
  })
  signaturePad.dispatchEvent(mouseEvent)
}

// Modificar la función handleTouchMove para limitar preventDefault solo al canvas
function handleTouchMove(e) {
  // Prevenir el comportamiento predeterminado solo dentro del canvas de firma
  e.preventDefault()
  const touch = e.touches[0]
  const mouseEvent = new MouseEvent("mousemove", {
    clientX: touch.clientX,
    clientY: touch.clientY,
  })
  signaturePad.dispatchEvent(mouseEvent)
}

// Añadir una función para manejar el desplazamiento en dispositivos táctiles
function setupTouchScrolling() {
  // Asegurar que el modal no bloquee el desplazamiento en el resto de la página
  signatureModal.addEventListener(
    "touchmove",
    (e) => {
      // Permitir desplazamiento dentro del modal
      e.stopPropagation()
    },
    { passive: true },
  )

  // Configurar eventos táctiles específicos para el canvas
  signaturePad.addEventListener("touchstart", handleTouchStart, { passive: false })
  signaturePad.addEventListener("touchmove", handleTouchMove, { passive: false })

  // Eliminar los listeners anteriores para evitar duplicados
  signaturePad.removeEventListener("touchstart", handleTouchStart)
  signaturePad.removeEventListener("touchmove", handleTouchMove)

  // Volver a añadir los listeners con la configuración correcta
  signaturePad.addEventListener("touchstart", handleTouchStart, { passive: false })
  signaturePad.addEventListener("touchmove", handleTouchMove, { passive: false })
}

// Función mejorada para manejar cambios de orientación y redimensionamiento
function handleResize() {
  // Limpiar timeout anterior si existe
  if (resizeTimeout) {
    clearTimeout(resizeTimeout)
  }

  // Usar debounce para evitar múltiples ejecuciones
  resizeTimeout = setTimeout(() => {
    // Reinicializar canvas del formulario
    initializeFormCanvases()

    // Si el modal está abierto, redimensionar el pad de firma
    if (signatureModal && signatureModal.style.display === "block") {
      resizeSignaturePad()
    }

    // Forzar un repaint para asegurar que los estilos se apliquen
    document.body.style.display = "none"
    document.body.offsetHeight // Trigger reflow
    document.body.style.display = ""

    // Disparar evento personalizado para notificar que el resize ha terminado
    window.dispatchEvent(new CustomEvent("resizeComplete"))
  }, 250) // Esperar 250ms después del último evento de resize
}

// Función para forzar el reajuste de elementos responsivos
function forceResponsiveReflow() {
  // Obtener todos los elementos que pueden necesitar reajuste
  const responsiveElements = document.querySelectorAll(
    ".container, .form-section, .modal-content, .signature-canvas-container",
  )

  responsiveElements.forEach((element) => {
    // Forzar recálculo de estilos
    const display = element.style.display
    element.style.display = "none"
    element.offsetHeight // Trigger reflow
    element.style.display = display
  })
}

// Agregar listeners para redimensionamiento mejorados
window.addEventListener("resize", handleResize)

window.addEventListener("orientationchange", () => {
  // Delay más largo para orientationchange ya que toma más tiempo
  setTimeout(() => {
    handleResize()
    forceResponsiveReflow()
  }, 500)
})

// Listener para cuando se complete el resize
window.addEventListener("resizeComplete", () => {
  // Reinicializar elementos que puedan haberse desconfigurado
  initializeFormCanvases()
})

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

// Función para preparar la impresión
window.addEventListener("beforeprint", () => {
  prepareForPrint()
})

window.addEventListener("afterprint", () => {
  cleanupAfterPrint()
})

// Función para detectar cambios de viewport en dispositivos móviles
function setupViewportHandler() {
  let viewportHeight = window.innerHeight

  window.addEventListener("resize", () => {
    const currentHeight = window.innerHeight
    const heightDifference = Math.abs(currentHeight - viewportHeight)

    // Si el cambio es significativo (más de 150px), probablemente es un cambio de orientación
    if (heightDifference > 150) {
      viewportHeight = currentHeight
      setTimeout(() => {
        forceResponsiveReflow()
        initializeFormCanvases()
      }, 300)
    }
  })
}

// Función para configurar el manejo de eventos en dispositivos móviles
function setupMobileFieldHandling() {
  const inputs = document.querySelectorAll('input, textarea, select')
  
  inputs.forEach(input => {
    // Prevenir el comportamiento por defecto del zoom en iOS
    input.addEventListener('focus', function(e) {
      if (window.innerWidth <= 768) {
        // Guardar la posición actual del scroll
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop
        
        // Asegurarse de que el input esté visible
        const rect = this.getBoundingClientRect()
        const isVisible = (
          rect.top >= 0 &&
          rect.left >= 0 &&
          rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        )
        
        if (!isVisible) {
          this.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    })
    
    // Restaurar el scroll cuando el input pierde el foco
    input.addEventListener('blur', function() {
      if (window.innerWidth <= 768) {
        document.body.scrollTop = document.documentElement.scrollTop = 0
      }
    })
  })
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  initSignatureModal()
  setupRealTimeValidation()
  setupViewportHandler()
  setupMobileFieldHandling()

  // Forzar un reajuste inicial después de que todo esté cargado
  setTimeout(() => {
    forceResponsiveReflow()
    initializeFormCanvases()
  }, 500)
})

// Listener para cuando la página esté completamente cargada
window.addEventListener("load", () => {
  // Segundo reajuste después de que todas las imágenes y recursos estén cargados
  setTimeout(() => {
    forceResponsiveReflow()
    initializeFormCanvases()
  }, 200)
})

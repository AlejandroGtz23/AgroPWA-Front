const tamanoObjetivo = 1024 * 1024

function cargarImagen(archivo) {
  if (typeof createImageBitmap === 'function') {
    return createImageBitmap(archivo).then((bitmap) => ({
      imagen: bitmap,
      ancho: bitmap.width,
      alto: bitmap.height,
      liberar: () => bitmap.close(),
    }))
  }

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(archivo)
    const imagen = new Image()
    imagen.onload = () => resolve({
      imagen,
      ancho: imagen.naturalWidth,
      alto: imagen.naturalHeight,
      liberar: () => URL.revokeObjectURL(url),
    })
    imagen.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo leer la imagen seleccionada.'))
    }
    imagen.src = url
  })
}

function convertirCanvas(canvas, tipo, calidad) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('No se pudo procesar la imagen seleccionada.'))
    }, tipo, calidad)
  })
}

export async function comprimirFotografia(archivo) {
  if (archivo.size <= tamanoObjetivo) return archivo

  const { imagen, ancho, alto, liberar } = await cargarImagen(archivo)
  try {
    const escalaInicial = Math.min(1, 2400 / Math.max(ancho, alto))
    let anchoCanvas = Math.max(1, Math.round(ancho * escalaInicial))
    let altoCanvas = Math.max(1, Math.round(alto * escalaInicial))
    const canvas = document.createElement('canvas')
    const contexto = canvas.getContext('2d')
    if (!contexto) throw new Error('Este navegador no puede comprimir la imagen.')

    const tipo = archivo.type === 'image/png' ? 'image/png' : 'image/jpeg'
    let comprimida
    for (let intento = 0; intento < 8; intento += 1) {
      canvas.width = anchoCanvas
      canvas.height = altoCanvas
      contexto.clearRect(0, 0, anchoCanvas, altoCanvas)
      contexto.drawImage(imagen, 0, 0, anchoCanvas, altoCanvas)
      const calidad = tipo === 'image/jpeg' ? Math.max(0.45, 0.88 - intento * 0.08) : undefined
      comprimida = await convertirCanvas(canvas, tipo, calidad)
      if (comprimida.size <= tamanoObjetivo) break
      anchoCanvas = Math.max(1, Math.round(anchoCanvas * 0.8))
      altoCanvas = Math.max(1, Math.round(altoCanvas * 0.8))
    }

    if (!comprimida || comprimida.size > tamanoObjetivo) {
      throw new Error('No se pudo comprimir la fotografía al tamaño requerido. Elige una imagen más pequeña.')
    }

    const extension = tipo === 'image/png' ? 'png' : 'jpg'
    const nombre = archivo.name.replace(/\.[^.]+$/, '') || 'fotografia'
    return new File([comprimida], `${nombre}.${extension}`, { type: tipo, lastModified: Date.now() })
  } finally {
    liberar()
  }
}

import type { jsPDF as JSPDF } from 'jspdf'

let fontLoaded = false
let fontBase64: string | null = null

/**
 * Loads the NotoSansJP font and adds it to jsPDF
 * This only needs to be done once, subsequent calls will reuse the cached font
 */
export async function loadJapaneseFont(pdf: JSPDF): Promise<void> {
  // If font is already loaded, just set it and return
  if (fontLoaded && fontBase64) {
    pdf.addFileToVFS('NotoSansJP-Regular.ttf', fontBase64)
    pdf.addFont('NotoSansJP-Regular.ttf', 'NotoSansJP', 'normal')
    return
  }

  try {
    // Fetch the font file from public directory
    const response = await fetch('/NotoSansJP-Regular.ttf')
    if (!response.ok) {
      throw new Error(`Failed to load font: ${response.status}`)
    }

    // Convert to array buffer then to base64
    const arrayBuffer = await response.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    // Convert to base64
    let binary = ''
    const len = uint8Array.byteLength
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i])
    }
    fontBase64 = btoa(binary)

    // Add font to PDF's virtual file system
    pdf.addFileToVFS('NotoSansJP-Regular.ttf', fontBase64)
    pdf.addFont('NotoSansJP-Regular.ttf', 'NotoSansJP', 'normal')

    fontLoaded = true
  }
  catch (error) {
    console.error('Failed to load Japanese font:', error)
    // Fall back to default font if loading fails
    throw error
  }
}

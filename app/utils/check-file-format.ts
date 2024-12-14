export const isPdf = (url: string): boolean => {
  try {
    // Create URL object
    const urlObj = new URL(url)

    // Check file extension in the URL
    const pathParts = urlObj.pathname.split('/')
    const fileName = pathParts[pathParts.length - 1]

    // Method 1: Check by file extension
    const isPdfByExtension = fileName.toLowerCase().endsWith('.pdf')

    // Method 2: Check URL search params (if available)
    const searchParams = urlObj.searchParams
    const fileType = searchParams.get('x-ut-file-type')
    const isPdfByFileType = fileType === 'application%2Fpdf' || fileType === 'application/pdf'

    return isPdfByExtension || isPdfByFileType
  } catch (error) {
    console.error('Error checking PDF URL:', error)
    return false
  }
}

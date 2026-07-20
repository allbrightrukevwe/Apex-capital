import QRCode from 'qrcode';

export async function generateQRCode(address: string): Promise<string> {
  try {
    // Generate QR code as a data URL (PNG image)
    const qrCodeDataUrl = await QRCode.toDataURL(address, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',  // QR code color
        light: '#FFFFFF', // Background color
      },
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}
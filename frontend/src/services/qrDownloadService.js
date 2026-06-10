import jsPDF from 'jspdf';

class QRDownloadService {
  // Gerar e baixar QR Code individual em PDF (simplificado)
  static async downloadQRCode(convite) {
    try {
      // Criar PDF
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      // Configurações de estilo
      pdf.setFont('helvetica');
      
      // Título
      pdf.setFontSize(16);
      pdf.setTextColor(40, 40, 40);
      pdf.text('QR CODE DO CONVITE', pageWidth / 2, 30, { align: 'center' });
      
      // Informações dos Convidados
      pdf.setFontSize(12);
      pdf.setTextColor(60, 60, 60);
      
      let yPosition = 50;
      
      // Convidado 1
      pdf.text(`Convidado: ${convite.nome_convidado1}`, 20, yPosition);
      yPosition += 8;
      
      // Convidado 2 (se existir)
      if (convite.nome_convidado2) {
        pdf.text(`Convidado: ${convite.nome_convidado2}`, 20, yPosition);
        yPosition += 15;
      } else {
        yPosition += 10;
      }
      
      // QR Code (usando API externa)
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${convite.qr_code}&format=png&margin=10`;
      
      try {
        // Adicionar imagem do QR Code centralizada
        const qrSize = 100;
        const qrX = (pageWidth - qrSize) / 2;
        const qrY = yPosition;
        
        pdf.addImage(qrCodeUrl, 'PNG', qrX, qrY, qrSize, qrSize);
        
      } catch (error) {
        console.warn('Não foi possível adicionar QR Code ao PDF:', error);
        pdf.setTextColor(255, 0, 0);
        pdf.text('Erro ao gerar QR Code', pageWidth / 2, yPosition + 50, { align: 'center' });
      }
      
      // Nome do arquivo
      const nomeArquivo = `convite_${convite.nome_convidado1.replace(/\s+/g, '_')}.pdf`;
      
      // Fazer download
      pdf.save(nomeArquivo);
      
      return true;
      
    } catch (error) {
      console.error('Erro ao gerar download do QR Code:', error);
      throw new Error('Erro ao gerar arquivo do QR Code');
    }
  }

  // Gerar e fazer download da imagem PNG do QR Code
  static async downloadQRCodeAsImage(convite) {
    return new Promise((resolve, reject) => {
      try {
        // URL do QR Code
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${convite.qr_code}&format=png&margin=15`;
        
        // Criar elemento de imagem
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // Permitir CORS
        
        img.onload = function() {
          try {
            // Criar canvas
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            
            // Desenhar imagem no canvas
            ctx.drawImage(img, 0, 0);
            
            // Converter para blob e fazer download
            canvas.toBlob((blob) => {
              try {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `qr_code_${convite.nome_convidado1.replace(/\s+/g, '_')}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Liberar URL
                setTimeout(() => URL.revokeObjectURL(url), 100);
                
                resolve(true);
              } catch (error) {
                reject(error);
              }
            }, 'image/png');
            
          } catch (error) {
            reject(error);
          }
        };
        
        img.onerror = function() {
          reject(new Error('Erro ao carregar imagem do QR Code'));
        };
        
        img.src = qrCodeUrl;
        
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default QRDownloadService;
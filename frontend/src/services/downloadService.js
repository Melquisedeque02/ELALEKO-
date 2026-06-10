import jsPDF from 'jspdf';
import ApiService from './api';

class DownloadService {
  // Gerar PDF do convite
  static async gerarPDF(conviteId) {
    try {
      // Buscar dados completos do convite
      const convites = await ApiService.listarConvites();
      const convite = convites.find(c => c.id === conviteId);
      
      if (!convite) {
        throw new Error('Convite não encontrado');
      }

      // Criar PDF
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      
      // Configurações de estilo
      pdf.setFont('helvetica');
      
      // Cabeçalho
      pdf.setFontSize(20);
      pdf.setTextColor(40, 40, 40);
      pdf.text('🎊 CONVITE OFICIAL 🎊', pageWidth / 2, 30, { align: 'center' });
      
      // Linha decorativa
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, 40, pageWidth - 20, 40);
      
      // Informações do evento
      pdf.setFontSize(16);
      pdf.setTextColor(60, 60, 60);
      pdf.text('Detalhes do Evento:', 20, 60);
      
      pdf.setFontSize(12);
      pdf.setTextColor(80, 80, 80);
      
      let yPosition = 75;
      
      // Convidados
      pdf.text(`Convidado 1: ${convite.nome_convidado1}`, 20, yPosition);
      yPosition += 10;
      
      if (convite.nome_convidado2) {
        pdf.text(`Convidado 2: ${convite.nome_convidado2}`, 20, yPosition);
        yPosition += 15;
      } else {
        yPosition += 10;
      }
      
      // QR Code Info
      pdf.text(`Código do Convite: ${convite.qr_code}`, 20, yPosition);
      yPosition += 10;
      
      // Status
      const status = convite.utilizado ? 'UTILIZADO' : 'VÁLIDO';
      const statusColor = convite.utilizado ? [220, 53, 69] : [40, 167, 69];
      
      pdf.setTextColor(...statusColor);
      pdf.text(`Status: ${status}`, 20, yPosition);
      yPosition += 15;
      
      // Data de criação
      pdf.setTextColor(80, 80, 80);
      const dataCriacao = new Date(convite.data_criacao).toLocaleDateString('pt-BR');
      pdf.text(`Criado em: ${dataCriacao}`, 20, yPosition);
      
      // QR Code (usando API externa)
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${convite.qr_code}`;
      
      // Adicionar imagem do QR Code
      try {
        pdf.addImage(qrCodeUrl, 'PNG', pageWidth - 70, 60, 50, 50);
        pdf.setTextColor(100, 100, 100);
        pdf.setFontSize(8);
        pdf.text('QR Code para validação', pageWidth - 70, 115, { align: 'center' });
      } catch (error) {
        console.warn('Não foi possível adicionar QR Code ao PDF');
      }
      
      // Rodapé
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text('Sistema de Convites - Gerado automaticamente', pageWidth / 2, 280, { align: 'center' });
      
      return pdf;
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      throw error;
    }
  }

  // Download do PDF
  static async downloadPDF(conviteId, filename = null) {
    try {
      const pdf = await this.gerarPDF(conviteId);
      const nomeArquivo = filename || `convite_${conviteId}.pdf`;
      pdf.save(nomeArquivo);
      return true;
    } catch (error) {
      console.error('Erro ao fazer download do PDF:', error);
      throw error;
    }
  }

  // Gerar imagem do convite
  static async gerarImagem(conviteId) {
    // Implementação similar para gerar imagem
    // Podemos usar html2canvas ou outra biblioteca
    return await this.gerarPDF(conviteId);
  }
}

export default DownloadService;
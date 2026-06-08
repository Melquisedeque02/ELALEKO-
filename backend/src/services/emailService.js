// backend/src/services/emailService.js
const { Resend } = require('resend');

// Inicializa o cliente Resend com a sua chave API
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Envia um email de recuperação de senha utilizando a API do Resend.
 * @param {string} to - E-mail do destinatário.
 * @param {string} resetLink - Link para redefinir a senha.
 */
async function sendResetEmail(to, resetLink) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Elaleko <onboarding@resend.dev>', // E-mail de testes fornecido pelo Resend
      to: [to],
      subject: 'Recuperação de senha - Elaleko',
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 500px; margin: 0 auto; background: #f5f0eb; padding: 20px; border-radius: 16px;">
          <div style="background: white; padding: 24px; border-radius: 16px;">
            <h2 style="color: #19634c; margin-bottom: 16px;"> Recuperação de senha</h2>
            <p>Recebemos um pedido para redefinir a sua senha.</p>
            <p>Clique no botão abaixo para criar uma nova senha (válido por 1 hora):</p>
            <a href="${resetLink}" style="display: inline-block; background: #19634c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 30px; margin: 16px 0;">Redefinir senha</a>
            <p>Se não foi você, ignore este email.</p>
            <hr style="margin: 20px 0; border-color: #e0dcd7;" />
            <p style="font-size: 12px; color: #6b6b6b;">Equipa Elaleko</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error(`❌ Erro da API do Resend:`, error);
      return;
    }

    console.log(`📧 Email enviado com sucesso para ${to}. ID: ${data?.id}`);
  } catch (error) {
    console.error(`❌ Erro inesperado ao enviar email:`, error);
  }
}

module.exports = { sendResetEmail };
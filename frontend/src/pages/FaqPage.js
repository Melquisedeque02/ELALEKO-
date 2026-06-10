import React from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import './FaqPage.css';

const FaqPage = () => {
  const [openIndex, setOpenIndex] = React.useState(null);

  const faqs = [
    {
      pergunta: "Como faço para criar um convite?",
      resposta: "Para criar um convite, faça login como organizador e clique em 'Criar evento' no menu. Preencha os dados do evento e dos convidados, adicione as informações desejadas (local, cronograma, etc.) e clique em 'Criar Convite'. O sistema gerará automaticamente um QR Code único para cada convite."
    },
    {
      pergunta: "Como o convidado acessa o convite?",
      resposta: "O convidado deve escanear o QR Code com a câmera do celular. Ele será redirecionado para uma página com a localização do evento e outras informações relevantes. Na entrada do evento, o segurança escaneará o mesmo QR Code para validar o convite."
    },
    {
      pergunta: "O que fazer se o QR Code não funcionar?",
      resposta: "Verifique se a câmera do celular está com boa iluminação e se o QR Code está visível. Se ainda assim não funcionar, o segurança pode digitar o código manualmente na área de validação ou fazer upload de uma imagem do QR Code."
    },
    {
      pergunta: "Posso editar um convite depois de criado?",
      resposta: "Sim! Na página 'Gerenciar Convites', clique no botão 'Editar' ao lado do convite desejado. Você poderá modificar as informações do evento e dos convidados. O QR Code permanecerá o mesmo."
    },
    {
      pergunta: "Como validar um convite na entrada do evento?",
      resposta: "O segurança deve fazer login no sistema, acessar a área 'Validar' e escanear o QR Code do convidado com a câmera do celular. O sistema mostrará os dados do convite e permitirá marcar como utilizado."
    },
    {
      pergunta: "O convite pode ser reutilizado?",
      resposta: "Não. Após ser validado na entrada do evento, o convite é marcado como 'utilizado' e não pode ser usado novamente. O sistema impede validações duplicadas."
    },
    {
      pergunta: "Preciso de internet para validar convites?",
      resposta: "Sim, o sistema requer conexão com a internet para validar os convites, pois a verificação é feita em tempo real no servidor. Certifique-se de ter uma conexão estável no dia do evento."
    },
    {
      pergunta: "Como entro em contato com o suporte?",
      resposta: "Em caso de dúvidas ou problemas, entre em contato pelo email: suporte@elaleko.com ou pelo WhatsApp: (+244) 922 965 959"
    }
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      <div className="faq-container">
        <div className="faq-header">
          <HelpCircle size={48} className="faq-icon" />
          <h1>Perguntas Frequentes</h1>
          <p>Tire suas dúvidas sobre o sistema Elaleko</p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <button 
                className={`faq-question ${openIndex === index ? 'active' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <span>{faq.pergunta}</span>
                {openIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              {openIndex === index && (
                <div className="faq-answer">
                  <p>{faq.resposta}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="faq-footer">
          <p>Não encontrou sua resposta?</p>
          <a href="mailto:suporte@elaleko.com" className="btn btn-primary">
            Fale com o Suporte
          </a>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
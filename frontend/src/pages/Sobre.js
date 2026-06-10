import React from 'react';
import './Sobre.css';

const Sobre = () => {  // ← NOME CORRETO (não AboutPage)
  return (
    <div className="sobre-page">
      <div className="sobre-container">
        <div className="sobre-header">
          <h1>Sobre o ELALEKO</h1>
          <p>Convites digitais com tecnologia de ponta</p>
        </div>

        <div className="sobre-content">
          <div className="sobre-section">
            <h2>Nossa História</h2>
            <p>
              O ELALEKO nasceu da necessidade de tornar a gestão de convites para eventos 
              mais prática, segura e sustentável. Com a crescente demanda por soluções digitais, 
              desenvolvemos uma plataforma que une elegância e tecnologia.
            </p>
          </div>

          <div className="sobre-section">
            <h2>Como Funciona</h2>
            <div className="steps-list">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-text">
                  <h3>Criação do Convite</h3>
                  <p>Preencha os dados do evento e dos convidados. Um QR Code único é gerado automaticamente.</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-text">
                  <h3>Compartilhamento</h3>
                  <p>Envie o convite digital ou imprima o QR Code para distribuição física.</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-text">
                  <h3>Validação na Porta</h3>
                  <p>Na entrada do evento, o QR Code é escaneado e validado em tempo real.</p>
                </div>
              </div>
            </div>
          </div>

         {/* <div className="sobre-section">
            <h2>Tecnologias Utilizadas</h2>
            <div className="tech-list">
              <span className="tech-tag">React</span>
              <span className="tech-tag">Node.js</span>
              <span className="tech-tag">Express</span>
              <span className="tech-tag">SQLite</span>
              <span className="tech-tag">QR Code API</span>
            </div>
          </div>*/}

          <div className="sobre-section">
            <h2>Contato</h2>
            <p>
              Para mais informações, suporte ou parcerias, entre em contato conosco:
            </p>
            <div className="contact-info">
              <p>Email: geral@milvendas.ao</p>
              <p>Whatsapp: (+244) 922 965 959</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sobre;
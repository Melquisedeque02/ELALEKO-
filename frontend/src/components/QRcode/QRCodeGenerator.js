import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QRCodeGenerator = ({ data, size = 120 }) => {
  // 🔥 IP FIXO - SEMPRE USA 192.168.18.13:3000
  const validationLink = `192.168.18.13:3000/convite/${data}`;
  
  return (
    <div className="qr-code-container">
      {/* QR CODE REAL - GERA IP FIXO */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <QRCodeSVG 
          value={validationLink}  // 🔥 AGORA SEMPRE: "192.168.18.13:3000/convite/..."
          size={size}
          level="H"
          includeMargin={true}
          bgColor="#FFFFFF"
          fgColor="#000000"
        />
      </div>
      
      {/* Informações do Link */}
      <div className="validation-link">
        <p className="link-text" style={{
          margin: '0 0 0.5rem 0',
          fontWeight: '500',
          color: '#374151',
          fontSize: '0.9rem'
        }}>
          <strong> Endereço de Validação:</strong>
        </p>
        
        <code 
          className="link-url"
          onClick={() => {
            navigator.clipboard.writeText(validationLink);
            alert(' Endereço copiado para a área de transferência!');
          }}
          style={{ 
            cursor: 'pointer',
            background: '#f8f9fa',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            fontFamily: 'Courier New, monospace',
            fontSize: '0.75rem',
            color: '#495057',
            wordBreak: 'break-all',
            display: 'block',
            marginBottom: '0.75rem',
            border: '1px solid #e9ecef',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#e9ecef';
            e.target.style.borderColor = '#3b82f6';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#f8f9fa';
            e.target.style.borderColor = '#e9ecef';
          }}
        >
          {validationLink}
        </code>
        
        <p className="link-instruction" style={{ 
          fontSize: '0.8rem', 
          color: '#6b7280', 
          margin: '0.5rem 0',
          textAlign: 'center'
        }}>
          <strong> Como usar:</strong> Escaneie com qualquer app de QR Code
        </p>
        
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            className="btn-test-link"
            onClick={() => window.open(`http://${validationLink}`, '_blank')}
            style={{
              background: '#30bc67',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              fontSize: '0.8rem',
              cursor: 'pointer',
              flex: '1',
              minWidth: '120px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#074d23';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#30bc67';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Abrir Validação
          </button>
          
          <button 
            className="btn-copy-link"
            onClick={() => {
              navigator.clipboard.writeText(validationLink);
              alert(' Endereço copiado: ' + validationLink);
            }}
            style={{
              background: '#167657',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              fontSize: '0.8rem',
              cursor: 'pointer',
              flex: '1',
              minWidth: '120px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#167657';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#167657';
              e.target.style.transform = 'translateY(0)';
            }}
          >
             Copiar Endereço
          </button>
        </div>
        
        <p className="link-note" style={{
          fontSize: '0.7rem',
          color: '#9ca3af',
          textAlign: 'center',
          margin: '0.75rem 0 0 0',
          fontStyle: 'italic'
        }}>
           QR Code gera: "192.168.18.5:3000/validate/..."
        </p>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
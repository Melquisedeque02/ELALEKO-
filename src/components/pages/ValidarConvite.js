import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Modal, message, Spin, Result, Button } from 'antd';
import { CheckCircleFilled, CloseCircleFilled, LoadingOutlined } from '@ant-design/icons';
import Api from '../api/Api';

const ValidarConvite = () => {
  const { code } = useParams();
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const modalShown = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detecta se é dispositivo móvel
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    // Previne que o modal seja exibido múltiplas vezes
    if (!modalShown.current && code && !modalVisible) {
      modalShown.current = true;
      setModalVisible(true);
      
      Modal.confirm({
        title: (
          <div style={isMobile ? styles.mobileModalTitle : styles.modalTitle}>
            <CheckCircleFilled style={isMobile ? styles.mobileModalTitleIcon : styles.modalTitleIcon} />
            Confirmação de Presença
          </div>
        ),
        content: (
          <div style={isMobile ? styles.mobileModalContent : styles.modalContent}>
            <p style={isMobile ? styles.mobileModalText : styles.modalText}>
              Você está prestes a confirmar sua presença usando o código:
            </p>
            <div style={isMobile ? styles.mobileCodeContainer : styles.codeContainer}>
              <span style={isMobile ? styles.mobileCodeText : styles.codeText}>{code}</span>
            </div>
            <p style={isMobile ? styles.mobileModalSubText : styles.modalSubText}>
              Deseja prosseguir com a confirmação?
            </p>
          </div>
        ),
        okText: 'Confirmar Presença',
        cancelText: 'Cancelar',
        okButtonProps: {
          style: isMobile ? styles.mobileConfirmButton : styles.confirmButton,
        },
        cancelButtonProps: {
          style: isMobile ? styles.mobileCancelButton : styles.cancelButton,
        },
        width: isMobile ? '90vw' : 520,
        centered: true,
        maskStyle: styles.modalMask,
        bodyStyle: isMobile ? styles.mobileModalBody : {},
        onOk: () => validarConvite(),
        onCancel: () => {
          setModalVisible(false);
          setLoading(false);
        },
        afterClose: () => {
          setModalVisible(false);
        }
      });
    }
  }, [code, modalVisible, isMobile]);

  const validarConvite = async () => {
    try {
      setModalVisible(false);
      const response = await Api.ValidarConvite({ code });

      if (response?.success) {
        message.success({
          content: (
            <span style={styles.messageContent}>
              <CheckCircleFilled style={isMobile ? styles.mobileSuccessIcon : styles.successIcon} />
              {response.message}
            </span>
          ),
          style: isMobile ? styles.mobileSuccessMessage : styles.successMessage,
        });
        setSucesso(true);
        setErro(false);
      } else {
        message.error({
          content: response.message || 'Erro ao validar convite.',
          style: isMobile ? styles.mobileErrorMessage : styles.errorMessage,
        });
        setErro(true);
        setSucesso(false);
      }
    } catch (error) {
      message.error({
        content: 'Erro ao conectar com o servidor.',
        style: isMobile ? styles.mobileErrorMessage : styles.errorMessage,
      });
      setErro(true);
      setSucesso(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    setLoading(true);
    setErro(false);
    modalShown.current = false;
    setModalVisible(false);
    
    await validarConvite();
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={isMobile ? styles.mobileContainer : styles.container}>
        <div style={isMobile ? styles.mobileCard : styles.card}>
          <div style={isMobile ? styles.mobileLoadingContainer : styles.loadingContainer}>
            <Spin 
              indicator={<LoadingOutlined style={isMobile ? styles.mobileLoadingIcon : styles.loadingIcon} spin />} 
              size={isMobile ? "default" : "large"}
            />
            <p style={isMobile ? styles.mobileLoadingText : styles.loadingText}>
              Processando sua confirmação...
            </p>
            <p style={isMobile ? styles.mobileLoadingSubText : styles.loadingSubText}>
              Aguarde um momento
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div style={isMobile ? styles.mobileContainer : styles.container}>
        <div style={isMobile ? styles.mobileCard : styles.card}>
          <Result
            icon={<CloseCircleFilled style={isMobile ? styles.mobileErrorIcon : styles.errorIcon} />}
            title="Convite Não Encontrado"
            subTitle="O código do convite parece estar inválido ou expirado."
            extra={[
              <Button 
                key="retry" 
                type="primary" 
                onClick={handleRetry}
                style={isMobile ? styles.mobileRetryButton : styles.retryButton}
                size={isMobile ? "middle" : "large"}
                block={isMobile}
              >
                Tentar Novamente
              </Button>,
            ]}
            style={styles.result}
          />
        </div>
      </div>
    );
  }

  if (sucesso) {
    return (
      <div style={isMobile ? styles.mobileContainer : styles.container}>
        <div style={isMobile ? styles.mobileCard : styles.card}>
          <Result
            icon={<CheckCircleFilled style={isMobile ? styles.mobileSuccessIcon : styles.successIcon} />}
            title="Presença Confirmada!"
            subTitle="Sua presença foi confirmada com sucesso. Agradecemos pela confirmação!"
            style={styles.result}
          />
        </div>
      </div>
    );
  }

  return null;
};

// Estilos responsivos
const styles = {
  // Desktop Styles
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, #f8f5f0 0%, #e8e1d1 100%)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    backgroundColor: 'white',
    padding: '50px 40px',
    borderRadius: '20px',
    boxShadow: `
      0 10px 40px rgba(199, 154, 63, 0.15),
      0 2px 10px rgba(199, 154, 63, 0.05)
    `,
    textAlign: 'center',
    minWidth: '450px',
    maxWidth: '550px',
    width: '100%',
    border: '1px solid #f0e6d3',
    position: 'relative',
    overflow: 'hidden',
  },
  modalMask: {
    backgroundColor: 'rgba(199, 154, 63, 0.1)',
    backdropFilter: 'blur(4px)',
  },
  modalTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '600',
    color: '#8b6e2c',
  },
  modalTitleIcon: {
    color: '#c79a3f',
    fontSize: '24px',
    marginRight: '10px',
  },
  modalContent: {
    textAlign: 'center',
    padding: '10px 0',
  },
  modalText: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '12px',
    lineHeight: '1.5',
  },
  modalSubText: {
    fontSize: '14px',
    color: '#888',
    fontStyle: 'italic',
    marginTop: '16px',
  },
  codeContainer: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #fdf8ed 0%, #f8f0e0 100%)',
    border: '2px solid #f0e6d3',
    borderRadius: '12px',
    padding: '4px 8px',
    margin: '12px 0',
  },
  codeText: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#c79a3f',
    letterSpacing: '1px',
    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  confirmButton: {
    backgroundColor: '#c79a3f',
    borderColor: '#c79a3f',
    borderRadius: '8px',
    fontWeight: '600',
    padding: '10px 30px',
    height: 'auto',
    fontSize: '14px',
    boxShadow: '0 4px 12px rgba(199, 154, 63, 0.3)',
    transition: 'all 0.3s ease',
  },
  cancelButton: {
    borderRadius: '8px',
    fontWeight: '600',
    padding: '10px 30px',
    height: 'auto',
    fontSize: '14px',
    borderColor: '#d9d9d9',
    color: '#666',
    transition: 'all 0.3s ease',
  },
  loadingContainer: {
    padding: '20px 0',
  },
  loadingIcon: {
    fontSize: '52px',
    color: '#c79a3f',
    marginBottom: '20px',
  },
  loadingText: {
    fontSize: '18px',
    color: '#8b6e2c',
    marginTop: '20px',
    fontWeight: '600',
  },
  loadingSubText: {
    fontSize: '14px',
    color: '#999',
    marginTop: '8px',
    fontStyle: 'italic',
  },
  retryButton: {
    backgroundColor: '#c79a3f',
    borderColor: '#c79a3f',
    borderRadius: '8px',
    fontWeight: '600',
    padding: '12px 36px',
    height: 'auto',
    fontSize: '15px',
    boxShadow: '0 4px 12px rgba(199, 154, 63, 0.3)',
    transition: 'all 0.3s ease',
  },
  successIcon: {
    fontSize: '72px',
    color: '#c79a3f',
  },
  errorIcon: {
    fontSize: '72px',
    color: '#ff4d4f',
  },
  successMessage: {
    marginTop: '16px',
    fontSize: '14px',
  },
  errorMessage: {
    marginTop: '16px',
    fontSize: '14px',
  },
  messageContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  result: {
    padding: 0,
  },

  // Mobile Styles
  mobileContainer: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '15px',
    background: 'linear-gradient(135deg, #f8f5f0 0%, #e8e1d1 100%)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  mobileCard: {
    backgroundColor: 'white',
    padding: '30px 20px',
    borderRadius: '16px',
    boxShadow: `
      0 8px 25px rgba(199, 154, 63, 0.15),
      0 2px 8px rgba(199, 154, 63, 0.05)
    `,
    textAlign: 'center',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid #f0e6d3',
    position: 'relative',
    overflow: 'hidden',
    margin: '0 10px',
  },
  mobileModalBody: {
    padding: '15px',
  },
  mobileModalTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '600',
    color: '#8b6e2c',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  mobileModalTitleIcon: {
    color: '#c79a3f',
    fontSize: '20px',
    marginRight: '8px',
    marginBottom: '5px',
  },
  mobileModalContent: {
    textAlign: 'center',
    padding: '5px 0',
  },
  mobileModalText: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '10px',
    lineHeight: '1.4',
    textAlign: 'center',
  },
  mobileModalSubText: {
    fontSize: '13px',
    color: '#888',
    fontStyle: 'italic',
    marginTop: '12px',
    textAlign: 'center',
  },
  mobileCodeContainer: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #fdf8ed 0%, #f8f0e0 100%)',
    border: '2px solid #f0e6d3',
    borderRadius: '10px',
    padding: '8px 12px',
    margin: '10px 0',
    wordBreak: 'break-all',
  },
  mobileCodeText: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#c79a3f',
    letterSpacing: '0.5px',
    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  mobileConfirmButton: {
    backgroundColor: '#c79a3f',
    borderColor: '#c79a3f',
    borderRadius: '8px',
    fontWeight: '600',
    padding: '12px 20px',
    height: 'auto',
    fontSize: '14px',
    width: '100%',
    marginBottom: '8px',
    boxShadow: '0 4px 12px rgba(199, 154, 63, 0.3)',
  },
  mobileCancelButton: {
    borderRadius: '8px',
    fontWeight: '600',
    padding: '12px 20px',
    height: 'auto',
    fontSize: '14px',
    borderColor: '#d9d9d9',
    color: '#666',
    width: '100%',
  },
  mobileLoadingContainer: {
    padding: '15px 0',
  },
  mobileLoadingIcon: {
    fontSize: '42px',
    color: '#c79a3f',
    marginBottom: '15px',
  },
  mobileLoadingText: {
    fontSize: '16px',
    color: '#8b6e2c',
    marginTop: '15px',
    fontWeight: '600',
  },
  mobileLoadingSubText: {
    fontSize: '13px',
    color: '#999',
    marginTop: '6px',
    fontStyle: 'italic',
  },
  mobileRetryButton: {
    backgroundColor: '#c79a3f',
    borderColor: '#c79a3f',
    borderRadius: '8px',
    fontWeight: '600',
    padding: '14px 20px',
    height: 'auto',
    fontSize: '15px',
    width: '100%',
    marginTop: '10px',
  },
  mobileSuccessIcon: {
    fontSize: '56px',
    color: '#c79a3f',
  },
  mobileErrorIcon: {
    fontSize: '56px',
    color: '#ff4d4f',
  },
  mobileSuccessMessage: {
    marginTop: '12px',
    fontSize: '13px',
  },
  mobileErrorMessage: {
    marginTop: '12px',
    fontSize: '13px',
  },
};

export default ValidarConvite;
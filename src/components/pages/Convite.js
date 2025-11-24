import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Empty,
  Tag,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  message
} from 'antd';
import {
  PlusOutlined,
  CalendarOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import Api from '../api/Api';

const { TextArea } = Input;

const Convites = () => {
  const [convites, setConvites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
 



  const fetchConvites = async () => {
    try {
       setLoading(true);
      const response = await Api.ListConvite();
      if (Array.isArray(response)) {
        const formatado = response.map(item => ({
          id:  item.id,
          descricao: item.descricao,
          numConvidados: item.n_convidado,
          local: item.local,
          status: 'ativo',
          dataEvento: item.data,
     
        }));
       setConvites(formatado);
      } else {
       // sms_error('Formato de resposta inválido');
      }
    } catch (error) {
    //  sms_error('Erro ao buscar hospitais: ' + error.message);
    }
    finally{
         setLoading(false);
    }
  };


  useEffect(() => {
fetchConvites();
}, []);


 

  const handleAddConvite = (values) => {
    const newConvite = {
      id: convites.length + 1,
      descricao: values.descricao,
      dataEvento: values.dataEvento.format('YYYY-MM-DD'),
      numConvidados: values.numConvidados,
      local: values.local,
      status: 'ativo'
    };
    setConvites([...convites, newConvite]);
    setModalVisible(false);
    form.resetFields();
    message.success('Convite criado com sucesso!');
  };

  const handleCardClick = (id) => navigate(`/convidados/${id}`);

  const getStatusTag = (status) => (
    <Tag color={status === 'ativo' ? 'green' : 'red'}>
      {status === 'ativo' ? 'Ativo' : 'Inativo'}
    </Tag>
  );

  const formatDate = (date) => dayjs(date).format('DD/MM/YYYY');

  return (
    <div className="convites-container">
      <div className="page-header">
        <div className="header-content">
          <h1>Meus Convites</h1>
          <p>Organize e acompanhe todos os seus eventos com estilo</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => setModalVisible(true)}
          className="add-button"
        >
          Novo Convite
        </Button>
      </div>

      {convites.length === 0 ? (
        <Empty
          description="Nenhum convite criado ainda"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary" onClick={() => setModalVisible(true)}>
            Criar Primeiro Convite
          </Button>
        </Empty>
      ) : (
        <Row gutter={[24, 24]}>
          {convites.map((convite) => (
            <Col key={convite.id} xs={24} sm={12} lg={8} xl={6}>
              <div className="card-3d-wrapper">
                <Card
                  className="convite-card"
                  hoverable
                  loading={loading}
                  onClick={() => handleCardClick(convite.id)}
                  actions={[
                    <EyeOutlined key="view" />,
                  //  <EditOutlined key="edit" />,
                   // <DeleteOutlined key="delete" />
                  ]}
                >
                  <div className="card-header">
                    <div className="card-icon">
                      <CalendarOutlined />
                    </div>
                    <div className="card-header-info">
                      <h3>{convite.descricao}</h3>
                      {getStatusTag(convite.status)}
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="card-info-item">
                      <CalendarOutlined className="info-icon" />
                      <span>{formatDate(convite.dataEvento)}</span>
                    </div>
                    <div className="card-info-item">
                      <UserOutlined className="info-icon" />
                      <span>{convite.numConvidados} convidados</span>
                    </div>
                    <div className="card-local">{convite.local}</div>
                  </div>
                </Card>
              </div>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title="Criar Novo Convite"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleAddConvite}>
          <Form.Item
            name="descricao"
            label="Descrição do Evento"
            rules={[{ required: true, message: 'Por favor insira a descrição' }]}
          >
            <Input placeholder="Ex: Casamento, Aniversário, Conferência..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dataEvento"
                label="Data do Evento"
                rules={[{ required: true, message: 'Selecione a data' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="numConvidados"
                label="Número de Convidados"
                rules={[{ required: true, message: 'Insira o número' }]}
              >
                <InputNumber min={1} max={1000} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="local"
            label="Local do Evento"
            rules={[{ required: true, message: 'Por favor insira o local' }]}
          >
            <Input placeholder="Ex: Salão de Festas, Restaurante..." />
          </Form.Item>

          <Form.Item name="observacoes" label="Observações">
            <TextArea rows={4} placeholder="Informações adicionais..." />
          </Form.Item>

          <div className="form-actions">
            <Button
              onClick={() => {
                setModalVisible(false);
                form.resetFields();
              }}
            >
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit">
              Criar Convite
            </Button>
          </div>
        </Form>
      </Modal>

      <style jsx>{`
        .convites-container {
          padding: 24px;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .header-content h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          color: #2a2a2a;
        }

        .header-content p {
          margin: 4px 0 0;
          color: #888;
          font-size: 15px;
        }

        .add-button {
          background: #c79a3f;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(199, 154, 63, 0.3);
        }

        .add-button:hover {
          background: #b38934 !important;
        }

        /* === EFEITO 3D === */
        .card-3d-wrapper {
          perspective: 1000px;
        }

        .convite-card {
          border-radius: 16px;
          overflow: hidden;
          border: none;
          background: linear-gradient(145deg, #ffffff, #f3f3f3);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
          transform-style: preserve-3d;
          transition: all 0.4s ease;
        }

        .convite-card:hover {
          transform: rotateY(6deg) rotateX(3deg) translateY(-6px);
          box-shadow: 0 15px 30px rgba(199, 154, 63, 0.3);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .card-icon {
          background: #c79a3f;
          color: white;
          font-size: 20px;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.4),
            0 4px 10px rgba(199, 154, 63, 0.4);
        }

        .card-header-info h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #2a2a2a;
        }

        .card-body {
          border-top: 1px solid #f0f0f0;
          padding-top: 10px;
        }

        .card-info-item {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #555;
          font-size: 13px;
          margin-bottom: 6px;
        }

        .info-icon {
          color: #c79a3f;
        }

        .card-local {
          margin-top: 10px;
          padding-top: 8px;
          font-size: 13px;
          font-style: italic;
          color: #666;
          border-top: 1px solid #f0f0f0;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #f0f0f0;
        }
      `}</style>
    </div>
  );
};

export default Convites;

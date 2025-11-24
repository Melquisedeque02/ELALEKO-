import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Card,
  Statistic,
  Row,
  Col,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  UploadOutlined,
  DownloadOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  TeamOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import Api from '../api/Api';
import ExcelUploaderModal from "./Import"; // ajuste o caminho


const { Column } = Table;
const { TextArea } = Input;

const ConviteDetalhes = () => {
  const [convidados, setConvidados] = useState([]);
  const [convite, setConvite] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
 const [importModalVisible, setImportModalVisible] = useState(false);

 let URLBase='https://qrinvite.milvendas.ao';
 

  const gerarQrCode =async (code,convidado,acompanhante) => {
 
 const nomes = convidado.replace(' ','_') + '_e_'+acompanhante.replace(' ','_');
 
    let qrgenerator= URLBase+'/qr?content='+'https://qrinvite.milvendas.ao'+'/validar/'+ code+'&filename='+nomes;

   window.open(qrgenerator, "_blank");

 

};


 const handleDownload = (record) => {
  gerarQrCode(record.codigo,record.nome,record.acompanhante);
  
  };



  const fetchConvidados = async () => {
    try {
       setLoading(true);

       const dados={id:id};
      const response = await Api.ListConvidado(dados);
      if (Array.isArray(response)) {
        const formatado = response.map(item => ({
  key: item.id,
  nome: item.convidado,
  acompanhante: item.acompanhante,
  codigo: item.code,
  status:  
    item.status === "1"
      ? "pendente"
      : item.status === "0"
      ? "confirmado"
      : item.status === "2"
      ? "cancelado"
      : "Desconhecido"
}));

setConvidados(formatado);

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


  const fetchDashboard = async () => {
    try {

     const dados={id:id};
      const response = await Api.ListConviteId(dados);
      if (response && typeof response === "object") {
       

          const mockConvite = {
          id: parseInt(id),
          descricao: response.descricao,
          dataEvento: response.data,
          numConvidados: response.n_convidado,
          local: response.local,
          status: 'ativo',
        };

       

        setConvite(mockConvite);

        
    } else {
       
    }
      
    } catch (error) {
    
    }
  };


 const closeModal = async () => {
 setImportModalVisible(false)
 fetchConvidados();
 }












  useEffect(() => {
    fetchDashboard();
    fetchConvidados();
  }, [id]);

 

  const handleAddConvidado = async (values) => {
    const newConvidado = {
   
      convidado: values.nome,
      acompanhante: values.acompanhante || '-',
      id_convites: id
     
     
    };

    const response= await Api.AddConvidado(newConvidado);


     fetchConvidados();
    setModalVisible(false);
    form.resetFields();
    message.success('Convidado adicionado com sucesso!');
  };

 

  const handleDownloadAll = () => {
    message.info('Iniciando download de todos os convites...');
  };

  const getStatusTag = (status) => {
    const statusConfig = {
      confirmado: { color: 'green', text: 'Confirmado' },
      pendente: { color: 'orange', text: 'Pendente' },
      cancelado: { color: 'red', text: 'Cancelado' },
    };
    const config = statusConfig[status] || statusConfig.pendente;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const stats = {
    total: convidados.length,
    confirmados: convidados.filter((c) => c.status === 'confirmado').length,
    pendentes: convidados.filter((c) => c.status === 'pendente').length,
    cancelados: convidados.filter((c) => c.status === 'cancelado').length,
  };

  return (
    <div className="convite-detalhes-container">
      {/* Header */}
      <div className="page-header">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/convites')}
          className="back-btn"
        >
          Voltar
        </Button>
        <div className="page-title">
          <h1>Detalhes do Convite</h1>
          <p>Gestão completa dos convidados do evento</p>
        </div>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          size="large"
          onClick={handleDownloadAll}
          className="export-btn"
        >
          Exportar Todos
        </Button>
      </div>

      {/* Informações */}
      <Card className="convite-info-card">
        <div className="convite-header">
          <div>
            <h2>{convite?.descricao}</h2>
            <div className="convite-meta">
              <span><CalendarOutlined /> {convite?.dataEvento}</span>
              <span><UserOutlined /> {convite?.numConvidados} convidados</span>
              <span><EnvironmentOutlined /> {convite?.local}</span>
            </div>
          </div>
          <div className="actions">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalVisible(true)}
              className="add-btn"
            >
              Adicionar Convidado
            </Button>
             <Button icon={<UploadOutlined  />}
              onClick={() => setImportModalVisible(true)}
              >Importar Excel</Button>
            
          </div>
        </div>
      </Card>

      {/* Estatísticas */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {[
          { title: 'Total', value: stats.total, color: '#1890ff', icon: <TeamOutlined /> },
          { title: 'Confirmados', value: stats.confirmados, color: '#52c41a', icon: <UserOutlined /> },
          { title: 'Pendentes', value: stats.pendentes, color: '#faad14', icon: <UserOutlined /> },
          { title: 'Cancelados', value: stats.cancelados, color: '#ff4d4f', icon: <UserOutlined /> },
        ].map((s, i) => (
          <Col xs={12} sm={6} key={i}>
            <Card className="stat-card" hoverable>
              <Statistic title={s.title} value={s.value} valueStyle={{ color: s.color }} prefix={s.icon} />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Tabela */}
      <Card title="Lista de Convidados" className="table-card">
        <Table
          dataSource={convidados}
          loading={loading}
          pagination={{ pageSize: 8 }}
          scroll={{ x: 800 }}
        >
   
          <Column title="Nome" dataIndex="nome" key="nome" />
          <Column title="Acompanhante" dataIndex="acompanhante" key="acompanhante" />
          <Column title="Status" dataIndex="status" key="status" render={(v) => getStatusTag(v)} />
          <Column
            title="Ações"
            key="acoes"
            render={(_, r) => (
              <Button type="link" icon={<DownloadOutlined />} onClick={() => handleDownload(r)}>
                Download
              </Button>
            )}
          />
        </Table>
      </Card>

      {/* Modal */}
      <Modal
        title="Adicionar Convidado"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={480}
        className="add-modal"
      >
        <Form layout="vertical" onFinish={handleAddConvidado} form={form}>
          <Form.Item label="Nome " name="nome" rules={[{ required: true }]}>
            <Input placeholder="Nome" />
          </Form.Item>
    
       
          <Form.Item label="Acompanhante" name="acompanhante">
            <Input placeholder="Nome do acompanhante (opcional)" />
          </Form.Item>
          

          <div className="form-footer">
            <Button onClick={() => setModalVisible(false)}>Cancelar</Button>
            <Button type="primary" htmlType="submit" className="submit-btn">
              Adicionar
            </Button>
          </div>
        </Form>
      </Modal>

       <ExcelUploaderModal
  open={importModalVisible}
  onClose={() =>closeModal()}
  conviteId={id}   
/>


      {/* Estilo */}
     <style jsx>{`
  .convite-detalhes-container {
    background: #fff;
    padding: 24px;
    min-height: 100vh;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(6px);
    border-radius: 16px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  }

  .back-btn {
    background: #f5f5f5;
    border-radius: 8px;
    border: none;
  }

  .page-title h1 {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
  }

  .page-title p {
    margin: 0;
    color: #888;
  }

  .export-btn {
    background: linear-gradient(45deg, #c79a3f, #f4d58d);
    border: none;
    font-weight: 600;
  }

  .convite-info-card {
    border-radius: 16px;
    margin-top: 24px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.3s;
  }

  .convite-info-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  .convite-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .convite-meta span {
    margin-right: 16px;
    color: #666;
  }

  .actions button {
    margin-left: 8px;
  }

  .add-btn {
    background: linear-gradient(45deg, #c79a3f, #f4d58d);
    border: none;
  }

  .stat-card {
    border-radius: 16px;
    text-align: center;
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    transition: all 0.3s;
  }

  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  }

  /* 🌟 Tabela aprimorada */
  .table-card {
    margin-top: 24px;
    border-radius: 16px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    transition: all 0.3s;
  }

  .table-card:hover {
    box-shadow: 0 6px 28px rgba(0,0,0,0.12);
  }

  .ant-table {
    border-radius: 16px;
  }

  .ant-table-thead > tr > th {
    background: #fff !important;
    color: #c79a3f !important;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid rgba(199, 154, 63, 0.15);
    font-size: 13px;
  }

  .ant-table-tbody > tr > td {
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
    transition: all 0.2s;
    padding: 12px 16px;
  }

  .ant-table-tbody > tr:hover > td {
    background: rgba(199, 154, 63, 0.05) !important;
    transform: scale(1.005);
    box-shadow: inset 0 0 6px rgba(199, 154, 63, 0.08);
  }

  .ant-table-tbody > tr:last-child > td {
    border-bottom: none;
  }

  .table-card .ant-table-pagination {
    margin-top: 16px;
  }

  .table-card .ant-btn-link {
    color: #c79a3f;
    font-weight: 600;
  }

  .table-card .ant-btn-link:hover {
    color: #b2872b;
    text-decoration: underline;
  }

  .add-modal .submit-btn {
    background: linear-gradient(45deg, #c79a3f, #f4d58d);
    border: none;
    font-weight: 600;
  }

  .form-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 16px;
  }
`}</style>

    </div>
  );
};

export default ConviteDetalhes;

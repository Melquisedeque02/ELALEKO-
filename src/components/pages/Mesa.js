import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Input, 
  Modal, 
  Form, 
  Spin, 
  Table,
  Space,
  message,
  Popconfirm,
  Empty,
  Typography,
  ConfigProvider,
  Pagination,
  Card,
  Row,
  Col
} from 'antd';
import { 
  RiDeleteBinLine, 
  RiEditLine, 
  RiSearchLine, 
  RiAddLine,
  RiTableLine
} from 'react-icons/ri';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Api from '../api/Api';

const { Title } = Typography;

const GerenciarMesas = () => {
  // Estados principais
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  // Estados para modais
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Estados para seleção
  const [selectedMesa, setSelectedMesa] = useState(null);
  
  // Formulário
  const [form] = Form.useForm();

  // Nova paleta de cores
  const primaryColor = '#3b82f6';
  const secondaryColor = '#8b5cf6';
  const gradient = `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`;
  const lightBackground = '#f8fafc';

  // Buscar dados iniciais com paginação
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const mesasData = await Api.ListMesa();
      
      setMesas(mesasData.map(m => ({ 
        ...m,
        key: m.id
      })));
    } catch (error) {
      toast.error('Erro ao carregar mesas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar mesas
  const filteredMesas = mesas.filter(mesa => {
    return mesa.descricao.toLowerCase().includes(searchText.toLowerCase());
  });

  // Paginação
  const paginatedMesas = filteredMesas.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Colunas da tabela
  const columns = [
    {
      title: 'Mesa',
      dataIndex: 'descricao',
      key: 'descricao',
      sorter: (a, b) => a.descricao.localeCompare(b.descricao),
      render: (text) => (
        <Space>
          <RiTableLine style={{ color: primaryColor }} />
          <span>{text}</span>
        </Space>
      )
    },
    {
      title: 'Ações',
      key: 'acoes',
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            icon={<RiEditLine />}
            onClick={() => {
              setSelectedMesa(record);
              form.setFieldsValue({
                descricao: record.descricao
              });
              setIsModalVisible(true);
            }}
            style={{
              color: primaryColor,
              borderColor: primaryColor,
              borderRadius: 6
            }}
          />
          
          <Popconfirm
            title="Excluir esta mesa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sim"
            cancelText="Não"
            okButtonProps={{
              danger: true,
              style: { borderRadius: 6 }
            }}
            cancelButtonProps={{
              style: { borderRadius: 6 }
            }}
          >
            <Button 
              icon={<RiDeleteBinLine />}
              danger
              style={{ borderRadius: 6 }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Manipuladores CRUD  
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      if (selectedMesa) {
        const response = await Api.AlterMesa({ 
          id: selectedMesa.id,
          descricao: values.descricao
        });
        
        if(response.success){
          fetchData();
          toast.success('Mesa atualizada com sucesso!');
        } else if(response.message === 'Request failed with status code 409'){
          toast.error('Já existe uma mesa com esta descrição.');
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await Api.AddMesa({ descricao: values.descricao });
        
        if(response.success){
          fetchData();
          toast.success('Mesa adicionada com sucesso!');
        } else if(response.message === 'Request failed with status code 409'){
          toast.error('Já existe uma mesa com esta descrição.');
        } else {
          toast.error(response.message);
        }
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      toast.error('Erro ao salvar mesa: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await Api.DeleteMesa({ id });

      if(response.success){
        fetchData();
        toast.success('Mesa excluída com sucesso!');
      } else if(response.message === 'Request failed with status code 409'){
        fetchData();
        toast.error('Esta mesa está vinculada a pedidos e não pode ser excluída.');
      } else {
        toast.error(response.message);
      }
      
      // Resetar para a primeira página se necessário
      setCurrentPage(1);
    } catch (error) {
      toast.error('Erro ao excluir mesa: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryColor,
          borderRadius: 8,
        },
      }}
    >
      <div style={{ 
        padding: 24,
        background: lightBackground,
        minHeight: '100vh'
      }}>
        <ToastContainer position="top-right" />
        
        {/* Cabeçalho */}
        <Card 
          style={{ 
            marginBottom: 24,
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: 'none'
          }}
          bodyStyle={{ padding: '16px 24px' }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <RiTableLine size={20} />
                </div>
                <Title level={3} style={{ margin: 0, color: '#1e293b' }}>
                  Mesas
                </Title>
              </div>
            </Col>
            
            <Col>
              <Space>
                <Input
                  placeholder="Pesquisar mesas..."
                  prefix={<RiSearchLine style={{ color: 'rgba(0,0,0,0.3)' }} />}
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{ 
                    width: 250,
                    borderRadius: 8,
                  }}
                />
                
                <Button 
                  type="primary"
                  icon={<RiAddLine />}
                  onClick={() => {
                    setSelectedMesa(null);
                    form.resetFields();
                    setIsModalVisible(true);
                  }}
                  style={{ 
                    background: gradient,
                    border: 'none',
                    borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                    height: 40,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  Nova Mesa
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Tabela de Mesas */}
        <Spin spinning={loading}>
          <Card
            style={{
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: 'none'
            }}
            bodyStyle={{ padding: 0 }}
          >
            {filteredMesas.length > 0 ? (
              <>
                <Table
                  columns={columns}
                  dataSource={paginatedMesas}
                  pagination={false}
                  style={{
                    borderRadius: 8,
                    overflow: 'hidden',
                  }}
                  locale={{
                    emptyText: 'Nenhuma mesa encontrada'
                  }}
                />
                
                {/* Paginação */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  padding: '16px'
                }}>
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredMesas.length}
                    onChange={(page) => setCurrentPage(page)}
                    showSizeChanger={false}
                    style={{
                      borderRadius: 8,
                    }}
                  />
                </div>
              </>
            ) : (
              <Empty
                description={
                  <span style={{ color: 'rgba(0,0,0,0.5)' }}>
                    Nenhuma mesa encontrada {searchText ? 'com o filtro atual' : ''}
                  </span>
                }
                style={{ 
                  padding: 40,
                }}
              />
            )}
          </Card>
        </Spin>

        {/* Modal de edição/criação */}
        <Modal
          title={
            <span style={{
              background: gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
              fontWeight: 600
            }}>
              {selectedMesa ? 'Editar Mesa' : 'Nova Mesa'}
            </span>
          }
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
          }}
          footer={[
            <Button 
              key="cancel" 
              onClick={() => {
                setIsModalVisible(false);
              }}
              style={{ borderRadius: 6 }}
            >
              Cancelar
            </Button>,
            <Button 
              key="submit" 
              type="primary" 
              loading={loading}
              onClick={() => form.submit()}
              style={{ 
                background: gradient,
                border: 'none',
                borderRadius: 6,
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
              }}
            >
              {selectedMesa ? 'Atualizar' : 'Salvar'}
            </Button>
          ]}
          width={500}
          destroyOnClose
          styles={{
            header: {
              borderBottom: '1px solid rgba(0,0,0,0.05)'
            },
            footer: {
              borderTop: '1px solid rgba(0,0,0,0.05)'
            }
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="descricao"
              label="Descrição"
              rules={[{ required: true, message: 'Campo obrigatório' }]}
            >
              <Input 
                maxLength={100}
                style={{ borderRadius: 6 }}
                placeholder="Digite o nome da mesa"
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default GerenciarMesas;
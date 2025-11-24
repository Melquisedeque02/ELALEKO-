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
  RiAppsLine
} from 'react-icons/ri';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Api from '../api/Api';

const { Title } = Typography;

const GerenciarCategorias = () => {
  // Estados principais
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  // Estados para modais
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Estados para seleção
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  
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
      const categoriasData = await Api.ListCategoria();
      
      setCategorias(categoriasData.map(c => ({ 
        ...c,
        key: c.id
      })));
    } catch (error) {
      toast.error('Erro ao carregar categorias: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar categorias
  const filteredCategorias = categorias.filter(categoria => {
    return categoria.descricao.toLowerCase().includes(searchText.toLowerCase());
  });

  // Paginação
  const paginatedCategorias = filteredCategorias.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Colunas da tabela
  const columns = [
    {
      title: 'Descrição',
      dataIndex: 'descricao',
      key: 'descricao',
      sorter: (a, b) => a.descricao.localeCompare(b.descricao),
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
              setSelectedCategoria(record);
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
            title="Excluir esta categoria?"
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

      if (selectedCategoria) {
        const response = await Api.AlterCategoria({ 
          id: selectedCategoria.id,
          descricao: values.descricao
        });
        
        if(response.success){
          fetchData();
          toast.success('Categoria atualizada com sucesso!');
        } else if(response.message === 'Request failed with status code 409'){
          toast.error('Já existe uma categoria com esta descrição.');
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await Api.AddCategoria({ descricao: values.descricao });
        
        if(response.success){
          fetchData();
          toast.success('Categoria adicionada com sucesso!');
        } else if(response.message === 'Request failed with status code 409'){
          toast.error('Já existe uma categoria com esta descrição.');
        } else {
          toast.error(response.message);
        }
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      toast.error('Erro ao salvar categoria: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await Api.DeleteCategoria({ id });

      if(response.success){
        fetchData();
        toast.success('Categoria excluída com sucesso!');
      } else if(response.message === 'Request failed with status code 409'){
        fetchData();
        toast.error('Esta categoria está vinculada a produtos e não pode ser excluída.');
      } else {
        toast.error(response.message);
      }
      
      // Resetar para a primeira página se necessário
      setCurrentPage(1);
    } catch (error) {
      toast.error('Erro ao excluir categoria: ' + error.message);
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
                  <RiAppsLine size={20} />
                </div>
                <Title level={3} style={{ margin: 0, color: '#1e293b' }}>
                  Categorias
                </Title>
              </div>
            </Col>
            
            <Col>
              <Space>
                <Input
                  placeholder="Pesquisar categorias..."
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
                    setSelectedCategoria(null);
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
                  Nova Categoria
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Tabela de Categorias */}
        <Spin spinning={loading}>
          <Card
            style={{
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: 'none'
            }}
            bodyStyle={{ padding: 0 }}
          >
            {filteredCategorias.length > 0 ? (
              <>
                <Table
                  columns={columns}
                  dataSource={paginatedCategorias}
                  pagination={false}
                  style={{
                    borderRadius: 8,
                    overflow: 'hidden',
                  }}
                  locale={{
                    emptyText: 'Nenhuma categoria encontrada'
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
                    total={filteredCategorias.length}
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
                    Nenhuma categoria encontrada {searchText ? 'com o filtro atual' : ''}
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
              {selectedCategoria ? 'Editar Categoria' : 'Nova Categoria'}
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
              {selectedCategoria ? 'Atualizar' : 'Salvar'}
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
                placeholder="Digite o nome da categoria"
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default GerenciarCategorias;
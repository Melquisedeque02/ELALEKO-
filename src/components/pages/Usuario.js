import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Input, 
  Modal, 
  Form, 
  Spin, 
  Table,
  Space,
  Tag,
  message,
  Popconfirm,
  Empty,
  Typography,
  ConfigProvider,
  Pagination,
  Switch,
  Card,
  Row,
  Col
} from 'antd';
import { 
  RiDeleteBinLine, 
  RiEditLine, 
  RiSearchLine, 
  RiAddLine,
  RiUserLine,
  RiLockLine,
  RiMailLine
} from 'react-icons/ri';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Api from '../api/Api';

const { Title } = Typography;

const GerenciarUsuarios = () => {
  // Estados principais
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  // Estados para modais
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Estados para seleção
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  
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
      const usuariosData = await Api.ListUser();
      
      setUsuarios(usuariosData.map(u => ({ 
        ...u,
        key: u.id,
        ativo: u.status === 'Ativo'
      })));
    } catch (error) {
      toast.error('Erro ao carregar usuários: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar usuários
  const filteredUsuarios = usuarios.filter(usuario => {
    return (
      usuario.nome.toLowerCase().includes(searchText.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  // Paginação
  const paginatedUsuarios = filteredUsuarios.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Colunas da tabela
  const columns = [
    {
      title: 'Usuário',
      dataIndex: 'nome',
      key: 'nome',
      sorter: (a, b) => a.nome.localeCompare(b.nome),
      render: (text, record) => (
        <Space>
          <RiUserLine style={{ color: primaryColor }} />
          <span>{text}</span>
        </Space>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => (
        <Space>
          <RiMailLine style={{ color: '#3b82f6' }} />
          <span>{email}</span>
        </Space>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Ativo' ? '#10b981' : '#ef4444'}>
          {status}
        </Tag>
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
              setSelectedUsuario(record);
              form.setFieldsValue({
                nome: record.nome,
                email: record.email,
                ativo: record.status === 'Ativo',
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
            title="Excluir este usuário?"
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

      const userData = {
        nome: values.nome,
        email: values.email,
        status: values.ativo ? 'Ativo' : 'Inativo'
      };

      if (values.password) {
        userData.password = values.password;
      }

      if (selectedUsuario) {
        userData.id = selectedUsuario.id;
        const response = await Api.AlterUser(userData);
        
        if(response.success){
          fetchData();
          toast.success('Usuário atualizado com sucesso!');
        } else if(response.message === 'Request failed with status code 409'){
          toast.error('Já existe um usuário com este email.');
        }
        else if(response.message === 'Request failed with status code 402'){
          toast.error('Não pode editar esse usuário');
        }
        else {
          toast.error(response.message);
        }
      } else {
        if (!values.password) {
          toast.error('A senha é obrigatória para novo usuário!');
          return;
        }
        
        const response = await Api.AddUser(userData);
        
        if(response.success){
          fetchData();
          toast.success('Usuário adicionado com sucesso!');
        } else if(response.message === 'Request failed with status code 409'){
          toast.error('Já existe um usuário com este email.');
        } else {
          toast.error(response.message);
        }
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      toast.error('Erro ao salvar usuário: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await Api.DeleteUser({ id });

      if(response.success){
        fetchData();
        toast.success('Usuário excluído com sucesso!');
      } else if(response.message === 'Request failed with status code 409'){
        fetchData();
        toast.error('Este usuário está vinculado a registros e não pode ser excluído.');
      } 
      else if(response.message === 'Request failed with status code 402'){
        toast.error('Não pode eliminar esse usuário');
      }
      else {
        toast.error(response.message);
      }
      
      setCurrentPage(1);
    } catch (error) {
      toast.error('Erro ao excluir usuário: ' + error.message);
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
                  <RiUserLine size={20} />
                </div>
                <Title level={3} style={{ margin: 0, color: '#1e293b' }}>
                  Usuários
                </Title>
              </div>
            </Col>
            
            <Col>
              <Space>
                <Input
                  placeholder="Pesquisar usuários..."
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
                    setSelectedUsuario(null);
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
                  Novo Usuário
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Tabela de Usuários */}
        <Spin spinning={loading}>
          <Card
            style={{
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: 'none'
            }}
            bodyStyle={{ padding: 0 }}
          >
            {filteredUsuarios.length > 0 ? (
              <>
                <Table
                  columns={columns}
                  dataSource={paginatedUsuarios}
                  pagination={false}
                  style={{
                    borderRadius: 8,
                    overflow: 'hidden',
                  }}
                  locale={{
                    emptyText: 'Nenhum usuário encontrado'
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
                    total={filteredUsuarios.length}
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
                    Nenhum usuário encontrado {searchText ? 'com o filtro atual' : ''}
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
              {selectedUsuario ? 'Editar Usuário' : 'Novo Usuário'}
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
              {selectedUsuario ? 'Atualizar' : 'Salvar'}
            </Button>
          ]}
          width={600}
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
              name="nome"
              label="Nome Completo"
              rules={[{ required: true, message: 'Campo obrigatório' }]}
            >
              <Input 
                placeholder="Digite o nome completo" 
                maxLength={100}
                style={{ borderRadius: 6 }}
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Campo obrigatório' },
                { type: 'email', message: 'Email inválido' }
              ]}
            >
              <Input 
                type="email"
                style={{ borderRadius: 6 }}
                placeholder="Digite o email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Senha"
              rules={[
                { 
                  required: !selectedUsuario, 
                  message: 'Campo obrigatório para novo usuário' 
                },
                { 
                  min: 6, 
                  message: 'A senha deve ter pelo menos 6 caracteres' 
                }
              ]}
            >
              <Input.Password
                placeholder={selectedUsuario ? "Deixe em branco para manter a senha atual" : "Digite a senha"}
                prefix={<RiLockLine style={{ color: 'rgba(0,0,0,0.3)' }} />}
                style={{ borderRadius: 6 }}
              />
            </Form.Item>

            <Form.Item
              name="ativo"
              label="Status"
              valuePropName="checked"
            >
              <Switch 
                checkedChildren="Ativo" 
                unCheckedChildren="Inativo" 
                defaultChecked
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default GerenciarUsuarios;
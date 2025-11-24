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
  Select,
  Badge,
  Card,
  Row,
  Col
} from 'antd';
import { 
  RiEditLine, 
  RiSearchLine, 
  RiRestaurantLine,
  RiClipboardLine,
  RiCloseCircleLine
} from 'react-icons/ri';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Api from '../api/Api';
import formatarValor from '../formatarValor';

const { Title } = Typography;

const GerenciarPedidos = () => {
  // Estados principais
  const [pedidos, setPedidos] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  // Estados para modais
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [form] = Form.useForm();

  // Nova paleta de cores
  const primaryColor = '#3b82f6';
  const secondaryColor = '#8b5cf6';
  const gradient = `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`;
  const lightBackground = '#f8fafc';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pedidosData, mesasData, produtosData] = await Promise.all([
        Api.ListPedido(),
        Api.ListMesa(),
        Api.ListProduto()
      ]);
      
      setPedidos(pedidosData.map(p => ({ 
        ...p,
        key: p.id,
        observacao: p.obs,
        preco: p.preco
      })));
      setMesas(mesasData);
      setProdutos(produtosData);
    } catch (error) {
      toast.error('Erro ao carregar pedidos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getMesaNumero = (id_mesa) => {
    const mesa = mesas.find(m => m.id === id_mesa);
    return mesa ? ` ${mesa.descricao}` : 'Mesa não encontrada';
  };

  const getProdutoNome = (id_produto) => {
    const produto = produtos.find(p => p.id === id_produto);
    return produto ? produto.descricao : 'Produto não encontrado';
  };

  const filteredPedidos = pedidos.filter(pedido => {
    return (
      pedido.observacao?.toLowerCase().includes(searchText.toLowerCase()) ||
      mesas.find(m => m.id === pedido.id_mesa)?.descricao.toString().includes(searchText.toLowerCase())
    );
  });

  const paginatedPedidos = filteredPedidos.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const pedidoData = {
        id: selectedPedido.id,
        status: values.status,
        ...(values.status === 'CANCELADO' && { obs: values.motivo })
      };

      const response = await Api.AlterPedido(pedidoData);
      
      if(response.success){
        fetchData();
        toast.success('Pedido atualizado com sucesso!');
      } else {
        toast.error(response.message || 'Erro ao atualizar pedido');
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      toast.error('Erro ao salvar pedido: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderEditModal = () => (
    <Modal
      title={
        <span style={{
          background: gradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block',
          fontWeight: 600
        }}>
          Editar Status do Pedido
        </span>
      }
      open={isModalVisible}
      onCancel={() => {
        setIsModalVisible(false);
        form.resetFields();
      }}
      footer={[
        <Button 
          key="cancel" 
          onClick={() => {
            setIsModalVisible(false);
            form.resetFields();
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
          Atualizar
        </Button>
      ]}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ status: selectedPedido?.status }}
      >
        <Form.Item
          name="status"
          label="Status do Pedido"
          rules={[{ required: true, message: 'Selecione o status' }]}
        >
          <Select
            placeholder="Selecione o status"
            onChange={(value) => {
              if (value !== 'CANCELADO') {
                form.setFieldsValue({ motivo: undefined });
              }
            }}
            options={[
              { value: 'PENDENTE', label: 'PENDENTE' },
              { value: 'FECHADO', label: 'FECHADO' },
              { value: 'CANCELADO', label: 'CANCELADO' }
            ]}
            style={{ borderRadius: 6 }}
          />
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => 
            prevValues.status !== currentValues.status
          }
        >
          {({ getFieldValue }) => 
            getFieldValue('status') === 'CANCELADO' ? (
              <Form.Item
                name="motivo"
                label="Motivo do Cancelamento"
                rules={[
                  { required: true, message: 'Por favor, informe o motivo do cancelamento' },
                  { max: 255, message: 'O motivo deve ter no máximo 255 caracteres' }
                ]}
              >
                <Input.TextArea 
                  rows={4} 
                  placeholder="Informe o motivo do cancelamento"
                  maxLength={255}
                  showCount
                />
              </Form.Item>
            ) : null
          }
        </Form.Item>

        {selectedPedido && (
          <div style={{ marginTop: 24 }}>
            <h4 style={{ marginBottom: 8, color: '#1e293b' }}>Detalhes do Pedido</h4>
            <p><strong>Mesa:</strong> {getMesaNumero(selectedPedido.id_mesa)}</p>
            <p><strong>Produto:</strong> {getProdutoNome(selectedPedido.id_produto)}</p>
            <p><strong>Quantidade:</strong> {selectedPedido.quantidade}</p>
            <p><strong>Preço Unitário:</strong> {formatarValor(selectedPedido.preco)}</p>
            <p><strong>Total:</strong> {formatarValor(selectedPedido.preco * selectedPedido.quantidade)}</p>
            {selectedPedido.observacao && (
              <p><strong>Observação:</strong> {selectedPedido.observacao}</p>
            )}
          </div>
        )}
      </Form>
    </Modal>
  );

  const columns = [
    {
      title: 'Mesa',
      dataIndex: 'id_mesa',
      key: 'mesa',
      render: (id_mesa) => (
        <Space style={{ width: '98%' }}>
          <RiRestaurantLine style={{ color: primaryColor }} />
          <span>{getMesaNumero(id_mesa)}</span>
        </Space>
      )
    },
    {
      title: 'Produto',
      dataIndex: 'id_produto',
      key: 'produto',
      width: 60,
      render: (id_produto) => getProdutoNome(id_produto)
    },
    {
      title: 'Observação',
      dataIndex: 'observacao',
      key: 'observacao',
      ellipsis: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = '';
        let text = '';
        
        switch(status) {
          case 'ABERTO':
            color = 'blue';
            text = 'ABERTO';
            break;
          case 'PENDENTE':
            color = 'orange';
            text = 'PENDENTE';
            break;
          case 'FECHADO':
            color = 'green';
            text = 'FECHADO';
            break;
          default:
            color = 'gray';
            text = status;
        }
        
        return (
          <Tag color={color}>
            {text}
          </Tag>
        );
      },
      filters: [
        { text: 'ABERTO', value: 'ABERTO' },
        { text: 'PENDENTE', value: 'PENDENTE' },
        { text: 'FECHADO', value: 'FECHADO' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Preço',
      key: 'preco',
      render: (_, record) => {
        const preco = Number(record.preco ?? 0);
        return ` ${formatarValor(preco)}`;
      },
      align: 'right'
    },
    {
      title: 'Quantidade',
      dataIndex: 'quantidade',
      key: 'quantidade',
      align: 'center'
    },
    {
      title: 'Total',
      key: 'total',
      render: (_, record) => {
        const preco = Number(record.preco ?? 0);
        const total = preco * record.quantidade;
        return <strong> {formatarValor(total)}</strong>;
      },
      align: 'right'
    },
    {
      title: 'Ações',
      key: 'acoes',
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            icon={<RiEditLine />}
            onClick={() => {
              setSelectedPedido(record);
              form.setFieldsValue({
                status: record.status
              });
              setIsModalVisible(true);
            }}
            disabled={record.status === 'FECHADO'}
            style={{
              color: primaryColor,
              borderColor: primaryColor,
              borderRadius: 6
            }}
          />
        </Space>
      ),
    },
  ];

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
                  <RiClipboardLine size={20} />
                </div>
                <Title level={3} style={{ margin: 0, color: '#1e293b' }}>
                  Pedidos
                </Title>
              </div>
            </Col>
            
            <Col>
              <Space>
                <Input
                  placeholder="Pesquisar pedidos..."
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
                
                <Badge count={pedidos.filter(p => p.status === 'ABERTO').length} style={{ backgroundColor: '#3b82f6' }}>
                  <Tag color="blue">ABERTOS</Tag>
                </Badge>
                
                <Badge count={pedidos.filter(p => p.status === 'PENDENTE').length} style={{ backgroundColor: '#f59e0b' }}>
                  <Tag color="orange">PENDENTES</Tag>
                </Badge>
                
                <Badge count={pedidos.filter(p => p.status === 'FECHADO').length} style={{ backgroundColor: '#10b981' }}>
                  <Tag color="green">FECHADOS</Tag>
                </Badge>
                
                <Badge count={pedidos.filter(p => p.status === 'CANCELADO').length} style={{ backgroundColor: '#ef4444' }}>
                  <Tag color="red">CANCELADOS</Tag>
                </Badge>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Tabela de Pedidos */}
        <Spin spinning={loading}>
          <Card
            style={{
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: 'none'
            }}
            bodyStyle={{ padding: 0 }}
          >
            {filteredPedidos.length > 0 ? (
              <>
                <Table
                  columns={columns}
                  dataSource={paginatedPedidos}
                  pagination={false}
                  style={{
                    borderRadius: 8,
                    overflow: 'hidden',
                  }}
                  locale={{
                    emptyText: 'Nenhum pedido encontrado'
                  }}
                  scroll={{ x: true }}
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
                    total={filteredPedidos.length}
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
                    Nenhum pedido encontrado {searchText ? 'com o filtro atual' : ''}
                  </span>
                }
                style={{ 
                  padding: 40,
                }}
              />
            )}
          </Card>
        </Spin>

        {renderEditModal()}
      </div>
    </ConfigProvider>
  );
};

export default GerenciarPedidos;
import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Input, 
  Spin, 
  Row, 
  Col, 
  Space, 
  Image,
  Tag,
  message,
  Card,
  Empty,
  Typography,
  ConfigProvider,
  InputNumber,
  Divider,
  Badge,
  Modal,
  Select,
  Pagination
} from 'antd';
import { 
  FaShoppingCart, 
  FaSearch, 
  FaUtensils,
  FaClipboardList,
  FaCheckCircle
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useParams, useNavigate } from 'react-router-dom';
import Api from '../api/Api';
import formatarValor from '../formatarValor';
 

const { Title, Text } = Typography;

const TelaVendas = () => {
//  const { id: mesaId } = useParams();
  const [mesaId, setmesaId] = useState(1);
     const { id } = useParams();
  const navigate = useNavigate();
  
  // Estados principais
  const [produtos, setProdutos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categorias, setCategorias] = useState([]);
  
  // Estados do carrinho
  const [carrinho, setCarrinho] = useState([]);
  const [observacao, setObservacao] = useState('');
  
  // Estados para modais
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Cores do degradê
  const primaryColor = 'rgb(249, 130, 68)';
  const secondaryColor = 'rgb(247, 72, 115)';
  const gradient = `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`;

  // URL base para imagens
  const BASE_IMAGE_URL = 'https://qrorder.technext.ao/public/img/';
  const IMG_ALTERNATIVA = 'https://qrorder.technext.ao/public/img/default.png';

 
  
  useEffect(() => {
   setmesaId(id);
  }, [id]);





  useEffect(() => {
    fetchData();
  }, [mesaId]);

  const fetchData = async () => {
    try {
      setLoading(true);

     
      const data={
        id:mesaId
      }
      const [produtosData, categoriasData, pedidosData] = await Promise.all([
        Api.ListProduto(),
        Api.ListCategoria(),
        Api.ListPedidoPorMesa({id:id})
      ]);
      
      setProdutos(produtosData.map(p => ({ 
        ...p,
        key: p.id,
        img: p.img ? (p.img.startsWith('http') ? p.img : `${BASE_IMAGE_URL}${p.img}`) : null
      })));
      
      setCategorias(categoriasData);
      
      // Filtrar apenas pedidos abertos ou pendentes
      setPedidos(pedidosData.filter(p => ['ABERTO', 'PENDENTE'].includes(p.status)));
    } catch (error) {
      toast.error('Erro ao carregar dados: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar produtos
  const filteredProdutos = produtos.filter(produto => {
    const matchesSearch = produto.descricao.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory ? Number(produto.id_categoria) === Number(selectedCategory) : true;
    const matchesStatus = produto.status?.toUpperCase() === 'DISPONÍVEL';
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Paginação - calcular produtos atuais
  const indexOfLastProduct = currentPage * pageSize;
  const indexOfFirstProduct = indexOfLastProduct - pageSize;
  const currentProducts = filteredProdutos.slice(indexOfFirstProduct, indexOfLastProduct);

  // Adicionar produto ao carrinho
  const adicionarAoCarrinho = (produto) => {
    setCarrinho(prev => {
      const existe = prev.find(item => item.id === produto.id);
      if (existe) {
        return prev.map(item =>
          item.id === produto.id 
            ? { ...item, quantidade: item.quantidade + 1 } 
            : item
        );
      }
      return [...prev, { ...produto, quantidade: 1 }];
    });
  };

  // Remover produto do carrinho
  const removerDoCarrinho = (produtoId) => {
    setCarrinho(prev => {
      const item = prev.find(item => item.id === produtoId);
      if (item && item.quantidade > 1) {
        return prev.map(item =>
          item.id === produtoId 
            ? { ...item, quantidade: item.quantidade - 1 } 
            : item
        );
      }
      return prev.filter(item => item.id !== produtoId);
    });
  };

  // Calcular total do carrinho
  const calcularTotal = () => {
    return carrinho.reduce((total, item) => {
      return total + (item.preco * item.quantidade);
    }, 0);
  };

  // Calcular total de pedidos ativos
  const calcularTotalPedidosAtivos = () => {
    return pedidos.reduce((total, pedido) => {
      const produto = produtos.find(p => p.id === pedido.id_produto);
      return total + (produto?.preco || 0) * pedido.quantidade;
    }, 0);
  };

  // Finalizar pedido
  const finalizarPedido = async () => {
    try {
      setLoading(true);
      
      if (carrinho.length === 0) {
        toast.error('Adicione pelo menos um produto ao pedido');
        return;
      }

      // Criar um pedido para cada produto no carrinho
      const pedidosPromises = carrinho.map(item => 
        Api.AddPedido({
          id_mesa: id,
          id_produto: item.id,
          quantidade: item.quantidade,
          obs: observacao,
          status: 'ABERTO'
        })
      );

      await Promise.all(pedidosPromises);
      
      toast.success('Pedido realizado com sucesso!');
      setCarrinho([]);
      setObservacao('');
      setIsModalVisible(false);
      fetchData();
    } catch (error) {
      toast.error('Erro ao realizar pedido: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Renderizar status do pedido
  const renderStatusTag = (status) => {
    let color = '';
    let text = '';
    
    switch(status) {
      case 'ABERTO':
        color = 'blue';
        text = 'Aberto';
        break;
      case 'PENDENTE':
        color = 'orange';
        text = 'Pendente';
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
  };

  // Layout responsivo
  const responsiveLayout = {
    productsCol: { xs: 24, sm: 24, md: 16, lg: 16, xl: 16 },
    ordersCol: { xs: 24, sm: 24, md: 8, lg: 8, xl: 8 },
    searchInput: { xs: 24, sm: 24, md: 12, lg: 8, xl: 8 },
    categorySelect: { xs: 24, sm: 24, md: 8, lg: 6, xl: 6 },
    cartButton: { xs: 24, sm: 24, md: 4, lg: 4, xl: 4 }
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
        padding: '16px 12px',
        background: '#f8f9fa',
        minHeight: '100vh'
      }}>
        <ToastContainer position="top-right" />
        
        {/* Cabeçalho */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: 16,
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8
        }}>
          <Title level={2} style={{ 
            margin: 0,
            fontSize: '1.5rem',
            background: gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>
            MESA {mesaId} - FAZER PEDIDO
          </Title>
          
          <div style={{ 
            display: 'flex', 
            gap: 8, 
            flexWrap: 'wrap',
            width: '100%',
            marginTop: 8
          }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <Input
                placeholder="Pesquisar produtos..."
                prefix={<FaSearch style={{ color: 'rgba(0,0,0,0.3)' }} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ 
                  width: '100%',
                  borderRadius: 8,
                  border: '1px solid rgba(0,0,0,0.1)'
                }}
              />
            </div>
            
            <div style={{ flex: 1, minWidth: 160 }}>
              <Select
                placeholder="Categoria"
                options={categorias.map(c => ({ value: c.id, label: c.descricao }))}
                value={selectedCategory}
                onChange={setSelectedCategory}
                style={{ width: '100%', borderRadius: 8 }}
                allowClear
              />
            </div>
            
            <div style={{ flex: 0 }}>
              <Badge 
                count={carrinho.reduce((total, item) => total + item.quantidade, 0)} 
                style={{ backgroundColor: primaryColor }}
              >
                <Button 
                  type="primary"
                  icon={<FaShoppingCart />}
                  onClick={() => setIsModalVisible(true)}
                  style={{ 
                    background: gradient,
                    border: 'none',
                    borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(247, 72, 115, 0.3)',
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <span className="hide-on-mobile">Ver Carrinho</span>
                  <span className="show-on-mobile" style={{ display: 'none' }}>Carrinho</span>
                </Button>
              </Badge>
            </div>
          </div>
        </div>

        <Row gutter={[16, 16]}>
          {/* Lista de Produtos */}
          <Col {...responsiveLayout.productsCol}>
            <Spin spinning={loading}>
              {currentProducts.length > 0 ? (
                <>
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: 16
                  }}>
                    {currentProducts.map(produto => (
                      <Card
                        key={produto.id}
                        hoverable
                        style={{
                          borderRadius: 12,
                          overflow: 'hidden',
                          border: 'none',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                          cursor: 'pointer'
                        }}
                        onClick={() => adicionarAoCarrinho(produto)}
                        cover={
                          <div style={{ 
                            height: 140, 
                            overflow: 'hidden',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Image
                              src={produto.img || IMG_ALTERNATIVA}
                              fallback={IMG_ALTERNATIVA}
                              alt={produto.descricao}
                              style={{ 
                                width: '100%',
                                height: 'auto',
                                maxHeight: '100%',
                                objectFit: 'contain'
                              }}
                              preview={false}
                            />
                            <div style={{
                              position: 'absolute',
                              bottom: 8,
                              right: 8,
                              background: 'rgba(255,255,255,0.9)',
                              borderRadius: 20,
                              padding: '4px 12px',
                              fontWeight: 'bold',
                              color: '#333',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                              fontSize: '0.9rem'
                            }}>
                              {formatarValor(produto.preco || 0)}
                            </div>
                          </div>
                        }
                      >
                        <div style={{ padding: '12px 0' }}>
                          <div style={{ 
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 8
                          }}>
                            <h3 style={{ 
                              margin: 0,
                              fontSize: '0.95rem',
                              fontWeight: 600,
                              color: '#333'
                            }}>
                              {produto.descricao}
                            </h3>
                          </div>
                          
                          <Tag
                            style={{
                              background: 'rgba(45, 183, 245, 0.1)',
                              color: '#2db7f5',
                              borderRadius: 4,
                              border: 'none',
                              fontSize: '0.8rem'
                            }}
                          >
                            {categorias.find(c => c.id === produto.id_categoria)?.descricao || 'Sem categoria'}
                          </Tag>
                        </div>
                      </Card>
                    ))}
                  </div>
                  
                  {/* Paginação */}
                  <div style={{ 
                    marginTop: 24,
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={filteredProdutos.length}
                      onChange={(page, size) => {
                        setCurrentPage(page);
                        setPageSize(size);
                      }}
                      showSizeChanger
                      pageSizeOptions={['8', '12', '16', '24']}
                      showTotal={(total, range) => `${range[0]}-${range[1]} de ${total} itens`}
                    />
                  </div>
                </>
              ) : (
                <Empty
                  description={
                    <span style={{ color: 'rgba(0,0,0,0.5)' }}>
                      Nenhum produto disponível encontrado
                    </span>
                  }
                  style={{ 
                    marginTop: 30,
                    padding: 30,
                    background: '#fff',
                    borderRadius: 12,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}
                />
              )}
            </Spin>
          </Col>

          {/* Pedidos Ativos */}
          <Col {...responsiveLayout.ordersCol}>
            <Card
              title={
                <Space>
                  <FaClipboardList style={{ color: primaryColor }} />
                  <span>PEDIDOS ATIVOS</span>
                </Space>
              }
              style={{
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                marginBottom: 16
              }}
              extra={
                <Text strong style={{ color: primaryColor }}>
                  Total: {formatarValor(calcularTotalPedidosAtivos())}
                </Text>
              }
            >
              {pedidos.length > 0 ? (
                <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                  {pedidos.map(pedido => {
                    const produto = produtos.find(p => p.id === pedido.id_produto);
                    return (
                      <div key={pedido.id} style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Text strong style={{ fontSize: '0.9rem' }}>
                            {produto?.descricao || 'Produto não encontrado'}
                          </Text>
                          <Text style={{ fontSize: '0.9rem' }}>
                            {pedido.quantidade}x {formatarValor(produto?.preco || 0)}
                          </Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                          <Text type="secondary" style={{ fontSize: '0.8rem' }}>
                            {pedido.obs || 'Sem observações'}
                          </Text>
                          {renderStatusTag(pedido.status)}
                        </div>
                        <Divider style={{ margin: '8px 0' }} />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <Empty
                  description="Nenhum pedido ativo"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Card>
          </Col>
        </Row>

        {/* Modal do Carrinho */}
        <Modal
          title={
            <span style={{
              background: gradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              FINALIZAR PEDIDO - MESA {mesaId}
            </span>
          }
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button 
              key="cancel" 
              onClick={() => setIsModalVisible(false)}
              style={{ borderRadius: 6 }}
            >
              Voltar
            </Button>,
            <Button 
              key="submit" 
              type="primary" 
              loading={loading}
              onClick={finalizarPedido}
              icon={<FaCheckCircle />}
              style={{ 
                background: gradient,
                border: 'none',
                borderRadius: 6,
                boxShadow: '0 2px 8px rgba(247, 72, 115, 0.3)'
              }}
            >
              Confirmar Pedido
            </Button>
          ]}
          width={window.innerWidth > 768 ? 600 : '90%'}
        >
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ marginBottom: 8 }}>Itens do Pedido</h4>
            {carrinho.length > 0 ? (
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {carrinho.map(item => (
                  <div key={item.id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <div style={{ flex: 2 }}>
                      <Text strong>{item.descricao}</Text>
                    </div>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                      <Space>
                        <Button 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation();
                            removerDoCarrinho(item.id);
                          }}
                        >
                          -
                        </Button>
                        <Text>{item.quantidade}</Text>
                        <Button 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation();
                            adicionarAoCarrinho(item);
                          }}
                        >
                          +
                        </Button>
                      </Space>
                    </div>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                      <Text>{formatarValor(item.preco * item.quantidade)}</Text>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Empty
                description="Nenhum item no carrinho"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </div>

          <div style={{ marginBottom: 24 }}>
            <h4 style={{ marginBottom: 8 }}>Observações</h4>
            <Input.TextArea
              rows={3}
              placeholder="Ex: Sem cebola, bem passado, etc."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              maxLength={255}
              showCount
            />
          </div>

          <Divider />

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Text strong style={{ fontSize: 16 }}>Total:</Text>
            <Text strong style={{ fontSize: 18 }}>{formatarValor(calcularTotal())}</Text>
          </div>
        </Modal>

        {/* Estilos para responsividade */}
        <style jsx>{`
          @media (max-width: 576px) {
            .hide-on-mobile {
              display: none;
            }
            .show-on-mobile {
              display: inline !important;
            }
          }
        `}</style>
      </div>
    </ConfigProvider>
  );
};

export default TelaVendas;
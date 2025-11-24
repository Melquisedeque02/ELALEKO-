import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Input, 
  Modal, 
  Form, 
  Spin, 
  Select, 
  Row, 
  Col, 
  Space, 
  Image,
  Upload,
  Tag,
  message,
  Card,
  Popconfirm,
  Empty,
  Typography,
  ConfigProvider,
  Pagination
} from 'antd';
import { 
  RiDeleteBinLine, 
  RiEditLine, 
  RiSearchLine, 
  RiImageLine,
  RiAddLine,
  RiLink,
  RiPriceTag3Line
} from 'react-icons/ri';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Api from '../api/Api';
import ValoresInput from '../ValoresInput';
import formatarValor from '../formatarValor';

const { Dragger } = Upload;
const { Title } = Typography;

const CardapioDigitalOtimizado = () => {
  // Estados principais
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8);
  
  // Estados para modais
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Estados para seleção
  const [selectedProduto, setSelectedProduto] = useState(null);
  
  // Formulário
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState('');

  // Nova paleta de cores
  const primaryColor = '#3b82f6';
  const secondaryColor = '#8b5cf6';
  const gradient = `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`;
  const lightBackground = '#f8fafc';

  // URL base para imagens
  const BASE_IMAGE_URL = 'https://qrorder.technext.ao/public/img/';
  const IMG_ALTERNATIVA='https://qrorder.technext.ao/public/img/default.png';

  // Configuração do upload (simulado)
  const uploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    beforeUpload: () => false,
    onChange: (info) => {
      const file = info.file;
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImageUrl(e.target.result);
        };
        reader.readAsDataURL(file);
        form.setFieldsValue({ img: file });
      } else {
        message.error('Você só pode enviar arquivos de imagem!');
      }
    }
  };

  // Buscar dados iniciais com paginação
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [produtosData, categoriasData] = await Promise.all([
        Api.ListProduto(),
        Api.ListCategoria()
      ]);
      
      const produtosFormatados = produtosData.map(p => ({ 
        id: p.id,
        descricao: p.descricao,
        preco: p.preco,
        status: p.status,
        id_categoria: p.id_categoria,
        img: p.img ? (p.img.startsWith('http') ? p.img : `${BASE_IMAGE_URL}${p.img}`) : null,
        key: p.id
      }));
      
      setProdutos(produtosFormatados);
      setCategorias(categoriasData);
    } catch (error) {
      toast.error('Erro ao carregar dados: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar produtos
  const filteredProdutos = produtos.filter(produto => {
    const matchesSearch = produto.descricao.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory ? produto.id_categoria === selectedCategory : true;
    const matchesStatus = selectedStatus ? produto.status === selectedStatus : true;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Paginação
  const paginatedProdutos = filteredProdutos.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const parseValorInput = (value) => {
    return parseFloat(value.replace(/\s/g, '').replace(',', '.')) || 0;
  };

  // Manipuladores CRUD  
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('descricao', values.descricao);
      formData.append('status', values.status);
      formData.append('preco', parseValorInput(values.preco));
      formData.append('id_categoria', values.id_categoria);

      if (values.img instanceof File) {
        formData.append('img', values.img);
      }

      if (selectedProduto) {
        formData.append('id', selectedProduto.id);
        const response = await Api.AlterProduto(formData);
        if(response.success){
          fetchData();
          toast.success('Produto atualizado com sucesso!');
        } else if(response.message === 'Request failed with status code 009'){
          toast.error('Já existe um produto com esta descrição.');
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await Api.AddProduto(formData);
        if(response.success){
          fetchData();
          toast.success('Produto adicionada com sucesso!');
        } else if(response.message === 'Request failed with status code 409'){
          toast.error('Já existe um produto com esta descrição.');
        } else {
          toast.error(response.message);
        }
      }

      setIsModalVisible(false);
      form.resetFields();
      setImageUrl('');
    } catch (error) {
      toast.error('Erro ao salvar produto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const response = await Api.DeleteProduto({ id });

      if(response.success){
        fetchData();
        toast.success('Produto excluído com sucesso!');
      } else if(response.message === 'Request failed with status code 409'){
        fetchData();
        toast.error('Este produto está vinculado a pedidos e não pode ser excluído. Ele foi marcado como INDISPONÍVEL.');
      } else {
        toast.error(response.message);
      }
      
      setCurrentPage(1);
    } catch (error) {
      toast.error('Erro ao excluir produto: ' + error.message);
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
                  <RiPriceTag3Line size={20} />
                </div>
                <Title level={3} style={{ margin: 0, color: '#1e293b' }}>
                  Produtos
                </Title>
              </div>
            </Col>
            
            <Col>
              <Space>
                <Input
                  placeholder="Pesquisar produtos..."
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
                
                <Select
                  placeholder="Categoria"
                  options={categorias.map(c => ({ value: c.id, label: c.descricao }))}
                  value={selectedCategory}
                  onChange={(value) => {
                    setSelectedCategory(value);
                    setCurrentPage(1);
                  }}
                  style={{ width: 180, borderRadius: 8 }}
                  allowClear
                />
                
                <Select
                  placeholder="Status"
                  options={[
                    { value: 'DISPONÍVEL', label: 'Disponível' },
                    { value: 'INDISPONÍVEL', label: 'Indisponível' }
                  ]}
                  value={selectedStatus}
                  onChange={(value) => {
                    setSelectedStatus(value);
                    setCurrentPage(1);
                  }}
                  style={{ width: 150, borderRadius: 8 }}
                  allowClear
                />
                
                <Button 
                  type="primary"
                  icon={<RiAddLine />}
                  onClick={() => {
                    setSelectedProduto(null);
                    setImageUrl('');
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
                  Novo Produto
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Lista de Produtos em Blocos */}
        <Spin spinning={loading}>
          {paginatedProdutos.length > 0 ? (
            <>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 24,
                marginTop: 16
              }}>
                {paginatedProdutos.map(produto => (
                  <Card
                    key={produto.id}
                    hoverable
                    style={{
                      borderRadius: 16,
                      overflow: 'hidden',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                    }}
                    bodyStyle={{ padding: 0 }}
                  >
                    <div style={{ 
                      height: 200, 
                      overflow: 'hidden',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#f8fafc'
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
                        bottom: 12,
                        right: 12,
                        background: 'rgba(255,255,255,0.95)',
                        borderRadius: 20,
                        padding: '6px 16px',
                        fontWeight: 'bold',
                        color: '#1e293b',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        fontSize: 14
                      }}>
                        {formatarValor(produto.preco || 0)}
                      </div>
                    </div>
                    
                    <div style={{ padding: '16px' }}>
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: 12
                      }}>
                        <h3 style={{ 
                          margin: 0,
                          fontSize: 16,
                          fontWeight: 600,
                          color: '#1e293b',
                          lineHeight: 1.4
                        }}>
                          {produto.descricao}
                        </h3>
                        
                        <Tag 
                          color={produto.status === 'DISPONÍVEL' ? '#10b981' : '#ef4444'}
                          style={{ 
                            borderRadius: 6,
                            fontWeight: 500,
                            marginLeft: 8,
                            flexShrink: 0
                          }}
                        >
                          {produto.status === 'DISPONÍVEL' ? 'Disponível' : 'Indisponível'}
                        </Tag>
                      </div>
                      
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: 16
                      }}>
                        <Tag
                          style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            color: primaryColor,
                            borderRadius: 6,
                            border: 'none',
                            fontSize: 12
                          }}
                        >
                          {categorias.find(c => c.id === produto.id_categoria)?.descricao || 'Sem categoria'}
                        </Tag>
                        
                        <Space>
                          <Button 
                            icon={<RiEditLine />}
                            onClick={() => {
                              setSelectedProduto(produto);
                              setImageUrl(produto.img || '');
                              form.setFieldsValue({
                                ...produto,
                                preco: formatarValor(produto.preco), 
                                img: produto.img ? produto.img.replace(BASE_IMAGE_URL, '') : 'default.png'
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
                            title="Excluir este produto?"
                            onConfirm={() => handleDelete(produto.id)}
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
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              {/* Paginação */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                marginTop: 32,
                padding: '16px 0'
              }}>
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={filteredProdutos.length}
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
                  Nenhum produto encontrado {searchText || selectedCategory || selectedStatus ? 'com os filtros atuais' : ''}
                </span>
              }
              style={{ 
                marginTop: 50,
                padding: 40,
                background: '#fff',
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
            />
          )}
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
              {selectedProduto ? 'Editar Produto' : 'Novo Produto'}
            </span>
          }
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setImageUrl('');
          }}
          footer={[
            <Button 
              key="cancel" 
              onClick={() => {
                setIsModalVisible(false);
                setImageUrl('');
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
              {selectedProduto ? 'Atualizar' : 'Salvar'}
            </Button>
          ]}
          width={700}
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
            initialValues={{ status: 'DISPONÍVEL' }}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="descricao"
                  label="Descrição"
                  rules={[{ required: true, message: 'Campo obrigatório' }]}
                >
                  <Input 
                    maxLength={100}
                    style={{ borderRadius: 6 }}
                    placeholder="Digite o nome do produto"
                  />
                </Form.Item>

                <Form.Item
                  name="preco"
                  label="Preço"
                  rules={[{ required: true, message: 'Campo obrigatório' }]}
                >
                  <ValoresInput/>
                </Form.Item>

                <Form.Item
                  name="id_categoria"
                  label="Categoria"
                  rules={[{ required: true, message: 'Selecione uma categoria' }]}
                >
                  <Select
                    placeholder="Selecione a categoria"
                    loading={!categorias.length}
                    options={categorias.map(c => ({
                      value: c.id,
                      label: c.descricao
                    }))}
                    style={{ borderRadius: 6 }}
                  />
                </Form.Item>

                <Form.Item
                  name="status"
                  label="Status"
                  rules={[{ required: true, message: 'Campo obrigatório' }]}
                >
                  <Select
                    options={[
                      { value: 'DISPONÍVEL', label: 'Disponível' },
                      { value: 'INDISPONÍVEL', label: 'Indisponível' }
                    ]}
                    style={{ borderRadius: 6 }}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  name="img"
                  label="Imagem do Produto"
                >
                  <Dragger 
                    {...uploadProps}
                    style={{ 
                      borderRadius: 6,
                      border: '1px dashed rgba(0,0,0,0.1)'
                    }}
                  >
                    <div style={{ padding: 20, textAlign: 'center' }}>
                      {imageUrl ? (
                        <div style={{ position: 'relative' }}>
                          <Image
                            src={imageUrl}
                            style={{ 
                              maxHeight: 120,
                              maxWidth: '100%',
                              borderRadius: 6,
                              marginBottom: 8
                            }}
                            preview={false}
                          />
                          <div style={{ 
                            marginTop: 8,
                            color: primaryColor,
                            fontWeight: 500
                          }}>
                            <RiLink /> Nova imagem selecionada
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="ant-upload-drag-icon">
                            <RiImageLine style={{ 
                              fontSize: 32, 
                              color: primaryColor 
                            }} />
                          </p>
                          <p className="ant-upload-text" style={{ color: '#1e293b' }}>
                            Clique ou arraste a imagem aqui
                          </p>
                          <p className="ant-upload-hint" style={{ color: 'rgba(0,0,0,0.5)' }}>
                            Formatos: JPG, PNG (máx. 2MB)
                          </p>
                        </>
                      )}
                    </div>
                  </Dragger>
                </Form.Item>

                {form.getFieldValue('img') && !imageUrl && (
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'rgba(0,0,0,0.5)' }}>Imagem atual:</p>
                    <Image
                      width={150}
                      src={`${BASE_IMAGE_URL}${form.getFieldValue('img')}`}
                      style={{ 
                        borderRadius: 6,
                        border: '1px solid rgba(0,0,0,0.1)'
                      }}
                    />
                  </div>
                )}
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default CardapioDigitalOtimizado;
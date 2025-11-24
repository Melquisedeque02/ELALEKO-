import React from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Typography, 
  Progress,
  Table,
  Tag,
  Space,
  Badge,
  Avatar
} from 'antd';
import {
  RiMoneyDollarCircleLine,
  RiUserLine,
  RiShoppingCartLine,
  RiTimeLine,
  RiFireLine,
  RiStarLine,
  RiTableLine,
  RiLineChartLine
} from 'react-icons/ri';

const { Title, Text } = Typography;

const DashboardRestaurante = () => {
  // Dados estáticos para o dashboard
  const cardData = [
    {
      title: 'Faturamento Hoje',
      value: 'R$ 8.245,60',
      icon: <RiMoneyDollarCircleLine style={{ fontSize: 24, color: '#3b82f6' }} />,
      progress: 78,
      trend: '12%',
      isUp: true
    },
    {
      title: 'Clientes Atendidos',
      value: '124',
      icon: <RiUserLine style={{ fontSize: 24, color: '#8b5cf6' }} />,
      progress: 65,
      trend: '8%',
      isUp: true
    },
    {
      title: 'Pedidos Ativos',
      value: '18',
      icon: <RiShoppingCartLine style={{ fontSize: 24, color: '#ec4899' }} />,
      progress: 36,
      trend: '5%',
      isUp: false
    },
    {
      title: 'Mesa Ocupação',
      value: '24/32',
      icon: <RiTableLine style={{ fontSize: 24, color: '#10b981' }} />,
      progress: 75,
      trend: '10%',
      isUp: true
    }
  ];

  const popularItems = [
    {
      key: '1',
      name: 'Picanha Premium',
      category: 'Carnes',
      orders: 42,
      rating: 4.8
    },
    {
      key: '2',
      name: 'Risoto de Funghi',
      category: 'Massas',
      orders: 38,
      rating: 4.7
    },
    {
      key: '3',
      name: 'Tiramisu',
      category: 'Sobremesas',
      orders: 35,
      rating: 4.9
    },
    {
      key: '4',
      name: 'Caipirinha Especial',
      category: 'Bebidas',
      orders: 56,
      rating: 4.6
    },
    {
      key: '5',
      name: 'Bruschetta',
      category: 'Entradas',
      orders: 28,
      rating: 4.5
    }
  ];

  const recentOrders = [
    {
      key: '1',
      order: '#4587',
      table: 'Mesa 12',
      status: 'Em preparo',
      time: '15 min',
      amount: 'R$ 148,90'
    },
    {
      key: '2',
      order: '#4586',
      table: 'Mesa 08',
      status: 'Pronto',
      time: '5 min',
      amount: 'R$ 89,50'
    },
    {
      key: '3',
      order: '#4585',
      table: 'Mesa 05',
      status: 'Entregue',
      time: '25 min',
      amount: 'R$ 225,30'
    },
    {
      key: '4',
      order: '#4584',
      table: 'Mesa 03',
      status: 'Em preparo',
      time: '12 min',
      amount: 'R$ 176,80'
    },
    {
      key: '5',
      order: '#4583',
      table: 'Mesa 09',
      status: 'Aguardando',
      time: '8 min',
      amount: 'R$ 92,40'
    }
  ];

  const statusColors = {
    'Aguardando': 'orange',
    'Em preparo': 'blue',
    'Pronto': 'green',
    'Entregue': 'gray'
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Cabeçalho */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ marginBottom: 8, color: '#1e293b' }}>Visão Geral</Title>
        <Text type="secondary" style={{ fontSize: 16 }}>Bem-vindo ao painel de controle do restaurante</Text>
      </div>

      {/* Cards de Métricas */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        {cardData.map((item, index) => (
          <Col xs={24} sm={12} md={12} lg={6} key={index}>
            <Card 
              bordered={false} 
              style={{ 
                borderRadius: 16,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                height: '100%',
                border: '1px solid rgba(0,0,0,0.03)'
              }}
              bodyStyle={{ padding: 20 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <Text type="secondary" style={{ fontSize: 14 }}>{item.title}</Text>
                  <Title level={3} style={{ marginTop: 8, marginBottom: 16, color: '#1e293b' }}>{item.value}</Title>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Text 
                      strong 
                      style={{ 
                        color: item.isUp ? '#10b981' : '#ef4444',
                        marginRight: 8,
                        fontSize: 14
                      }}
                    >
                      {item.trend} {item.isUp ? '↑' : '↓'}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 13 }}>vs ontem</Text>
                  </div>
                </div>
                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: 12,
                  background: 'rgba(59, 130, 246, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {item.icon}
                </div>
              </div>
              <Progress 
                percent={item.progress} 
                showInfo={false} 
                strokeColor={item.isUp ? '#10b981' : '#ef4444'}
                style={{ marginTop: 16 }}
                strokeWidth={6}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Seção Inferior */}
      <Row gutter={[24, 24]}>
        {/* Itens Populares */}
        <Col xs={24} md={12}>
          <Card
            title={
              <Space>
                <RiFireLine style={{ color: '#3b82f6' }} />
                <Text strong style={{ color: '#1e293b' }}>Itens Mais Pedidos</Text>
              </Space>
            }
            bordered={false}
            style={{ 
              borderRadius: 16,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              height: '100%',
              border: '1px solid rgba(0,0,0,0.03)'
            }}
          >
            <Table
              dataSource={popularItems}
              pagination={false}
              showHeader={false}
              columns={[
                {
                  dataIndex: 'name',
                  key: 'name',
                  render: (text, record) => (
                    <div>
                      <Text strong>{text}</Text>
                      <div>
                        <Text type="secondary" style={{ fontSize: 13 }}>{record.category}</Text>
                      </div>
                    </div>
                  )
                },
                {
                  dataIndex: 'orders',
                  key: 'orders',
                  render: (text) => (
                    <Text>{text} pedidos</Text>
                  )
                },
                {
                  dataIndex: 'rating',
                  key: 'rating',
                  render: (text) => (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <RiStarLine style={{ color: '#f59e0b', marginRight: 4 }} />
                      <Text>{text}</Text>
                    </div>
                  )
                }
              ]}
            />
          </Card>
        </Col>

        {/* Pedidos Recentes */}
        <Col xs={24} md={12}>
          <Card
            title={
              <Space>
                <RiTimeLine style={{ color: '#3b82f6' }} />
                <Text strong style={{ color: '#1e293b' }}>Pedidos Recentes</Text>
                <Badge count={5} style={{ backgroundColor: '#3b82f6' }} />
              </Space>
            }
            bordered={false}
            style={{ 
              borderRadius: 16,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              height: '100%',
              border: '1px solid rgba(0,0,0,0.03)'
            }}
          >
            <Table
              dataSource={recentOrders}
              pagination={false}
              columns={[
                {
                  title: 'Pedido',
                  dataIndex: 'order',
                  key: 'order'
                },
                {
                  title: 'Mesa',
                  dataIndex: 'table',
                  key: 'table'
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status) => (
                    <Tag color={statusColors[status]}>
                      {status}
                    </Tag>
                  )
                },
                {
                  title: 'Tempo',
                  dataIndex: 'time',
                  key: 'time'
                },
                {
                  title: 'Valor',
                  dataIndex: 'amount',
                  key: 'amount',
                  render: (text) => (
                    <Text strong>{text}</Text>
                  )
                }
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* Rodapé */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card
            title={
              <Space>
                <RiLineChartLine style={{ color: '#3b82f6' }} />
                <Text strong style={{ color: '#1e293b' }}>Desempenho do Mês</Text>
              </Space>
            }
            bordered={false}
            style={{ 
              borderRadius: 16,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: '1px solid rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: 'rgba(59, 130, 246, 0.1)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20
              }}>
                <RiLineChartLine style={{ fontSize: 40, color: '#3b82f6' }} />
              </div>
              <Title level={3} style={{ color: '#1e293b' }}>Meta do mês: 78%</Title>
              <Text type="secondary">Faturamento atual: R$ 124.856,20 de R$ 160.000,00</Text>
              <Progress 
                percent={78} 
                strokeColor="#3b82f6" 
                style={{ maxWidth: 400, margin: '20px auto' }}
                strokeWidth={10}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardRestaurante;
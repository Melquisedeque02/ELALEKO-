import React, { useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { 
  Layout, 
  Menu, 
  theme, 
  Avatar, 
  Space, 
  Typography, 
  Button,
  Badge,
  Dropdown
} from 'antd';
import {
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiDashboardLine,
  RiShoppingBagLine,
  RiAppsLine,
  RiTableLine,
  RiShoppingCartLine,
  RiLogoutCircleLine,
  RiUserLine,
  RiRestaurantLine
} from 'react-icons/ri';
import Api from '../api/Api';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const RestaurantMenu = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState(['1']);
  const navigate = useNavigate();
  const location = useLocation();
  const [nome, setNome] = useState('');
  const [pedidos, setPedidos] = useState(0);

  // Verificação de tempo de sessão
  useEffect(() => {
    const loginTime = parseInt(localStorage.getItem("loginTime"), 10) || Date.now();
    localStorage.setItem("loginTime", loginTime);

    const now = Date.now();
    const expired = now - loginTime > 3600000; // 1 hora

    if (expired) {
      logout();
      return;
    }

    const remainingTime = 3600000 - (now - loginTime);
    const timeout = setTimeout(logout, remainingTime);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    fetchData(); // chama imediatamente ao montar

    const interval = setInterval(() => {
      fetchData();  
    }, 6000);  

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const dados = await Api.ListUserId();
      const _pedidos = await Api.CountPedidos();
      setPedidos(_pedidos.id);
      setNome(dados.nome);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  useEffect(() => {
    let newSelectedKey = ['1'];
    
    if (location.pathname.includes('/produtos')) {
      newSelectedKey = ['2'];
    } else if (location.pathname.includes('/categorias')) {
      newSelectedKey = ['3'];
    } else if (location.pathname.includes('/mesas')) {
      newSelectedKey = ['4'];
    } else if (location.pathname.includes('/pedidos')) {
      newSelectedKey = ['5'];
    }
    else if (location.pathname.includes('/usuarios')) {
      newSelectedKey = ['6'];
    }
    
    setSelectedKey(newSelectedKey);
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("loginTime");
    window.location.href = "/";
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const userMenuItems = [
    {
      key: '1',
      icon: <RiLogoutCircleLine />,
      label: 'Sair',
      danger: true,
      onClick: logout
    },
  ];

  const menuItems = [
    {
      key: '1',
      icon: <RiDashboardLine />,
      label: 'Dashboard',
      onClick: () => navigate('/dashboard')
    },
    {
      key: '2',
      icon: <RiShoppingBagLine />,
      label: 'Produtos',
      onClick: () => navigate('/produtos')
    },
    {
      key: '3',
      icon: <RiAppsLine />,
      label: 'Categorias',
      onClick: () => navigate('/categorias')
    },
    {
      key: '4',
      icon: <RiTableLine />,
      label: 'Mesas',
      onClick: () => navigate('/mesas')
    },
    {
      key: '5',
      icon: <RiShoppingCartLine />,
      label: (
        <Space>
          <span>Pedidos</span>
          <Badge count={pedidos} style={{ 
            backgroundColor: 'rgba(59,130,246, 0.8)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.3)'
          }} />
        </Space>
      ),
      onClick: () => navigate('/pedidos')
    },
    {
      key: '6',
      icon: <RiUserLine />,
      label: 'Usuários',
      onClick: () => navigate('/usuarios')
    },
  ];

  // Nova paleta de cores
  const primaryColor = '#3b82f6';
  const secondaryColor = '#8b5cf6';
  const sidebarGradient = `linear-gradient(180deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;

  return (
    <Layout className="restaurant-layout" style={{ 
      minHeight: '100vh',
      background: '#f8fafc'
    }}>
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        width={280}
        style={{
          background: sidebarGradient,
          boxShadow: '0 0 30px rgba(0,0,0,0.1)',
          position: 'fixed',
          height: '100vh',
          zIndex: 100,
        }}
      >
        {/* Logo */}
        <div style={{ 
          padding: collapsed ? '16px 0' : '24px', 
          textAlign: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {!collapsed ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '10px 0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.2)',
                marginRight: 12,
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                <RiRestaurantLine style={{ 
                  fontSize: 20, 
                  color: "white" 
                }} />
              </div>
              <Text strong style={{ 
                fontSize: 20, 
                color: 'white',
                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}>
                QR ORDER
              </Text>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.2)',
              margin: '0 auto',
              backdropFilter: 'blur(5px)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <RiRestaurantLine style={{ 
                fontSize: 20, 
                color: "white" 
              }} />
            </div>
          )}
        </div>

        {/* Menu Principal */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKey}
          style={{
            background: 'transparent',
            borderRight: 0,
            marginTop: 24,
            padding: '0 12px'
          }}
          items={menuItems.map(item => ({
            ...item,
            label: (
              <span style={{
                fontWeight: 500,
                fontSize: 15,
                color: selectedKey.includes(item.key) ? 'white' : 'rgba(255,255,255,0.85)'
              }}>
                {item.label}
              </span>
            ),
            style: {
              borderRadius: 8,
              marginBottom: 8,
              background: selectedKey.includes(item.key) ? 'rgba(255,255,255,0.15)' : 'transparent',
              transition: 'all 0.2s'
            }
          }))}
        />

        {/* Perfil do Usuário */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          padding: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(0,0,0,0.1)',
          backdropFilter: 'blur(5px)'
        }}>
          <Dropdown menu={{ items: userMenuItems }} placement="topRight">
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              ':hover': {
                background: 'rgba(255,255,255,0.1)'
              }
            }}>
              <Avatar 
                size="small" 
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white'
                }} 
                icon={<RiUserLine />} 
              />
              {!collapsed && (
                <div style={{ marginLeft: '12px' }}>
                  <Text strong style={{ 
                    display: 'block', 
                    color: 'white',
                    fontSize: 14
                  }}>
                    {nome}
                  </Text>
                  <Text style={{ 
                    color: 'rgba(255,255,255,0.7)', 
                    fontSize: 12 
                  }}>
                    Administrador
                  </Text>
                </div>
              )}
            </div>
          </Dropdown>
        </div>
      </Sider>

      {/* Área de Conteúdo */}
      <Layout style={{ 
        marginLeft: collapsed ? 80 : 280, 
        transition: 'all 0.3s cubic-bezier(0.2, 0, 0, 1)',
        background: 'transparent'
      }}>
        <Header
          style={{
            padding: 0,
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 10px rgba(0,0,0,0.05)',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <RiMenuUnfoldLine /> : <RiMenuFoldLine />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '18px',
              width: 64,
              height: 64,
              color: '#3b82f6'
            }}
          />
        </Header>

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(8px)',
            borderRadius: 16,
            boxShadow: '0 1px 10px rgba(0,0,0,0.03)'
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default RestaurantMenu;
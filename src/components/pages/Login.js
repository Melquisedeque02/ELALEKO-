import { useState } from "react";
import {
  Layout,
  Input,
  Button,
  Form,
  Typography,
  ConfigProvider,
  Modal,
  Divider,
  Card
} from "antd";
import { RiUserLine, RiLockLine, RiRestaurantLine, RiArrowRightLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Api from "../api/Api";

const { Content } = Layout;
const { Title, Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      localStorage.removeItem("token");
      localStorage.removeItem("loginTime");

      const result = await Api.Login({
        email: values.email,
        password: values.password,
      });

      if (result.success) {
        toast.success("Login efetuado com sucesso");
        localStorage.setItem("token", JSON.stringify(result.user));
        localStorage.setItem("loginTime", Date.now());
       
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);

      } else if (result.message === "Ativar") {
        setEmail(values.email);
        setSenhaAtual(values.password);
        localStorage.setItem("NPW", JSON.stringify(result.senha));
        toast.warning("Para continuar, altere sua senha");
        setShowModal(true);
      } else {
        toast.error(result.message || "Credenciais incorretas");
      }
    } catch (error) {
      toast.error(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAlterarSenha = async (values) => {
    try {
      if (values.nova !== values.confirmar) {
        toast.error("As senhas não coincidem");
        return;
      }
      const usuario = JSON.parse(localStorage.getItem("NPW"));

      const result = await Api.AlterPW({
        id: usuario.id,
        nova_senha: values.nova,
      });

      if (result.success) {
        toast.success("Senha alterada com sucesso!");
        setShowModal(false);
        navigate("/");
      } else {
        toast.error(result.message || "Erro ao alterar senha");
      }
    } catch (error) {
      toast.error(`Erro: ${error.message}`);
    }
  };

  // Nova paleta de cores
  const primaryColor = '#3b82f6';
  const secondaryColor = '#8b5cf6';
  const gradient = `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryColor,
          borderRadius: 12,
          colorBgContainer: "#ffffff",
        },
        components: {
          Button: {
            colorPrimary: primaryColor,
            colorPrimaryHover: secondaryColor,
          },
          Input: {
            hoverBorderColor: primaryColor,
            activeBorderColor: primaryColor,
          }
        }
      }}
    >
      <Layout>
        <ToastContainer 
          position="top-center" 
          autoClose={3000}
          toastStyle={{ borderRadius: 12 }}
        />
        <Content
          style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: gradient,
          }}
        >
          <Card
            style={{
              width: "100%",
              maxWidth: 440,
              borderRadius: 20,
              boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
              border: "none",
              overflow: "hidden"
            }}
            bodyStyle={{ padding: 40 }}
          >
            <div style={{ 
              textAlign: "center", 
              marginBottom: 40,
            }}>
              <div style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 80,
                height: 80,
                borderRadius: "20px",
                background: gradient,
                marginBottom: 20,
                boxShadow: "0 8px 20px rgba(59, 130, 246, 0.3)"
              }}>
                <RiRestaurantLine style={{ 
                  fontSize: 36, 
                  color: "white" 
                }} />
              </div>
              <Title level={2} style={{ 
                marginBottom: 8, 
                color: "#1e293b",
                fontWeight: 700
              }}>
                QR ORDER
              </Title>
              <Text type="secondary" style={{ 
                fontSize: 16,
                color: "#64748b"
              }}>
                Acesso ao sistema  
              </Text>
            </div>

            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                name="email"
                rules={[{ required: true, message: "Por favor, insira seu email!" }]}
              >
                <Input 
                  size="large" 
                  prefix={<RiUserLine style={{ color: "#94a3b8", marginRight: 8 }} />} 
                  placeholder="Email" 
                  style={{ 
                    padding: "14px 16px", 
                    borderRadius: 12,
                    fontSize: 15
                  }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: "Por favor, insira sua senha!" }]}
              >
                <Input.Password 
                  size="large" 
                  prefix={<RiLockLine style={{ color: "#94a3b8", marginRight: 8 }} />} 
                  placeholder="Senha" 
                  style={{ 
                    padding: "14px 16px", 
                    borderRadius: 12,
                    fontSize: 15
                  }}
                />
              </Form.Item>

              <Form.Item style={{ marginTop: 30 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={loading}
                  style={{
                    height: 50,
                    fontWeight: 600,
                    fontSize: 16,
                    borderRadius: 12,
                    boxShadow: "0 4px 14px rgba(59, 130, 246, 0.3)",
                    letterSpacing: 0.5,
                    border: "none",
                    background: gradient
                  }}
                >
                  ENTRAR <RiArrowRightLine style={{ marginLeft: 8 }} />
                </Button>
              </Form.Item>

              <div style={{ 
                textAlign: "center", 
                marginTop: 20,
              }}>
                <Text 
                  style={{ 
                    color: "#64748b", 
                    cursor: "pointer",
                    fontSize: 14,
                    ":hover": {
                      color: primaryColor
                    }
                  }}
                >
                  Esqueceu sua senha?
                </Text>
              </div>
            </Form>
          </Card>
        </Content>

        {/* MODAL DE ALTERAÇÃO DE SENHA */}
        <Modal
          open={showModal}
          title={<Title level={4} style={{ margin: 0, color: "#1e293b" }}>Alterar senha</Title>}
          onCancel={() => setShowModal(false)}
          footer={null}
          centered
          styles={{
            body: { padding: "24px 24px 8px" }
          }}
          width={400}
        >
          <Form layout="vertical" onFinish={handleAlterarSenha}>
            <Form.Item label="Senha atual">
              <Input.Password 
                value={senhaAtual} 
                disabled 
                size="large"
                style={{ borderRadius: 12 }}
              />
            </Form.Item>

            <Form.Item
              label="Nova senha"
              name="nova"
              rules={[{ required: true, message: "Informe a nova senha" }]}
            >
              <Input.Password 
                placeholder="Nova senha" 
                size="large"
                style={{ borderRadius: 12 }}
              />
            </Form.Item>

            <Form.Item
              label="Confirmar nova senha"
              name="confirmar"
              rules={[{ required: true, message: "Confirme a nova senha" }]}
            >
              <Input.Password 
                placeholder="Confirme a nova senha" 
                size="large"
                style={{ borderRadius: 12 }}
              />
            </Form.Item>

            <Form.Item style={{ marginTop: 30 }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                block
                size="large"
                style={{
                  height: 48,
                  fontWeight: 600,
                  borderRadius: 12,
                  boxShadow: "0 4px 14px rgba(59, 130, 246, 0.3)",
                  background: gradient
                }}
              >
                CONFIRMAR ALTERAÇÃO
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    </ConfigProvider>
  );
};

export default LoginPage;
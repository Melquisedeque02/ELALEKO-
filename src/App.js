import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./components/pages/Home";
import Dashboard from "./components/pages/Dashboard";
import Produto from "./components/pages/Produto";
import Categoria from "./components/pages/Categoria";
import Mesa from "./components/pages/Mesa";
import Usuario from "./components/pages/Usuario";
import Pedido from "./components/pages/Pedido";
import Pos from "./components/pages/Pos";
 

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rota de login fora da estrutura protegida */}
        <Route path="/" element={<Login />} />
          <Route path="/vendas/:id" element={<Pos />} />

     
  
             
       

        {/* Rotas protegidas dentro de Home */}
        <Route
          path="/*"
          element={
          //  <Home />
          
           <ProtectedRoute>
            <Home />
            </ProtectedRoute>
 

          }
        >

           <Route path="dashboard" element={<Dashboard />} />
           <Route path="produtos" element={<Produto />} />
            <Route path="mesas" element={<Mesa />} />
            <Route path="categorias" element={<Categoria />} />
            <Route path="usuarios" element={<Usuario />} />
            <Route path="pedidos" element={<Pedido />} />
           
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

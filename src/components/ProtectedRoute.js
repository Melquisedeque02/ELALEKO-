import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProtectedRoute = ({ children }) => {
  const token = JSON.parse(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.error("Você precisa fazer login para acessar esta página!");
       setTimeout(() => {
            navigate("/");
          }, 3500);
    }
  }, [token, navigate]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {token ? children : null}
    </>
  );
};

export default ProtectedRoute;

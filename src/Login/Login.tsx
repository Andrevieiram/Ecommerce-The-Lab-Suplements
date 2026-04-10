import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api'; // Importando sua instância do Axios
import './Login.css';

const Login = () => {
  const navigate = useNavigate();

  // Estados
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Usando a instância 'api' configurada anteriormente
      const response = await api.post('/users/login', {
        email,
        password
      });

      // O Axios coloca os dados da resposta dentro de .data
      const { token } = response.data;

      if (token) {
        // 1. Salva o token
        localStorage.setItem('token', token);
        
        // 2. Mantém lógica de autenticação
        localStorage.setItem('isAuthenticated', 'true');

        // 3. Redireciona
        navigate('/produtos');
      } else {
        alert("Erro inesperado: Token não recebido.");
      }

    } catch (error) {
      // O Axios captura erros 4xx e 5xx aqui
      const message = (error as Error & { response?: { data?: { message?: string } } }).response?.data?.message || "Não foi possível conectar ao servidor.";
      alert(message);
      console.error("Erro no login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="background-container">
      <div className="logo-left-login">
        <img 
          src='/images/WhatsApp_Image_2025-10-28_at_11.50.35-removebg-preview.png' 
          alt="Logo The Lab" 
        />
      </div>

      <div id="login-container">
        <div className="login-header">
           <h2>Sign in</h2>
           <p>Bem-vindo de volta!</p>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email</label> 
            <input 
              type="email" 
              id="email" 
              placeholder="Digite seu e-mail" 
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
              disabled={isLoading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
              disabled={isLoading}
            />
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'CARREGANDO...' : 'SIGN IN'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
import { useState } from 'react'; // Importamos o useState para guardar o que o usuário digita
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  // Estados para armazenar email e senha
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      // Faz a requisição para o backend
        const response = await fetch('http://localhost:3000/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        
        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Erro ao fazer login");
            return;
        }

        // 1. Salva o token que veio do backend
        localStorage.setItem('token', data.token);
        
        // 2. Mantém lógica original de isAuthenticated 
        localStorage.setItem('isAuthenticated', 'true');

        // 3. Redireciona para produtos
        navigate('/produtos');

    } catch (error) {
        console.error("Erro de conexão:", error);
        alert("Não foi possível conectar ao servidor.");
    }
  };

  return (
    <div id="background-container">
      <div className="logo-left-login">
        <img src='images\WhatsApp_Image_2025-10-28_at_11.50.35-removebg-preview.png' alt="Logo" />
      </div>

      <div id="login-container">
        <h2>Sign in</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Email</label> 
            <input 
                type="email" 
                id="email" 
                placeholder="Enter Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required 
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
                type="password" 
                id="password" 
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required 
            />
          </div>

          <button type="submit">SIGN IN</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
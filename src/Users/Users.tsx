import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Users.css';
import ModalCadastro from './ModalCadastro'; // <--- 1. Importar o Modal

interface User {
  _id: string;
  name: string;
  email: string;
  cpf: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 2. Estado para controlar se o modal está aberto
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const navigate = useNavigate();

  // Função para buscar dados (usada no load e após cadastrar)
  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/');
        return;
    }
    try {
        const response = await fetch('http://localhost:3000/api/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if(data.data) setUsers(data.data);
    } catch (error) {
        console.error("Erro:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;

    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:3000/api/users/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            alert("Usuário excluído com sucesso!");
            setUsers(users.filter(user => user._id !== id));
        } else {
            alert("Erro ao excluir usuário");
        }
    } catch (error) {
        alert("Erro de conexão.");
    }
  };

  return (
    <>
      {/* HEADER E MENU LATERAL (Mantidos iguais) */}
      <header className="header-container">
        <div className="avatar">
            <img src="images/avatar.png" alt="Avatar" id="picture" />
        </div>
      </header>

      <div className="leftNav-container">
        <div className="logo-left">
            <img src="images/WhatsApp_Image_2025-10-28_at_11.50.35-removebg-preview.png" alt="Logo" style={{width: '100%'}}/>
        </div>
        
        <div className="nav-items">
            <div className="nav-item" onClick={() => navigate('/produtos')}>Produtos</div>
            <div className="nav-item" onClick={() => navigate('/promocoes')}>Promoções</div>
            <div className="nav-item-active">Usuários</div>
        </div>

        <div className="nav-item-logout" onClick={handleLogout}>
            Logout
        </div>
      </div>

      <div className="main-users">
        <div className="main-title">
            <h1>Gerenciamento de Usuários</h1>
            
            {/* 3. Botão agora abre o modal */}
            <button 
                className="userAdd-button" 
                onClick={() => setIsModalOpen(true)} 
            >
                + Adicionar Usuário
            </button>
        </div>

        <div className="users-table-container">
            {loading ? (
                <p style={{padding: '20px'}}>Carregando...</p>
            ) : (
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>CPF</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user._id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.cpf}</td>
                                    <td>
                                        <button className="btn-edit">Editar</button>
                                        <button 
                                            className="table-action-button-remove" 
                                            onClick={() => handleDelete(user._id)}
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="table-empty">Nenhum usuário encontrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
      </div>

      {/* 4. Renderizando o Modal */}
      <ModalCadastro 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchUsers} // Passamos a função de buscar para atualizar a lista ao criar
      />
    </>
  );
};

export default Users;
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Users.css';
import ModalCadastro from './ModalCadastro';
import api from '../../api';

interface User {
  _id: string;
  name: string;
  email: string;
  cpf: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    try {

      const response = await api.get('/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.data && response.data.data) {
        setUsers(response.data.data);
      } else if (Array.isArray(response.data)) {
        setUsers(response.data);
      }
      
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
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
      await api.delete(`/users/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      alert("Usuário excluído com sucesso!");
      setUsers(users.filter(user => user._id !== id));
      
    } catch (error) {
      alert("Erro ao excluir usuário ou erro de conexão.");
      console.error(error);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  }
  

  return (
    <>
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
            <button className="userAdd-button" onClick={handleOpenCreate}>
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
                                        <button 
                                            className="btn-edit"
                                            onClick={() => handleEdit(user)}
                                        >
                                            Editar
                                        </button>
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

      <ModalCadastro 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchUsers} 
        userToEdit={editingUser}
      />
    </>
  );
};

export default Users;
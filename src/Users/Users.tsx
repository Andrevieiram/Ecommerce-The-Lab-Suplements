import React, { useState, useEffect } from 'react'; 
import "./Users.css";
import ModalCadastro from './ModalCadastro'; 
import { getFromLocalStorage } from './StorageUsers'; 
import { NavLink } from 'react-router-dom';

interface User {
  id: string; 
  name: string;
  cpf: string;
  email: string;
}

const Users = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  //estado para armazenar a lista de usuários
  const [users, setUsers] = useState<User[]>([]);

  //função para carregar os usuários do storage
  const loadUsers = () => {
    const storedUsers = getFromLocalStorage<User[]>('users') || [];
    setUsers(storedUsers);
  };

  useEffect(() => {
    loadUsers();
  }, []); 

  const abrirModal = () => {
    setIsModalOpen(true);
  };
  
  const fecharModal = () => {
    setIsModalOpen(false);
    loadUsers(); 
  };

  return (
    <div className = "users-container">
      <header className="header-container">
      </header>

      <nav className="leftNav-container">
          <img className="logo-left" src="images\WhatsApp_Image_2025-10-28_at_11.50.35-removebg-preview.png" alt="The Lab Suplements" />
          <div className="nav-items">
            
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? "nav-item-active" : "nav-item"}
            >
              Dashboard
            </NavLink>

            <NavLink 
              to="/produtos" 
              className={({ isActive }) => isActive ? "nav-item-active" : "nav-item"}
            >
              Produtos
            </NavLink>

            <NavLink 
              to="/users" 
              className={({ isActive }) => isActive ? "nav-item-active" : "nav-item"}
            >
              Usuários
            </NavLink>

          </div>
          <button className="nav-item-logout">Logout</button>
      </nav>

      <main className="main-users">
        <div className="main-title">
            <h1>Gerenciamento de Usuários</h1>
            <button className="userAdd-button" onClick={abrirModal}>
              Adicionar Novo Usuários
            </button>
        </div>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>CPF</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.cpf}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="table-empty">
                    Nenhum usuário cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
      </main>


      <ModalCadastro isOpen={isModalOpen} onClose={fecharModal} />
    </div>
  )
}

export default Users;
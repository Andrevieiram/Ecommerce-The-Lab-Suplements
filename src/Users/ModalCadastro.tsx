import React, { useState } from 'react'; 
import './ModalCadastro.css';
import { saveToLocalStorage, getFromLocalStorage } from './StorageUsers'; 


interface User {
  id: string; 
  name: string;
  cpf: string;
  email: string;
  password: string; 
}

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
}

const ModalCadastro = ({ isOpen, onClose }: ModalProps) => {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); 

    const newUser: User = {
      id: crypto.randomUUID(), 
      name: name,
      cpf: cpf,
      email: email,
      password: password, 
    };

    // Pega a lista existente de usuários ou cria uma nova
    const existingUsers = getFromLocalStorage<User[]>('users') || [];
    
    // Adiciona o novo usuário à lista
    const updatedUsers = [...existingUsers, newUser];

    // Salva a lista atualizada de volta no localStorage
    saveToLocalStorage<User[]>('users', updatedUsers);

    // Feedback para o usuário e fecha o modal
    alert('Usuário cadastrado com sucesso!');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>

        <h2>Cadastrar Novo Usuário</h2>

        <form className="modal-form" onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label htmlFor="name">Nome:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cpf">CPF:</label>
            <input
              type="text"
              id="cpf"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="form-submit-button">
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalCadastro;
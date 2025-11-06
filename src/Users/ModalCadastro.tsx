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

interface FormErrors {
  name?: string;
  cpf?: string;
  email?: string;
  password?: string;
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
  const [errors, setErrors] = useState<FormErrors>({});

  if (!isOpen) {
    return null;
  }

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = "Nome é obrigatório.";
    }

    if (!cpf.trim()) {
      newErrors.cpf = "CPF é obrigatório.";
    } else if (cpf.length !== 11) {
      newErrors.cpf = "CPF inválido. Deve conter 11 dígitos.";
    }

    if (!email.trim()) {
      newErrors.email = "Email é obrigatório.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Formato de email inválido.";
    }

    if (!password.trim()) {
      newErrors.password = "Senha é obrigatória.";
    } else if (password.length < 6) {
      newErrors.password = "A senha deve ter no mínimo 6 caracteres.";
    }
    
    return newErrors;
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    setCpf(numericValue.slice(0, 11));
  };

  const formatCpfForDisplay = (cpfString: string): string => {
    if (!cpfString) return '';
    const value = cpfString.replace(/[^0-9]/g, '').slice(0, 11);

    if (value.length > 9) {
      return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      return value.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
    } else if (value.length > 3) {
      return value.replace(/(\d{3})(\d{3})/, '$1.$2');
    }
    
    return value;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const existingUsers = getFromLocalStorage<User[]>('users') || [];
    
    let maxId = 0;
    for (const user of existingUsers) {
      const idNum = parseInt(user.id.replace('#', ''));
      if (idNum > maxId) {
        maxId = idNum;
      }
    }

    const newId = maxId + 1;

    const newUser: User = {
      id: `#${newId.toString().padStart(5, '0')}`,
      name: name,
      cpf: formatCpfForDisplay(cpf),
      email: email,
      password: password,
    };

    const updatedUsers = [...existingUsers, newUser];
    saveToLocalStorage<User[]>('users', updatedUsers);

    alert('Usuário cadastrado com sucesso!');
    
    setName('');
    setCpf('');
    setEmail('');
    setPassword('');
    
    onClose();
  };

  return (
    <div className="modal-overlay">
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
              style={{ borderColor: errors.name ? '#e63946' : '#ccc' }}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="cpf">CPF:</label>
            <input
              type="text"
              id="cpf"
              placeholder="123.456.789-00"
              value={formatCpfForDisplay(cpf)}
              onChange={handleCpfChange}
              maxLength={14}
              style={{ borderColor: errors.cpf ? '#e63946' : '#ccc' }}
            />
            {errors.cpf && <span className="error-message">{errors.cpf}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ borderColor: errors.email ? '#e63946' : '#ccc' }}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ borderColor: errors.password ? '#e63946' : '#ccc' }}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
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

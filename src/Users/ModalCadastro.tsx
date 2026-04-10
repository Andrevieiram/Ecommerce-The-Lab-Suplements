import React, { useState, useEffect } from 'react';
import './ModalCadastro.css';
import api from '../../api';

interface FormErrors {
  name?: string;
  cpf?: string;
  email?: string;
  password?: string;
}

// Interface do usuário
interface User {
    _id: string;
    name: string;
    email: string;
    cpf: string;
}

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userToEdit: User | null; // <--- NOVA PROP: Recebe o usuário para editar
}

const ModalCadastro = ({ isOpen, onClose, onSuccess, userToEdit }: ModalProps) => {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  // EFEITO: Quando o modal abre ou o 'userToEdit' muda, preenche ou limpa o formulário
  useEffect(() => {
    if (userToEdit) {
        // Modo Edição
        setName(userToEdit.name);
        setCpf(userToEdit.cpf);
        setEmail(userToEdit.email);
        setPassword(''); // Senha vazia na edição (só preenche se quiser trocar)
    } else {
        // Modo Cadastro (Limpa tudo)
        setName('');
        setCpf('');
        setEmail('');
        setPassword('');
    }
    setErrors({});
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!name.trim()) newErrors.name = "Nome é obrigatório.";
    if (!cpf.trim()) newErrors.cpf = "CPF é obrigatório.";
    if (!email.trim()) newErrors.email = "Email é obrigatório.";
    
    // Na edição, a senha é opcional. No cadastro, é obrigatória.
    if (!userToEdit && !password.trim()) {
        newErrors.password = "Senha é obrigatória.";
    }
    return newErrors;
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setCpf(value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }


    try {
      const payload = {
        name,
        email,
        cpf,
        password: password || undefined
      };

      if (userToEdit) {
        // Modo Edição
        await api.put(`/users/${userToEdit._id}`, payload);
        alert('Usuário atualizado com sucesso!');
      } else {
        // Modo Cadastro
        await api.post('/users', payload);
        alert('Usuário cadastrado com sucesso!');
      }

      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message: string } } }).response?.data?.message 
        : "Erro ao salvar";
      alert(errorMessage);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>

        <h2>{userToEdit ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}</h2>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome:</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} 
                   style={{ borderColor: errors.name ? '#e63946' : '#ccc' }} />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="cpf">CPF:</label>
            <input type="text" id="cpf" placeholder="000.000.000-00" value={cpf} onChange={handleCpfChange} maxLength={14} 
                   style={{ borderColor: errors.cpf ? '#e63946' : '#ccc' }} />
            {errors.cpf && <span className="error-message">{errors.cpf}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                   style={{ borderColor: errors.email ? '#e63946' : '#ccc' }} />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha {userToEdit && '(Deixe em branco para manter)'}:</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} 
                   style={{ borderColor: errors.password ? '#e63946' : '#ccc' }} />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button type="submit" className="form-submit-button">
            {userToEdit ? 'Salvar Alterações' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalCadastro;
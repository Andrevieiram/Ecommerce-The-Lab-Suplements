import React, { useState, useEffect } from 'react';
import './ModalCadastro.css';
import api from '../../api';

interface FormErrors {
  name?: string;
  cpf?: string;
  email?: string;
  password?: string;
}

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
  userToEdit: User | null;
}

const ModalCadastro = ({ isOpen, onClose, onSuccess, userToEdit }: ModalProps) => {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para evitar cliques duplos

  // EFEITO: Sincroniza os campos com o usuário selecionado ou limpa para novo cadastro
  useEffect(() => {
    if (isOpen) {
      if (userToEdit) {
        setName(userToEdit.name);
        setCpf(userToEdit.cpf);
        setEmail(userToEdit.email);
      } else {
        setName('');
        setCpf('');
        setEmail('');
      }
      setPassword('');
      setErrors({});
    }
  }, [userToEdit, isOpen]);

  if (!isOpen) return null;

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!name.trim()) newErrors.name = "Nome é obrigatório.";
    if (!cpf.trim() || cpf.length < 14) newErrors.cpf = "CPF inválido.";
    if (!email.trim() || !email.includes('@')) newErrors.email = "E-mail inválido.";
    
    // Senha obrigatória apenas em novos cadastros
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

    setIsSubmitting(true);

    try {
      const payload = {
        name,
        email,
        cpf,
        ...(password && { password }) // Só envia a senha se ela for preenchida
      };

      if (userToEdit) {
        await api.put(`/users/${userToEdit._id}`, payload);
        alert('Usuário atualizado com sucesso!');
      } else {
        await api.post('/users', payload);
        alert('Usuário cadastrado com sucesso!');
      }

      onSuccess();
      onClose();
    } catch (error) {
      const msg = (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Erro ao processar requisição";
      alert(msg);
      console.error("Erro no cadastro:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>

        <h2>{userToEdit ? 'Editar Usuário' : 'Novo Usuário'}</h2>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome Completo</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>CPF</label>
              <input 
                type="text" 
                placeholder="000.000.000-00" 
                value={cpf} 
                onChange={handleCpfChange} 
                maxLength={14}
                className={errors.cpf ? 'input-error' : ''}
              />
              {errors.cpf && <span className="error-text">{errors.cpf}</span>}
            </div>

            <div className="form-group">
              <label>E-mail</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>
              Senha {userToEdit && <small>(Deixe vazio para não alterar)</small>}
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button 
            type="submit" 
            className="form-submit-button" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : (userToEdit ? 'Salvar Alterações' : 'Criar Usuário')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalCadastro;
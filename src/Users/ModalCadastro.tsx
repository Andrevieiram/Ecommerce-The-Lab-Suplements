import React, { useState } from 'react';
import './ModalCadastro.css';

interface FormErrors {
  name?: string;
  cpf?: string;
  email?: string;
  password?: string;
}

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Nova prop para atualizar a lista
}

const ModalCadastro = ({ isOpen, onClose, onSuccess }: ModalProps) => {
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
    if (!name.trim()) newErrors.name = "Nome é obrigatório.";
    if (!cpf.trim()) newErrors.cpf = "CPF é obrigatório.";
    else if (cpf.length !== 14) newErrors.cpf = "CPF inválido."; // Validando com máscara
    if (!email.trim()) newErrors.email = "Email é obrigatório.";
    if (!password.trim()) newErrors.password = "Senha é obrigatória.";
    else if (password.length < 6) newErrors.password = "A senha deve ter no mínimo 6 caracteres.";
    return newErrors;
  };

  // Formata o CPF enquanto digita (000.000.000-00)
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
        // --- INTEGRAÇÃO COM O BACKEND ---
        const response = await fetch('http://localhost:3000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // Não precisa de token se a rota de criar for pública no backend
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password,
                cpf: cpf // Envia o CPF formatado ou limpo, depende do seu backend
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Usuário cadastrado com sucesso!');
            
            // Limpa o formulário
            setName('');
            setCpf('');
            setEmail('');
            setPassword('');
            setErrors({});
            
            onSuccess(); // Atualiza a tabela no pai
            onClose();   // Fecha o modal
        } else {
            alert(data.message || "Erro ao cadastrar usuário");
        }

    } catch (error) {
        console.error("Erro:", error);
        alert("Erro de conexão com o servidor.");
    }
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
              placeholder="000.000.000-00"
              value={cpf}
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
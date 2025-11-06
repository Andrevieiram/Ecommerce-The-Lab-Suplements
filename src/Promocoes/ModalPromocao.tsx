import React, { useState } from 'react';
import './ModalPromocao.css';
import { savePromocoes, getPromocoes } from './StoragePromocoes.tsx';

interface Promocao {
  id: string;
  name: string;
  description: string;
  discount: string;
  status: 'Ativa' | 'Inativa';
}

interface FormErrors {
  name?: string;
  description?: string;
  discount?: string;
}

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onPromocaoAdded: (newPromocao: Promocao) => void;
};

const ModalPromocao = ({ isOpen, onClose, onPromocaoAdded }: ModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState<number | string>('');
  const [status, setStatus] = useState<'Ativa' | 'Inativa'>('Ativa');
  const [errors, setErrors] = useState<FormErrors>({});

  if (!isOpen) return null;

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    const discountValue = typeof discount === 'string' ? parseFloat(discount.replace(',', '.')) : discount as number;

    if (!name.trim()) newErrors.name = "Nome da promoção é obrigatório.";
    if (!description.trim()) newErrors.description = "Descrição é obrigatória.";
    if (!discountValue || isNaN(discountValue) || discountValue <= 0) newErrors.discount = "Desconto deve ser maior que zero.";

    return newErrors;
  };

  const resetFields = () => {
    setName('');
    setDescription('');
    setDiscount('');
    setStatus('Ativa');
    setErrors({});
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const discountValue = typeof discount === 'string' ? parseFloat(discount.replace(',', '.')) : discount as number;
    const existingPromocoes = getPromocoes<Promocao[]>('promocoes') || [];

    let maxId = 0;
    for (const promo of existingPromocoes) {
      const idNum = parseInt(promo.id.replace('#', ''));
      if (idNum > maxId) maxId = idNum;
    }
    const newId = maxId + 1;

    const finalDiscountString = `${discountValue.toFixed(2).replace('.', ',')}%`;

    const newPromocao: Promocao = {
      id: `#${newId.toString().padStart(4, '0')}`,
      name,
      description,
      discount: finalDiscountString,
      status,
    };

    const updatedPromocoes = [...existingPromocoes, newPromocao];
    savePromocoes('promocoes', updatedPromocoes);
    onPromocaoAdded(newPromocao);

    alert('Promoção cadastrada com sucesso!');
    resetFields();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>

        <h2>Cadastrar Nova Promoção</h2>

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
            <label htmlFor="description">Descrição:</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ borderColor: errors.description ? '#e63946' : '#ccc' }}
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="discount">Desconto (%):</label>
            <input
              type="number"
              id="discount"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              step="0.01"
              min="0"
              style={{ borderColor: errors.discount ? '#e63946' : '#ccc' }}
            />
            {errors.discount && <span className="error-message">{errors.discount}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'Ativa' | 'Inativa')}
            >
              <option value="Ativa">Ativa</option>
              <option value="Inativa">Inativa</option>
            </select>
          </div>

          <button type="submit" className="form-submit-button">
            Cadastrar Promoção
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalPromocao;

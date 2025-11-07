import React, { useState } from 'react';
import './ModalPromocao.css';
import { savePromocoes, getPromocoes } from './StoragePromocoes.tsx';

interface Promocao {
  id: string;
  name: string;
  category: string;
  stock: string;
  unit: string;
  price: string;
  discount: string;
  newPrice?: string;
  status: 'Ativa' | 'Inativa';
}

interface FormErrors {
  name?: string;
  category?: string;
  stock?: string;
  unit?: string;
  price?: string;
  discount?: string;
}

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onPromocaoAdded: (newPromocao: Promocao) => void;
};

const ModalPromocao = ({ isOpen, onClose, onPromocaoAdded }: ModalProps) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [status, setStatus] = useState<'Ativa' | 'Inativa'>('Ativa');
  const [errors, setErrors] = useState<FormErrors>({});

  if (!isOpen) return null;

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!name.trim()) newErrors.name = "Nome da promoção é obrigatório.";
    if (!category.trim()) newErrors.category = "Categoria é obrigatória.";
    if (!stock.trim() || isNaN(Number(stock)) || Number(stock) < 0) newErrors.stock = "Estoque inválido.";
    if (!unit.trim()) newErrors.unit = "Unidade é obrigatória.";
    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) newErrors.price = "Preço inválido.";
    if (!discount.trim() || isNaN(Number(discount)) || Number(discount) <= 0) newErrors.discount = "Desconto deve ser maior que zero.";
    return newErrors;
  };

  const resetFields = () => {
    setName('');
    setCategory('');
    setStock('');
    setUnit('');
    setPrice('');
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

    const discountValue = parseFloat(discount.replace(',', '.'));
    const priceValue = parseFloat(price.replace(',', '.'));

    const formattedPrice = `R$ ${priceValue.toFixed(2).replace('.', ',')}`;
    const newPriceValue = priceValue - (priceValue * discountValue / 100);
    const formattedNewPrice = `R$ ${newPriceValue.toFixed(2).replace('.', ',')}`;

    const finalDiscountString = `${discountValue.toFixed(2).replace('.', ',')}%`;

    const existingPromocoes = getPromocoes<Promocao[]>('promocoes') || [];

    let maxId = 0;
    for (const promo of existingPromocoes) {
      const idNum = parseInt(promo.id.replace('#', ''));
      if (idNum > maxId) maxId = idNum;
    }
    const newId = maxId + 1;

    const newPromocao: Promocao = {
      id: `#${newId.toString().padStart(4, '0')}`,
      name,
      category,
      stock,
      unit,
      price: formattedPrice,
      discount: finalDiscountString,
      newPrice: formattedNewPrice,
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
            <label htmlFor="category">Categoria:</label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ borderColor: errors.category ? '#e63946' : '#ccc' }}
            />
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="stock">Estoque:</label>
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              min="0"
              style={{ borderColor: errors.stock ? '#e63946' : '#ccc' }}
            />
            {errors.stock && <span className="error-message">{errors.stock}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="unit">Unidade:</label>
            <input
              type="text"
              id="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              style={{ borderColor: errors.unit ? '#e63946' : '#ccc' }}
            />
            {errors.unit && <span className="error-message">{errors.unit}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="price">Preço (R$):</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
              min="0"
              style={{ borderColor: errors.price ? '#e63946' : '#ccc' }}
            />
            {errors.price && <span className="error-message">{errors.price}</span>}
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

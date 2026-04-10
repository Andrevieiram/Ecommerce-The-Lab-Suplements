import React, { useState } from 'react';
import './ModalPromocao.css';

interface Promocao {
  id: string;
  name: string;
  category: string;
  stock: string;
  unit: string;
  price: string;
  discount?: string;
  newPrice?: string;
  status: 'Ativa' | 'Inativa';
}

interface ModalPromocaoProps {
  isOpen: boolean;
  onClose: () => void;
  onPromocaoAdded: (newPromocao: Promocao) => void; // A função que faltava aqui
}

const ModalPromocao = ({ isOpen, onClose, onPromocaoAdded }: ModalPromocaoProps) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [stock] = useState('');
  const [unit] = useState('un');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Cálculo básico do novo preço se houver desconto
    const valorPreco = parseFloat(price);
    const valorDesconto = parseFloat(discount || '0');
    const novoPrecoCalculado = valorPreco - (valorPreco * (valorDesconto / 100));

    const novaPromocao: Promocao = {
      id: Math.random().toString(36).substr(2, 9), // Gera um ID aleatório
      name,
      category,
      stock,
      unit,
      price,
      discount,
      newPrice: novoPrecoCalculado.toFixed(2),
      status: 'Ativa'
    };

    // AQUI ESTÁ O PULO DO GATO:
    onPromocaoAdded(novaPromocao); 
    
    // Limpa os campos e fecha
    setName('');
    setCategory('');
    setPrice('');
    setDiscount('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Adicionar Nova Promoção</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome do Produto:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Preço Original:</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Desconto (%):</label>
              <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancelar">Cancelar</button>
            <button type="submit" className="btn-salvar">Salvar Promoção</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalPromocao;
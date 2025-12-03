import React, { useState, useEffect } from 'react';
import './ModalPromocao.css';
import { API_BASE } from '../api';

import type { Promocao } from './types/index';


interface Product {
  _id: string;
  name: string;
  category: string;
  price: number; 
  stock: number; 
  status: boolean;
}

interface FormErrors {
  productId?: string;
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
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState('');
  const [discount, setDiscount] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (isOpen) {
      fetch(`${API_BASE}/product`)
        .then(res => res.json())
        .then(data => setProducts(data.data))
        .catch(err => console.error(err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId) {
      setErrors({ productId: "Produto obrigatório" });
      return;
    }

    const selectedProduct = products.find(p => p._id === selectedProductId);
    if (!selectedProduct) {
      alert("Produto não encontrado");
      return;
    }

    const priceValue = selectedProduct.price;
    const discountValue = parseFloat(discount);
    const newPriceValue = priceValue - (priceValue * discountValue / 100);

    const promo: Promocao = {
      productId: selectedProduct._id,
      code: `PROMO-${Date.now()}`,
      name: selectedProduct.name,
      category: selectedProduct.category,
      stock,
      unit,
      price: priceValue.toString(),
      discount: discount,
      newPrice: newPriceValue.toString(),
      status: 'Ativa',
    };

    try {
      const res = await fetch(`${API_BASE}/promotion/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promo),
      });
      const data = await res.json();
      if (res.ok) {
        onPromocaoAdded(data.data);
        onClose();
        alert('Promoção cadastrada com sucesso!');
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao criar promoção');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <h2>Cadastrar Nova Promoção</h2>
        <form onSubmit={handleSubmit}>
          <label>Produto:</label>
          <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)}>
            <option value="">Selecione um produto</option>
            {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          {errors.productId && <span className="error">{errors.productId}</span>}

          <label>Estoque:</label>
          <input type="number" value={stock} onChange={e => setStock(e.target.value)} />

          <label>Unidade:</label>
          <input type="text" value={unit} onChange={e => setUnit(e.target.value)} />

          <label>Desconto (%):</label>
          <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} />

          <button type="submit">Cadastrar Promoção</button>
        </form>
      </div>
    </div>
  );
};

export default ModalPromocao;

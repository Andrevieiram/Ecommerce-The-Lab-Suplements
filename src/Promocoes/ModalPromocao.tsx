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
}

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onPromocaoAdded: (newPromocao: Promocao) => void;
};

const ModalPromocao = ({ isOpen, onClose, onPromocaoAdded }: ModalProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [discount, setDiscount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch(`${API_BASE}/product/getall`)
        .then(res => res.json())
        .then(data => {
          const lista = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
          setProducts(lista);
        })
        .catch(err => console.error("Erro ao buscar produtos:", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedProductId('');
      setDiscount('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProductId || !discount) {
      alert("Por favor, selecione um produto e defina o desconto.");
      return;
    }

    const payload = {
      productId: selectedProductId,
      discount: Number(discount),
      status: 'active'
    };

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/promotion/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Promoção criada com sucesso!');
        onPromocaoAdded(data.data || data); 
        onClose();
      } else {
        alert(data.message || 'Erro ao criar promoção');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const selectedProductDetails = products.find(p => p._id === selectedProductId);
  
  const previewPrice = selectedProductDetails 
    ? selectedProductDetails.price - (selectedProductDetails.price * (Number(discount) / 100))
    : 0;

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        
        <h2>Nova Promoção</h2>
        
        <form onSubmit={handleSubmit}>
          {}
          <div className="form-group">
            <label>Selecione o Produto:</label>
            <select 
              value={selectedProductId} 
              onChange={e => setSelectedProductId(e.target.value)}
              disabled={loading}
              className="modal-select"
            >
              <option value="">-- Escolha um produto --</option>
              {products.map(p => (
                <option key={p._id} value={p._id}>
                  {p.name} (R$ {Number(p.price).toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {}
          <div className="form-group">
            <label>Desconto (%):</label>
            <input 
              type="number" 
              min="1" 
              max="100"
              value={discount} 
              onChange={e => setDiscount(e.target.value)}
              placeholder="Ex: 10"
              disabled={!selectedProductId}
            />
          </div>

          {}
          {selectedProductDetails && discount && (
            <div className="promotion-preview">
              <p><strong>Preço Original:</strong> R$ {Number(selectedProductDetails.price).toFixed(2)}</p>
              <p><strong>Preço com Desconto:</strong> <span style={{color: 'green', fontWeight: 'bold'}}>R$ {previewPrice.toFixed(2)}</span></p>
            </div>
          )}

          <div className="modal-actions">
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Salvando...' : 'Confirmar Promoção'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalPromocao;
import React, { useState } from 'react';

import './ModalProduto.css'; 


import { saveProducts, getProducts } from './StorageProducts.tsx'; 

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: string;
  status: 'Ativo' | 'Inativo';
}

interface FormErrors {
  name?: string;
  category?: string;
  price?: string;
  stock?: string;
}


type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: (newProduct: Product) => void;
}

const ModalProduto = ({ isOpen, onClose, onProductAdded }: ModalProps) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [stock, setStock] = useState<number | string>('');
  const [status, setStatus] = useState<'Ativo' | 'Inativo'>('Ativo');
  const [errors, setErrors] = useState<FormErrors>({});

  if (!isOpen) {
    return null;
  }

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    const priceValue = typeof price === 'string' ? parseFloat(price.replace(',', '.')) : price as number;
    const stockValue = typeof stock === 'string' ? parseInt(stock as string, 10) : Number(stock);

    if (!name.trim()) {
      newErrors.name = "Nome do produto é obrigatório.";
    }
    if (!category.trim()) {
      newErrors.category = "Categoria é obrigatória.";
    }
    
    if (!priceValue || isNaN(priceValue) || priceValue <= 0) {
      newErrors.price = "Preço deve ser um valor positivo maior que zero.";
    }
    
    if (typeof stock === 'string' && stock.trim() === '') {
      newErrors.stock = "Estoque deve ser um número não negativo.";
    } else if (isNaN(stockValue) || stockValue <= 0) {
      newErrors.stock = "Estoque deve ser um número não negativo.";
    }

    return newErrors;
  };
  

  const resetFields = () => {
    setName('');
    setCategory('');
    setPrice('');
    setStock('');
    setStatus('Ativo');
    setErrors({});
  };


  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    
    const priceValue = typeof price === 'string' ? parseFloat(price.replace(',', '.')) : price as number;
    const stockValue = typeof stock === 'string' ? parseInt(stock as string, 10) : Number(stock);

    const existingProducts = getProducts<Product[]>('products') || []; 
    
    
    let maxId = 0;
    for (const prod of existingProducts) {
      const idNum = parseInt(prod.id.replace('#', ''));
      if (idNum > maxId) {
        maxId = idNum;
      }
    }
    const newId = maxId + 1;
  

    const finalPriceString = `R$ ${priceValue.toFixed(2).replace('.', ',')}`;
    const finalStockString = `${stockValue.toString()} un.`;

    const newProduct: Product = {
      id: `#${newId.toString().padStart(4, '0')}`, 
      name: name,
      category: category,
      price: finalPriceString,
      stock: finalStockString,
      status: status,
    };

    const updatedProducts = [...existingProducts, newProduct];
    saveProducts('products', updatedProducts); 
    onProductAdded(newProduct);  
    
    alert('Produto cadastrado com sucesso!');
    
    resetFields();
    onClose();
  };

  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          &times;
        </button>

        <h2>Cadastrar Novo Produto</h2>

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

          <div className="form-group-row"> {/* Use uma div para campos lado a lado (opcional, requer CSS) */}
            <div className="form-group half-width">
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

            <div className="form-group half-width">
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
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status:</label>
            <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as 'Ativo' | 'Inativo')}
            >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
            </select>
          </div>

          <button type="submit" className="form-submit-button">
            Cadastrar Produto
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalProduto;
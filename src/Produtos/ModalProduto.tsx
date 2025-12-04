import React, { useState, useEffect } from 'react';
import './ModalProduto.css'; 

export interface newProduct {
    _id?: string; 
    code: string; 
    name: string;
    category: string;
    price: number; 
    stock: number;
    status?: boolean;
}

export interface FormErrors {
    code?: string;
    name?: string;
    category?: string;
    price?: string;
    stock?: string;
}

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    productToEdit: newProduct | null;
}

const ModalProduto = ({ isOpen, onClose, onSuccess, productToEdit }: ModalProps) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [stock, setStock] = useState<number | string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null); // Corrigido destructuring

  useEffect(() => {
    if (productToEdit) {
        setCode(productToEdit.code); 
        setName(productToEdit.name);
        setCategory(productToEdit.category);
        setPrice(productToEdit.price);
        setStock(productToEdit.stock);
    } else {
        setCode(''); 
        setName('');
        setCategory('');
        setPrice('');
        setStock('');
    }
    setErrors({});
    setSubmissionError(null);
   }, [productToEdit, isOpen]); 

  if (!isOpen) {
    return null;
  }

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    const codeString = typeof code === 'string' ? code.trim() : String(code).trim();
    const numberRegex = /^\d+$/;

    if (!codeString) {
      newErrors.code = "O código do produto é obrigatório.";
    } else if (!numberRegex.test(codeString)) {
      newErrors.code = "O código deve conter apenas números.";
    }

    if (!name.trim()) newErrors.name = "Nome do produto é obrigatório.";
    if (!category.trim()) newErrors.category = "Categoria é obrigatória.";

    const priceValue = Number(price);
    if (isNaN(priceValue) || priceValue <= 0) newErrors.price = "Preço inválido.";

    const stockValue = Number(stock);
    if (isNaN(stockValue) || stockValue < 0) newErrors.stock = "Estoque inválido.";

    return newErrors;
  };

  const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
  
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
  
      const token = localStorage.getItem('token');
      
      const method = productToEdit ? 'PUT' : 'POST';
      
      const url = productToEdit 
          ? `http://localhost:3000/api/product/${productToEdit.code}` 
          : 'http://localhost:3000/api/product';
  
      try {
          const response = await fetch(url, {
              method: method,
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
              },
              body: JSON.stringify({
                  code,
                  name,
                  category,
                  price: Number(price),
                  stock: Number(stock)
              })
          });
  
          const data = await response.json();
  
          if (response.ok) {
              alert(productToEdit ? 'Produto atualizado!' : 'Produto cadastrado!');
              onSuccess();
              onClose();
          } else {
              alert(data.message || "Erro ao salvar");
          }
  
      } catch (error) {
          console.error("Erro fetch:", error);
          alert("Erro de conexão com o servidor.");
      }
    };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>

        <h2>{productToEdit ? 'Editar Produto' : 'Cadastrar Novo Produto'}</h2>

        <form className="modal-form" onSubmit={handleSubmit}>
            {submissionError && <div className="error-message">{submissionError}</div>}
            
            <div className="form-group">
                <label htmlFor="code">Código:</label>
                <input
                    type="text" 
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    style={{ borderColor: errors.code ? '#e63946' : '#ccc' }} 
                    disabled={!!productToEdit} 
                />
                {errors.code && <span className="error-message">{errors.code}</span>}
            </div>
            
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

            <div className="form-group-row"> 
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
            
            <button type="submit" className="form-submit-button">
                {productToEdit ? 'Salvar Alterações' : 'Cadastrar'}
            </button>
        </form>
      </div>
    </div>
  );
};

export default ModalProduto;
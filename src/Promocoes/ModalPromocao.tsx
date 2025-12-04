import React, { useState, useEffect } from 'react';
import './ModalPromocao.css';

export interface Promotion {
    _id?: string;
    code: string;
    productName?: string; 
    originalPrice?: number; 
    discountedPrice?: number; 
    discountPercentage: number;
    targetProductCode: string;
    status: boolean;
}

interface ProductSummary {
    code: string;
    name: string;
    price: number;
}

interface FormErrors {
    discountPercentage?: string;
    targetProductCode?: string;
}

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    promoToEdit: Promotion | null;
}

const ModalPromocao = ({ isOpen, onClose, onSuccess, promoToEdit }: ModalProps) => {
  const [discountPercentage, setDiscount] = useState<number | string>('');
  const [targetProductCode, setTargetProductCode] = useState('');
  const [productsList, setProductsList] = useState<ProductSummary[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (isOpen) {
        const fetchProducts = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://localhost:3000/api/product', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await response.json();
                if (data.data) setProductsList(data.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchProducts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (promoToEdit) {
        setDiscount(promoToEdit.discountPercentage);
        setTargetProductCode(promoToEdit.targetProductCode);
    } else {
        setDiscount('');
        setTargetProductCode('');
    }
    setErrors({});
   }, [promoToEdit, isOpen]); 

  if (!isOpen) return null;

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};
    const disc = Number(discountPercentage);
    if (isNaN(disc) || disc <= 0 || disc > 100) newErrors.discountPercentage = "Desconto inválido (1-100%).";
    if (!targetProductCode) newErrors.targetProductCode = "Selecione um produto.";
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
      const method = promoToEdit ? 'PUT' : 'POST';
      const url = promoToEdit 
          ? `http://localhost:3000/api/promotion/${promoToEdit.code}` 
          : 'http://localhost:3000/api/promotion';
  
      try {
          const response = await fetch(url, {
              method: method,
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}` 
              },
              body: JSON.stringify({
                  discountPercentage: Number(discountPercentage),
                  targetProductCode
              })
          });
  
          const data = await response.json();
  
          if (response.ok) {
              alert(promoToEdit ? 'Promoção atualizada!' : 'Promoção criada!');
              onSuccess();
              onClose();
          } else {
              alert(data.message || "Erro ao salvar");
          }
      } catch (error) {
          alert("Erro de conexão.");
      }
    };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>

        <h2>{promoToEdit ? 'Editar Promoção' : 'Nova Promoção'}</h2>
        <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '15px'}}>
            O código será gerado automaticamente (4 dígitos).
        </p>

        <form className="modal-form" onSubmit={handleSubmit}>
            
            <div className="form-group">
                <label>Produto:</label>
                <select 
                    value={targetProductCode} 
                    onChange={(e) => setTargetProductCode(e.target.value)}
                    disabled={!!promoToEdit} 
                    style={{ borderColor: errors.targetProductCode ? 'red' : '#ccc', width: '100%', padding: '10px' }}
                >
                    <option value="">Selecione...</option>
                    {productsList.map(prod => (
                        <option key={prod.code} value={prod.code}>
                            {prod.name} (R$ {Number(prod.price).toFixed(2)})
                        </option>
                    ))}
                </select>
                {errors.targetProductCode && <span className="error-message">{errors.targetProductCode}</span>}
            </div>

            <div className="form-group">
                <label>Desconto (%):</label>
                <input type="number" value={discountPercentage} onChange={(e) => setDiscount(e.target.value)}
                    style={{ borderColor: errors.discountPercentage ? 'red' : '#ccc' }} />
                {errors.discountPercentage && <span className="error-message">{errors.discountPercentage}</span>}
            </div>
            
            <button type="submit" className="form-submit-button">
                {promoToEdit ? 'Salvar' : 'Cadastrar'}
            </button>
        </form>
      </div>
    </div>
  );
};

export default ModalPromocao;
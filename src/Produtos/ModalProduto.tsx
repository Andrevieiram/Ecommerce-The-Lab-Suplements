import React, { useState } from 'react';


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
    onProductAdded: (newProduct: newProduct) => Promise<void>;
}

const ModalProduto = ({ isOpen, onClose, onProductAdded }: ModalProps) => {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [stock, setStock] = useState<number | string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  if (!isOpen) {
    return null;
  }

  const validateForm = (priceValue: number, stockValue: number): FormErrors => {
    const newErrors: FormErrors = {};
    const codeString = code.trim();
    const numberRegex = /^\d+$/; 
    
    if (!codeString) {
        newErrors.code = "O código do produto é obrigatório.";
    } else if (!numberRegex.test(codeString)) {
        newErrors.code = "O código deve conter apenas números (sem espaços ou caracteres especiais).";
    } else if (parseInt(codeString, 10) <= 0) { 
        newErrors.code = "O código do produto deve ser um número positivo (maior que zero).";
    }
    if (!name.trim()) {
      newErrors.name = "Nome do produto é obrigatório.";
    }
    if (!category.trim()) {
      newErrors.category = "Categoria é obrigatória.";
    }
    
    if (isNaN(priceValue) || priceValue <= 0) {
      newErrors.price = "Preço deve ser um valor positivo maior que zero.";
    }
    
    
    if (isNaN(stockValue) || stockValue < 0) {
      newErrors.stock = "Estoque deve ser um número maior que zero.";
    }
    return newErrors;
  };

    const resetFields = () => {
      setCode('');
      setName('');
      setCategory('');
      setPrice('');
      setStock('');
      setErrors({});
    };


  const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      setErrors({});
      const priceValue = parseFloat(`${price}`.replace(',', '.')) || 0;
      const stockValue = parseInt(stock as string, 10) || 0;
      
      const validationErrors = validateForm(priceValue, stockValue);
      
      if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          return;
      }

      const newProduct: newProduct = {
          code: code.trim(), 
          name: name,
          category: category,
          price: priceValue,
          stock: stockValue,
      };
      
      setIsSubmitting(true);
      
      try {
          // 3. Chama a função de API passada via props
          await onProductAdded(newProduct);
          
          // Sucesso: Reseta campos e fecha o modal
          resetFields();
          onClose(); 
          
      } catch (error) {
        console.error("Erro completo da API ao cadastrar produto:", error); 
            
        // Tenta extrair a mensagem de erro:
        let errorMessage = "Erro desconhecido ao cadastrar.";
        
        // Se for um objeto Error padrão, usa a message.
        if (error instanceof Error) {
            errorMessage = error.message;
        } 
        // Se for um objeto genérico retornado (por exemplo, { message: '...' })
        else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }
        // Se o erro vier de um `throw` simples de string/número
        else if (typeof error === 'string') {
            errorMessage = error;
        }
          
        setSubmissionError(`Falha no cadastro: ${errorMessage}`);
          
      } finally {
          setIsSubmitting(false);
      }
  };

  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          
        <div className="modal-header">
            <h2>Cadastrar Novo Produto (API)</h2>
            <button className="modal-close-button" onClick={onClose}>
                &times;
            </button>
        </div>
        <form className="modal-form" onSubmit={handleSubmit}>
            
            {submissionError && (
                 <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm font-medium">{submissionError}</div>
            )}
            <div className="form-group">
                <label htmlFor="code">Código:</label>
                <input
                    type="text" 
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    // O estilo inline é mantido, mas você pode substituí-lo por uma classe no seu CSS
                    style={{ borderColor: errors.code ? '#e63946' : '#ccc' }} 
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
            
            <button 
                type="submit" 
                disabled={isSubmitting}
                className="form-submit-button">
                {isSubmitting ? 'Cadastrando...' : 'Cadastrar Produto'}
            </button>
        </form>
      </div>
    </div>
  );
};

export default ModalProduto;
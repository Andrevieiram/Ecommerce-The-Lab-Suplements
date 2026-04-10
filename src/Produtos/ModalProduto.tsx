import React, { useState, useEffect } from 'react';
import api from '../../api'; // Ajuste o caminho conforme sua estrutura
import './ModalProduto.css';

export interface Product {
    _id?: string; 
    code: string; 
    name: string;
    category: string;
    price: number; 
    stock: number;
    status?: boolean;
}

interface FormErrors {
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
    productToEdit: Product | null;
}

const ModalProduto = ({ isOpen, onClose, onSuccess, productToEdit }: ModalProps) => {
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState<string>('');
    const [stock, setStock] = useState<string>('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (productToEdit) {
                setCode(productToEdit.code);
                setName(productToEdit.name);
                setCategory(productToEdit.category);
                setPrice(String(productToEdit.price));
                setStock(String(productToEdit.stock));
            } else {
                setCode('');
                setName('');
                setCategory('');
                setPrice('');
                setStock('');
            }
            setErrors({});
        }
    }, [productToEdit, isOpen]);

    if (!isOpen) return null;

    const validateForm = (): FormErrors => {
        const newErrors: FormErrors = {};
        if (!code.trim()) newErrors.code = "O código é obrigatório.";
        if (!name.trim()) newErrors.name = "O nome é obrigatório.";
        if (!category.trim()) newErrors.category = "A categoria é obrigatória.";
        
        if (!price || parseFloat(price) <= 0) {
            newErrors.price = "Preço deve ser maior que zero.";
        }
        
        if (stock === '' || parseInt(stock) < 0) {
            newErrors.stock = "Estoque não pode ser negativo.";
        }

        return newErrors;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                code,
                name,
                category,
                price: parseFloat(price),
                stock: parseInt(stock)
            };

            if (productToEdit) {
                // Se sua API usa o CODE na URL:
                await api.put(`/produtos/${productToEdit.code}`, payload);
                alert('Produto atualizado!');
            } else {
                await api.post('/produtos', payload);
                alert('Produto cadastrado!');
            }

            onSuccess();
            onClose();
        } catch (error) {
            const msg = (error as { response?: { data?: { message?: string } } }).response?.data?.message || "Erro ao salvar produto";
            alert(msg);
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                
                <div className="modal-header">
                    <h2>{productToEdit ? 'Editar Produto' : 'Novo Produto'}</h2>
                    <button className="modal-close-button" onClick={onClose}>&times;</button>
                </div>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Código do Produto:</label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            disabled={!!productToEdit} // Geralmente não se edita o código único
                            className={errors.code ? 'input-error' : ''}
                        />
                        {errors.code && <span className="error-message">{errors.code}</span>}
                    </div>

                    <div className="form-group">
                        <label>Nome:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={errors.name ? 'input-error' : ''}
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label>Categoria:</label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={errors.category ? 'input-error' : ''}
                        />
                        {errors.category && <span className="error-message">{errors.category}</span>}
                    </div>

                    <div className="form-group-row" style={{ display: 'flex', gap: '10px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Preço (R$):</label>
                            <input
                                type="number"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className={errors.price ? 'input-error' : ''}
                            />
                            {errors.price && <span className="error-message">{errors.price}</span>}
                        </div>

                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Estoque:</label>
                            <input
                                type="number"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                className={errors.stock ? 'input-error' : ''}
                            />
                            {errors.stock && <span className="error-message">{errors.stock}</span>}
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="form-submit-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Salvando...' : (productToEdit ? 'Salvar Alterações' : 'Cadastrar Produto')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ModalProduto;
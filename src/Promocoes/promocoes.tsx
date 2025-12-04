import { useNavigate, NavLink } from 'react-router-dom';
import './Promocoes.css';
import ModalPromocao from './ModalPromocao';
import { useState, useEffect, useCallback } from 'react';
import { API_BASE } from '../api';
import type { Promocao, PromotionResponse } from './types/index'; 

const Promocoes = () => {
  const navigate = useNavigate();
  const [promocoes, setPromocoes] = useState<Promocao[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  const fetchPromocoes = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/promotion/getall`);
      
      if (!res.ok) {
        throw new Error(`Erro na rede: status ${res.status}`);
      }

      const responseData = await res.json() as PromotionResponse; 
      
      if (responseData.data && Array.isArray(responseData.data)) {
        setPromocoes(responseData.data); 
      } else {
        setPromocoes([]);
      }
      
    } catch (err) {
      console.error("Erro ao carregar promoções:", err); 
      alert('Erro ao carregar promoções. Verifique o console para detalhes.');
    } finally {
      setIsLoading(false);
    }
  }, []);


  const handleDelete = async (_id: string) => {
    if (!window.confirm("Tem certeza que deseja remover esta promoção?")) return; 

    try {
      const res = await fetch(`${API_BASE}/api/promotion/delete/${_id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        const data = contentType && contentType.includes("application/json") ? await res.json() : { message: 'Promoção removida.' };

        alert(data.message || 'Promoção removida com sucesso');
        setPromocoes(prev => prev.filter(p => p._id !== _id));
      } else {
         const errorData = await res.json();
         alert(errorData.message || 'Erro ao deletar');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao deletar a promoção');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const handlePromocaoAdded = () => {
    fetchPromocoes(); 
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    fetchPromocoes();
  }, [navigate, fetchPromocoes]);

  return (
    <div className="promocoes-container">
      <header className="header-container">
        <button className="avatar">
          <img id='picture' src='images/avatar.png' alt="Avatar" />
        </button>
      </header>

      <nav className="leftNav-container">
        <img
          className="logo-left"
          src="images/WhatsApp_Image_2025-10-28_at_11.50.35-removebg-preview.png"
          alt="The Lab Suplements"
        />
        <div className="nav-items">
          <NavLink to="/produtos" className={({ isActive }) => isActive ? "nav-item-active" : "nav-item"}>Produtos</NavLink>
          <NavLink to="/promocoes" className={({ isActive }) => isActive ? "nav-item-active" : "nav-item"}>Promoções</NavLink>
          <NavLink to="/usuarios" className={({ isActive }) => isActive ? "nav-item-active" : "nav-item"}>Usuários</NavLink>
        </div>
        <button className="nav-item-logout" onClick={handleLogout}>Logout</button>
      </nav>

      <main className="main-promocoes">
        <div className="main-title">
          <h1>Gerenciamento de Promoções</h1>
          <button className="promocaoAdd-button" onClick={() => setIsModalOpen(true)}>
            Adicionar Nova Promoção
          </button>
        </div>

        <div className="promocoes-table-container">
          {isLoading ? (
            <p style={{ textAlign: 'center', padding: '20px' }}>Carregando promoções...</p>
          ) : (
            <table className="promocoes-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Estoque</th>
                  <th>Preço Original</th>
                  <th>Desconto (%)</th>
                  <th>Novo Preço</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {promocoes.length > 0 ? (
                  promocoes.map((p) => {
                    const product = p.product;
                    const isProductValid = product && product.name && product.price;

                    if (!isProductValid) {
                        return (
                            <tr key={p._id} className="table-error-row">
                                <td colSpan={8}>
                                    Erro: Produto associado à promoção (ID: {p.product?._id || 'N/A'}) não encontrado ou inválido.
                                </td>
                            </tr>
                        );
                    }

                    return (
                      <tr key={p._id}>
                        <td>{product.name}</td> 
                        <td>{product.category}</td>
                        <td>{product.stock}</td>
                        <td>R$ {Number(product.price).toFixed(2)}</td>
                        <td>{p.discount ? `${p.discount}%` : '-'}</td>
                        <td style={{ fontWeight: 'bold', color: '#2ecc71' }}>
                          {p.newPrice ? `R$ ${Number(p.newPrice).toFixed(2)}` : '-'}
                        </td>
                        <td>{p.status}</td>
                        <td>
                          <button
                            className="table-action-button-remove"
                            onClick={() => p._id && handleDelete(p._id)}
                          >
                            Remover
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="table-empty">
                      Nenhuma promoção cadastrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>

      <ModalPromocao
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPromocaoAdded={handlePromocaoAdded}
      />
    </div>
  );
};

export default Promocoes;